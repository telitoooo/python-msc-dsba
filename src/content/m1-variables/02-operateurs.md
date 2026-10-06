### Opérateurs arithmétiques

| Opérateur | Opération | Exemple | Résultat |
|---|---|---|---|
| `+` `-` `*` | addition, soustraction, multiplication | `7 * 3` | `21` |
| `/` | division (toujours un `float`) | `7 / 2` | `3.5` |
| `//` | division entière (quotient arrondi vers le bas) | `7 // 2` | `3` |
| `%` | modulo (reste de la division) | `7 % 2` | `1` |
| `**` | puissance | `2 ** 10` | `1024` |
| `-x`, `+x` | opposé, inchangé | `-(3 - 5)` | `2` |

```python
a, b = 17, 5
print("a + b  =", a + b)
print("a - b  =", a - b)
print("a * b  =", a * b)
print("a / b  =", a / b)    # division « réelle » : toujours un float
print("a // b =", a // b)   # quotient de la division entière
print("a % b  =", a % b)    # reste (modulo)
print("a ** b =", a ** b)   # puissance
print(2 / 3, 2 // 3)        # 0.666… et 0
```

> 💡 **`//` et `%` vont ensemble** : 17 = 5 × **3** + **2**, donc `17 // 5 == 3` et `17 % 5 == 2`. Usages classiques : `n % 2 == 0` teste si `n` est pair, `n % 10` donne le dernier chiffre, et le couple `//` / `%` convertit des unités (secondes → minutes…).

### Fonctions numériques intégrées

| Fonction | Résultat |
|---|---|
| `abs(x)` | valeur absolue (ou module d'un nombre complexe) |
| `divmod(x, y)` | le couple `(x // y, x % y)` |
| `pow(x, y)` | `x` puissance `y` (comme `x ** y`) |
| `round(x, n)` | `x` arrondi à `n` décimales |
| `int(x)`, `float(x)` | conversion en entier / en flottant |
| `complex(re, im)` | nombre complexe de partie réelle `re` et imaginaire `im` (`im` vaut 0 par défaut) |
| `c.conjugate()`, `c.real`, `c.imag` | conjugué, parties réelle et imaginaire d'un complexe |

```python
print(abs(-7), abs(3 + 4j))          # 7 et 5.0 (module de 3 + 4i)
print(divmod(17, 5))                 # (3, 2)
print(pow(2, 10), round(3.14159, 2))
z = complex(3, 4)
print(z, z.real, z.imag, z.conjugate(), z * z.conjugate())
print((-1) ** 0.5)                   # la racine d'un négatif donne un complexe
```

### Combiner des types

Python **promeut** automatiquement un type vers un type plus général quand on les combine : `int` + `float` → `float`, `float` + `complex` → `complex`. Mais il refuse de deviner entre texte et nombre :

```python
print(3 + 2.5, 1 + 2j + 0.5)
try:
    print(3 + "4")                   # peut-on ajouter 3 à '4' ?
except TypeError as e:
    print("TypeError :", e)
print("4" * 3)                       # répétition d'une chaîne : '444'
```

### Priorité des opérateurs

Comme en mathématiques : `**` d'abord, puis `*` `/` `//` `%`, puis `+` `-`. À priorité égale, on calcule de gauche à droite. **Dans le doute, mettez des parenthèses.**

```python
print(2 + 3 * 4)      # 14
print((2 + 3) * 4)    # 20
print(10 - 4 - 3)     # 3 : de gauche à droite
print(-2 ** 2)        # -4 : la puissance passe avant le signe moins !
print(2 ** 3 ** 2)    # 512 : exception, ** se calcule de droite à gauche
```

### Affectations augmentées

`x += 1` est un raccourci pour `x = x + 1`. Idem pour `-=`, `*=`, `/=`, `//=`, `%=` et `**=`.

```python
score = 10
score += 5     # 15
score *= 2     # 30
score -= 1     # 29
print(score)
```

### Comparaisons : le résultat est un booléen

| `<` | `<=` | `>` | `>=` | `==` | `!=` | `is` | `is not` |
|---|---|---|---|---|---|---|---|
| strictement inférieur | inférieur ou égal | strictement supérieur | supérieur ou égal | égal | différent | même objet | objets différents |

```python
note = 14
print(note >= 10)        # True
print(note == 20)        # False
print(0 <= note <= 20)   # comparaison chaînée, très lisible
is_adult = note >= 18    # on peut ranger le résultat d'un test dans une variable
print(is_adult)
```

> 💡 **Égalité ou identité ?** `==` compare les **valeurs** (le contenu), `is` compare les **identités** (le même objet en mémoire). Cette distinction sera capitale avec les listes, les dictionnaires et les objets.

### Opérateurs logiques : `and`, `or`, `not`

- `A and B` est vrai si **les deux** sont vrais ;
- `A or B` est vrai si **au moins un** est vrai ;
- `not A` inverse la valeur (sa priorité est plus faible que celle de `==` : `not a == b` signifie `not (a == b)`).

```python
age = 20
country = "de"
temperature = 35
may_drink_alcohol = age >= 18 and country == "de"
extreme_temp = temperature < -10 or temperature > 30
value_lower_10 = not age > 10
print(may_drink_alcohol, extreme_temp, value_lower_10)
```

**Court-circuit** : Python s'arrête dès que le résultat est connu, et renvoie **l'un des deux opérandes** (pas forcément un booléen) :

| Opération | Résultat |
|---|---|
| `x or y` | si `x` est faux, alors `y`, sinon `x` |
| `x and y` | si `x` est faux, alors `x`, sinon `y` |
| `not x` | si `x` est faux, alors `True`, sinon `False` |

```python
print(0 or 5, 3 or 5, "" or "défaut")   # 5 3 défaut
print(0 and 5, 3 and 5)                 # 0 5
nom = ""
print(nom or "anonyme")                 # valeur par défaut très pratique
print(False and 1 / 0)                  # 1 / 0 n'est jamais calculé : pas d'erreur
```

> ⚠️ **Piège des flottants** : `0.1 + 0.2 == 0.3` vaut `False` ! Les nombres à virgule sont stockés en binaire avec de minuscules erreurs d'arrondi. Pour comparer deux `float`, testez plutôt que leur écart est minuscule : `abs(a - b) < 1e-9`.

> 🎯 **À retenir** : `/` renvoie un `float`, `//` le quotient, `%` le reste ; `abs`, `divmod`, `pow`, `round`, `complex` ; les comparaisons (dont `is`) produisent des `bool` que l'on combine avec `and`, `or` et `not`, évalués en court-circuit.
