### Vectorised computing

An operation between arrays of the **same shape** applies element-wise, without a loop. NumPy's mathematical functions (`np.sqrt`, `np.exp`, `np.log`, `np.sin`…) do the same: they are *ufuncs* (universal functions).

```python
import numpy as np

prices = np.array([2.95, 4.95, 1.95, 12.95])
quantities = np.array([3, 1, 0, 2])
print(prices * quantities)              # price of each order line
print((prices * quantities).sum())      # total
print(prices @ quantities)              # dot product: same total in one operation
print(np.sqrt(np.array([4, 9, 16])))
```

### Broadcasting

**Broadcasting** lets you operate on arrays of **different shapes**: the smaller one is “stretched” (without any real copy) to match the larger one.

```python
import numpy as np

arr = np.array([[1, 2, 3],
                [4, 5, 6]])               # shape (2, 3)
row_vector = np.array([10, 20, 30])        # shape (3,)
print(arr + row_vector)                    # added to EACH row
print(arr * 2)                             # a number is stretched to the whole array

col_vector = np.array([[100], [200]])      # shape (2, 1)
print(arr + col_vector)                    # added to EACH column
```

**The rule**: compare the shapes starting from the **last** dimension. Two dimensions are compatible if they are **equal** or if one of them is **1** (it is then stretched). A missing dimension counts as 1.

```python
import numpy as np

A = np.arange(32).reshape(4, 1, 8)
B = np.arange(48).reshape(1, 6, 8)
# axis 0: 4 and 1 → B is stretched; axis 1: 1 and 6 → A is stretched; axis 2: 8 and 8 → equal
print((A + B).shape)                       # (4, 6, 8)

try:
    np.ones((2, 3)) + np.ones((2, 4))      # 3 and 4: incompatible
except ValueError as e:
    print("Error:", e)
```

> 💡 To turn a vector `(n,)` into a column `(n, 1)`, use `v[:, np.newaxis]` (or `v.reshape(-1, 1)`). Example: a multiplication table in one line, `np.arange(1, 11)[:, np.newaxis] * np.arange(1, 11)`.

### Matrix product

`np.dot(a, b)` or `a @ b` computes the matrix product (or the dot product of two vectors). With an order matrix (one row per order, one column per product), a single product gives the amount of each order:

```python
import numpy as np

prices = np.array([2.95, 4.95, 1.95, 12.95])
orders = np.array([
    [3, 0, 0, 2],
    [10, 3, 4, 8],
    [19, 0, 1, 1],
])
print(orders @ prices)             # total of each order (shape (3,))
print(orders.sum(axis=0))          # quantity sold of each product
print(orders.sum(axis=0) * prices) # revenue per product
```

### Why “say goodbye to loops”?

```python
import time
import numpy as np

n = 1_000_000
start = time.perf_counter()
total = 0
for i in range(n):
    total += i * i
loop_time = time.perf_counter() - start

start = time.perf_counter()
values = np.arange(n, dtype=np.int64)
total_np = (values * values).sum()
numpy_time = time.perf_counter() - start

print(total == total_np, f"loop: {loop_time:.3f} s, NumPy: {numpy_time:.4f} s")
```

> 🎯 **Key points**: operations and *ufuncs* are element-wise; broadcasting aligns shapes from the last dimension (equal or 1); `@` / `np.dot` for the matrix product; a vectorised computation advantageously replaces a loop.
