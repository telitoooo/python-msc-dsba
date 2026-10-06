### Masques booléens et filtrage

Une comparaison sur un tableau renvoie un **tableau de booléens** de même forme : un **masque**. Utilisé entre crochets, il **filtre** les éléments (résultat à 1 dimension).

```python
import numpy as np

numbers = np.linspace(5, 50, 24, dtype=int).reshape(4, -1)
print(numbers)
mask = numbers % 4 == 0
print(mask)
print(numbers[mask])                         # les multiples de 4
by_four = numbers[numbers % 4 == 0]          # en une ligne
print(np.count_nonzero(mask), mask.any(), mask.all())
```

On combine les conditions avec `&` (et), `|` (ou) et `~` (non), **avec des parenthèses** (les mots-clés `and` / `or` ne fonctionnent pas sur des tableaux) :

```python
import numpy as np

temps = np.array([12.5, 31.0, 28.4, 35.2, 18.9, 30.1])
print(temps[(temps > 20) & (temps < 32)])
print(np.where(temps > 30, "hot", "ok"))     # choisit élément par élément
temps[temps > 33] = 33                        # écrêter avec un masque
print(temps)
```

### Transposer, mélanger, trier

```python
import numpy as np

a = np.array([[1, 2], [3, 4], [5, 6]])
print(a.T)                                   # transposée : forme (2, 3)

rng = np.random.default_rng(0)
rng.shuffle(a)                               # mélange les LIGNES, sur place
print(a)
print(np.sort(a, axis=0))                    # trie chaque colonne
print(np.sort(np.array([3, 1, 2])), np.argsort(np.array([3, 1, 2])))  # valeurs / indices triés
```

> 💡 `np.argsort` donne l'**ordre** des indices : `noms[np.argsort(notes)]` trie une liste de noms selon les notes.

### Concaténer

```python
import numpy as np

a = np.array([[4, 8], [6, 1]])
b = np.array([[3, 5], [7, 2]])
print(np.hstack((a, b)))                     # côte à côte : (2, 4)
print(np.vstack((a, b)))                     # l'un sous l'autre : (4, 2)
print(np.concatenate((a, b)))                # axis=0 par défaut, comme vstack
print(np.concatenate((a, b), axis=1))        # comme hstack
print(np.concatenate((a, b), axis=None))     # tout à plat : [4 8 6 1 3 5 7 2]
```

### Tableaux structurés

Un tableau NumPy n'a qu'un type… sauf si ce type est **structuré** : chaque élément est un enregistrement avec des champs nommés.

```python
import numpy as np

data = np.array([
    ("joe", 32, 6),
    ("mary", 15, 20),
    ("felipe", 80, 100),
    ("beyonce", 38, 9001),
], dtype=[("name", "U10"), ("age", int), ("power", int)])

print(data[0])                               # ('joe', 32, 6)
print(data["name"])                          # une colonne
print(data[data["power"] > 9000]["name"])    # filtrage par champ
print(np.sort(data, order="age")["name"])    # tri selon un champ
print(data["name"].dtype)                    # <U10
```

`<U10` signifie : chaîne **U**nicode d'au plus **10** caractères, stockée en *little-endian* (`<`, l'ordre des octets du processeur).

> ⚠️ Les tableaux structurés dépannent, mais dès que vos données ressemblent à un **tableau à colonnes de types différents**, passez à **pandas** (module 9), conçu pour cela.

> 🎯 **À retenir** : `a[masque]` filtre ; `&`, `|`, `~` avec parenthèses ; `np.where(cond, si_vrai, si_faux)` ; `.T`, `shuffle`, `np.sort`, `np.argsort` ; `hstack`, `vstack`, `concatenate(axis=0 | 1 | None)` ; `dtype=[("nom", "U10"), …]` pour des enregistrements.
