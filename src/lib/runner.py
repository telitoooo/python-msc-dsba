"""
Moteur d'exécution exécuté dans Pyodide (Web Worker).

- Exécute le code de l'élève comme un vrai script `main.py`, dans un dossier
  de travail neuf à chaque exécution (`/home/pyodide/projet` dans le navigateur).
- Y dépose les fichiers fournis par l'exercice (données, modules éditables),
  puis renvoie la liste des fichiers présents après l'exécution.
- Redirige stdout / stderr vers le terminal via `_js_emit(stream, texte)`,
  fonction injectée par le worker JavaScript.
- Simule input() à partir de la zone « Entrées (stdin) ».
- Lance les tests automatiques d'un exercice et renvoie un rapport JSON.
- Affiche les figures matplotlib (plt.show) et les images Pillow (img.show)
  dans le terminal, sous forme d'images PNG.

Ce fichier est aussi chargé tel quel par `scripts/verify_content.py`
pour valider les solutions des exercices hors navigateur.
"""

import ast
import base64
import builtins
import importlib
import io
import json
import linecache
import os
import shutil
import sys
import tempfile
import traceback
import types

FILENAME = "<main.py>"
MAX_OUTPUT = 50_000  # caractères affichés avant d'arrêter le programme
MAX_LISTED_FILES = 60
MAX_PREVIEW = 6_000

if sys.platform == "emscripten":
    WORKDIR = "/home/pyodide/projet"
else:  # vérification hors navigateur
    WORKDIR = os.path.realpath(os.path.join(tempfile.gettempdir(), "pylab_projet"))
RERUN_DIR = WORKDIR + "_verif"

sys.dont_write_bytecode = True  # pas de __pycache__ dans le dossier de l'élève
os.environ["MPLBACKEND"] = "Agg"  # matplotlib dessine en mémoire (pas de fenêtre, pas de DOM)

MAX_FIGURE_PREVIEW = 400_000  # octets : au-delà, une image du dossier n'est pas prévisualisée
IMAGE_TYPES = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif"}

_LANG = "fr"
_MESSAGES = {
    "fr": {
        "too_long": "plus de {n} caractères affichés : boucle infinie ?",
        "eof": "input() n'a plus rien à lire : ajoutez une valeur par ligne dans la zone « Entrées (stdin) ».",
        "not_evaluated": "Non évalué : le programme s'est arrêté sur une erreur.",
        "got": "Obtenu : {expr} = {value}",
        "flask_run": (
            "[navigateur] app.run() est simulé : aucun serveur réseau ne peut démarrer ici.\n"
            "Testez vos routes avec client = app.test_client() puis client.get('/').\n"
        ),
    },
    "en": {
        "too_long": "more than {n} characters printed: infinite loop?",
        "eof": "input() has nothing left to read: add one value per line in the “Inputs (stdin)” box.",
        "not_evaluated": "Not evaluated: the program stopped on an error.",
        "got": "Got: {expr} = {value}",
        "flask_run": (
            "[browser] app.run() is simulated: no network server can start here.\n"
            "Test your routes with client = app.test_client() then client.get('/').\n"
        ),
    },
}


def _msg(key, **values):
    table = _MESSAGES.get(_LANG, _MESSAGES["fr"])
    return table[key].format(**values)


class SortieTropLongue(Exception):
    """Levée quand le programme affiche trop de texte (souvent une boucle infinie)."""


class _JsStream(io.TextIOBase):
    """Flux texte qui transmet chaque écriture au terminal du navigateur."""

    def __init__(self, kind, limit=None):
        super().__init__()
        self.kind = kind
        self.limit = limit
        self.count = 0
        self.chunks = []

    def writable(self):
        return True

    def write(self, s):
        s = str(s)
        if self.limit is not None:
            self.count += len(s)
            if self.count > self.limit:
                raise SortieTropLongue(_msg("too_long", n=f"{self.limit:,}".replace(",", " ")))
        self.chunks.append(s)
        _js_emit(self.kind, s)  # noqa: F821  (injectée par le worker)
        return len(s)


def _input(prompt=""):
    """Remplace input() : lit la ligne suivante de la zone « Entrées (stdin) »."""
    prompt = str(prompt)
    sys.stdout.write(prompt)
    line = sys.stdin.readline()
    if not line:
        raise EOFError(_msg("eof"))
    line = line.rstrip("\r\n")
    if isinstance(sys.stdout, _JsStream):
        _js_emit("stdin", line + "\n")  # noqa: F821  (écho coloré dans le terminal)
    else:
        sys.stdout.write(line + "\n")
    return line


