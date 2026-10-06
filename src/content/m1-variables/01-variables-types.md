### Une variable, c'est une étiquette

Une **variable** associe un **nom** à une **valeur**. On la crée avec l'opérateur d'affectation `=` : la valeur de droite (une **expression**, construite à partir de constantes, de variables et d'opérateurs) est calculée, puis rangée sous le nom de gauche.

```python
age = 22
prenom = "Ada"
print(prenom, "a", age, "ans")

age = age + 1      # réaffectation : l'expression age + 1 vaut 23, puis age désigne 23
print("Un an plus tard :", age)
```

> ⚠️ **`=` n'est pas une égalité mathématique.** `age = age + 1` signifie : « calcule `age + 1`, puis range le résultat dans `age` ». Pour *comparer* deux valeurs, on utilise `==`. En réaffectant ses variables, le programme fait **évoluer son état**.

### Les types élémentaires

Python devine le type à partir de la valeur : pas besoin de déclarer les variables, le **typage est dynamique** (implicite). La fonction `type()` permet de connaître le type de n'importe quel objet.

| Type | Nom | Exemples | Usage typique |
|---|---|---|---|
| `int` | entier (précision **illimitée**) | `42`, `-7`, `1_000_000`, `2 ** 100` | comptages, indices |
| `float` | nombre à virgule (64 bits, ~15 chiffres significatifs, jusqu'à ±1,8 × 10³⁰⁸) | `3.14`, `-0.5`, `2e3` | mesures, moyennes |
| `complex` | nombre complexe (paire de `float`) | `3 + 4j`, `complex(1, -2)` | calcul scientifique |
| `bool` | booléen | `True`, `False` | résultat d'un test |
| `str` | chaîne de caractères | `"Python"`, `'DSBA'` | texte |
| `NoneType` | « rien » : une seule valeur | `None` | absence de valeur |

```python
taille = 1.78
est_etudiant = True
promo = "MSc DSBA"
z = 3 + 4j

print(type(taille), type(est_etudiant), type(promo), type(z), type(None))
print(type(10), type(10.0), type("10"))   # trois types différents !
print(2 ** 100)                           # les entiers n'ont pas de limite
```

> 💡 **Astuce** : le séparateur décimal est le **point** (`1.78`), jamais la virgule. `1,78` crée… un tuple de deux entiers (voir module 4).

### Typage dynamique et *duck typing*

Une même variable peut désigner successivement des valeurs de types différents :

```python
a = 3
print(a, type(a))
a = "foobar"
print(a, type(a))
a = "3.0"
print(float(a) + 1)       # on convertit si besoin
```

En Python, ce qui compte n'est pas ce qu'un objet **est** (son type déclaré), mais ce qu'il **sait faire** : c'est le ***duck typing*** (« si ça marche comme un canard et que ça cancane comme un canard, alors c'est un canard »). Par exemple, `len()` fonctionne avec tout objet qui a une longueur : chaîne, liste, dictionnaire…

```python
for objet in ["canard", [1, 2, 3], {"a": 1}]:
    print(type(objet).__name__, "→", len(objet))
```

### Bien nommer ses variables

- Lettres, chiffres et `_` uniquement, **sans commencer par un chiffre** : `note_1` ✅ `1ere_note` ❌
- Python distingue majuscules et minuscules : `Age` et `age` sont deux variables différentes.
- Convention Python : le **snake_case** (`prix_unitaire`, `nb_etudiants`).
- Préférez des noms explicites : `moyenne_classe` plutôt que `m`.
- Les mots réservés (`if`, `for`, `def`, `True`…) sont interdits.

### Affectations multiples

```python
x, y = 3, 4          # deux affectations en une seule ligne
print("x =", x, "et y =", y)

x, y = y, x          # échange de valeurs, sans variable temporaire
print("après échange : x =", x, "et y =", y)

a = b = 0            # même valeur pour deux variables
print(a, b)
```

### Identité : `id()` et `is`

Chaque objet a une **identité**, un entier unique et constant pendant toute sa vie, que renvoie `id()`. L'opérateur `is` teste si deux noms désignent **le même objet** (même `id`), alors que `==` teste si deux valeurs sont **égales**. Cette distinction sera essentielle avec les listes et les objets (module 6).

```python
a = 3
c = a
print(id(a), id(c), a is c)     # c désigne le même objet que a
b = [1, 2]
d = [1, 2]
print(b == d, b is d)           # True False
print(None is None, type(None))
```

> 💡 Pour tester si une variable vaut `None`, on écrit `x is None` (et non `x == None`).

### La valeur spéciale `None`

`None` représente **l'absence de valeur** (son type est `NoneType`, un « singleton » : il n'existe qu'une seule valeur `None`). Vous la croiserez souvent, par exemple comme résultat d'une fonction qui ne renvoie rien (module 3).

> ⚠️ Une variable doit exister **avant** d'être utilisée. Sinon Python s'arrête avec `NameError: name '...' is not defined`. Vérifiez aussi l'orthographe : `Prenom` ≠ `prenom`.

> 🎯 **À retenir** : `nom = valeur` crée ou remplace une variable ; typage dynamique et *duck typing* ; `type(x)` donne le type ; types élémentaires : `int`, `float`, `complex`, `bool`, `str` et `None` ; `id()` et `is` pour l'identité, `==` pour l'égalité.
