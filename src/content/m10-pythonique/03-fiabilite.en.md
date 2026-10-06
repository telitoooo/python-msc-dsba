### Assertions: checking your assumptions

`assert condition, message` checks that a condition **must** be true at this point of the program; otherwise an `AssertionError` is raised. It is a **sanity check** for the developer.

```python
def isqrt(n):
    assert n >= 0, "n must be positive"
    i = 0
    while i * i < n:          # loop until i * i is not less than n
        i += 1
    return i                  # the first integer whose square is not less than n

print(isqrt(144))
try:
    isqrt(-25)
except AssertionError as e:
    print("AssertionError:", e)
```

> ⚠️ Assertions can be **disabled** (`python -O program.py`): never use them to validate data coming from the user (raise a real exception there: `raise ValueError(...)`). They are meant to catch **bugs**.

### `with`: the context manager

Three ways to write to a file — the last one is the right one:

```python
# 1) without with: if write() raises an error, the file is never closed
file = open("file_path.txt", "w")
file.write("hello world !")
file.close()

# 2) still without with, but safe: finally runs no matter what
file = open("file_path.txt", "w")
try:
    file.write("hello world")
finally:
    file.close()

# 3) with with: same guarantee, no close() to write
with open("file_path.txt", "w") as file:
    file.write("hello world !")
print(file.closed)
```

You can write your own context managers: a class with `__enter__` (run when entering the block, its return value is bound by `as`) and `__exit__` (run when leaving, **even if an exception occurred**).

```python
import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self.start
        print(f"block ran in {self.elapsed:.4f} s")
        return False              # False: a possible exception keeps propagating

with Timer() as t:
    total = sum(i * i for i in range(500_000))
print(total, t.elapsed > 0)
```

### Unit tests with `unittest`

A **unit test** is a piece of code that automatically checks that a function behaves as expected. The standard library provides `unittest`: the tests of a module are grouped in a class inheriting from `unittest.TestCase`; each method whose name starts with `test` is a test, which uses **assertions** (`assertEqual`, `assertTrue`, `assertGreater`, `assertAlmostEqual`, `assertRaises`…).

```python
import math
import sys
import unittest

def distance(x: tuple, y: tuple) -> float:
    """Euclidean distance between two points."""
    return math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)


class EuclideanTestCase(unittest.TestCase):
    """Tests for the distance function."""

    def test_euclidean_distance_same(self):
        x = (0.0, 0.0)
        self.assertEqual(distance(x, x), 0.0)

    def test_euclidean_distance(self):
        x, y = (0.0, 0.0), (1.0, 1.0)
        self.assertGreater(distance(x, y), 1.0)
        self.assertEqual(distance(x, y), distance(y, x))

    def test_known_value(self):
        self.assertAlmostEqual(distance((0, 0), (3, 4)), 5.0)


suite = unittest.defaultTestLoader.loadTestsFromTestCase(EuclideanTestCase)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```

In a real project, tests live in a separate file (`test_euclidean.py`) that imports the tested module, and are run with:

```python norun
if __name__ == "__main__":
    unittest.main()          # or, in a terminal: python -m unittest
```

> 💡 The **coverage** package measures test **coverage**: how much of the code is run by at least one test (`coverage run -m unittest`, then `coverage report`).

### Logging rather than printing: `logging`

Why avoid debugging `print`s? You cannot always see the console (server, graphical interface), and a `print` tells neither **when**, nor **where**, nor **how serious** it is. The `logging` module defines **levels** (DEBUG < INFO < WARNING < ERROR < CRITICAL), writes to the console or a file, and adds context (time, module, function, line…).

```python
import logging

logging.basicConfig(
    format="%(asctime)s,%(msecs)03d %(name)s %(levelname)s %(message)s",
    datefmt="%H:%M:%S",
    level=logging.DEBUG,
    force=True,      # reconfigures even if logging was already configured (useful here and in notebooks)
)
logging.debug("something to debug")
logging.info("an info i wanna share")
logging.warning("watch out, something may be a problem")
logging.error("we are facing something wrong")
logging.critical("even worse")
```

Add `filename="app.log"` to `basicConfig` to write to a file; `level=logging.WARNING` hides less serious messages. By default, logs go to the **error output** (in red in this terminal).

### Debugging

IDEs (VS Code, PyCharm, Spyder…) include a **debugger**: set **breakpoints**, run **step by step**, **inspect** variables. On the command line, `breakpoint()` opens the `pdb` debugger. Caveat: interactive applications (tkinter, Flask) are trickier to debug, because they run inside an event loop.

> 🎯 **Key points**: `assert` for bugs (can be disabled with `-O`); `with` guarantees resources are released (`__enter__` / `__exit__`); `unittest.TestCase` + `test_…` methods + `assertEqual`…; `logging` with levels and a format rather than `print`; debugger and breakpoints.