builtins.input = _input


# --------------------------------------------------------------------------
# Bibliothèques : figures matplotlib, images Pillow, serveur Flask
# --------------------------------------------------------------------------

_FIGURES = []        # description des figures affichées (utilisée par les tests)
_QUIET = [False]     # pendant les tests : ne rien envoyer au terminal


def _emit_png(raw):
    if not _QUIET[0]:
        _js_emit("image", "data:image/png;base64," + base64.b64encode(raw).decode("ascii"))  # noqa: F821


def _figure_info(fig):
    axes = []
    for ax in fig.get_axes():
        legend = ax.get_legend()
        axes.append({
            "title": ax.get_title(),
            "xlabel": ax.get_xlabel(),
            "ylabel": ax.get_ylabel(),
            "lines": len(ax.lines),
            "collections": len(ax.collections),
            "patches": len(ax.patches),
            "images": len(ax.images),
            "texts": len(ax.texts),
            "xscale": ax.get_xscale(),
            "yscale": ax.get_yscale(),
            "legend": legend is not None,
            "labels": [t.get_text() for t in legend.get_texts()] if legend is not None else [],
        })
    suptitle = getattr(fig, "_suptitle", None)
    return {"axes": axes, "suptitle": suptitle.get_text() if suptitle is not None else ""}


def _flush_figures(*args, **kwargs):
    """Remplace plt.show() : envoie chaque figure ouverte au terminal, puis la ferme."""
    plt = sys.modules.get("matplotlib.pyplot")
    if plt is None:
        return
    for num in plt.get_fignums():
        fig = plt.figure(num)
        if not fig.get_axes():
            continue
        _FIGURES.append(_figure_info(fig))
        if not _QUIET[0]:
            buffer = io.BytesIO()
            fig.savefig(buffer, format="png", dpi=90, bbox_inches="tight")
            _emit_png(buffer.getvalue())
    plt.close("all")


def _pil_show(image, *args, **kwargs):
    """Remplace Image.show() : affiche l'image dans le terminal."""
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    _emit_png(buffer.getvalue())


def _flask_run(app, *args, **kwargs):
    """Remplace app.run() : impossible d'ouvrir un port réseau dans le navigateur."""
    sys.stdout.write(_msg("flask_run"))


def _prepare_libraries(source):
    """Si le code utilise ces bibliothèques, on les branche sur le terminal avant l'exécution."""
    _FIGURES.clear()
    plots_with_pandas = "pandas" in source and (".plot" in source or ".hist(" in source)
    if "matplotlib" in source or "seaborn" in source or plots_with_pandas:
        try:
            import matplotlib

            matplotlib.use("Agg")
            import matplotlib.pyplot as plt

            plt.close("all")
            plt.show = _flush_figures
        except ImportError:
            pass
    if "PIL" in source:
        try:
            from PIL import Image

            Image.Image.show = _pil_show
        except ImportError:
            pass
    if "flask" in source:
        try:
            import flask

            flask.Flask.run = _flask_run
        except ImportError:
            pass


# --------------------------------------------------------------------------
# Dossier de travail : chaque exécution part d'un dossier propre
# --------------------------------------------------------------------------

def _is_student_file(filename):
    return filename == FILENAME or filename.startswith(WORKDIR)


def _purge_student_modules():
    """Oublie les modules importés depuis le dossier de l'élève (ils ont pu changer)."""
    for name, module in list(sys.modules.items()):
        path = getattr(module, "__file__", None)
        if name != "__main__" and isinstance(path, str) and os.path.abspath(path).startswith(WORKDIR):
            del sys.modules[name]


def _write_files(path, files):
    for name, content in files.items():
        full = os.path.join(path, name)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        with open(full, "w", encoding="utf-8") as f:
            f.write(content)


