### Pourquoi des modules ?

Un **module** est simplement un fichier `.py`. On découpe un gros programme en plusieurs fichiers pour le rendre lisible, réutilisable et testable. Un **package** est un dossier de modules qui contient un fichier `__init__.py`.

```text
mon_projet/
├── main.py              # point d'entrée : ce qu'on exécute
├── banque/              # un package
│   ├── __init__.py
│   ├── compte.py
│   └── stockage.py
└── README.md
```

### Les différentes formes d'`import`

```python
import math                          # on utilise math.sqrt, math.pi…
import statistics as st              # alias : st.mean
from random import randint, choice   # import de noms précis
from collections import Counter

print(math.sqrt(16), math.pi)
print(st.mean([12, 15, 18]))
print(randint(1, 6), choice(["pile", "face"]))
print(Counter("abracadabra").most_common(2))
```

> ⚠️ Évitez `from module import *` : on ne sait plus d'où viennent les noms, et ils peuvent en écraser d'autres.

Pour un package, on écrit par exemple `from banque.compte import deposer` ou `import banque.stockage`.

Le fichier `__init__.py` **fait d'un dossier un package** : il est exécuté au premier import du package (il peut être vide, ou définir des noms communs). Un projet bien rangé contient aussi un `README.md` qui explique comment l'utiliser, et suit les conventions de style **PEP 8** (voir la séance 6).

```python
# Pour l'exemple, on crée d'abord les fichiers du projet : a/__init__.py, a/func_a.py et b.py
import os
os.makedirs("a", exist_ok=True)
with open("a/__init__.py", "w") as f:
    f.write('module = "a"\n')
with open("a/func_a.py", "w") as f:
    f.write("def f_a(x):\n    return 2 * x\n")
with open("b.py", "w") as f:
    f.write("CONST = 42\n\ndef func_b(x):\n    return x + CONST\n")

import a
import a.func_a
from b import CONST, func_b

def main():
    print(a.module)            # nom défini dans a/__init__.py
    print(a.func_a.f_a(2))     # fonction du module a/func_a.py
    print(CONST, func_b(2))

if __name__ == "__main__":
    main()
```

### `if __name__ == "__main__":`

Quand Python **exécute** un fichier, la variable spéciale `__name__` vaut `"__main__"` ; quand le fichier est **importé**, elle vaut le nom du module. Ce test permet donc d'écrire du code qui ne s'exécute que si le fichier est lancé directement, et pas lors d'un import :

```python
def aire(rayon):
    return 3.14159 * rayon ** 2

def main():
    print("Aire du cercle unité :", aire(1))

if __name__ == "__main__":
    main()          # pas exécuté si un autre fichier fait « import ce_module »
```

### Où Python cherche-t-il les modules ?

Dans l'ordre : **le dossier du script exécuté**, puis la bibliothèque standard, puis les paquets installés avec `pip` (comme `requests` ou `pillow`). La liste complète est dans `sys.path`.

> ⚠️ **Piège classique : ne nommez jamais un fichier comme un module que vous importez.** Un fichier `random.py`, `glob.py`, `json.py` ou `email.py` placé à côté de votre script **remplace silencieusement** le vrai module, pour votre script et pour toutes les bibliothèques qui l'importent. Symptômes : `AttributeError: module 'random' has no attribute 'randint'` ou `TypeError: 'module' object is not callable`. Remède : renommer le fichier **et** supprimer le dossier `__pycache__`.

### La bibliothèque standard… et le reste du monde

Python est livré avec de nombreux modules (liste complète sur docs.python.org/3/library) : `copy`, `os`, `io`, `collections`, `datetime`, `time`, `functools`, `itertools`, `inspect`, `glob`, `re`, `math`, `random`, `pickle`, `json`, `csv`, `argparse`, `multiprocessing`, `queue`, `asyncio`, `html`, `xml`, `urllib`, `http`, `tkinter`, `unittest`, `sys`…

Les paquets externes se trouvent sur **PyPI** (pypi.org) et s'installent dans le terminal avec `pip install` (voir la leçon 1.1). Quelques exemples :

| Domaine | Paquets |
|---|---|
| Data science | NumPy (calcul numérique), pandas (tableaux de données), Matplotlib et Seaborn (graphiques), SciPy (fonctions scientifiques), scikit-learn (machine learning), TensorFlow et PyTorch (deep learning), Pillow et OpenCV (images), Jupyter (notebooks) |
| Web | requests (requêtes HTTP), Scrapy (robot d'exploration), Flask, Django et Tornado (frameworks), BeautifulSoup (analyse du HTML), pystache (gabarits) |
| Autres | pydub et librosa (audio), pygame (jeux), PyOpenGL et pyglet (3D), NetworkX (graphes), PyQt (interfaces graphiques), pytest (tests) |

### Trois modules standard très utiles

**`datetime` et `time`** : dates, durées et chronométrage.

```python
from datetime import date, datetime, timedelta
import time

maintenant = datetime.now()
print(maintenant.year, maintenant.strftime("%d/%m/%Y %H:%M"))
print(date(2026, 12, 25) - date(2026, 10, 5))        # une durée (timedelta)
print(date(2026, 10, 5) + timedelta(days=100))

horodatage = time.time()                             # timestamp : secondes depuis le 1er janvier 1970
print(horodatage, datetime.fromtimestamp(horodatage))  # un timestamp → une date

avant = time.time()
for i in range(3):
    print("je dors un peu…")
    time.sleep(0.5)                                  # met le programme en pause 0,5 s
print(f"durée totale : {time.time() - avant:.1f} s")

debut = time.perf_counter()
total = sum(i * i for i in range(1_000_000))
print(f"calcul en {time.perf_counter() - debut:.3f} s")
```

> 💡 Pour chronométrer, utilisez `time.perf_counter()` : c'est une horloge haute précision qui ne recule jamais, contrairement à `time.time()` qui suit l'heure système (elle peut être ajustée pendant la mesure).

**`collections`** : `Counter` compte les éléments, `defaultdict` crée les valeurs manquantes.

```python
from collections import Counter, defaultdict

mots = "le chat et le chien et le poisson".split()
compte = Counter(mots)
print(compte["le"], compte["ours"])        # 3 0 : pas de KeyError
print(compte.most_common(2))

par_initiale = defaultdict(list)
for mot in mots:
    par_initiale[mot[0]].append(mot)
print(dict(par_initiale))
```

**`argparse`** : lire les arguments de la ligne de commande (`python stats.py 1342 --top 5`).

```python
import argparse

parser = argparse.ArgumentParser(description="Statistiques de mots")
parser.add_argument("ids", type=int, nargs="+", help="identifiants des livres")
parser.add_argument("--top", type=int, default=10, help="nombre de mots à afficher")

args = parser.parse_args(["1342", "84", "--top", "5"])   # en vrai : parse_args() lit sys.argv
print(args.ids, args.top)
```

> 💡 **Lancer un programme Python** depuis un terminal : `python3 script.py` (un fichier), `python3 -m module` (un module, ex. `python3 -m http.server`), `python3 -c "print('bonjour')"` (une chaîne de code).

> 🎯 **À retenir** : un module = un fichier `.py`, un package = un dossier avec `__init__.py` ; `import x`, `import x as y`, `from x import f` ; protégez le point d'entrée par `if __name__ == "__main__":` ; ne nommez jamais vos fichiers comme des modules existants.
