### Des fonctions qui manipulent des fonctions

La **programmation fonctionnelle** compose des fonctions plutôt que d'écrire des boucles qui modifient des variables. Python en offre les outils essentiels : `lambda`, `map`, `filter`, `sorted(key=…)`, `any`, `all`, `zip`, `enumerate`, et les modules `itertools` et `functools`.

```python
l = [1, 2, 3, 4, 5]

l_squared = map(lambda x: x**2, l)          # applique une fonction à chaque élément
l_even = filter(lambda x: x % 2 == 0, l)    # garde les éléments qui vérifient la condition
print(list(l_squared), list(l_even))        # map et filter renvoient des itérateurs paresseux

all_positive = all(map(lambda x: x > 0, l)) # True si TOUS vérifient la condition
any_positive = any(map(lambda x: x > 0, l)) # True si AU MOINS UN la vérifie
print(all_positive, any_positive)

pairs = [(1, "one"), (2, "two"), (3, "three"), (4, "four")]
pairs.sort(key=lambda pair: pair[1])        # trie selon le 2e élément (ordre alphabétique)
print(pairs)
print(sorted(["banana", "Apple", "cherry"], key=str.lower))   # key : n'importe quelle fonction
```

> 💡 Une compréhension est souvent plus lisible que `map` / `filter` avec une lambda : `[x**2 for x in l if x % 2 == 0]`. Les deux styles sont « pythoniques » ; choisissez le plus clair.

### `zip` et `enumerate`

```python
names = ["Ada", "Alan", "Grace"]
years = [1815, 1912, 1906]
for i, (name, year) in enumerate(zip(names, years), start=1):
    print(f"{i}. {name} ({year})")
print(dict(zip(names, years)))
```

### `itertools`, `functools`, `collections`

```python
import itertools
import functools
import collections

print(list(itertools.product("AB", [1, 2])))          # produit cartésien
print(list(itertools.combinations("ABC", 2)))         # combinaisons
print(list(itertools.permutations("ABC", 2))[:4])     # arrangements
print(list(itertools.accumulate([1, 2, 3, 4])))       # sommes cumulées
print(list(itertools.chain([1, 2], (3, 4))))          # mise bout à bout

print(functools.reduce(lambda acc, x: acc * x, [1, 2, 3, 4, 5]))   # 5! = 120
square_of = functools.partial(pow, exp=2)             # fixe un argument
print(square_of(7))

counts = collections.Counter("abracadabra")           # compter en une ligne
print(counts.most_common(2))
```

Un exemple du cours, à lire de l'intérieur vers l'extérieur : trouver l'adresse IP qui a reçu le plus d'erreurs 404 dans un journal de serveur web, en une seule expression.

```python norun
print(
  max(
    [(count, ip) for ip, count in
      collections.Counter([
        ip for ip, code in
        [ip_and_code(x) for x in
          urllib.request.urlopen(logurl).read().decode("utf8").splitlines()]
        if code == "404"
      ]).items()
    ]
  )
)
```

### Les décorateurs

Une fonction peut **prendre** une fonction et en **renvoyer** une autre : c'est un **décorateur**. La syntaxe `@decorateur` au-dessus d'un `def` est un raccourci pour `f = decorateur(f)`. Vous en croiserez partout (`@property`, `@lru_cache`, `@app.route` de Flask au module 11…).

```python
import functools
import time

def timed(func):
    """Décorateur qui affiche la durée de chaque appel."""
    @functools.wraps(func)                 # conserve le nom et la docstring de func
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} : {time.perf_counter() - start:.4f} s")
        return result
    return wrapper

@timed                                     # équivaut à : slow_sum = timed(slow_sum)
def slow_sum(n):
    return sum(range(n))

print(slow_sum(1_000_000))

@functools.lru_cache                       # mémorise les résultats déjà calculés
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)
print(fib(80))
```

> 🎯 **À retenir** : `lambda` pour une petite fonction anonyme ; `map`, `filter` (paresseux) ; `sorted(…, key=…)` / `list.sort(key=…)` ; `any`, `all`, `zip`, `enumerate` ; `itertools` (product, combinations, accumulate, chain), `functools` (reduce, partial, lru_cache, wraps), `collections.Counter` ; un décorateur prend une fonction et en renvoie une nouvelle.
