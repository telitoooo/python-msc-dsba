### Boolean masks and filtering

A comparison on an array returns an **array of booleans** of the same shape: a **mask**. Used inside square brackets, it **filters** the elements (1-dimensional result).

```python
import numpy as np

numbers = np.linspace(5, 50, 24, dtype=int).reshape(4, -1)
print(numbers)
mask = numbers % 4 == 0
print(mask)
print(numbers[mask])                         # multiples of 4
by_four = numbers[numbers % 4 == 0]          # in one line
print(np.count_nonzero(mask), mask.any(), mask.all())
```

Conditions are combined with `&` (and), `|` (or) and `~` (not), **with parentheses** (the keywords `and` / `or` do not work on arrays):

```python
import numpy as np

temps = np.array([12.5, 31.0, 28.4, 35.2, 18.9, 30.1])
print(temps[(temps > 20) & (temps < 32)])
print(np.where(temps > 30, "hot", "ok"))     # chooses element by element
temps[temps > 33] = 33                        # clip with a mask
print(temps)
```

### Transposing, shuffling, sorting

```python
import numpy as np

a = np.array([[1, 2], [3, 4], [5, 6]])
print(a.T)                                   # transpose: shape (2, 3)

rng = np.random.default_rng(0)
rng.shuffle(a)                               # shuffles the ROWS, in place
print(a)
print(np.sort(a, axis=0))                    # sorts each column
print(np.sort(np.array([3, 1, 2])), np.argsort(np.array([3, 1, 2])))  # sorted values / indices
```

> 💡 `np.argsort` gives the **order** of indices: `names[np.argsort(grades)]` sorts a list of names according to the grades.

### Concatenating

```python
import numpy as np

a = np.array([[4, 8], [6, 1]])
b = np.array([[3, 5], [7, 2]])
print(np.hstack((a, b)))                     # side by side: (2, 4)
print(np.vstack((a, b)))                     # one below the other: (4, 2)
print(np.concatenate((a, b)))                # axis=0 by default, like vstack
print(np.concatenate((a, b), axis=1))        # like hstack
print(np.concatenate((a, b), axis=None))     # flattened: [4 8 6 1 3 5 7 2]
```

### Structured arrays

A NumPy array has a single type… unless this type is **structured**: each element is a record with named fields.

```python
import numpy as np

data = np.array([
    ("joe", 32, 6),
    ("mary", 15, 20),
    ("felipe", 80, 100),
    ("beyonce", 38, 9001),
], dtype=[("name", "U10"), ("age", int), ("power", int)])

print(data[0])                               # ('joe', 32, 6)
print(data["name"])                          # one column
print(data[data["power"] > 9000]["name"])    # filtering on a field
print(np.sort(data, order="age")["name"])    # sorting on a field
print(data["name"].dtype)                    # <U10
```

`<U10` means: a **U**nicode string of at most **10** characters, stored *little-endian* (`<`, the processor's byte order).

> ⚠️ Structured arrays can help, but as soon as your data look like a **table with columns of different types**, switch to **pandas** (module 9), designed for that.

> 🎯 **Key points**: `a[mask]` filters; `&`, `|`, `~` with parentheses; `np.where(cond, if_true, if_false)`; `.T`, `shuffle`, `np.sort`, `np.argsort`; `hstack`, `vstack`, `concatenate(axis=0 | 1 | None)`; `dtype=[("name", "U10"), …]` for records.
