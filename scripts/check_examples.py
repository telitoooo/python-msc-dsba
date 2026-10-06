"""
Exécute tous les exemples Python des leçons (fichiers .md de src/content), comme le bouton
« Exécuter » du site, et signale ceux qui lèvent une erreur.

- les blocs ```python norun (exemples statiques) sont ignorés ;
- le code des blocs ```python setup est ajouté en tête des exemples qui les suivent ;
- ```python stdin=a|b fournit les entrées ;
- un exemple qui montre volontairement une erreur porte la mention ```python raises=TypeError.

Utilise exactement le même moteur que le site (src/lib/runner.py).
Usage : npm run check-examples   (ou : python3 scripts/check_examples.py [préfixe de dossier…])
        ex. python3 scripts/check_examples.py m5 m6
"""

import json
import os
import re
import signal
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "src/content"
TIMEOUT_S = 60
FENCE = re.compile(r"^```python([^\n]*)\n(.*?)^```", re.M | re.S)
NO_FILES = json.dumps({"data": {}, "modules": {}})


def load_runner():
    namespace = {"_js_emit": lambda stream, text: None, "__name__": "runner"}
    exec(compile((ROOT / "src/lib/runner.py").read_text(), "runner.py", "exec"), namespace)
    return namespace["run"]


def on_timeout(signum, frame):
    raise TimeoutError(f"exécution > {TIMEOUT_S} s")


def examples(markdown):
    """(numéro, méta, code avec prélude) pour chaque exemple exécutable."""
    setups = []
    for index, match in enumerate(FENCE.finditer(markdown), start=1):
        meta, code = match.group(1), match.group(2).rstrip("\n")
        if re.search(r"\bnorun\b", meta):
            continue
        prelude = "\n".join(setups)
        yield index, meta, f"{prelude}\n{code}" if prelude else code
        if re.search(r"\bsetup\b", meta):
            setups.append(code)


def main():
    run = load_runner()
    prefixes = sys.argv[1:]
    signal.signal(signal.SIGALRM, on_timeout)
    files = sorted(CONTENT.glob("*/*.md"))
    if prefixes:
        files = [f for f in files if any(f.parent.name.startswith(p) for p in prefixes)]

    checked = failures = 0
    home = os.getcwd()
    for path in files:
        lang = "en" if path.name.endswith(".en.md") else "fr"
        for index, meta, code in examples(path.read_text(encoding="utf-8")):
            stdin_match = re.search(r"stdin=(\S+)", meta)
            stdin = "\n".join(stdin_match.group(1).split("|")) if stdin_match else ""
            expected = re.search(r"raises=(\w+)", meta)
            with tempfile.TemporaryDirectory() as tmp:
                os.chdir(tmp)
                signal.alarm(TIMEOUT_S)
                try:
                    result = json.loads(run(code, stdin, "[]", NO_FILES, lang))
                    error = result["error"]
                except TimeoutError as e:
                    error = {"type": "Timeout", "message": str(e), "line": None}
                finally:
                    signal.alarm(0)
                    os.chdir(home)
            checked += 1
            label = f"{path.relative_to(CONTENT)} #{index}"
            if expected:
                if not error or error["type"] != expected.group(1):
                    failures += 1
                    print(f"[ERR] {label} : {expected.group(1)} attendue, obtenu {error and error['type']}")
            elif error:
                failures += 1
                print(f"[ERR] {label} : {error['type']}: {error['message']} (ligne {error.get('line')})")

    print(f"\n{checked} exemples exécutés dans {len(files)} leçons, {failures} en erreur.")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
