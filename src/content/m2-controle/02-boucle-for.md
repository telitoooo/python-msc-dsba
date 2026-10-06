### Répéter un nombre connu de fois

Une boucle `while` (leçon suivante) tourne un nombre **indéfini** de fois : on ne sait pas combien de temps la condition restera vraie. La boucle `for` tourne un nombre **défini** de fois : sur un intervalle d'entiers avec `range(a, b, pas)`, sur une collection d'objets, et plus généralement sur tout **itérable**.

```python
for i in range(5):
    print("Tour n°", i)
print("Terminé")

names = ["Alice", "Bob", "Charlie"]
for name in names:
    print("Hello, " + name + "!")
```

| Appel | Valeurs produites | Remarque |
|---|---|---|
| `range(5)` | 0, 1, 2, 3, 4 | commence à 0, **5 exclu** |
| `range(2, 6)` | 2, 3, 4, 5 | début inclus, fin exclue |
| `range(0, 20, 5)` | 0, 5, 10, 15 | pas de 5 |
| `range(10, 0, -3)` | 10, 7, 4, 1 | pas négatif : compte à rebours |

> 💡 `range(1, n + 1)` produit les entiers de 1 à `n` inclus : c'est le réflexe à avoir.

### Parcourir une chaîne de caractères

`for` fonctionne avec toute séquence : chaînes, listes, tuples… (module 4).

```python
for lettre in "DSBA":
    print(lettre, end=" ")   # end=" " : pas de retour à la ligne
print()                      # retour à la ligne final
```

### Les trois patterns à connaître par cœur

**L'accumulateur** : on initialise *avant* la boucle, on met à jour *dans* la boucle.

```python
total = 0
for n in range(1, 6):
    total += n
print("1 + 2 + 3 + 4 + 5 =", total)
```

**Le compteur** : on compte les éléments qui vérifient une condition.

```python
nb_pairs = 0
for n in range(1, 21):
    if n % 2 == 0:
        nb_pairs += 1
print(nb_pairs, "nombres pairs entre 1 et 20")
```

**Le maximum courant** : on garde le meilleur élément vu jusqu'ici.

```python
mot = "algorithme"
plus_grande = mot[0]
for lettre in mot:
    if lettre > plus_grande:      # ordre alphabétique
        plus_grande = lettre
print("Dernière lettre dans l'alphabet :", plus_grande)
```

### Numéroter avec `enumerate()`

```python
for position, lettre in enumerate("Py"):
    print(position, lettre)
```

### Boucles imbriquées

Une boucle dans une boucle : la boucle intérieure s'exécute **entièrement** à chaque tour de la boucle extérieure.

```python
for ligne in range(1, 4):
    for colonne in range(1, 4):
        print(ligne * colonne, end="\t")
    print()   # fin de ligne
```

Un motif d'étoiles (*Hands-on 10*) se construit de la même façon : la boucle extérieure choisit la ligne, l'intérieure y dessine les étoiles.

```python
n = 4
for i in range(1, n + 1):
    for j in range(i):
        print("* ", end="")
    print("")
```

> ⚠️ N'oubliez pas d'**initialiser l'accumulateur avant la boucle**. Placé à l'intérieur, `total = 0` serait remis à zéro à chaque tour !

> 🎯 **À retenir** : `for x in iterable:` tourne un nombre défini de fois ; `range(debut, fin, pas)` exclut `fin` ; accumulateur, compteur et maximum courant sont les trois patterns de base ; `enumerate` numérote.
