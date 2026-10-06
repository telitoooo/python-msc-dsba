### Writing efficient code: the principles

- **Use built-in functions and libraries** (`sum`, `max`, `sorted`, `collections`…): they are written in C and highly optimised.
- **Avoid global variables**: accessing a local variable is faster (and the code is clearer).
- **Prefer comprehensions to loops** that `append`: more concise, and faster.
- **Beware of recursion**: each call costs memory (stack); an iterative or memoised version is often preferable.
- **Use NumPy and SciPy** for scientific computing: **vectorisation** and **broadcasting** replace loops.
- **Cython** (a superset of Python compiled to C) or **Numba** speed up critical parts.
- **multiprocessing**, multi-threading or **asyncio** use several cores or the waiting times.
- **Measure before optimising**: a profiler (`cProfile`) and the debugger locate the real bottlenecks.
- **Keep it simple and readable**: clear code is easier to understand, maintain… and optimise.
- Prefer `match` / `case` to a long `if` / `elif` ladder.

### Measuring time

```python
import time
import timeit

start = time.perf_counter()                        # high-resolution stopwatch
total = sum(range(1_000_000))
print(f"{time.perf_counter() - start:.4f} s")

# timeit repeats the measurement to smooth out variations
print(timeit.timeit("sum(range(1000))", number=1000))
print(timeit.timeit("[i * i for i in range(1000)]", number=1000))
```

### Choosing the right data structure

Complexity often matters more than micro-optimisations: looking for an element in a **list** goes through the whole list (time proportional to its size), whereas a **set** or a **dictionary** answers in almost constant time (hash table, module 4).

```python
import time

values = list(range(100_000))
as_set = set(values)
targets = range(99_000, 100_000)

start = time.perf_counter()
found = sum(1 for t in targets if t in values)      # 1,000 scans of a list
print("list:", f"{time.perf_counter() - start:.4f} s")

start = time.perf_counter()
found = sum(1 for t in targets if t in as_set)      # 1,000 lookups in a set
print("set: ", f"{time.perf_counter() - start:.6f} s")
```

### Say goodbye to loops (1): NumPy

```python
import time
import numpy as np

start = time.time()
total = 0
for item in range(0, 1_500_000):              # iterative sum
    total = total + item
print("sum is:", total, f"({time.time() - start:.3f} s)")

start = time.time()
print("sum is:", np.sum(np.arange(1_500_000, dtype=np.int64)), f"({time.time() - start:.4f} s)")
```

### Say goodbye to loops (2 and 3): pandas

Walking through a DataFrame row by row with `iterrows` is **extremely slow** (the course measures 109 s versus 0.12 s on 5 million rows). Compute on **whole columns** instead, and `df.loc[mask, column] = …` replaces row-by-row `if`s:

```python
import time
import numpy as np
import pandas as pd

rng = np.random.default_rng(0)
df = pd.DataFrame(rng.integers(1, 50, size=(5_000, 4)), columns=["a", "b", "c", "d"])

start = time.time()
ratios = []
for idx, row in df.iterrows():                   # row by row: slow
    ratios.append(100 * row["d"] / row["c"])
print(f"iterrows:   {time.time() - start:.3f} s")

start = time.time()
df["ratio"] = 100 * (df["d"] / df["c"])          # one single vectorised operation
print(f"vectorised: {time.time() - start:.4f} s", np.allclose(ratios, df["ratio"]))

# Conditional column without a loop: e = d if a == 0, b - c if 0 < a <= 25, b + c otherwise
df["e"] = df["b"] + df["c"]
df.loc[df["a"] <= 25, "e"] = df["b"] - df["c"]
df.loc[df["a"] == 0, "e"] = df["d"]
print(df.head())
```

### Say goodbye to loops (4): know your algebra

A double loop computing sums of products is a **matrix product**: `np.dot` (or `@`) does it in one optimised operation.

```python
import time
import numpy as np

rng = np.random.default_rng(0)
m = rng.random((1, 5))
x = rng.random((50_000, 5))

start = time.process_time()
z = np.zeros((50_000,))
for i in range(50_000):
    total = 0
    for j in range(5):
        total = total + x[i][j] * m[0][j]
    z[i] = total
print(f"loops:  {time.process_time() - start:.3f} s")

start = time.process_time()
z2 = np.dot(x, m.T)                       # shape (50000, 1)
print(f"np.dot: {time.process_time() - start:.4f} s", np.allclose(z, z2.ravel()))
```

### Using all the cores: `multiprocessing`

Spread the computation over several **processes** (one per core), then gather the results. This code does not run in the browser (no processes): try it on your computer.

```python norun
import random
from multiprocessing import Pool

def sample(num_samples):
    num_inside = 0
    for _ in range(num_samples):
        x, y = random.random(), random.random()
        if x**2 + y**2 <= 1:
            num_inside += 1
    return num_inside

def approximate_pi_parallel(num_samples):
    batch = 100_000
    with Pool() as pool:                                   # one process per core
        results = pool.map(sample, [batch] * (num_samples // batch))
    return 4 * sum(results) / num_samples

if __name__ == "__main__":                                 # mandatory with multiprocessing
    print(approximate_pi_parallel(10_000_000))
```

### Compiling on the fly: Numba

**Numba** converts a Python function into machine code at run time (*JIT*, *just-in-time*), with vectorisation, even GPU computing. Try it on your computer (`pip install numba`):

```python norun
import random
import numba

@numba.jit(nopython=True)
def monte_carlo_pi_jit(n_samples: int) -> float:
    acc = 0
    for i in range(n_samples):
        x, y = random.random(), random.random()
        if x**2 + y**2 < 1.0:
            acc += 1
    return 4.0 * acc / n_samples

print(monte_carlo_pi_jit(10_000_000))     # dozens of times faster than pure Python
```

> 🎯 **Key points**: measure (`time.perf_counter`, `timeit`, `cProfile`) before optimising; the right data structure (`set` / `dict` for lookups); built-ins and comprehensions; vectorise with NumPy / pandas (never `iterrows` on big tables); `np.dot` rather than nested loops; `multiprocessing`, Numba, Cython to go further.
