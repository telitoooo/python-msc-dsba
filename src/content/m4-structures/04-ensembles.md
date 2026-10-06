### Une collection sans doublons

Un **ensemble** (`set`) est une collection **non ordonnée** d'éléments **uniques**. Comme en mathématiques, on peut calculer unions, intersections et différences.

```python
langages = {"Python", "SQL", "R", "Python"}
print(langages)                # le doublon a disparu (ordre imprévisible)
print(len(langages), "SQL" in langages)

villes = ["Paris", "Lyon", "Paris", "Nice", "Lyon"]
uniques = set(villes)          # dédoublonner une liste
print(sorted(uniques))         # sorted → liste triée, affichage stable
```

> ⚠️ `{}` crée un **dictionnaire vide**, pas un ensemble ! L'ensemble vide s'écrit `set()`.

Deux façons de voir un ensemble : le **concept mathématique** (pas de doublons), ou un **dictionnaire qui n'aurait que des clés** (les clés sont uniques). Un ensemble peut remplacer une liste quand l'ordre n'a pas d'importance.

```python
ingredients1 = {"flour", "water", "salt", "yeast"}
ingredients2 = set(["water", "salt", "flour", "yeast"])
print(ingredients1 == ingredients2)        # True : l'ordre ne compte pas

x = set("abc")
y = set("aeiou")
print(sorted(x | y), sorted(x & y), sorted(x - y), x <= y)
```

### Ajouter et retirer

```python
competences = set()
competences.add("Python")
competences.add("SQL")
competences.add("Python")      # déjà présent : aucun effet
competences.discard("Excel")   # retire si présent, sans erreur
competences.remove("SQL")      # retire, mais KeyError si absent
print(competences)
```

### Opérations ensemblistes

| Opération | Opérateur | Méthode | Contient… |
|---|---|---|---|
| Union | `a \| b` | `a.union(b)` | les éléments de `a` **ou** de `b` |
| Intersection | `a & b` | `a.intersection(b)` | les éléments de `a` **et** de `b` |
| Différence | `a - b` | `a.difference(b)` | les éléments de `a` **sauf** ceux de `b` |
| Différence symétrique | `a ^ b` | `a.symmetric_difference(b)` | les éléments d'**un seul** des deux |
| Inclusion | `a <= b` | `a.issubset(b)` | `True` si tout `a` est dans `b` |

```python
python = {"Ada", "Alan", "Grace", "Linus"}
sql = {"Grace", "Linus", "Margaret"}

print("Les deux      :", sorted(python & sql))
print("Au moins un   :", sorted(python | sql))
print("Python seul   :", sorted(python - sql))
print("Un seul cours :", sorted(python ^ sql))
print({"Ada", "Alan"} <= python)
```

### Quand utiliser un ensemble ?

- **Dédoublonner** des valeurs : `set(liste)` ;
- **Tester l'appartenance** très rapidement (`x in grand_ensemble` est quasi instantané, même avec des millions d'éléments, contrairement à une liste) ;
- **Comparer** deux collections : éléments communs, manquants, nouveaux…

> ⚠️ Un ensemble n'a **pas d'ordre** ni d'indices (`s[0]` est impossible), et ses éléments doivent être immuables (pas de liste dans un set). Pour un affichage reproductible, utilisez `sorted(s)`.

> 🎯 **À retenir** : `set()` = éléments uniques, sans ordre ; `|`, `&`, `-`, `^` pour combiner ; `set(liste)` pour dédoublonner ; `in` est très rapide.
