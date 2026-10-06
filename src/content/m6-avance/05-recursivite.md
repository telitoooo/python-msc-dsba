### Une fonction qui s'appelle elle-même

Une fonction **récursive** résout un problème en se rappelant sur un problème **plus petit**. Elle a toujours deux parties :

- un **cas de base**, résolu directement, qui arrête la récursion ;
- un **cas récursif**, qui se ramène à un problème plus petit.

```python
def fact(n):
    if n == 0:              # cas de base
        return 1
    return n * fact(n - 1)  # cas récursif (le else est facultatif après un return)

print(fact(5))              # 5 * 4 * 3 * 2 * 1 = 120
```

### La pile d'appels

Pour revenir au bon endroit après chaque `return`, l'ordinateur empile les appels en cours : c'est la **pile d'appels** (*call stack*). `fact(3)` attend `fact(2)`, qui attend `fact(1)`, qui attend `fact(0)` ; puis les résultats remontent.

```python
def fact_bavard(n, niveau=0):
    print("  " * niveau + f"fact({n})")
    if n == 0:
        resultat = 1
    else:
        resultat = n * fact_bavard(n - 1, niveau + 1)
    print("  " * niveau + f"→ {resultat}")
    return resultat

fact_bavard(3)
```

> ⚠️ **Sans cas de base atteignable, la pile déborde** : `fact(-1)` descend vers -2, -3… sans jamais atteindre 0, jusqu'à la `RecursionError` (Python limite la profondeur à environ 1000 appels, voir `sys.getrecursionlimit()`). Protégez vos fonctions : `if n < 0: raise ValueError(...)`.

### Récursif, itératif, mémoïsé : l'exemple de Fibonacci

Le cours définit `fib(0) = 1`, `fib(1) = 1` et `fib(n) = fib(n - 1) + fib(n - 2)`, soit 1, 1, 2, 3, 5, 8, 13, 21… Plusieurs façons de la calculer :

```python
import time

def fib_rec(n):                      # traduction directe : élégante mais exponentielle
    if n < 2:
        return 1
    return fib_rec(n - 1) + fib_rec(n - 2)

def fib_iter(n):                     # boucle : linéaire
    a, b = 1, 1
    for _ in range(n):
        a, b = b, a + b
    return a

cache = {}
def fib_memo(n):                     # récursif + mémoire des résultats déjà calculés
    if n < 2:
        return 1
    if n not in cache:
        cache[n] = fib_memo(n - 1) + fib_memo(n - 2)
    return cache[n]

for f in (fib_rec, fib_iter, fib_memo):
    debut = time.perf_counter()
    print(f.__name__, f(25), f"{time.perf_counter() - debut:.4f} s")
```

`fib_rec(25)` recalcule les mêmes valeurs des centaines de milliers de fois ; la mémoïsation et la boucle n'en calculent chacune qu'une.

### Quand la récursion est naturelle

La récursion brille sur les **structures elles-mêmes récursives** : un dossier contient des fichiers et des **dossiers** ; un arbre contient des sous-arbres.

```python
import os

os.makedirs("projet/src/outils", exist_ok=True)
for chemin in ["projet/README.md", "projet/src/main.py", "projet/src/outils/aide.py"]:
    open(chemin, "w").close()

def taille_arbre(dossier):
    """Nombre de fichiers dans le dossier et tous ses sous-dossiers."""
    total = 0
    for nom in os.listdir(dossier):
        chemin = os.path.join(dossier, nom)
        if os.path.isdir(chemin):
            total += taille_arbre(chemin)   # même problème, plus petit
        else:
            total += 1
    return total

print(taille_arbre("projet"), "fichiers")
```

> 🎯 **À retenir** : un cas de base + un cas récursif qui se rapproche du cas de base ; chaque appel occupe la pile ; la récursion naïve peut être exponentielle (Fibonacci) : boucle ou mémoïsation ; idéale pour les arborescences et le *backtracking*.
