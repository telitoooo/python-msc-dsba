### Pourquoi NumPy ?

**NumPy** (*Numerical Python*) fournit un type de tableau à **n dimensions**, `ndarray`, et des centaines de fonctions de calcul. C'est la fondation de tout l'écosystème data (pandas, matplotlib, scikit-learn, PyTorch…). Ses atouts :

- **vitesse** : les calculs sont faits en C, sur des données stockées de façon compacte (souvent 10 à 100 fois plus rapide qu'une boucle Python) ;
- **moins de boucles** : une opération s'applique à tout le tableau d'un coup ;
- un code **plus clair** et de **meilleure qualité**.

Par convention, on l'importe sous le nom `np`. Dans ce site, NumPy est chargé automatiquement au premier `import numpy` (cela prend quelques secondes la première fois).

```python
import numpy as np

my_array = np.array([1, 2, 3, 4, 5, 6, 7, 8], dtype=np.int64)       # 1 dimension
my_2d_array = np.array([[1, 2, 3, 4],
                        [5, 6, 7, 8]], dtype=np.int64)              # 2 dimensions
my_3d_array = np.array([[[1, 2, 3, 4], [5, 6, 7, 8]],
                        [[1, 2, 3, 4], [9, 10, 11, 12]]])           # 3 dimensions

for a in (my_array, my_2d_array, my_3d_array):
    print(a.ndim, a.shape, a.size, a.dtype)
```

### Les propriétés d'un tableau

| Propriété | Signification | Exemple pour `my_2d_array` |
|---|---|---|
| `a.ndim` | nombre de dimensions (d'**axes**) | `2` |
| `a.shape` | **forme** : tuple de la taille de chaque dimension | `(2, 4)` |
| `a.size` | nombre total d'éléments | `8` |
| `a.dtype` | type (unique !) de tous les éléments | `int64` |

> ⚠️ **Faites attention aux formes (*shapes*) !** La plupart des erreurs NumPy viennent d'une forme inattendue. Affichez `a.shape` dès que vous doutez.

### Un tableau n'est pas une liste

Tous les éléments d'un tableau ont **le même type** (NumPy convertit si besoin) et les opérations s'appliquent **élément par élément** :

```python
import numpy as np

liste = [1, 2, 3]
tableau = np.array([1, 2, 3])
print(liste * 2)          # [1, 2, 3, 1, 2, 3] : répétition
print(tableau * 2)        # [2 4 6] : calcul élément par élément
print(tableau + 10, tableau ** 2)

melange = np.array([1, 2.5, 3])
print(melange, melange.dtype)        # tout devient float64
```

### Créer des tableaux

```python
import numpy as np

print(np.arange(0, 10, 2))           # comme range, mais renvoie un tableau
print(np.linspace(0, 1, 5))          # 5 valeurs régulièrement espacées de 0 à 1 (inclus)
print(np.zeros((2, 3)))              # tableau de zéros de forme (2, 3)
print(np.ones(4, dtype=int))
print(np.full((2, 2), 7))
print(np.eye(3))                     # matrice identité
```

### Changer de forme : `reshape`, `swapaxes`, `.T`

`reshape` réorganise les mêmes données dans une autre forme (le nombre total d'éléments doit être conservé ; `-1` signifie « calcule cette dimension pour moi »).

```python
import numpy as np

temperatures = np.array([
    29.3, 42.1, 18.8, 16.1, 38.0, 12.5,
    12.6, 49.9, 38.6, 31.3, 9.2, 22.2,
]).reshape(2, 2, 3)
print(temperatures.shape)                     # (2, 2, 3)
print(temperatures)

print(np.swapaxes(temperatures, 1, 2).shape)  # (2, 3, 2) : échange les axes 1 et 2
print(np.arange(12).reshape(3, -1))           # -1 → 4 colonnes
print(np.arange(6).reshape(2, 3).T)           # transposée : (3, 2)
print(temperatures.flatten())                 # retour à 1 dimension
```

> 💡 `reshape` ne copie pas les données : il crée une nouvelle **vue** sur le même bloc mémoire. C'est instantané, même pour des millions de valeurs.

> 🎯 **À retenir** : `import numpy as np` ; `np.array(liste)` ; `shape`, `ndim`, `size`, `dtype` ; un seul type par tableau ; opérations élément par élément ; `arange`, `linspace`, `zeros`, `ones`, `full`, `eye` ; `reshape` (avec `-1`), `swapaxes`, `.T`.
