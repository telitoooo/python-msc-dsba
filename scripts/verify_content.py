"""
Vérifie le contenu pédagogique hors navigateur :

- chaque solution passe 100 % de ses tests ;
- chaque code de départ est du Python valide et ne passe PAS tous les tests ;
- chaque niveau possède les champs obligatoires.

Utilise exactement le même moteur que le site (src/lib/runner.py).
Usage : npm run verify-content   (ou : python3 scripts/verify_content.py [préfixe…])
        ex. python3 scripts/verify_content.py m7 m8-l2   → seulement ces leçons
"""

import json
import signal
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED = ("title", "prompt", "starter", "solution", "tests")
TIMEOUT_S = 30  # numpy / pandas / matplotlib : la première importation prend du temps


def load_runner():
    namespace = {"_js_emit": lambda stream, text: None, "__name__": "runner"}
    exec(compile((ROOT / "src/lib/runner.py").read_text(), "runner.py", "exec"), namespace)
    return namespace["run"]


def on_timeout(signum, frame):
    raise TimeoutError(f"exécution > {TIMEOUT_S} s")


def main():
    run = load_runner()
    content = json.loads((ROOT / "scripts/content.json").read_text())
    prefixes = sys.argv[1:]
    if prefixes:
        content = {k: v for k, v in content.items() if any(k == p or k.startswith(p + "-") for p in prefixes)}
    signal.signal(signal.SIGALRM, on_timeout)
    failures = 0
    checked = 0

    for lesson_id, exercises in content.items():
        for ex in exercises:
            for tier_id, tier in ex["tiers"].items():
                label = f"{lesson_id}/{ex['id']}/{tier_id}"
                problems = [f"champ manquant : {f}" for f in REQUIRED if not tier.get(f)]
                stdin = tier.get("stdin", "")
                tests_json = json.dumps(tier.get("tests", []))
                data = tier.get("files") or {}
                start_files = json.dumps({"data": data, "modules": tier.get("modules") or {}})
                sol_files = json.dumps({"data": data, "modules": tier.get("solutionModules") or {}})
                if tier.get("modules") and set(tier["modules"]) != set(tier.get("solutionModules") or {}):
                    problems.append("modules et solutionModules n'ont pas les mêmes fichiers")

                signal.alarm(TIMEOUT_S)
                try:
                    sol = json.loads(run(tier["solution"], stdin, tests_json, sol_files))
                    start = json.loads(run(tier["starter"], stdin, tests_json, start_files))
                finally:
                    signal.alarm(0)

                if sol["error"]:
                    problems.append(f"la solution lève {sol['error']['type']}: {sol['error']['message']}")
                for t in sol["tests"] or []:
                    if not t["passed"]:
                        problems.append(f"solution KO → {t['label']} ({t['message']})")
                if start["error"] and start["error"]["type"] in ("SyntaxError", "IndentationError"):
                    problems.append(f"le code de départ est invalide : {start['error']['message']}")
                if start["tests"] and all(t["passed"] for t in start["tests"]):
                    problems.append("le code de départ passe déjà tous les tests")

                checked += 1
                status = "OK " if not problems else "ERR"
                n_tests = len(tier.get("tests", []))
                print(f"[{status}] {label:<22} {n_tests} tests")
                for p in problems:
                    print(f"        - {p}")
                failures += bool(problems)

    print(f"\n{checked} niveaux vérifiés, {failures} en erreur.")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
