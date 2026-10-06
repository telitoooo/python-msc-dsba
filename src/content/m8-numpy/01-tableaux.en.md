### Why NumPy?

**NumPy** (*Numerical Python*) provides an **n-dimensional** array type, `ndarray`, and hundreds of computing functions. It is the foundation of the whole data ecosystem (pandas, matplotlib, scikit-learn, PyTorch…). Its strengths:

- **speed**: computations run in C, on compactly stored data (often 10 to 100 times faster than a Python loop);
- **fewer loops**: an operation applies to the whole array at once;
- **clearer** code of **better quality**.

By convention it is imported as `np`. On this site, NumPy is loaded automatically on the first `import numpy` (it takes a few seconds the first time).

```python
import numpy as np

my_array = np.array([1, 2, 3, 4, 5, 6, 7, 8], dtype=np.int64)       # 1 dimension
my_2d_array = np.array([[1, 2, 3, 4],
                        [5, 6, 7, 8]], dtype=np.int64)              # 2 dimensions
my_3d_array = np.array([[[1, 2, 3, 4], [5, 6, 7, 8]],
                        [[1, 2, 3, 4], [9, 10, 11, 12]]])           # 3 dimensions

for a in (my_array, my_2d_array, my_3d_array):
    print(a.ndim, a.shape, a.size, a.dtype)
```

### Array properties

| Property | Meaning | Example for `my_2d_array` |
|---|---|---|
| `a.ndim` | number of dimensions (**axes**) | `2` |
| `a.shape` | **shape**: tuple of the size of each dimension | `(2, 4)` |
| `a.size` | total number of elements | `8` |
| `a.dtype` | (single!) type of all elements | `int64` |

> ⚠️ **Pay attention to shapes!** Most NumPy errors come from an unexpected shape. Print `a.shape` whenever in doubt.

### An array is not a list

All the elements of an array have **the same type** (NumPy converts if needed) and operations apply **element-wise**:

```python
import numpy as np

my_list = [1, 2, 3]
array = np.array([1, 2, 3])
print(my_list * 2)        # [1, 2, 3, 1, 2, 3]: repetition
print(array * 2)          # [2 4 6]: element-wise computation
print(array + 10, array ** 2)

mixed = np.array([1, 2.5, 3])
print(mixed, mixed.dtype)            # everything becomes float64
```

### Creating arrays

```python
import numpy as np

print(np.arange(0, 10, 2))           # like range, but returns an array
print(np.linspace(0, 1, 5))          # 5 evenly spaced values from 0 to 1 (included)
print(np.zeros((2, 3)))              # array of zeros with shape (2, 3)
print(np.ones(4, dtype=int))
print(np.full((2, 2), 7))
print(np.eye(3))                     # identity matrix
```

### Changing shape: `reshape`, `swapaxes`, `.T`

`reshape` reorganises the same data into another shape (the total number of elements must be kept; `-1` means “compute this dimension for me”).

```python
import numpy as np

temperatures = np.array([
    29.3, 42.1, 18.8, 16.1, 38.0, 12.5,
    12.6, 49.9, 38.6, 31.3, 9.2, 22.2,
]).reshape(2, 2, 3)
print(temperatures.shape)                     # (2, 2, 3)
print(temperatures)

print(np.swapaxes(temperatures, 1, 2).shape)  # (2, 3, 2): swaps axes 1 and 2
print(np.arange(12).reshape(3, -1))           # -1 → 4 columns
print(np.arange(6).reshape(2, 3).T)           # transpose: (3, 2)
print(temperatures.flatten())                 # back to 1 dimension
```

> 💡 `reshape` does not copy data: it creates a new **view** on the same memory block. It is instantaneous, even for millions of values.

> 🎯 **Key points**: `import numpy as np`; `np.array(list)`; `shape`, `ndim`, `size`, `dtype`; one type per array; element-wise operations; `arange`, `linspace`, `zeros`, `ones`, `full`, `eye`; `reshape` (with `-1`), `swapaxes`, `.T`.
