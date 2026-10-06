### Pourquoi pandas ?

**pandas** représente les données sous forme de **tableaux** (comme une feuille de calcul ou une table de base de données, mais en mémoire). Construit sur NumPy, il sert à **charger, nettoyer, transformer, explorer et visualiser** des données, en lien avec SciPy, scikit-learn, PyTorch, matplotlib… Ses deux structures de base :

- **`Series`** : une colonne, c'est-à-dire des valeurs étiquetées par un **index** ;
- **`DataFrame`** : un tableau de plusieurs colonnes (chacune est une `Series`) partageant le même index.

```python
import pandas as pd

data = {
    "apples": [3, 2, 0, 1],
    "oranges": [0, 3, 7, 2],
}
purchases = pd.DataFrame(data)
print(purchases)
print(type(purchases["apples"]))      # une colonne est une Series
```

### L'index : nommer les lignes

Par défaut les lignes sont numérotées 0, 1, 2… On peut fournir notre propre **index**, puis accéder à une ligne par son **étiquette** avec `.loc` :

```python
import pandas as pd

purchases = pd.DataFrame(
    {"apples": [3, 2, 0, 1], "oranges": [0, 3, 7, 2]},
    index=["June", "Robert", "Lily", "David"],
)
print(purchases)
print(purchases.loc["June"])          # une ligne, sous forme de Series
print(purchases.loc["Lily", "oranges"])
print(purchases["apples"].sum(), purchases.shape)
purchases["total"] = purchases["apples"] + purchases["oranges"]   # nouvelle colonne
print(purchases)
```

### Lire et écrire des fichiers

pandas lit et écrit de nombreux formats : CSV (`read_csv` / `to_csv`), JSON (`read_json` / `to_json`), Excel, bases SQL (`read_sql`)…

```python
import io
import pandas as pd

csv_text = """,apples,oranges
June,3,0
Robert,2,3
Lily,0,7
David,1,2
"""
# io.StringIO fait passer un texte pour un fichier ; en vrai : pd.read_csv("purchases.csv")
df = pd.read_csv(io.StringIO(csv_text))
print(df)                                 # la 1re colonne devient « Unnamed: 0 »
df = pd.read_csv(io.StringIO(csv_text), index_col=0)
print(df)                                 # index_col=0 : la 1re colonne sert d'index

df.to_csv("purchases_copy.csv")           # écrit un fichier dans le dossier de travail
print(open("purchases_copy.csv").read())
```

> 💡 `index_col="Title"` utilise la colonne nommée `Title` comme index : c'est ce que fait le cours avec le jeu de données de films IMDB.

### Jeter un premier coup d'œil

| Méthode / attribut | Ce qu'on obtient |
|---|---|
| `df.head(n)` / `df.tail(n)` | les `n` premières / dernières lignes (5 par défaut) |
| `df.shape` | `(nombre de lignes, nombre de colonnes)` |
| `df.columns`, `df.index` | noms des colonnes, étiquettes des lignes |
| `df.dtypes` | type de chaque colonne |
| `df.info()` | résumé : colonnes, valeurs non nulles, types, mémoire |
| `df.describe()` | statistiques des colonnes numériques |

```python
import pandas as pd

movies = pd.DataFrame({
    "Title": ["Prometheus", "Split", "Sing", "Arrival"],
    "Year": [2012, 2016, 2016, 2016],
    "Rating": [7.0, 7.3, 7.2, 8.0],
    "Revenue (Millions)": [126.46, 138.12, 270.32, None],
}).set_index("Title")
print(movies.head(2))
print(movies.shape, list(movies.columns))
movies.info()
```

> 🎯 **À retenir** : `import pandas as pd` ; `pd.DataFrame(dict)` ; une colonne = une `Series` ; l'index étiquette les lignes (`index=`, `index_col=`, `set_index`) ; `.loc[étiquette]` ; `read_csv` / `to_csv` ; `head`, `tail`, `shape`, `columns`, `info`, `describe`.
