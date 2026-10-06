### Écrire du code efficace : les principes

- **Utilisez les fonctions intégrées et les bibliothèques** (`sum`, `max`, `sorted`, `collections`…) : elles sont écrites en C et très optimisées.
- **Évitez les variables globales** : l'accès à une variable locale est plus rapide (et le code plus clair).
- **Préférez les compréhensions aux boucles** qui font des `append` : plus concises, et plus rapides.
- **Méfiez-vous de la récursivité** : chaque appel coûte de la mémoire (pile) ; une version itérative ou mémoïsée est souvent préférable.
- **Utilisez NumPy et SciPy** pour le calcul scientifique : **vectorisation** et **broadcasting** remplacent les boucles.
- **Cython** (un sur-ensemble de Python compilé en C) ou **Numba** accélèrent les parties critiques.
- **multiprocessing**, *multi-threading* ou **asyncio** exploitent plusieurs cœurs ou les temps d'attente.
- **Mesurez avant d'optimiser** : un *profiler* (`cProfile`) et le débogueur localisent les vrais goulets d'étranglement.
- **Restez simple et lisible** : un code clair est plus facile à comprendre, maintenir… et optimiser.
- Préférez `match` / `case` à une longue cascade de `if` / `elif`.

### Mesurer le temps

```python
import time
import timeit

start = time.perf_counter()                        # chronomètre haute précision
total = sum(range(1_000_000))
print(f"{time.perf_counter() - start:.4f} s")

# timeit répète la mesure pour lisser les variations
print(timeit.timeit("sum(range(1000))", number=1000))
print(timeit.timeit("[i * i for i in range(1000)]", number=1000))
```

### Choisir la bonne structure de données

La complexité compte souvent plus que les micro-optimisations : chercher un élément dans une **liste** parcourt toute la liste (temps proportionnel à sa taille), alors qu'un **ensemble** ou un **dictionnaire** répond en temps quasi constant (table de hachage, module 4).

```python
import time

values = list(range(100_000))
as_set = set(values)
targets = range(99_000, 100_000)

start = time.perf_counter()
found = sum(1 for t in targets if t in values)      # 1 000 parcours d'une liste
print("liste :", f"{time.perf_counter() - start:.4f} s")

start = time.perf_counter()
found = sum(1 for t in targets if t in as_set)      # 1 000 recherches dans un set
print("set   :", f"{time.perf_counter() - start:.6f} s")
```

### Dire adieu aux boucles (1) : NumPy

```python
import time
import numpy as np

start = time.time()
total = 0
for item in range(0, 1_500_000):              # somme itérative
    total = total + item
print("sum is:", total, f"({time.time() - start:.3f} s)")

start = time.time()
print("sum is:", np.sum(np.arange(1_500_000, dtype=np.int64)), f"({time.time() - start:.4f} s)")
```

### Dire adieu aux boucles (2 et 3) : pandas

Parcourir un DataFrame ligne par ligne avec `iterrows` est **extrêmement lent** (le cours mesure 109 s contre 0,12 s sur 5 millions de lignes). On calcule plutôt sur des **colonnes entières**, et `df.loc[masque, colonne] = …` remplace les `if` ligne par ligne :

```python
import time
import numpy as np
import pandas as pd

rng = np.random.default_rng(0)
df = pd.DataFrame(rng.integers(1, 50, size=(5_000, 4)), columns=["a", "b", "c", "d"])

start = time.time()
ratios = []
for idx, row in df.iterrows():                   # ligne par ligne : lent
    ratios.append(100 * row["d"] / row["c"])
print(f"iterrows   : {time.time() - start:.3f} s")

start = time.time()
df["ratio"] = 100 * (df["d"] / df["c"])          # une seule opération vectorisée
print(f"vectorisé  : {time.time() - start:.4f} s", np.allclose(ratios, df["ratio"]))

# Colonne conditionnelle sans boucle : e = d si a == 0, b - c si 0 < a <= 25, b + c sinon
df["e"] = df["b"] + df["c"]
df.loc[df["a"] <= 25, "e"] = df["b"] - df["c"]
df.loc[df["a"] == 0, "e"] = df["d"]
print(df.head())
```

### Dire adieu aux boucles (4) : connaître son algèbre

Une double boucle qui calcule des sommes de produits est un **produit matriciel** : `np.dot` (ou `@`) le fait en une opération optimisée.

```python
import time
import numpy as np

rng = np.random.default_rng(0)
m = rng.random((1, 5))
x = rng.random((50_000, 5))

start = time.process_time()
z = np.zeros((50_000,))
for i in range(50_000):
    total = 0
    for j in range(5):
        total = total + x[i][j] * m[0][j]
    z[i] = total
print(f"boucles : {time.process_time() - start:.3f} s")

start = time.process_time()
z2 = np.dot(x, m.T)                       # forme (50000, 1)
print(f"np.dot  : {time.process_time() - start:.4f} s", np.allclose(z, z2.ravel()))
```

### Utiliser tous les cœurs : `multiprocessing`

On répartit le calcul sur plusieurs **processus** (un par cœur), puis on rassemble les résultats. Ce code ne s'exécute pas dans le navigateur (pas de processus) : essayez-le sur votre ordinateur.

```python norun
import random
from multiprocessing import Pool

def sample(num_samples):
    num_inside = 0
    for _ in range(num_samples):
        x, y = random.random(), random.random()
        if x**2 + y**2 <= 1:
            num_inside += 1
    return num_inside

def approximate_pi_parallel(num_samples):
    batch = 100_000
    with Pool() as pool:                                   # un processus par cœur
        results = pool.map(sample, [batch] * (num_samples // batch))
    return 4 * sum(results) / num_samples

if __name__ == "__main__":                                 # obligatoire avec multiprocessing
    print(approximate_pi_parallel(10_000_000))
```

### Compiler à la volée : Numba

**Numba** convertit une fonction Python en code machine au moment de l'exécution (*JIT*, *just-in-time*), avec vectorisation, voire calcul sur GPU. À essayer sur votre ordinateur (`pip install numba`) :

```python norun
import random
import numba

@numba.jit(nopython=True)
def monte_carlo_pi_jit(n_samples: int) -> float:
    acc = 0
    for i in range(n_samples):
        x, y = random.random(), random.random()
        if x**2 + y**2 < 1.0:
            acc += 1
    return 4.0 * acc / n_samples

print(monte_carlo_pi_jit(10_000_000))     # des dizaines de fois plus rapide qu'en Python pur
```

> 🎯 **À retenir** : mesurez (`time.perf_counter`, `timeit`, `cProfile`) avant d'optimiser ; bonne structure de données (`set` / `dict` pour chercher) ; built-ins et compréhensions ; vectorisez avec NumPy / pandas (jamais `iterrows` sur de gros tableaux) ; `np.dot` plutôt que des boucles imbriquées ; `multiprocessing`, Numba, Cython pour aller plus loin.
