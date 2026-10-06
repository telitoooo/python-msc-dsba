### Les doublons

Des données réelles contiennent souvent des lignes en double. `drop_duplicates()` les supprime (paramètre `keep="first"` par défaut, ou `"last"`, ou `False` pour supprimer **toutes** les occurrences).

```python
import pandas as pd

movies = pd.DataFrame(
    {"Year": [2012, 2016, 2016], "Rating": [7.0, 7.3, 7.2]},
    index=pd.Index(["Prometheus", "Split", "Sing"], name="Title"),
)
doubled = pd.concat([movies, movies])        # empile deux fois le même tableau
print(doubled.shape)                         # (6, 2)
print(doubled.drop_duplicates().shape)       # (3, 2)
print(doubled.drop_duplicates(keep=False).shape)
```

> ⚠️ **Le cours (diapos) utilise `df.append(df)` : cette méthode a été supprimée de pandas** (version 2.0). On écrit désormais `pd.concat([df1, df2])`.

### Renommer les colonnes

Des noms courts, sans espaces ni parenthèses, simplifient la suite (`df.rating` au lieu de `df["Rating"]`).

```python
import pandas as pd

df = pd.DataFrame({"Rank": [1], "Runtime (Minutes)": [121], "Revenue (Millions)": [333.13]})
print(df.columns)

df = df.rename(columns={"Runtime (Minutes)": "Runtime", "Revenue (Millions)": "Revenue_millions"})
print(list(df.columns))

df.columns = [col.lower() for col in df]     # parcourir un DataFrame donne ses noms de colonnes
print(list(df.columns))
```

### Les valeurs manquantes

Une case vide d'un CSV devient `NaN` (*Not a Number*, `np.nan`) ; `None` aussi. Deux stratégies :

1. **supprimer** les lignes (ou colonnes) incomplètes : `dropna()` ;
2. **remplacer** les manques par une valeur plausible (moyenne, médiane…) : c'est l'**imputation**, avec `fillna()`.

```python
import numpy as np
import pandas as pd

movies = pd.DataFrame({
    "rating": [8.1, 7.0, 6.4, 7.1],
    "revenue_millions": [333.13, 126.46, np.nan, 8.01],
    "metascore": [76, np.nan, 71, 78],
}, index=["Guardians", "Prometheus", "Mindhorn", "Lost City of Z"])

print(movies.isnull())                 # masque des valeurs manquantes
print(movies.isnull().sum())           # nombre de manques par colonne
print(movies.dropna().shape)           # lignes complètes seulement
print(movies.dropna(axis=1).shape)     # colonnes complètes seulement

mean_revenue = movies["revenue_millions"].mean()      # les NaN sont ignorés
movies["revenue_millions"] = movies["revenue_millions"].fillna(mean_revenue)
print(movies)
print(movies.isnull().sum())
```

> ⚠️ **Piège (pandas 3, *copy-on-write*)** : les diapos écrivent `revenue = movies_df['revenue_millions']` puis `revenue.fillna(revenue_mean, inplace=True)`. Avec pandas récent, `revenue` est une **copie** : le DataFrame n'est **pas** modifié. La forme sûre est de **réaffecter la colonne** : `df["col"] = df["col"].fillna(valeur)`. De même, préférez `df = df.dropna()` à `df.dropna(inplace=True)`.

### Types des colonnes

```python
import pandas as pd

df = pd.DataFrame({"year": ["2016", "2012"], "votes": ["757074", "485820"]})
print(df.dtypes)                       # des chaînes
df = df.astype({"year": int, "votes": int})
print(df.dtypes, df["votes"].sum())
```

> 🎯 **À retenir** : `pd.concat([a, b])` (plus d'`append`) ; `drop_duplicates(keep=…)` ; `rename(columns={…})` ou `df.columns = […]` ; `isnull().sum()` compte les manques ; `dropna()` (lignes) / `dropna(axis=1)` (colonnes) ; imputation `df["c"] = df["c"].fillna(df["c"].mean())` ; `astype` pour changer de type.
