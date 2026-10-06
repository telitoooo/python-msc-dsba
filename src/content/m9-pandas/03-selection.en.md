The examples of this lesson use a small excerpt of the course's IMDB movie dataset. This first block creates the `movies` table; it is automatically reused by all the following examples.

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

### Exploring

```python
print(movies.describe())                         # statistics of the numeric columns
print(movies["director"].describe())             # for text: count, unique, top, freq
print(movies["director"].value_counts())         # frequency of each value
print(movies.corr(numeric_only=True).round(2))   # correlations between numeric columns
```

> ⚠️ The slides write `movies_df.corr()`. With recent pandas you must add `numeric_only=True` as soon as the table contains text.

### Selecting columns

```python
genre_col = movies["genre"]              # one column → Series
print(type(genre_col))
genre_df = movies[["genre"]]             # a LIST of columns → DataFrame
print(type(genre_df))
subset = movies[["genre", "rating"]]
print(subset.head())
```

### Selecting rows: `loc` and `iloc`

- `.loc[…]` selects by **label** (the row name): the end of a slice is **included**;
- `.iloc[…]` selects by **position** (like a list): the end is **excluded**.

```python
print(movies.loc["Prometheus"])                  # by name
print(movies.iloc[1])                            # by position: the 2nd row
print(movies.loc["Prometheus":"Sing"])           # from Prometheus to Sing INCLUDED
print(movies.iloc[1:4])                          # positions 1, 2 and 3
print(movies.loc["Inception", "rating"], movies.iloc[0, 3])
```

### Conditional selection

A condition on a column gives a `Series` of booleans (a **mask**, as with NumPy) that filters the rows:

```python
condition = movies["director"] == "Ridley Scott"
print(condition)
print(movies[condition])
print(movies[movies["rating"] >= 8.6])

# Several conditions: | (or), & (and), with parentheses
nolan_or_scott = movies[(movies["director"] == "Christopher Nolan") | (movies["director"] == "Ridley Scott")]
print(nolan_or_scott.index.tolist())
print(movies[movies["director"].isin(["Christopher Nolan", "Ridley Scott"])].index.tolist())

# Movies released between 2010 and 2015, rated at least 8, with revenue below the 3rd quartile
q75 = movies["revenue_millions"].quantile(0.75)
print(movies[movies["year"].between(2010, 2015) & (movies["rating"] >= 8) & (movies["revenue_millions"] < q75)])
```

### Applying a function, grouping, sorting

```python
def rating_function(x):
    return "good" if x >= 8.0 else "bad"

movies["rating_category"] = movies["rating"].apply(rating_function)
movies["main_genre"] = movies["genre"].str.split(",").str[0]     # .str: string methods
print(movies[["rating", "rating_category", "main_genre"]])

print(movies.groupby("director")["rating"].mean())               # mean per director
print(movies.sort_values("revenue_millions", ascending=False).head(3))
```

> 💡 `groupby(column)` splits the table into groups (one value of the column = one group), then each group is **aggregated** (`mean`, `sum`, `count`, `max`…). It is the equivalent of SQL's `GROUP BY`.

> 🎯 **Key points**: `describe`, `value_counts`, `corr(numeric_only=True)`; `df["c"]` → Series, `df[["c"]]` → DataFrame; `.loc` by label (end included), `.iloc` by position (end excluded); filters `df[condition]` with `&`, `|`, `isin`, `between`, `quantile`; `apply(f)`; `groupby(...).mean()`; `sort_values`.
