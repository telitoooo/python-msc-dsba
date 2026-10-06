### Pourquoi des structures de données ?

Pour travailler sur des données, il faut les charger et les **ranger en mémoire** (RAM). Il existe plusieurs **structures de données**, aux propriétés différentes ; les plus importantes sont le **coût d'une recherche** (retrouver un élément), le **coût d'une insertion** (en ajouter un) et l'**organisation interne** des données. Bien choisir sa structure est fondamental : pour l'**efficacité**, la **réutilisabilité**, et parce qu'elle reflète notre compréhension du problème (abstraction). Les structures de base de Python sont les **listes**, les **tuples**, les **dictionnaires** et les **ensembles**.

### Créer et lire une liste

Une **liste** est une séquence **ordonnée** et **modifiable** de valeurs, écrite entre crochets. Elle peut mélanger les types (même si, en pratique, on y range souvent des éléments de même nature).

```python
notes = [12, 15.5, 9, 17]
vide = []
mixte = ["Ada", 36, True]

print(notes[0], notes[-1])     # indexation : comme les chaînes
print(notes[1:3])              # slicing : [15.5, 9]
print(len(notes), 15.5 in notes)
```

Contrairement aux chaînes, une liste est **mutable** : on peut modifier ses éléments en place, et elle peut s'**agrandir**.

```python
users = ["John", "Paul", "George", "Ringo"]
print(users[0], users[-1])     # le premier, le dernier
users[0] = "Andrew"            # remplacer un élément
stuff = ["a", 1, 2.3, True, [1, 2, 3], (1, 2, 3), {"a": 1, "b": 2}]   # hétérogène
print(["a"] * 5)               # répétition avec *
users = users + ["Mick", "Keith"]   # concaténation avec +
print(users, len(stuff))
```

> 💡 **Question du cours** : avec `users = ['John', 'Paul', 'George', 'Ringo']`, que vaut `len(users)` après `users.append(['Mick', 'Keith'])` ? Réponse : **5** — `append` ajoute **un seul** élément, ici une liste. Pour ajouter deux éléments, il faut `extend` (ou `+`).

### Méthodes essentielles

| Méthode | Effet |
|---|---|
| `l.append(x)` | ajoute `x` à la fin |
| `l.extend([x, y])` | ajoute plusieurs éléments à la fin |
| `l.insert(i, x)` | insère `x` à l'indice `i` |
| `l.remove(x)` | retire la **première** occurrence de `x` (erreur si absent) |
| `l.pop()` / `l.pop(i)` | retire et **renvoie** le dernier élément / celui d'indice `i` |
| `l.index(x)` | indice de la première occurrence de `x` |
| `l.count(x)` | nombre d'occurrences de `x` |
| `l.sort()` / `l.reverse()` | trie / inverse **en place** |
| `l.copy()` | renvoie une copie (superficielle) |

```python
courses = ["pain", "lait"]
courses.append("œufs")
courses.insert(0, "café")
courses.extend(["riz", "thé"])
print(courses)

dernier = courses.pop()
courses.remove("lait")
print(courses, "| retiré :", dernier)
```

### Fonctions utiles sur les listes

```python
valeurs = [4, 1, 9, 3]
print(len(valeurs), sum(valeurs), min(valeurs), max(valeurs))
print(sorted(valeurs))                  # nouvelle liste triée
print(sorted(valeurs, reverse=True))    # ordre décroissant
print(valeurs)                          # l'originale n'a pas bougé
```

> ⚠️ **`sorted(l)` vs `l.sort()`** : `sorted` renvoie une *nouvelle* liste ; `.sort()` modifie la liste *en place* et renvoie `None`. Écrire `l = l.sort()` remplace donc votre liste par `None` !

### Parcourir une liste

```python
fruits = ["pomme", "kiwi", "mangue"]

for fruit in fruits:                       # le plus courant
    print(fruit.upper())

for i, fruit in enumerate(fruits):         # avec l'indice
    print(i, fruit)

resultat = []                              # construire une nouvelle liste
for fruit in fruits:
    if len(fruit) > 4:
        resultat.append(fruit)
print(resultat)
```

### Le découpage (slicing) en détail

Le découpage `l[début:fin:pas]` fonctionne comme pour les chaînes (valeurs par défaut : `début = 0`, `fin` = la longueur, `pas = 1` ; indices négatifs autorisés). Mais une liste étant mutable, on peut aussi **remplacer ou supprimer une tranche** :

```python
l = list(range(11))
print(l[2], l[2:5], l[::2])          # 2 [2, 3, 4] [0, 2, 4, 6, 8, 10]
print(l[6::-1])                      # de droite à gauche : [6, 5, 4, 3, 2, 1, 0]

l[2:5] = [20, 30]                    # remplacer un segment (tailles différentes : OK)
print(l)                             # [0, 1, 20, 30, 5, 6, 7, 8, 9, 10]
l[2:5] = []                          # supprimer des éléments
print(l)                             # [0, 1, 6, 7, 8, 9, 10]
l[::2] = ["a", "b", "c", "d"]        # tranche « étendue » : le remplacement doit avoir LA MÊME taille
print(l)                             # ['a', 1, 'b', 7, 'c', 9, 'd']
```

Trois façons d'**inverser** une liste : `l[::-1]` (nouvelle liste), `list(reversed(l))` (nouvelle liste), `l.reverse()` (en place).

### Le piège de l'alias

`b = a` ne copie **pas** la liste : `a` et `b` sont deux noms pour **le même objet**.

```python
a = [1, 2, 3]
b = a            # alias : même liste
b.append(4)
print(a)         # [1, 2, 3, 4] !

c = a.copy()     # vraie copie (ou a[:] ou list(a))
c.append(5)
print(a, c)
```

### Chaînes ↔ listes

```python
phrase = "Python pour la data"
mots = phrase.split()          # découpe sur les espaces
print(mots)
print("-".join(mots))          # recolle avec un séparateur
print(list("abc"))             # ['a', 'b', 'c']
```

> 🎯 **À retenir** : listes ordonnées et mutables ; `append`, `pop`, `remove`, `sort`… ; `sorted()` renvoie une nouvelle liste ; `b = a` crée un alias, `a.copy()` une copie.
