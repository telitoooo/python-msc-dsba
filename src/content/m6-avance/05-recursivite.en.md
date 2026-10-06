### A function that calls itself

A **recursive** function solves a problem by calling itself on a **smaller** problem. It always has two parts:

- a **base case**, solved directly, which stops the recursion;
- a **recursive case**, which reduces to a smaller problem.

```python
def fact(n):
    if n == 0:              # base case
        return 1
    return n * fact(n - 1)  # recursive case (else is optional after a return)

print(fact(5))              # 5 * 4 * 3 * 2 * 1 = 120
```

### The call stack

To come back to the right place after each `return`, the computer stacks the ongoing calls: this is the **call stack**. `fact(3)` waits for `fact(2)`, which waits for `fact(1)`, which waits for `fact(0)`; then the results go back up.

```python
def chatty_fact(n, level=0):
    print("  " * level + f"fact({n})")
    if n == 0:
        result = 1
    else:
        result = n * chatty_fact(n - 1, level + 1)
    print("  " * level + f"→ {result}")
    return result

chatty_fact(3)
```

> ⚠️ **Without a reachable base case, the stack overflows**: `fact(-1)` goes down to -2, -3… without ever reaching 0, until a `RecursionError` (Python limits the depth to about 1000 calls, see `sys.getrecursionlimit()`). Protect your functions: `if n < 0: raise ValueError(...)`.

### Recursive, iterative, memoised: the Fibonacci example

The course defines `fib(0) = 1`, `fib(1) = 1` and `fib(n) = fib(n - 1) + fib(n - 2)`, i.e. 1, 1, 2, 3, 5, 8, 13, 21… Several ways to compute it:

```python
import time

def fib_rec(n):                      # direct translation: elegant but exponential
    if n < 2:
        return 1
    return fib_rec(n - 1) + fib_rec(n - 2)

def fib_iter(n):                     # loop: linear
    a, b = 1, 1
    for _ in range(n):
        a, b = b, a + b
    return a

cache = {}
def fib_memo(n):                     # recursive + memory of the results already computed
    if n < 2:
        return 1
    if n not in cache:
        cache[n] = fib_memo(n - 1) + fib_memo(n - 2)
    return cache[n]

for f in (fib_rec, fib_iter, fib_memo):
    start = time.perf_counter()
    print(f.__name__, f(25), f"{time.perf_counter() - start:.4f} s")
```

`fib_rec(25)` recomputes the same values hundreds of thousands of times; memoisation and the loop compute each of them only once.

### When recursion is natural

Recursion shines on **structures that are themselves recursive**: a folder contains files and **folders**; a tree contains subtrees.

```python
import os

os.makedirs("project/src/tools", exist_ok=True)
for path in ["project/README.md", "project/src/main.py", "project/src/tools/helper.py"]:
    open(path, "w").close()

def tree_size(folder):
    """Number of files in the folder and all its subfolders."""
    total = 0
    for name in os.listdir(folder):
        path = os.path.join(folder, name)
        if os.path.isdir(path):
            total += tree_size(path)        # same problem, smaller
        else:
            total += 1
    return total

print(tree_size("project"), "files")
```

> 🎯 **Key points**: a base case + a recursive case getting closer to the base case; each call takes room on the stack; naive recursion can be exponential (Fibonacci): use a loop or memoisation; ideal for file trees and *backtracking*.