class _Sandbox:
    """
    Prépare un dossier neuf contenant main.py + fichiers fournis, s'y place,
    et fait de main.py le module __main__ (comme `python main.py`).
    Tout est restauré à la sortie.
    """

    def __init__(self, path, code, data, modules):
        self.path = path
        self.code = code
        self.files = {**data, **modules}

    def __enter__(self):
        try:
            cwd = os.getcwd()
        except OSError:  # dossier courant supprimé par le programme précédent
            cwd = tempfile.gettempdir()
        self.saved = (cwd, list(sys.path), list(sys.argv), sys.modules.get("__main__"))
        shutil.rmtree(self.path, ignore_errors=True)
        os.makedirs(self.path)
        _write_files(self.path, self.files)
        _write_files(self.path, {"main.py": self.code})
        os.chdir(self.path)
        sys.path.insert(0, self.path)
        sys.argv[:] = ["main.py"]
        _purge_student_modules()
        importlib.invalidate_caches()
        module = types.ModuleType("__main__")
        module.__file__ = os.path.join(self.path, "main.py")
        module.__builtins__ = builtins
        sys.modules["__main__"] = module
        return module.__dict__

    def __exit__(self, *exc):
        cwd, path, argv, main = self.saved
        os.chdir(cwd)
        sys.path[:] = path
        sys.argv[:] = argv
        if main is not None:
            sys.modules["__main__"] = main
        _purge_student_modules()
        return False


def _snapshot(path, data, modules):
    """Fichiers présents dans le dossier de travail après l'exécution."""
    entries = []
    seen = set()
    for root, dirs, files in os.walk(path):
        dirs[:] = sorted(d for d in dirs if d != "__pycache__")
        for name in sorted(files):
            full = os.path.join(root, name)
            rel = os.path.relpath(full, path).replace(os.sep, "/")
            if rel == "main.py" or rel in modules:
                continue
            seen.add(rel)
            if len(entries) >= MAX_LISTED_FILES:
                continue
            with open(full, "rb") as f:
                raw = f.read()
            try:
                text = raw.decode("utf-8")
            except UnicodeDecodeError:
                text = None
            if rel not in data:
                status = "nouveau"
            elif raw == data[rel].encode("utf-8"):
                status = "fourni"
            else:
                status = "modifié"
            preview = None if text is None else text[:MAX_PREVIEW]
            entry = {"path": rel, "size": len(raw), "status": status, "text": preview,
                     "truncated": text is not None and len(text) > MAX_PREVIEW}
            mime = IMAGE_TYPES.get(os.path.splitext(rel)[1].lower())
            if mime and len(raw) <= MAX_FIGURE_PREVIEW:
                entry["image"] = f"data:{mime};base64," + base64.b64encode(raw).decode("ascii")
            entries.append(entry)
    for rel in sorted(set(data) - seen):
        entries.append({"path": rel, "size": 0, "status": "supprimé", "text": None, "truncated": False})
    return entries


# --------------------------------------------------------------------------
# Erreurs
# --------------------------------------------------------------------------

def _register_source(code):
    """Permet au traceback d'afficher les lignes du code de l'élève."""
    linecache.cache[FILENAME] = (len(code), None, code.splitlines(True), FILENAME)


def _student_frames(exc):
    return [f for f in traceback.extract_tb(exc.__traceback__) if _is_student_file(f.filename)]


def _format_exception(exc):
    """Traceback limité aux fichiers de l'élève (sans les rouages internes)."""
    frames = _student_frames(exc)
    text = ""
    if frames:
        text += "Traceback (most recent call last):\n"
        text += "".join(traceback.StackSummary.from_list(frames).format())
    text += "".join(traceback.format_exception_only(type(exc), exc))
    return text


def _describe(exc):
    line = None
    filename = None
    if isinstance(exc, SyntaxError) and exc.filename and _is_student_file(exc.filename):
        line, filename = exc.lineno, exc.filename
    else:
        frames = _student_frames(exc)
        if frames:
            line, filename = frames[-1].lineno, frames[-1].filename
    message = exc.msg if isinstance(exc, SyntaxError) else str(exc)
    file = None if filename in (None, FILENAME) else os.path.basename(filename)
    return {"type": type(exc).__name__, "message": message, "line": line, "file": file}


# --------------------------------------------------------------------------
# Outils mis à disposition des tests (expressions Python évaluées après le code)
# --------------------------------------------------------------------------

def _ast_info(source):
    try:
        tree = ast.parse(source)
    except SyntaxError:
        return set(), set()
    kinds = {type(n).__name__ for n in ast.walk(tree)}
    called = set()
    for n in ast.walk(tree):
        if isinstance(n, ast.Call):
            if isinstance(n.func, ast.Name):
                called.add(n.func.id)
            elif isinstance(n.func, ast.Attribute):
                called.add(n.func.attr)
    return kinds, called


