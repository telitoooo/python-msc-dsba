### Conversions automatiques (implicites)

Python convertit tout seul quand il n'y a aucun risque de perte : un calcul qui mélange `int` et `float` donne un `float`. Les booléens se comportent comme `1` et `0`.

```python
print(3 + 2.0)        # 5.0 (float)
print(True + True)    # 2
print(10 / 5)         # 2.0 : la division / donne toujours un float
```

### Conversions explicites

Le nom d'un type sert d'**opérateur de conversion** : si la conversion a un sens, elle est effectuée.

| Fonction | Convertit en | Exemples |
|---|---|---|
| `int(x)` | entier (toujours en base 10) | `int("42")` → `42` · `int(3.99)` → `3` (troncature !) |
| `float(x)` | nombre à virgule | `float("3.5")` → `3.5` · `float(2)` → `2.0` |
| `str(x)` | texte | `str(42)` → `"42"` |
| `bool(x)` | booléen | `bool(0)` → `False` · `bool("abc")` → `True` |
| `round(x, n)` | arrondi à `n` décimales | `round(3.14159, 2)` → `3.14` |
| `list(x)`, `tuple(x)` | liste, tuple (module 4) | `list("abc")` → `['a', 'b', 'c']` |

```python
texte = "42"
nombre = int(texte)
print(texte * 2, "vs", nombre * 2)   # 4242 vs 84
print("Score : " + str(nombre))      # str() pour concaténer
print(int(7.9), round(7.9))          # 7 vs 8
```

> ⚠️ **Erreurs classiques**
> - `"42" + 1` → `TypeError` : on n'additionne pas du texte et un nombre.
> - `int("3.5")` → `ValueError` : passez par `float` d'abord, `int(float("3.5"))`.
> - `int("abc")` → `ValueError` : ce n'est pas un nombre en base 10…
> - `round(2.5)` donne `2` : Python arrondit les « ,5 » au nombre **pair** le plus proche (arrondi bancaire).

### Bases numériques et codes des caractères

`int(texte, base)` lit un nombre écrit dans une autre base ; `bin`, `oct` et `hex` écrivent un entier en base 2, 8 et 16. Chaque caractère a un **code** (Unicode, qui prolonge l'ASCII) : `ord(c)` donne le code du caractère `c`, `chr(i)` le caractère de code `i`.

```python
a = int("1234")
print(a)
a = int("abc", 16)              # « abc » lu en hexadécimal : 10×256 + 11×16 + 12
print(a)
print(bin(10), oct(64), hex(255), int("1010", 2))

l = list("abc")
print(l)
codes = [ord(c) for c in l]     # ord(c) : code du caractère c
print(codes)
s = "".join([chr(i) for i in codes])   # chr(i) : caractère de code i
print(s, chr(ord("a") + 1), ord("é"))
```

> ⚠️ **Attention aux représentations textuelles** : `str()` d'un tuple, d'une liste ou d'un dictionnaire renvoie le **texte affiché** par `print`, crochets et guillemets compris. Ce n'est pas la même chose que recoller les éléments !

```python
t = tuple("abc")
print(t)
s = str(("a", "b", "c"))
print(s, len(s))                 # "('a', 'b', 'c')" : 15 caractères
print(str(["a", "b", "c"]), str({"a": 1, "b": 2}))
print("".join(t))                # "abc" : ce qu'on voulait sans doute
```

### Vrai ou faux ? (truthiness)

Toute valeur peut être interprétée comme un booléen. Sont considérées comme **fausses** : `0`, `0.0`, `""` (chaîne vide), `None`, et les collections vides (`[]`, `{}`…). Tout le reste est vrai, y compris `"0"` et `"False"` !

```python
print(bool(0), bool(42), bool(-3.5), bool(0.0))     # False True True False
print(bool(""), bool(" "), bool("0"), bool("False")) # False True True True
print(bool(None), bool([]), bool([0]))               # False False True
```

### Lire une saisie avec `input()`

`input("question")` affiche la question, attend une saisie et **renvoie toujours une chaîne (`str`)**. Il faut donc convertir pour calculer.

> 💡 Sur ce site, les valeurs saisies se placent dans la zone **Entrées (stdin)**, une par ligne : chaque appel à `input()` lit la ligne suivante.

```python stdin=25
age_texte = input("Quel âge avez-vous ? ")
print(type(age_texte))          # <class 'str'>
age = int(age_texte)
print("Dans 10 ans, vous aurez", age + 10, "ans")
```

> 🎯 **À retenir** : `input()` renvoie du texte ; convertissez avec `int()`, `float()`, `str()` ; `int()` tronque, `round()` arrondit ; `int(s, base)`, `bin`, `hex`, `ord`, `chr` ; `str()` d'un conteneur donne son affichage ; seules les valeurs « vides » ou nulles sont fausses.
