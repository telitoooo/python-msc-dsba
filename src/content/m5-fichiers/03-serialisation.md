### Sérialiser, c'est quoi ?

Un fichier texte ne contient que des caractères. Pour **sauvegarder une structure Python** (dictionnaire de listes, carte, état d'un jeu…) puis la **recharger à l'identique**, il faut la transformer en suite d'octets : c'est la **sérialisation**. L'opération inverse est la **désérialisation**.

| Format | Fichier | Lisible par un humain | Autres langages | Objets acceptés |
|---|---|---|---|---|
| **JSON** | texte | oui | oui (standard du web) | dict, list, str, nombres, bool, None |
| **pickle** | binaire | non | non (Python uniquement) | presque tous les objets Python |
| HDF5 | binaire | non | oui | tableaux numériques volumineux |

### JSON : le format d'échange universel

```python
import json

data = {
    "president": {"nom": "Zaphod Beeblebrox", "espece": "Bételgeusien"},
    "membres": ["Ford", "Arthur", "Trillian"],
    "actif": True,
    "budget": None,
}

with open("equipage.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)   # indent : lisible ; ensure_ascii=False : accents

with open("equipage.json", encoding="utf-8") as f:
    relu = json.load(f)

print(relu == data)
with open("equipage.json", encoding="utf-8") as f:
    print(f.read())
```

Pour travailler avec des **chaînes** plutôt qu'avec des fichiers : `json.dumps(obj)` (*dump string*) et `json.loads(texte)`.

> ⚠️ **JSON ne connaît pas tous les types Python** : un `tuple` revient sous forme de `list`, les **clés de dictionnaire deviennent des chaînes** (`{1: "a"}` → `{"1": "a"}`), et un `set` provoque une `TypeError`. Pensez à reconvertir après chargement.

```python
import json

print(json.loads(json.dumps((3, 4))))         # [3, 4] : le tuple est devenu une liste
print(json.loads(json.dumps({1: "un"})))      # {'1': 'un'} : clé convertie en str
try:
    json.dumps({1, 2, 3})
except TypeError as e:
    print("Erreur :", e)
```

JSON est cependant **extensible** : le paramètre `default` indique comment convertir un objet que JSON ne connaît pas.

```python
import json

print(json.dumps({"tags": {"python", "data"}}, default=sorted))   # un set devient une liste triée
```

### pickle : sauvegarder (presque) n'importe quel objet Python

```python
import pickle

etat = {"joueur": "Ada", "position": (3, 4), "inventaire": {"épée", "carte"}}

with open("partie.pickle", "wb") as f:     # "wb" : le binaire est obligatoire !
    pickle.dump(etat, f)

with open("partie.pickle", "rb") as f:
    reconstruit = pickle.load(f)

print(reconstruit == etat, type(reconstruit["position"]), type(reconstruit["inventaire"]))
```

pickle peut même sérialiser des **fonctions** (en mémorisant leur nom, il faut donc qu'elles existent encore au chargement) :

```python
import math, pickle

octets = pickle.dumps([math.sqrt, len])     # dumps : vers une chaîne d'octets
f_racine, f_len = pickle.loads(octets)
print(f_racine(16), f_len("abc"))
```

> 💡 **HDF5** est un format binaire indépendant de Python, conçu pour de gros volumes de données numériques (tableaux NumPy, DataFrames). On l'utilise via les paquets `h5py` ou `pandas` (`df.to_hdf(...)`), à installer avec `pip`.

> ⚠️ **Ne désérialisez jamais un pickle d'origine inconnue** : `pickle.load` peut exécuter du code arbitraire. Pour échanger des données avec d'autres personnes ou d'autres programmes, préférez JSON.

### Lequel choisir ?

- **JSON** pour des données simples à **partager**, archiver ou relire à l'œil (configuration, API web, export).
- **pickle** pour **mettre en cache** rapidement des objets Python complexes que seul votre programme relira.

> 🎯 **À retenir** : `json.dump(obj, f)` / `json.load(f)` en mode texte ; `pickle.dump(obj, f)` / `pickle.load(f)` en mode **binaire** (`"wb"`, `"rb"`) ; JSON transforme tuples et clés, et refuse les `set`.