def _make_helpers(source, output, data, modules, namespace):
    node_kinds, called = _ast_info(source)

    def uses(*kinds):
        """uses('For'), uses('ListComp')… : main.py contient ces nœuds AST."""
        return all(k in node_kinds for k in kinds)

    def calls(name):
        """calls('sum') : main.py appelle cette fonction / méthode."""
        return name in called

    def uses_in(filename, *kinds):
        """Comme uses(), mais dans un module éditable (ex. 'compte.py')."""
        return all(k in _ast_info(modules.get(filename, ""))[0] for k in kinds)

    def calls_in(filename, name):
        """Comme calls(), mais dans un module éditable."""
        return name in _ast_info(modules.get(filename, ""))[1]

    def _tree(filename=None):
        try:
            return ast.parse(source if filename is None else modules.get(filename, ""))
        except SyntaxError:
            return ast.Module(body=[], type_ignores=[])

    def recursive(func_name=None, filename=None):
        """True si la fonction func_name s'appelle elle-même (sans nom : n'importe quelle fonction)."""
        for node in ast.walk(_tree(filename)):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and func_name in (None, node.name):
                if any(
                    isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == node.name
                    for n in ast.walk(node)
                ):
                    return True
        return False

    def assigns(*names, filename=None):
        """True si le code affecte l'un de ces noms (ex. assigns('list', 'sum'))."""
        for node in ast.walk(_tree(filename)):
            if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store) and node.id in names:
                return True
            if isinstance(node, (ast.FunctionDef, ast.arg)) and getattr(node, "name", getattr(node, "arg", None)) in names:
                return True
        return False

    def capture(fn, *args, **kwargs):
        """Renvoie ce qu'affiche fn(*args, **kwargs)."""
        saved = sys.stdout
        sys.stdout = io.StringIO()
        try:
            fn(*args, **kwargs)
            return sys.stdout.getvalue()
        finally:
            sys.stdout = saved

    def raises(exc_type, fn, *args, **kwargs):
        """True si fn(*args, **kwargs) lève exc_type."""
        try:
            fn(*args, **kwargs)
        except exc_type:
            return True
        except Exception:
            return False
        return False

    def error_message(fn, *args, **kwargs):
        """Message de l'exception levée par fn(*args, **kwargs), ou None."""
        try:
            fn(*args, **kwargs)
        except Exception as exc:
            return str(exc)
        return None

    def read_file(path):
        with open(path, encoding="utf-8") as f:
            return f.read()

    def run_with(stdin="", argv=None, **overrides):
        """
        Ré-exécute tout le programme (dans un dossier neuf) en remplaçant la valeur
        des affectations de premier niveau, ex. run_with(note=8)['mention'].
        argv : arguments de ligne de commande, ex. run_with(argv=["--num_iter=34"]).
        Le dictionnaire renvoyé contient aussi 'OUTPUT' (texte affiché).
        """
        new_tree = ast.parse(source, FILENAME)
        replaced = set()
        for node in new_tree.body:
            if (
                isinstance(node, ast.Assign)
                and len(node.targets) == 1
                and isinstance(node.targets[0], ast.Name)
                and node.targets[0].id in overrides
                and node.targets[0].id not in replaced
            ):
                name = node.targets[0].id
                replaced.add(name)
                node.value = ast.copy_location(
                    ast.Name(id="__override_" + name, ctx=ast.Load()), node.value
                )
        ast.fix_missing_locations(new_tree)
        saved = sys.stdout, sys.stdin, sys.stderr
        with _Sandbox(RERUN_DIR, source, data, modules) as env:
            for key, value in overrides.items():
                env[key] = value
                env["__override_" + key] = value
            if argv is not None:
                sys.argv[:] = ["main.py", *argv]
            sys.stdout, sys.stdin, sys.stderr = io.StringIO(), io.StringIO(stdin), io.StringIO()
            try:
                try:
                    exec(compile(new_tree, FILENAME, "exec"), env)
                except SystemExit as exc:  # argparse, sys.exit()…
                    env["EXIT_CODE"] = exc.code
                env["OUTPUT"] = sys.stdout.getvalue()
                env["ERRORS"] = sys.stderr.getvalue()
            finally:
                sys.stdout, sys.stdin, sys.stderr = saved
                _flush_figures()
        return env

    def pick(env, *names):
        """pick(run_with(n=3), 'a', 'b') → (env['a'], env['b'])"""
        return tuple(env[n] for n in names)

    def approx(a, b, tol=1e-6):
        return abs(a - b) <= tol

    def has_loop(fn):
        """True si la fonction contient une boucle for / while ou une compréhension (code non vectorisé)."""
        import inspect
        import textwrap

        try:
            tree = ast.parse(textwrap.dedent(inspect.getsource(fn)))
        except (OSError, TypeError, SyntaxError):
            return True
        return any(isinstance(n, (ast.For, ast.While, ast.comprehension)) for n in ast.walk(tree))

    def run_testcase(case, **patches):
        """
        Exécute une classe unittest.TestCase de l'élève. Les noms passés en
        paramètres remplacent temporairement ceux du programme, ce qui permet de
        vérifier que les tests détectent une implémentation fausse.
        Renvoie {"run": nb de tests, "failed": échecs + erreurs, "ok": bool}.
        """
        import unittest

        saved = {name: namespace[name] for name in patches if name in namespace}
        namespace.update(patches)
        try:
            suite = unittest.defaultTestLoader.loadTestsFromTestCase(case)
            result = unittest.TextTestRunner(stream=io.StringIO(), verbosity=0).run(suite)
        finally:
            for name in patches:
                if name in saved:
                    namespace[name] = saved[name]
                else:
                    namespace.pop(name, None)
        failed = len(result.failures) + len(result.errors)
        return {"run": result.testsRun, "failed": failed, "ok": result.testsRun > 0 and failed == 0}

    return {
        "OUTPUT": output,
        "LINES": [l.strip() for l in output.splitlines() if l.strip()],
        "SOURCE": source,
        "FILES": dict(modules),
        "uses": uses,
        "calls": calls,
        "uses_in": uses_in,
        "calls_in": calls_in,
        "capture": capture,
        "recursive": recursive,
        "assigns": assigns,
        "raises": raises,
        "error_message": error_message,
        "read_file": read_file,
        "file_exists": os.path.exists,
        "run_with": run_with,
        "pick": pick,
        "approx": approx,
        "run_testcase": run_testcase,
        "has_loop": has_loop,
        "FIGURES": list(_FIGURES),
    }


