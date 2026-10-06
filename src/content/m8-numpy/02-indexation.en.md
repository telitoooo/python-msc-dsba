### Axes

Each position in the shape of an array is an **axis**. For a 2D array of shape `(rows, columns)`: **axis 0** runs along the rows (moving “down”), **axis 1** runs along the columns (moving “right”).

Aggregation functions (`sum`, `max`, `min`, `mean`, `std`, `argmax`…) apply either to the **whole array** or **along an axis**: the given axis is the one that “disappears”.

```python
import numpy as np

table = np.array([
    [5, 3, 7, 1],
    [2, 6, 7, 9],
    [1, 1, 1, 1],
    [4, 3, 2, 0],
])
print(table.max())           # 9: the whole array
print(table.max(axis=0))     # [5 6 7 9]: maximum of each COLUMN
print(table.max(axis=1))     # [7 9 1 4]: maximum of each ROW
print(table.sum(axis=1), table.mean(axis=0))
print(table.argmax(axis=1))  # index (column) of the maximum of each row
```

### Indexing: a comma between axes

Unlike lists of lists (`m[i][j]`), NumPy indexes **several axes within a single pair of square brackets**: `a[i, j]`.

```python
import numpy as np

square = np.array([
    [16, 3, 2, 13],
    [5, 10, 11, 8],
    [9, 6, 7, 12],
    [4, 15, 14, 1],
])
print(square[1, 2], square[-1, -1])      # row 1 column 2; last element

# Dürer's magic square: all rows, columns and diagonals sum to 34
for i in range(4):
    assert square[:, i].sum() == 34      # column i
    assert square[i, :].sum() == 34      # row i
assert sum(square[i, i] for i in range(4)) == 34
assert np.trace(square) == 34 and np.trace(np.fliplr(square)) == 34
print("magic square ✔")
```

### Slicing in several dimensions

The `start:stop:step` slicing of session 2 applies **to each axis**:

```python
import numpy as np

arr = np.array([[1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]])
print("Row 0:", arr[0])               # same as arr[0, :]
print("Column 1:", arr[:, 1])
print("Subarray:\n", arr[1:3, 0:2])
print("Every other row:\n", arr[::2])
print("Indexing with a list:", arr[[0, 2], 1])   # rows 0 and 2, column 1
```

### View or copy?

> ⚠️ **A slice is a VIEW** on the original data, not a copy: modifying it modifies the initial array. This is deliberate (no costly copy), but it is a classic trap. Use `.copy()` to work on an independent copy.

```python
import numpy as np

grades = np.array([[12, 15], [8, 11]])
first_col = grades[:, 0]          # view
first_col += 5                    # also modifies grades!
print(grades)

safe = grades[:, 1].copy()        # independent copy
safe[:] = 0
print(grades)                     # unchanged by this second modification
```

> 🎯 **Key points**: `axis=0` aggregates down the rows (one result per column), `axis=1` along the columns (one result per row); `a[i, j]`; `a[:, j]` a column, `a[i]` a row, `a[1:3, 0:2]` a subarray; slices are views, `.copy()` for a copy.
