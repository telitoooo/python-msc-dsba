### Changer le flot d'exécution

Sans structure de contrôle, un programme s'exécute **ligne après ligne**, dans l'ordre. Les **structures de contrôle** changent ce flot : exécuter du code **seulement sous une condition** (`if … else …`) ou **de façon répétée** (boucles `while`, `for … in …`, `for … in range()`, leçons suivantes). Les exceptions (`try … except …`) viendront au module 5.

### Exécuter du code sous condition

Le mot-clé `if` exécute un **bloc** de code seulement si une condition est vraie. `elif` (« sinon si ») et `else` (« sinon ») gèrent les autres cas : les conditions sont testées **dans l'ordre**, et seul le bloc de la **première** condition vraie est exécuté.

```python
temperature = 28

if temperature > 30:
    print("Canicule ! Restez au frais.")
elif temperature > 20:
    print("Il fait bon.")
elif temperature > 10:
    print("Prenez une veste.")
else:
    print("Il fait froid !")

print("Fin du bulletin météo")   # hors du if : toujours exécuté
```

L'exemple du cours, avec plusieurs conditions testées en séquence :

```python
age = 30
age_seconds = age * 365 * 24 * 60 * 60
if age_seconds < 100_000_000:
    print("You are less than 100 million seconds old")
elif age_seconds < 1_000_000_000:
    print("You are less than 1 billion seconds old")
elif age_seconds < 2_000_000_000:
    print("You are less than 2 billion seconds old")
else:
    print("You are older than 2 billion seconds")
```

### Les blocs de code

Un **bloc** est un groupe de lignes qui vont ensemble, par exemple le code exécuté quand la condition d'un `if` est vraie. En Python :

- la ligne qui précède le bloc se termine par **deux-points `:`** ;
- le bloc est **indenté** (décalé), habituellement de **4 espaces** : c'est l'indentation, et non des accolades, qui délimite le bloc ;
- on peut avoir autant de `elif` que nécessaire ; `else` est facultatif et toujours en dernier.

> ⚠️ **Python teste les conditions dans l'ordre et s'arrête à la première vraie.** Si l'on écrit `if note >= 10:` avant `elif note >= 16:`, une note de 18 obtiendra la mention de la première branche ! Rangez vos conditions du cas le plus restrictif au plus général.

Un programme est fait de **blocs**, eux-mêmes faits d'**instructions** (*statements* : `if`, `for`, une affectation, un `print(…)`…). Une **expression** est ce qui produit une valeur (éventuellement `None`) : tout ce qui peut se trouver à droite d'un `=`. Un bloc ne peut pas être vide : pour un bloc qui ne fait « rien » (pour l'instant), on écrit l'instruction `pass`.

```python
import os

my_path = "data.csv"
if not os.path.exists(my_path):
    pass                      # rien à faire pour l'instant (à compléter plus tard)
else:
    print("Le fichier existe")
print("suite du programme")
```

### Conditions composées

```python
age = 20
etudiant = True
ville = "Paris"

if age >= 18 and etudiant:
    print("Majeur et étudiant")

if age < 12 or age >= 65:
    print("Tarif réduit")
else:
    print("Plein tarif")

if not etudiant:
    print("Pas étudiant")

if 18 <= age <= 25:                          # comparaison chaînée
    print("Carte jeune valable")

if ville in ("Paris", "Lyon", "Marseille"):  # appartenance
    print("Grande ville")
```

### Conditions « implicites »

`if x:` évalue `x` comme un booléen : `0`, `0.0`, `""`, `[]`, `None`… sont considérés comme faux, tout le reste comme vrai.

```python
nom = ""
if nom:
    print("Bonjour", nom)
else:
    print("Nom manquant !")
```

### L'expression conditionnelle (ternaire)

Pour affecter à une variable une valeur qui dépend d'une seule condition, l'**opérateur ternaire** est une alternative concise en une ligne : `valeur_si_vrai if condition else valeur_si_faux`.

```python
x = 12
# Version longue
y = "big"
if x < 100:
    y = "small"
# Version ternaire
y = "small" if x < 100 else "big"
print(y)
```

### Conditions imbriquées

Un `if` peut contenir un autre `if`. Souvent, un `and` rend le code plus lisible.

```python
connecte = True
admin = False

if connecte:
    if admin:
        print("Panneau d'administration")
    else:
        print("Espace utilisateur")
else:
    print("Veuillez vous connecter")
```

> ⚠️ **Deux erreurs fréquentes** : écrire `if x = 3:` (affectation) au lieu de `if x == 3:` (comparaison) → `SyntaxError`, et oublier d'indenter le bloc → `IndentationError`.

> 🎯 **À retenir** : `if` / `elif` / `else` + `:` + bloc indenté ; la première condition vraie l'emporte ; combinez avec `and`, `or`, `not` ; `pass` pour un bloc vide ; `x if cond else y` pour choisir une valeur.
