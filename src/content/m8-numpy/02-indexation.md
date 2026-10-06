### Les axes

Chaque position dans la forme d'un tableau correspond à un **axe**. Pour un tableau 2D de forme `(lignes, colonnes)` : l'**axe 0** parcourt les lignes (on se déplace « vers le bas »), l'**axe 1** parcourt les colonnes (« vers la droite »).

Les fonctions d'agrégation (`sum`, `max`, `min`, `mean`, `std`, `argmax`…) s'appliquent soit au **tableau entier**, soit **le long d'un axe** : l'axe indiqué est celui qui « disparaît ».

```python
import numpy as np

table = np.array([
    [5, 3, 7, 1],
    [2, 6, 7, 9],
    [1, 1, 1, 1],
    [4, 3, 2, 0],
])
print(table.max())           # 9 : tout le tableau
print(table.max(axis=0))     # [5 6 7 9] : maximum de chaque COLONNE
print(table.max(axis=1))     # [7 9 1 4] : maximum de chaque LIGNE
print(table.sum(axis=1), table.mean(axis=0))
print(table.argmax(axis=1))  # indice (colonne) du maximum de chaque ligne
```

### Indexer : une virgule entre les axes

Contrairement aux listes de listes (`m[i][j]`), NumPy indexe **plusieurs axes dans un seul jeu de crochets** : `a[i, j]`.

```python
import numpy as np

square = np.array([
    [16, 3, 2, 13],
    [5, 10, 11, 8],
    [9, 6, 7, 12],
    [4, 15, 14, 1],
])
print(square[1, 2], square[-1, -1])      # ligne 1 colonne 2 ; dernier élément

# Le carré magique de Dürer : toutes les lignes, colonnes et diagonales valent 34
for i in range(4):
    assert square[:, i].sum() == 34      # colonne i
    assert square[i, :].sum() == 34      # ligne i
assert sum(square[i, i] for i in range(4)) == 34
assert np.trace(square) == 34 and np.trace(np.fliplr(square)) == 34
print("carré magique ✔")
```

### Découper (*slicing*) en plusieurs dimensions

Le slicing `début:fin:pas` de la séance 2 s'applique **sur chaque axe** :

```python
import numpy as np

arr = np.array([[1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]])
print("Ligne 0 :", arr[0])            # équivaut à arr[0, :]
print("Colonne 1 :", arr[:, 1])
print("Sous-tableau :\n", arr[1:3, 0:2])
print("Une ligne sur deux :\n", arr[::2])
print("Indexation par liste :", arr[[0, 2], 1])   # lignes 0 et 2, colonne 1
```

### Vue ou copie ?

> ⚠️ **Une tranche (*slice*) est une VUE** sur les données d'origine, pas une copie : la modifier modifie le tableau initial. C'est voulu (pas de copie coûteuse), mais c'est un piège classique. Utilisez `.copy()` pour travailler sur une copie indépendante.

```python
import numpy as np

grades = np.array([[12, 15], [8, 11]])
first_col = grades[:, 0]          # vue
first_col += 5                    # modifie aussi grades !
print(grades)

safe = grades[:, 1].copy()        # copie indépendante
safe[:] = 0
print(grades)                     # inchangé par cette deuxième modification
```

> 🎯 **À retenir** : `axis=0` agrège le long des lignes (résultat par colonne), `axis=1` le long des colonnes (résultat par ligne) ; `a[i, j]` ; `a[:, j]` une colonne, `a[i]` une ligne, `a[1:3, 0:2]` un sous-tableau ; les tranches sont des vues, `.copy()` pour une copie.
