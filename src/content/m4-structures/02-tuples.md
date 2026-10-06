### Une séquence non modifiable

Un **tuple** ressemble à une liste, mais il est **immuable** : une fois créé, on ne peut ni ajouter, ni retirer, ni modifier d'élément. On l'écrit avec des parenthèses (souvent facultatives).

```python
point = (3, 4)
couleur = 255, 128, 0          # les parenthèses sont facultatives
singleton = (42,)              # tuple à un élément : la virgule est obligatoire !
pas_un_tuple = (42)            # ceci est juste l'entier 42

print(point[0], len(couleur), type(singleton), type(pas_un_tuple))
```

> ⚠️ `point[0] = 10` provoque une `TypeError` : les tuples n'ont ni `append`, ni `remove`, ni `sort`. Seules `count()` et `index()` existent.

Un tuple est plutôt un **agrégat** qu'une séquence : son « domaine » est le produit cartésien d'autres données (un point = un x **et** un y), atomiques ou structurées. Il a un nombre **fixe** de coordonnées et ne peut pas être agrandi… mais on peut **créer un nouveau tuple** par concaténation, et on peut le découper.

```python
a = (5, 10, 15, 20)
b = (25, 30, 35, 40)
c = a + b                       # un NOUVEAU tuple
print(c, len(c), c[2:5])
```

### Liste ou tuple ?

| | Liste `[...]` | Tuple `(...)` |
|---|---|---|
| Modifiable | oui | non |
| Usage typique | collection qui évolue (panier, résultats…) | enregistrement fixe (coordonnées, date, ligne de données) |
| Clé de dictionnaire | impossible | possible |

### Le déballage (unpacking)

On peut répartir les éléments d'un tuple (ou d'une liste) dans plusieurs variables en une ligne. C'est ce qui rend possible l'échange `a, b = b, a`.

```python
point = (3, 4)
x, y = point
print("x =", x, "y =", y)

prenom, nom, age = ("Grace", "Hopper", 85)
print(f"{prenom} {nom}, {age} ans")

premier, *reste = [10, 20, 30, 40]     # * récupère « le reste » dans une liste
print(premier, reste)
*debut, dernier = [10, 20, 30, 40]
print(debut, dernier)
```

### Renvoyer plusieurs valeurs depuis une fonction

```python
def min_max(valeurs):
    return min(valeurs), max(valeurs)    # renvoie un tuple

bas, haut = min_max([12, 5, 19, 8])
print(bas, haut)
```

Attention au **contrat** d'une telle fonction : l'exemple du cours calcule les racines d'un polynôme du second degré et renvoie `None` **ou** un tuple. L'appelant doit gérer les deux cas !

```python
def root_quadratic(a, b, c):
    d = b ** 2 - 4 * a * c
    if d < 0:
        return None
    elif d == 0:
        return (-b / (2 * a),)                      # un tuple à UN élément
    else:
        return (-b + d ** 0.5) / (2 * a), (-b - d ** 0.5) / (2 * a)

for coefs in [(1, 2, 1), (1, -3, 2), (1, 0, 1)]:
    roots = root_quadratic(*coefs)                  # * déballe le tuple en 3 arguments
    if roots:
        print(f"Roots: {roots}")
    else:
        print("No roots")
```

### Tuples partout : `enumerate` et `zip`

`zip` associe les éléments de plusieurs séquences deux à deux, sous forme de tuples.

```python
noms = ["Ada", "Alan", "Grace"]
notes = [17, 14, 19]

for nom, note in zip(noms, notes):
    print(nom, "→", note)

print(list(zip(noms, notes)))
```

### Trier une liste de tuples

Par défaut, les tuples sont comparés élément par élément. Le paramètre `key` permet de choisir **le critère de tri** grâce à une petite fonction anonyme `lambda`.

```python
etudiants = [("Ada", 17), ("Alan", 14), ("Grace", 19)]

print(sorted(etudiants))                                      # par nom
print(sorted(etudiants, key=lambda e: e[1], reverse=True))    # par note décroissante
print(sorted(etudiants, key=lambda e: (-e[1], e[0])))         # note ↓ puis nom ↑
```

> 💡 `lambda e: e[1]` est une fonction minuscule équivalente à `def critere(e): return e[1]`. Elle est très utilisée avec `sorted`, `min`, `max`… et en pandas.

> 🎯 **À retenir** : tuple = séquence immuable ; `(x,)` pour un seul élément ; le déballage `a, b = t` et `premier, *reste = t` ; `return a, b` renvoie un tuple ; `sorted(..., key=lambda ...)` pour trier selon un critère.
