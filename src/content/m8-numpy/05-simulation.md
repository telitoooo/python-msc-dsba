### Le générateur aléatoire de NumPy

Pour simuler, on tire des nombres **pseudo-aléatoires**. On crée un générateur avec une **graine** (*seed*) : la même graine redonne exactement la même suite de tirages, ce qui rend les expériences **reproductibles** (indispensable pour déboguer et comparer).

```python
import numpy as np

rng = np.random.default_rng(seed=42)
print(rng.random(3))                     # 3 réels uniformes dans [0, 1[
print(rng.integers(1, 7, size=10))       # 10 lancers de dé (7 exclu)
print(rng.normal(loc=170, scale=8, size=4).round(1))   # loi normale
print(rng.choice(["pile", "face"], size=5))
print(rng.permutation(5))                # une permutation de 0..4
```

> 💡 L'ancienne interface `np.random.seed(0)` / `np.random.rand(…)` existe toujours et se croise souvent sur Internet ; `default_rng` est la façon moderne et recommandée.

### La méthode de Monte-Carlo

L'idée : estimer une quantité en **simulant un grand nombre d'expériences aléatoires**. Exemple célèbre : tirer des points au hasard dans le carré [0, 1] × [0, 1] ; la proportion de points tombés dans le quart de disque de rayon 1 tend vers son aire, π/4.

```python
import numpy as np

rng = np.random.default_rng(0)
n = 100_000
x, y = rng.random(n), rng.random(n)      # n points d'un coup : pas de boucle
inside = x**2 + y**2 <= 1                 # masque booléen
print("π ≈", 4 * inside.mean())          # mean() d'un masque = proportion de True

# Convergence : estimation après 1, 2, …, n points
estimates = 4 * np.cumsum(inside) / np.arange(1, n + 1)
print(estimates[[9, 99, 999, 9_999, 99_999]])
```

L'erreur diminue comme 1/√n : pour gagner un chiffre de précision, il faut **100 fois** plus de points.

> ⚠️ **Ne mémorisez pas ce dont vous n'avez pas besoin** : pour un milliard de points, stocker tous les tirages saturerait la mémoire. On simule alors par **paquets** (par exemple 1 million à la fois) en n'accumulant que le compteur.

### Simuler une expérience pas à pas

Certaines expériences ont une logique séquentielle. Exemple (*Hands-on « flight seats assignment »*) : 100 passagers montent dans un avion de 100 places. Le premier s'assoit au hasard ; chaque suivant prend sa place si elle est libre, sinon une place libre au hasard. Quelle est la probabilité que le dernier passager trouve sa place ?

```python
import numpy as np

def last_gets_own_seat(n_seats, rng):
    free = set(range(n_seats))
    free.remove(rng.integers(n_seats))            # passager 0 : au hasard
    for passenger in range(1, n_seats - 1):
        if passenger in free:
            free.remove(passenger)                # sa place est libre
        else:
            free.remove(rng.choice(list(free)))   # sinon, une place libre au hasard
    return (n_seats - 1) in free                  # reste-t-il la place du dernier ?

rng = np.random.default_rng(1)
results = [last_gets_own_seat(100, rng) for _ in range(2000)]
print("probabilité estimée :", np.mean(results))
```

Chaque simulation contient une boucle, mais on peut **répéter** l'expérience, compter les succès avec NumPy (`np.mean` d'une liste de booléens) et, pour accélérer, vectoriser *à travers les simulations* (avancer toutes les simulations d'un passager à la fois).

> 🎯 **À retenir** : `rng = np.random.default_rng(graine)` puis `rng.random`, `rng.integers`, `rng.normal`, `rng.choice`, `rng.permutation` ; Monte-Carlo = simuler beaucoup et compter ; `masque.mean()` donne une proportion ; `np.cumsum` pour suivre une convergence ; erreur en 1/√n.
