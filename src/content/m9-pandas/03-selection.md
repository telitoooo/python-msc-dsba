Les exemples de cette leçon utilisent un petit extrait du jeu de données de films IMDB du cours. Ce premier bloc crée le tableau `movies` ; il est automatiquement repris par tous les exemples suivants.

```python setup
import pandas as pd

movies = pd.DataFrame({
    "title": ["Prometheus", "Split", "Sing", "Interstellar", "The Martian", "Inception", "Arrival"],
    "genre": ["Adventure,Mystery,Sci-Fi", "Horror,Thriller", "Animation,Comedy,Family",
              "Adventure,Drama,Sci-Fi", "Adventure,Drama,Sci-Fi", "Action,Adventure,Sci-Fi",
              "Drama,Mystery,Sci-Fi"],
    "director": ["Ridley Scott", "M. Night Shyamalan", "Christophe Lourdelet", "Christopher Nolan",
                 "Ridley Scott", "Christopher Nolan", "Denis Villeneuve"],
    "year": [2012, 2016, 2016, 2014, 2015, 2010, 2016],
    "rating": [7.0, 7.3, 7.2, 8.6, 8.0, 8.8, 8.0],
    "revenue_millions": [126.46, 138.12, 270.32, 187.99, 228.43, 292.57, 100.5],
}).set_index("title")
```

### Explorer

```python
print(movies.describe())                         # statistiques des colonnes numériques
print(movies["director"].describe())             # pour du texte : count, unique, top, freq
print(movies["director"].value_counts())         # fréquence de chaque valeur
print(movies.corr(numeric_only=True).round(2))   # corrélations entre colonnes numériques
```

> ⚠️ Les diapos écrivent `movies_df.corr()`. Avec pandas récent, il faut préciser `numeric_only=True` dès que le tableau contient du texte.

### Sélectionner des colonnes

```python
genre_col = movies["genre"]              # une colonne → Series
print(type(genre_col))
genre_df = movies[["genre"]]             # une LISTE de colonnes → DataFrame
print(type(genre_df))
subset = movies[["genre", "rating"]]
print(subset.head())
```

### Sélectionner des lignes : `loc` et `iloc`

- `.loc[…]` sélectionne par **étiquette** (le nom de la ligne) : la borne de fin d'une tranche est **incluse** ;
- `.iloc[…]` sélectionne par **position** (comme une liste) : la borne de fin est **exclue**.

```python
print(movies.loc["Prometheus"])                  # par nom
print(movies.iloc[1])                            # par position : la 2e ligne
print(movies.loc["Prometheus":"Sing"])           # de Prometheus à Sing INCLUS
print(movies.iloc[1:4])                          # positions 1, 2 et 3
print(movies.loc["Inception", "rating"], movies.iloc[0, 3])
```

### Sélection conditionnelle

Une condition sur une colonne donne une `Series` de booléens (un **masque**, comme avec NumPy) qui filtre les lignes :

```python
condition = movies["director"] == "Ridley Scott"
print(condition)
print(movies[condition])
print(movies[movies["rating"] >= 8.6])

# Plusieurs conditions : | (ou), & (et), avec des parenthèses
nolan_or_scott = movies[(movies["director"] == "Christopher Nolan") | (movies["director"] == "Ridley Scott")]
print(nolan_or_scott.index.tolist())
print(movies[movies["director"].isin(["Christopher Nolan", "Ridley Scott"])].index.tolist())

# Films sortis entre 2010 et 2015, notés au moins 8, avec une recette sous le 3e quartile
q75 = movies["revenue_millions"].quantile(0.75)
print(movies[movies["year"].between(2010, 2015) & (movies["rating"] >= 8) & (movies["revenue_millions"] < q75)])
```

### Appliquer une fonction, regrouper, trier

```python
def rating_function(x):
    return "good" if x >= 8.0 else "bad"

movies["rating_category"] = movies["rating"].apply(rating_function)
movies["main_genre"] = movies["genre"].str.split(",").str[0]     # .str : méthodes de chaînes
print(movies[["rating", "rating_category", "main_genre"]])

print(movies.groupby("director")["rating"].mean())               # moyenne par réalisateur
print(movies.sort_values("revenue_millions", ascending=False).head(3))
```

> 💡 `groupby(colonne)` découpe le tableau en groupes (une valeur de la colonne = un groupe), puis on **agrège** chaque groupe (`mean`, `sum`, `count`, `max`…). C'est l'équivalent du `GROUP BY` de SQL.

> 🎯 **À retenir** : `describe`, `value_counts`, `corr(numeric_only=True)` ; `df["c"]` → Series, `df[["c"]]` → DataFrame ; `.loc` par étiquette (fin incluse), `.iloc` par position (fin exclue) ; filtres `df[condition]` avec `&`, `|`, `isin`, `between`, `quantile` ; `apply(f)` ; `groupby(...).mean()` ; `sort_values`.
