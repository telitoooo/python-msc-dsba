### Calcul vectorisé

Une opération entre tableaux de **même forme** s'applique élément par élément, sans boucle. Les fonctions mathématiques de NumPy (`np.sqrt`, `np.exp`, `np.log`, `np.sin`…) font de même : ce sont des *ufuncs* (fonctions universelles).

```python
import numpy as np

prices = np.array([2.95, 4.95, 1.95, 12.95])
quantities = np.array([3, 1, 0, 2])
print(prices * quantities)              # prix de chaque ligne de commande
print((prices * quantities).sum())      # total
print(prices @ quantities)              # produit scalaire : même total en une opération
print(np.sqrt(np.array([4, 9, 16])))
```

### Le broadcasting

Le **broadcasting** permet d'opérer sur des tableaux de **formes différentes** : le plus petit est « étendu » (sans copie réelle) pour correspondre au plus grand.

```python
import numpy as np

arr = np.array([[1, 2, 3],
                [4, 5, 6]])               # forme (2, 3)
row_vector = np.array([10, 20, 30])        # forme (3,)
print(arr + row_vector)                    # ajouté à CHAQUE ligne
print(arr * 2)                             # un nombre est étendu à tout le tableau

col_vector = np.array([[100], [200]])      # forme (2, 1)
print(arr + col_vector)                    # ajouté à CHAQUE colonne
```

**La règle** : on compare les formes en partant de la **dernière** dimension. Deux dimensions sont compatibles si elles sont **égales** ou si l'une vaut **1** (elle est alors étendue). Une dimension manquante compte comme 1.

```python
import numpy as np

A = np.arange(32).reshape(4, 1, 8)
B = np.arange(48).reshape(1, 6, 8)
# axe 0 : 4 et 1 → B est étendu ; axe 1 : 1 et 6 → A est étendu ; axe 2 : 8 et 8 → égaux
print((A + B).shape)                       # (4, 6, 8)

try:
    np.ones((2, 3)) + np.ones((2, 4))      # 3 et 4 : incompatibles
except ValueError as e:
    print("Erreur :", e)
```

> 💡 Pour transformer un vecteur `(n,)` en colonne `(n, 1)`, utilisez `v[:, np.newaxis]` (ou `v.reshape(-1, 1)`). Exemple : une table de multiplication en une ligne, `np.arange(1, 11)[:, np.newaxis] * np.arange(1, 11)`.

### Produit matriciel

`np.dot(a, b)` ou `a @ b` calcule le produit matriciel (ou scalaire pour deux vecteurs). Avec une matrice de commandes (une ligne par commande, une colonne par produit), un seul produit donne le montant de chaque commande :

```python
import numpy as np

prices = np.array([2.95, 4.95, 1.95, 12.95])
orders = np.array([
    [3, 0, 0, 2],
    [10, 3, 4, 8],
    [19, 0, 1, 1],
])
print(orders @ prices)             # total de chaque commande (forme (3,))
print(orders.sum(axis=0))          # quantité vendue de chaque produit
print(orders.sum(axis=0) * prices) # chiffre d'affaires par produit
```

### Pourquoi « dire adieu aux boucles » ?

```python
import time
import numpy as np

n = 1_000_000
start = time.perf_counter()
total = 0
for i in range(n):
    total += i * i
loop_time = time.perf_counter() - start

start = time.perf_counter()
values = np.arange(n, dtype=np.int64)
total_np = (values * values).sum()
numpy_time = time.perf_counter() - start

print(total == total_np, f"boucle : {loop_time:.3f} s, NumPy : {numpy_time:.4f} s")
```

> 🎯 **À retenir** : les opérations et *ufuncs* sont élément par élément ; le broadcasting aligne les formes depuis la dernière dimension (égales ou 1) ; `@` / `np.dot` pour le produit matriciel ; un calcul vectorisé remplace avantageusement une boucle.