def _run_tests(tests, namespace, source, output, error, data, modules):
    if error is not None:
        return [
            {
                "label": t["label"],
                "passed": False,
                "message": _msg("not_evaluated"),
            }
            for t in tests
        ]

    helpers = _make_helpers(source, output, data, modules, namespace)
    results = []
    _QUIET[0] = True
    for t in tests:
        env = dict(namespace)
        env.update(helpers)
        saved = sys.stdout, sys.stdin
        sys.stdout, sys.stdin = io.StringIO(), io.StringIO("")
        message = None
        try:
            passed = bool(eval(t["check"], env))
            if not passed and t.get("show"):
                try:
                    message = _msg("got", expr=t["show"], value=repr(eval(t["show"], env)))
                except Exception as exc:  # la valeur n'existe pas encore
                    message = f"{type(exc).__name__}: {exc}"
        except BaseException as exc:
            passed = False
            message = f"{type(exc).__name__}: {exc}"
        finally:
            sys.stdout, sys.stdin = saved
        results.append({"label": t["label"], "passed": passed, "message": message})
    _QUIET[0] = False
    _flush_figures()
    return results


def run(code, stdin_text="", tests_json="null", files_json="null", lang="fr"):
    """
    Point d'entrée appelé par le worker. Renvoie un JSON (str).
    files_json : {"data": {chemin: texte}, "modules": {nom.py: code}} (facultatif)
    lang : langue des messages ("fr" ou "en")
    """
    global _LANG
    _LANG = lang if lang in _MESSAGES else "fr"
    _QUIET[0] = False
    tests = json.loads(tests_json)
    files = json.loads(files_json) or {}
    data = files.get("data") or {}
    modules = files.get("modules") or {}

    out = _JsStream("stdout", MAX_OUTPUT)
    err = _JsStream("stderr")
    saved_io = sys.stdout, sys.stderr, sys.stdin
    _register_source(code)
    error = None
    results = None

    with _Sandbox(WORKDIR, code, data, modules) as namespace:
        sys.stdout, sys.stderr, sys.stdin = out, err, io.StringIO(stdin_text)
        try:
            _prepare_libraries(code + "\n".join(modules.values()))
            exec(compile(code, FILENAME, "exec"), namespace)
        except SystemExit as exc:
            if isinstance(exc.code, str):
                err.write(exc.code + "\n")
        except BaseException as exc:
            error = _describe(exc)
            err.write(_format_exception(exc))
        finally:
            try:
                _flush_figures()  # figures non affichées par plt.show()
            except Exception:
                pass
            sys.stdout, sys.stderr, sys.stdin = saved_io

        snapshot = _snapshot(WORKDIR, data, modules)
        if tests is not None:
            results = _run_tests(tests, namespace, code, "".join(out.chunks), error, data, modules)

    return json.dumps({"error": error, "tests": results, "files": snapshot})
