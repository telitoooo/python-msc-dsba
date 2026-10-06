### Associer des clés à des valeurs

Un **dictionnaire** (`dict`) associe des **clés** uniques à des **valeurs**. On n'accède plus par position, mais par clé : idéal pour décrire un objet ou faire une table de correspondance.

```python
etudiant = {"nom": "Ada", "age": 22, "langages": ["Python", "SQL"]}

print(etudiant["nom"])                          # accès par clé
print(etudiant.get("email", "non renseigné"))   # valeur par défaut si clé absente

etudiant["age"] = 23                 # modifier
etudiant["email"] = "ada@exemple.fr" # ajouter une nouvelle clé
del etudiant["langages"]             # supprimer
print(etudiant)
print("age" in etudiant, len(etudiant))         # in teste les CLÉS
```

> ⚠️ `d["cle_absente"]` provoque une `KeyError`. Utilisez `d.get(cle, defaut)` ou testez `cle in d` avant.

### Parcourir un dictionnaire

```python
stock = {"pommes": 10, "bananes": 5, "kiwis": 8}

for fruit in stock:                    # parcourt les clés
    print(fruit)

for quantite in stock.values():        # les valeurs
    print(quantite)

for fruit, quantite in stock.items():  # les paires (clé, valeur)
    print(f"{fruit:<8} : {quantite}")

print(sum(stock.values()))
```

### Méthodes utiles

| Méthode | Effet |
|---|---|
| `d.get(k, defaut)` | valeur de `k`, ou `defaut` si absente |
| `d.keys()` / `d.values()` / `d.items()` | vues sur les clés / valeurs / paires |
| `d.pop(k)` | retire `k` et renvoie sa valeur |
| `d.update(autre)` | fusionne un autre dictionnaire |
| `d.setdefault(k, v)` | renvoie `d[k]`, en le créant avec `v` s'il n'existe pas |

### Le pattern « compter »

Compter des occurrences est l'usage n°1 des dictionnaires en analyse de données :

```python
texte = "abracadabra"
compte = {}
for lettre in texte:
    compte[lettre] = compte.get(lettre, 0) + 1
print(compte)

plus_frequente = max(compte, key=compte.get)    # clé de valeur maximale
print("Lettre la plus fréquente :", plus_frequente)
```

### Le pattern « regrouper »

```python
personnes = [("Ada", "Londres"), ("Alan", "Londres"), ("Marie", "Paris")]
par_ville = {}
for nom, ville in personnes:
    if ville not in par_ville:
        par_ville[ville] = []
    par_ville[ville].append(nom)
print(par_ville)
```

### Quelles clés ?

Un dictionnaire est une extension des listes : une liste associe un **entier** (la position) à un élément, un dictionnaire associe **n'importe quelle clé** à un élément (il n'y a donc plus de contiguïté). Les clés sont **uniques** et doivent être **immuables** : `str`, `int`, `float`, `bool`, `tuple`… mais pas de liste. Pourquoi ? L'accès à un dictionnaire est très rapide parce que Python range chaque paire selon le **hachage** de la clé (`hash()`, à ne pas confondre avec `id()`) : si la clé pouvait changer, on ne la retrouverait plus.

```python
print(hash(3), hash("3"), hash((1, 2)))
try:
    hash([1, 2])
except TypeError as e:
    print("TypeError :", e)                 # unhashable type: 'list'

distances = {}                              # des tuples comme clés : autorisé
distances[("A", "B")] = 100
distances[("A", "C")] = 200
distances[("B", "C")] = 150
print(distances[("A", "C")])

stock = {"apple": 20, "orange": 30, "banana": 10}
stock["orange"] -= 8                        # modifier une valeur en place
print(stock)
```

Les valeurs, elles, peuvent être n'importe quoi, y compris des listes ou d'autres dictionnaires (structure proche du JSON). La carte de France du cours imbrique ainsi **trois niveaux** de dictionnaires :

```python
carte = {
    "La Baule-Escoublac": {"coords": (356, 638), "next": {"Saint-Nazaire": 15, "Guerande": 6}},
    "Saint-Nazaire": {"coords": (484, 563), "next": {"La Baule-Escoublac": 15, "Nantes": 63}},
}
print(carte["Saint-Nazaire"]["next"]["Nantes"])     # 63 km
for ville, infos in carte.items():
    print(ville, infos["coords"], sorted(infos["next"]))
```

> 💡 Une liste de dictionnaires ayant les mêmes clés, c'est exactement une table de données : `pandas.DataFrame(liste_de_dicts)` la transforme en tableau.

> 🎯 **À retenir** : `{cle: valeur}` ; accès `d[k]` ou `d.get(k, defaut)` ; parcours avec `.items()` ; `d[k] = d.get(k, 0) + 1` pour compter.
