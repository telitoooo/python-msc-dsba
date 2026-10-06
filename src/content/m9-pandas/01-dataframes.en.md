### Why pandas?

**pandas** represents data as **tables** (like a spreadsheet or a database table, but in memory). Built on top of NumPy, it is used to **load, clean, transform, explore and visualise** data, together with SciPy, scikit-learn, PyTorch, matplotlib… Its two core structures:

- **`Series`**: one column, i.e. values labelled by an **index**;
- **`DataFrame`**: a table of several columns (each one is a `Series`) sharing the same index.

```python
import pandas as pd

data = {
    "apples": [3, 2, 0, 1],
    "oranges": [0, 3, 7, 2],
}
purchases = pd.DataFrame(data)
print(purchases)
print(type(purchases["apples"]))      # a column is a Series
```

### The index: naming rows

By default rows are numbered 0, 1, 2… You can provide your own **index**, then access a row by its **label** with `.loc`:

```python
import pandas as pd

purchases = pd.DataFrame(
    {"apples": [3, 2, 0, 1], "oranges": [0, 3, 7, 2]},
    index=["June", "Robert", "Lily", "David"],
)
print(purchases)
print(purchases.loc["June"])          # one row, as a Series
print(purchases.loc["Lily", "oranges"])
print(purchases["apples"].sum(), purchases.shape)
purchases["total"] = purchases["apples"] + purchases["oranges"]   # new column
print(purchases)
```

### Reading and writing files

pandas reads and writes many formats: CSV (`read_csv` / `to_csv`), JSON (`read_json` / `to_json`), Excel, SQL databases (`read_sql`)…

```python
import io
import pandas as pd

csv_text = """,apples,oranges
June,3,0
Robert,2,3
Lily,0,7
David,1,2
"""
# io.StringIO makes a text look like a file; for real: pd.read_csv("purchases.csv")
df = pd.read_csv(io.StringIO(csv_text))
print(df)                                 # the 1st column becomes "Unnamed: 0"
df = pd.read_csv(io.StringIO(csv_text), index_col=0)
print(df)                                 # index_col=0: the 1st column is the index

df.to_csv("purchases_copy.csv")           # writes a file in the working folder
print(open("purchases_copy.csv").read())
```

> 💡 `index_col="Title"` uses the column named `Title` as the index: this is what the course does with the IMDB movie dataset.

### Taking a first look

| Method / attribute | What you get |
|---|---|
| `df.head(n)` / `df.tail(n)` | the first / last `n` rows (5 by default) |
| `df.shape` | `(number of rows, number of columns)` |
| `df.columns`, `df.index` | column names, row labels |
| `df.dtypes` | type of each column |
| `df.info()` | summary: columns, non-null values, types, memory |
| `df.describe()` | statistics of the numeric columns |

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

> 🎯 **Key points**: `import pandas as pd`; `pd.DataFrame(dict)`; a column = a `Series`; the index labels the rows (`index=`, `index_col=`, `set_index`); `.loc[label]`; `read_csv` / `to_csv`; `head`, `tail`, `shape`, `columns`, `info`, `describe`.
