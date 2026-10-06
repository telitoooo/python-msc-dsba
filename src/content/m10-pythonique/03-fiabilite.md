### Les assertions : vérifier ses hypothèses

`assert condition, message` vérifie qu'une condition **doit** être vraie à cet endroit du programme ; sinon une `AssertionError` est levée. C'est un **contrôle de cohérence** (*sanity check*) pour le développeur.

```python
def isqrt(n):
    assert n >= 0, "n doit être positif"
    i = 0
    while i * i < n:          # boucle jusqu'à ce que i * i ne soit plus inférieur à n
        i += 1
    return i                  # le premier entier dont le carré n'est pas inférieur à n

print(isqrt(144))
try:
    isqrt(-25)
except AssertionError as e:
    print("AssertionError :", e)
```

> ⚠️ Les assertions peuvent être **désactivées** (`python -O programme.py`) : ne les utilisez jamais pour valider des données venant de l'utilisateur (là, levez une vraie exception : `raise ValueError(...)`). Elles servent à détecter les **bugs**.

### `with` : le gestionnaire de contexte

Trois façons d'écrire dans un fichier — la dernière est la bonne :

```python
# 1) sans with : si write() lève une erreur, le fichier n'est jamais fermé
file = open("file_path.txt", "w")
file.write("hello world !")
file.close()

# 2) toujours sans with, mais sûr : finally s'exécute quoi qu'il arrive
file = open("file_path.txt", "w")
try:
    file.write("hello world")
finally:
    file.close()

# 3) avec with : même garantie, sans close() à écrire
with open("file_path.txt", "w") as file:
    file.write("hello world !")
print(file.closed)
```

On peut écrire ses propres gestionnaires de contexte : une classe avec `__enter__` (exécuté à l'entrée du bloc, sa valeur de retour est liée par `as`) et `__exit__` (exécuté à la sortie, **même en cas d'exception**).

```python
import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self.start
        print(f"bloc exécuté en {self.elapsed:.4f} s")
        return False              # False : une éventuelle exception continue sa route

with Timer() as t:
    total = sum(i * i for i in range(500_000))
print(total, t.elapsed > 0)
```

### Les tests unitaires avec `unittest`

Un **test unitaire** est un morceau de code qui vérifie automatiquement qu'une fonction se comporte comme prévu. La bibliothèque standard fournit `unittest` : on regroupe les tests d'un module dans une classe qui hérite de `unittest.TestCase` ; chaque méthode dont le nom commence par `test` est un test, qui utilise des **assertions** (`assertEqual`, `assertTrue`, `assertGreater`, `assertAlmostEqual`, `assertRaises`…).

```python
import math
import sys
import unittest

def distance(x: tuple, y: tuple) -> float:
    """Distance euclidienne entre deux points."""
    return math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)


class EuclideanTestCase(unittest.TestCase):
    """Tests de la fonction distance."""

    def test_euclidean_distance_same(self):
        x = (0.0, 0.0)
        self.assertEqual(distance(x, x), 0.0)

    def test_euclidean_distance(self):
        x, y = (0.0, 0.0), (1.0, 1.0)
        self.assertGreater(distance(x, y), 1.0)
        self.assertEqual(distance(x, y), distance(y, x))

    def test_known_value(self):
        self.assertAlmostEqual(distance((0, 0), (3, 4)), 5.0)


suite = unittest.defaultTestLoader.loadTestsFromTestCase(EuclideanTestCase)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```

Dans un vrai projet, les tests vivent dans un fichier séparé (`test_euclidean.py`) qui importe le module testé, et se lancent par :

```python norun
if __name__ == "__main__":
    unittest.main()          # ou, dans un terminal : python -m unittest
```

> 💡 Le paquet **coverage** mesure la **couverture** des tests : quelle part du code est exécutée par au moins un test (`coverage run -m unittest`, puis `coverage report`).

### Journaliser plutôt qu'afficher : `logging`

Pourquoi éviter les `print` de débogage ? On ne voit pas toujours la console (serveur, interface graphique), et un `print` n'indique ni **quand**, ni **où**, ni **à quel point c'est grave**. Le module `logging` définit des **niveaux** (DEBUG < INFO < WARNING < ERROR < CRITICAL), écrit dans la console ou un fichier, et ajoute le contexte (heure, module, fonction, ligne…).

```python
import logging

logging.basicConfig(
    format="%(asctime)s,%(msecs)03d %(name)s %(levelname)s %(message)s",
    datefmt="%H:%M:%S",
    level=logging.DEBUG,
    force=True,      # reconfigure même si logging l'a déjà été (utile ici et dans un notebook)
)
logging.debug("something to debug")
logging.info("an info i wanna share")
logging.warning("watch out, something may be a problem")
logging.error("we are facing something wrong")
logging.critical("even worse")
```

Ajoutez `filename="app.log"` à `basicConfig` pour écrire dans un fichier ; `level=logging.WARNING` masque les messages moins graves. Par défaut, les journaux vont sur la **sortie d'erreur** (en rouge dans ce terminal).

### Déboguer

Les IDE (VS Code, PyCharm, Spyder…) intègrent un **débogueur** : poser des **points d'arrêt**, exécuter **pas à pas**, **inspecter** les variables. En ligne de commande, `breakpoint()` ouvre le débogueur `pdb`. Limite : les applications interactives (tkinter, Flask) sont plus délicates à déboguer, car elles tournent dans une boucle d'événements.

> 🎯 **À retenir** : `assert` pour les bugs (désactivable avec `-O`) ; `with` garantit la libération des ressources (`__enter__` / `__exit__`) ; `unittest.TestCase` + méthodes `test_…` + `assertEqual`… ; `logging` avec niveaux et format plutôt que `print` ; débogueur et points d'arrêt.
