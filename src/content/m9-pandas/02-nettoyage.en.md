### Duplicates

Real data often contain duplicated rows. `drop_duplicates()` removes them (parameter `keep="first"` by default, or `"last"`, or `False` to remove **all** occurrences).

```python
import pandas as pd

movies = pd.DataFrame(
    {"Year": [2012, 2016, 2016], "Rating": [7.0, 7.3, 7.2]},
    index=pd.Index(["Prometheus", "Split", "Sing"], name="Title"),
)
doubled = pd.concat([movies, movies])        # stacks the same table twice
print(doubled.shape)                         # (6, 2)
print(doubled.drop_duplicates().shape)       # (3, 2)
print(doubled.drop_duplicates(keep=False).shape)
```

> ⚠️ **The course slides use `df.append(df)`: this method was removed from pandas** (version 2.0). Write `pd.concat([df1, df2])` instead.

### Renaming columns

Short names, without spaces or parentheses, make everything easier afterwards (`df.rating` instead of `df["Rating"]`).

```python
import pandas as pd

df = pd.DataFrame({"Rank": [1], "Runtime (Minutes)": [121], "Revenue (Millions)": [333.13]})
print(df.columns)

df = df.rename(columns={"Runtime (Minutes)": "Runtime", "Revenue (Millions)": "Revenue_millions"})
print(list(df.columns))

df.columns = [col.lower() for col in df]     # iterating over a DataFrame gives its column names
print(list(df.columns))
```

### Missing values

An empty cell in a CSV becomes `NaN` (*Not a Number*, `np.nan`); so does `None`. Two strategies:

1. **drop** incomplete rows (or columns): `dropna()`;
2. **replace** missing values with a plausible value (mean, median…): this is **imputation**, with `fillna()`.

```python
import numpy as np
import pandas as pd

movies = pd.DataFrame({
    "rating": [8.1, 7.0, 6.4, 7.1],
    "revenue_millions": [333.13, 126.46, np.nan, 8.01],
    "metascore": [76, np.nan, 71, 78],
}, index=["Guardians", "Prometheus", "Mindhorn", "Lost City of Z"])

print(movies.isnull())                 # mask of missing values
print(movies.isnull().sum())           # number of missing values per column
print(movies.dropna().shape)           # complete rows only
print(movies.dropna(axis=1).shape)     # complete columns only

mean_revenue = movies["revenue_millions"].mean()      # NaN values are ignored
movies["revenue_millions"] = movies["revenue_millions"].fillna(mean_revenue)
print(movies)
print(movies.isnull().sum())
```

> ⚠️ **Trap (pandas 3, *copy-on-write*)**: the slides write `revenue = movies_df['revenue_millions']` then `revenue.fillna(revenue_mean, inplace=True)`. With recent pandas, `revenue` is a **copy**: the DataFrame is **not** modified. The safe form is to **reassign the column**: `df["col"] = df["col"].fillna(value)`. Likewise, prefer `df = df.dropna()` over `df.dropna(inplace=True)`.

### Column types

```python
import pandas as pd

df = pd.DataFrame({"year": ["2016", "2012"], "votes": ["757074", "485820"]})
print(df.dtypes)                       # strings
df = df.astype({"year": int, "votes": int})
print(df.dtypes, df["votes"].sum())
```

> 🎯 **Key points**: `pd.concat([a, b])` (no more `append`); `drop_duplicates(keep=…)`; `rename(columns={…})` or `df.columns = […]`; `isnull().sum()` counts missing values; `dropna()` (rows) / `dropna(axis=1)` (columns); imputation `df["c"] = df["c"].fillna(df["c"].mean())`; `astype` to change type.
