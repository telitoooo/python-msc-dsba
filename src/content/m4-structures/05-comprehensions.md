### Construire une liste en une ligne

Une **compréhension de liste** construit une nouvelle liste à partir d'une séquence, de façon concise et lisible.

```python
# Version boucle classique
carres = []
for x in range(1, 6):
    carres.append(x ** 2)
print(carres)

# Version compréhension : même résultat
carres = [x ** 2 for x in range(1, 6)]
print(carres)
```

La syntaxe se lit presque comme une phrase : `[expression for element in sequence]` → « l'expression, pour chaque élément de la séquence ».

### Filtrer avec `if`

```python
nombres = [5, 12, 7, 20, 3, 18]
pairs = [n for n in nombres if n % 2 == 0]
grands_doubles = [n * 2 for n in nombres if n > 10]
print(pairs, grands_doubles)

mots = ["data", "IA", "python", "SQL"]
print([m.lower() for m in mots if len(m) > 2])
```

### Transformer avec `if ... else`

Pour **choisir une valeur** (et non filtrer), l'expression conditionnelle se place **avant** le `for` :

```python
notes = [8, 15, 11, 6]
resultats = ["admis" if n >= 10 else "ajourné" for n in notes]
print(resultats)
```

> ⚠️ Position du `if` : **à la fin** il **filtre** (`[x for x in l if cond]`) ; **au début** avec un `else` il **transforme** chaque élément (`[a if cond else b for x in l]`).

### Compréhensions de dictionnaires et d'ensembles

```python
mots = ["data", "python", "ia", "pandas"]

longueurs = {mot: len(mot) for mot in mots}          # dict
initiales = {mot[0] for mot in mots}                  # set
print(longueurs)
print(sorted(initiales))

prix = {"café": 2.5, "thé": 2.0, "jus": 3.5}
prix_ttc = {produit: round(p * 1.1, 2) for produit, p in prix.items()}
print(prix_ttc)
```

Le cours construit même un dictionnaire à partir de **deux** boucles : une clé par couple `(i, j)` :

```python
a = [1, 2, 3, 4]
b = [5, 6, 7]
dct = {(i, j): i * j for i in a for j in b}
print(dct)          # {(1, 5): 5, (1, 6): 6, …, (4, 7): 28}
```

Exemple plus complexe : compléter une table de distances qui n'est donnée que dans un sens (si `y` n'est pas dans `dists[x]`, on cherche dans `dists[y]`, sinon `None`) :

```python
dists = {"A": {"B": 140, "E": 200, "F": 200}, "B": {"C": 260, "F": 140},
         "C": {"D": 360}, "D": {"F": 280}, "E": {"F": 120}, "F": {}}
d_complete = {x: {y: dists[x][y] if y in dists[x]
                     else dists[y][x] if x in dists[y]
                     else None
                  for y in dists.keys()}
              for x in dists.keys()}
print(d_complete["F"])
```

### Compréhensions imbriquées

```python
matrice = [[1, 2, 3], [4, 5, 6]]

aplatie = [x for ligne in matrice for x in ligne]    # même ordre que deux for imbriqués
print(aplatie)

table = [[i * j for j in range(1, 4)] for i in range(1, 4)]
print(table)
```

### Expressions génératrices

Avec des **parenthèses** (ou sans crochets, dans un appel de fonction), on obtient une *expression génératrice* : les valeurs sont produites une à une, sans créer de liste intermédiaire. Un générateur est fait pour être **consommé** (par une boucle, `sum`, `tuple()`…) : l'afficher directement ne montre pas ses valeurs.

```python
t = (1.12, 2.34, 3.45, 4.56, 5.67)
i = (int(x) for x in t)
print(i)              # <generator object <genexpr> at 0x…>
print(tuple(i))       # (1, 2, 3, 4, 5) : il faut le convertir pour l'afficher
```

```python
print(sum(x ** 2 for x in range(1, 11)))     # somme des carrés de 1 à 10
print(max(len(m) for m in ["a", "abc", "ab"]))
print(any(n < 0 for n in [3, -1, 4]))        # au moins un négatif ?
```

> 💡 **Lisibilité d'abord** : si une compréhension ne tient pas sur une ligne ou devient difficile à lire, revenez à une boucle classique.

> 🎯 **À retenir** : `[expr for x in seq if cond]` ; `{k: v for ...}` pour un dict ; `{expr for ...}` pour un set ; `if` final = filtre, `a if c else b` initial = transformation.
