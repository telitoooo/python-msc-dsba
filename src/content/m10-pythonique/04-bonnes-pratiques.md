### `argparse` : lire les arguments de la ligne de commande

Un programme reçoit souvent des **arguments** au lancement, par convention sous la forme `--nom=valeur` :

```text
user@name:~/python101$ python3 -m my_module --num_iter=34
number of iterations 34
```

Le module `argparse` déclare les arguments attendus (type, valeur par défaut, aide), lit `sys.argv`, convertit les valeurs et génère automatiquement l'aide `--help`.

```python
import argparse

parser = argparse.ArgumentParser(description="Démo argparse")
parser.add_argument("name", help="argument positionnel (obligatoire)")
parser.add_argument("--num_iter", type=int, default=10, help="nombre d'itérations")
parser.add_argument("--verbose", action="store_true", help="drapeau : True s'il est présent")

# Dans un vrai programme : args = parser.parse_args()  (lit la ligne de commande)
# Ici, on simule la ligne : python3 my_module.py Ada --num_iter=34 --verbose
args = parser.parse_args(["Ada", "--num_iter=34", "--verbose"])
print("number of iterations", args.num_iter, "|", args.name, args.verbose)
print(parser.parse_args(["Bob"]))          # valeurs par défaut
```

### Le zen de Python

`import this` affiche les principes de conception de Python (Tim Peters) : *Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex. Flat is better than nested. Readability counts. Errors should never pass silently…*

```python
import codecs
import this        # affiche le Zen au premier import seulement (Python reste chargé ensuite)

zen = codecs.decode(this.s, "rot13")   # le texte est stocké codé en ROT13 : on peut le réafficher
print(zen.splitlines()[2:6])
```

### Guides de style : PEP 8

Tout projet doit suivre des **conventions** communes (nommage, découpage des lignes…) : un code cohérent est plus **lisible**, plus facile à **maintenir**, et contient moins de bugs. Le guide officiel est **PEP 8** (il existe aussi celui de Google). Les règles essentielles :

| Élément | Convention | Exemple |
|---|---|---|
| variables, fonctions, modules | `snake_case` | `total_price`, `compute_mean()` |
| classes | `CapWords` | `VendingMachine` |
| constantes | `UPPER_CASE` | `MAX_QUANTITY` |
| indentation | 4 espaces | |
| lignes | 79 caractères (souvent 99–120 en pratique) | |
| imports | en haut du fichier, un par ligne | `import os` |

> 💡 Des outils vérifient et corrigent le style automatiquement : `flake8`, `pylint`, `black`, `ruff`.

### Docstrings et annotations de type

Chaque **module**, **classe** et **fonction** mérite une docstring : une première ligne de résumé, une description plus détaillée, puis des sections **Args** (arguments et types), **Returns** (ce qui est renvoyé), **Raises** (exceptions possibles) et **Attributes** (pour une classe). Les **annotations de type** (*type hints*) sont facultatives : Python ne les vérifie pas à l'exécution, elles aident le lecteur, l'IDE et des outils comme `mypy`.

```python
import math

def euclidean_distance(x: tuple[float, float], y: tuple[float, float]) -> float:
    """Computes the Euclidean distance between two points.

    Args:
        x: a tuple of two floats, the first point's coordinates.
        y: a tuple of two floats, the second point's coordinates.

    Returns:
        A positive float.
    """
    return math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)

help(euclidean_distance)
print(euclidean_distance.__annotations__)
```

### `match` / `case` : le filtrage par motif

Depuis Python 3.10, `match` compare une valeur à des **motifs** : plus lisible qu'une longue cascade de `if` / `elif`, il sait aussi **déstructurer** une liste ou un tuple et capturer des variables.

```python
def execute(command: str) -> str:
    match command.split():
        case ["deposit", amount]:
            return f"dépôt de {float(amount):.2f}"
        case ["withdraw", amount] if float(amount) > 0:     # garde : condition supplémentaire
            return f"retrait de {float(amount):.2f}"
        case ["balance"] | ["solde"]:                         # plusieurs motifs
            return "affichage du solde"
        case []:
            return "commande vide"
        case _:                                               # tout le reste
            return "commande inconnue"

for c in ["deposit 50", "withdraw 20", "solde", "", "dance"]:
    print(repr(c), "→", execute(c))
```

### Travailler en équipe

- **Relecture par les pairs** (*peer review*) : tout code est relu par un autre membre avant d'être intégré, pour détecter les bugs tôt, faire respecter les conventions, améliorer la qualité et **partager la connaissance** du code. Variante : la **programmation en binôme** (*pair programming*), à deux devant le même écran.
- **Gestion de versions** (git, mercurial) : chacun garde le code à jour, on navigue dans l'historique, on revient à une version précédente, on crée des **branches**. Hors du périmètre du cours, mais indispensable dès qu'on est plusieurs.

### Organiser les fichiers d'un projet

Ne mettez pas tout le projet dans un seul fichier : un gros module est illisible, plusieurs personnes le modifient en même temps et rien n'est réutilisable. Découpez en **modules** (fichiers) et **paquets** (dossiers contenant un `__init__.py`) :

```text
project/
├── README.md             # à quoi sert le projet, comment le lancer
├── requirements.txt      # dépendances : pip install -r requirements.txt
├── resources/config.yml
├── tests/                # tests unitaires
└── vending_machine/      # le paquet principal
    ├── __init__.py
    ├── app.py
    ├── core/
    │   ├── __init__.py
    │   └── machine.py
    ├── analysis/
    │   ├── __init__.py
    │   ├── http_client.py
    │   └── log_parser.py
    └── www/templates/machine.html
```

Lancez toujours l'interpréteur depuis la **racine** du projet, avec l'option module : `python -m vending_machine.app`. Dans `app.py`, on importe alors `from vending_machine.core import machine`, puis on utilise `machine.VendingMachine(…)`.

> 🎯 **À retenir** : `argparse` (`add_argument`, `type`, `default`, `action="store_true"`, `parse_args`) ; `import this` ; PEP 8 : `snake_case`, `CapWords`, `UPPER_CASE`, 4 espaces ; docstrings Args / Returns / Raises ; annotations `x: int -> float` ; `match` / `case` ; relecture, git ; paquets avec `__init__.py`, README et requirements.txt, `python -m`.
