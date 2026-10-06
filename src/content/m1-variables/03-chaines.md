### Créer des chaînes

Une chaîne (`str`) est une **séquence de caractères**. Elle s'écrit entre guillemets simples `'...'`, doubles `"..."` ou triples `"""..."""` (sur plusieurs lignes).

```python
greeting = "Hello"
name = 'John'
long_string = """This is
quite a long
string"""
message1 = f"{greeting}, {name}!"            # formatage (f-string)
message2 = greeting + ", " + name + "!"      # concaténation
print(message1, message2, long_string, sep="\n")
```

### Les séquences d'échappement

Comment écrire un guillemet **dans** une chaîne délimitée par des guillemets ? `text = "He said: "hi!""` est invalide ! On utilise une **séquence d'échappement**, introduite par la barre oblique inverse `\`, ou l'autre type de guillemets :

| Séquence | Signification |
|---|---|
| `\"` / `\'` | guillemet double / simple |
| `\n` | retour à la ligne |
| `\t` | tabulation |
| `\\` | une barre oblique inverse |

```python
text = "He said: \"hi!\""
text2 = 'He said: "hi!"'          # ou bien : changer de guillemets
a = "line 1\nline 2"
b = "C:\\docs"                     # un seul \ dans la chaîne
print(text, text2, a, b, sep="\n")
print(len(b))                      # 7 : \\ compte pour un caractère
print("Colonne A\tColonne B")
print(r"C:\docs\new")              # chaîne « brute » (r) : les \ ne sont pas interprétés
```

### Opérations de base

```python
prenom = "Ada"
print("Bonjour " + prenom)     # concaténation
print("=" * 20)                # répétition
print(len(prenom))             # longueur : 3
print("d" in prenom)           # appartenance : True
```

### Indexation et découpage (slicing)

Chaque caractère a une **position** (indice) qui commence à **0**. Les indices négatifs partent de la fin.

```text
 P   y   t   h   o   n
 0   1   2   3   4   5
-6  -5  -4  -3  -2  -1
```

`s[debut:fin:pas]` extrait une sous-chaîne : `debut` est **inclus**, `fin` est **exclu**.

```python
mot = "Python"
print(mot[0], mot[-1])   # P n
print(mot[0:3])          # Pyt   (indices 0, 1, 2)
print(mot[2:])           # thon  (jusqu'à la fin)
print(mot[:2])           # Py    (depuis le début)
print(mot[::2])          # Pto   (un caractère sur deux)
print(mot[::-1])         # nohtyP (inversé !)
```

> ⚠️ Les chaînes sont **immuables** : `mot[0] = "J"` provoque une `TypeError`. On crée une nouvelle chaîne à la place : `mot = "J" + mot[1:]`.

### Fonctions et méthodes

Une **fonction** reçoit des **paramètres** et produit un résultat, la **valeur de retour** : `len("Hello")` renvoie `5`. `print()` accepte plusieurs objets mais ne renvoie rien d'utile (`None`). Une **méthode** est une fonction qui appartient à un type d'objet (ici `str`) et s'appelle avec un point : `texte.upper()`. Une méthode de chaîne **renvoie une nouvelle chaîne** sans modifier l'originale.

| Méthode | Effet | Exemple → résultat |
|---|---|---|
| `upper()` / `lower()` | majuscules / minuscules | `"Py".upper()` → `"PY"` |
| `title()` | Majuscule À Chaque Mot | `"ada lovelace".title()` → `"Ada Lovelace"` |
| `capitalize()` | première lettre en majuscule | `"python".capitalize()` → `"Python"` |
| `strip()` | retire les espaces aux extrémités | `"  hi  ".strip()` → `"hi"` |
| `replace(a, b)` | remplace `a` par `b` | `"1,5".replace(",", ".")` → `"1.5"` |
| `find(x)` | position de `x` (ou `-1`) | `"data".find("t")` → `2` |
| `count(x)` | nombre d'occurrences | `"banane".count("a")` → `2` |
| `startswith(x)` / `endswith(x)` | commence / finit par `x` ? | `"notes.txt".endswith(".txt")` → `True` |
| `isdigit()`, `isupper()`, `islower()` | que des chiffres / majuscules / minuscules ? | `"2024".isdigit()` → `True` |
| `split(sep)` | découpe en liste | `"a b c".split(" ")` → `['a', 'b', 'c']` |
| `splitlines()` | découpe en lignes | `"l1\nl2".splitlines()` → `['l1', 'l2']` |
| `sep.join(liste)` | recolle une liste de chaînes | `"-".join(["a", "b"])` → `"a-b"` |
| `center(n)`, `ljust(n)`, `rjust(n)` | centre / aligne à gauche / à droite sur `n` caractères | `"ok".center(6)` → `"  ok  "` |

```python
first_name = "john"
print(first_name.upper(), first_name.count("o"), first_name.replace("o", "@"))

brut = "   Data Science   "
propre = brut.strip()
print("[" + propre + "]", propre.lower())
print(brut)   # inchangée !

mots = "Python pour la data".split(" ")
print(mots, "_".join(mots))
print("ligne 1\nligne 2\nligne 3".splitlines())

for produit, prix in [("Clavier", 49.9), ("Souris", 19.5)]:
    print("|" + produit.ljust(10) + "|" + str(prix).rjust(7) + "|" + "OK".center(6) + "|")
```

### Les f-strings : formater facilement

Préfixez la chaîne par `f` et placez des expressions entre accolades. Après `:` vous pouvez préciser un format.

```python
nom = "Grace"
moyenne = 15.4567
nb = 1234567
print(f"{nom} a une moyenne de {moyenne:.2f}/20")   # 2 décimales
print(f"Population : {nb:,} habitants")             # séparateur de milliers
print(f"{nom:>10}|{nom:<10}|{nom:^10}|")            # aligné à droite, à gauche, centré
print(f"2 + 3 = {2 + 3}")                           # n'importe quelle expression
```

> 🎯 **À retenir** : `"…"`, `'…'`, `"""…"""` ; échappements `\"`, `\n`, `\t`, `\\` ; indices à partir de 0, `s[debut:fin]` exclut `fin` ; les méthodes renvoient de nouvelles chaînes (`strip`, `split`, `join`, `center`…) ; les f-strings (`f"{x:.2f}"`) sont la façon moderne de construire du texte.
