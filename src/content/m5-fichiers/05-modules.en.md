### Why modules?

A **module** is simply a `.py` file. A large program is split into several files to make it readable, reusable and testable. A **package** is a folder of modules containing an `__init__.py` file.

```text
my_project/
├── main.py              # entry point: what you run
├── bank/                # a package
│   ├── __init__.py
│   ├── account.py
│   └── storage.py
└── README.md
```

### The different forms of `import`

```python
import math                          # use math.sqrt, math.pi…
import statistics as st              # alias: st.mean
from random import randint, choice   # import specific names
from collections import Counter

print(math.sqrt(16), math.pi)
print(st.mean([12, 15, 18]))
print(randint(1, 6), choice(["heads", "tails"]))
print(Counter("abracadabra").most_common(2))
```

> ⚠️ Avoid `from module import *`: you no longer know where the names come from, and they may overwrite others.

For a package, you write for instance `from bank.account import deposit` or `import bank.storage`.

The `__init__.py` file **turns a folder into a package**: it is executed the first time the package is imported (it can be empty, or define common names). A tidy project also contains a `README.md` explaining how to use it, and follows the **PEP 8** style conventions (see session 6).

```python
# For the example, we first create the project files: a/__init__.py, a/func_a.py and b.py
import os
os.makedirs("a", exist_ok=True)
with open("a/__init__.py", "w") as f:
    f.write('module = "a"\n')
with open("a/func_a.py", "w") as f:
    f.write("def f_a(x):\n    return 2 * x\n")
with open("b.py", "w") as f:
    f.write("CONST = 42\n\ndef func_b(x):\n    return x + CONST\n")

import a
import a.func_a
from b import CONST, func_b

def main():
    print(a.module)            # name defined in a/__init__.py
    print(a.func_a.f_a(2))     # function of the module a/func_a.py
    print(CONST, func_b(2))

if __name__ == "__main__":
    main()
```

### `if __name__ == "__main__":`

When Python **runs** a file, the special variable `__name__` is `"__main__"`; when the file is **imported**, it is the module's name. This test therefore lets you write code that only runs when the file is launched directly, and not when it is imported:

```python
def area(radius):
    return 3.14159 * radius ** 2

def main():
    print("Area of the unit circle:", area(1))

if __name__ == "__main__":
    main()          # not executed if another file does "import this_module"
```

### Where does Python look for modules?

In this order: **the folder of the script being run**, then the standard library, then the packages installed with `pip` (such as `requests` or `pillow`). The full list is in `sys.path`.

> ⚠️ **Classic trap: never name a file like a module you import.** A `random.py`, `glob.py`, `json.py` or `email.py` file placed next to your script **silently replaces** the real module, for your script and for every library that imports it. Symptoms: `AttributeError: module 'random' has no attribute 'randint'` or `TypeError: 'module' object is not callable`. Remedy: rename the file **and** delete the `__pycache__` folder.

### The standard library… and the rest of the world

Python comes with many modules (full list on docs.python.org/3/library): `copy`, `os`, `io`, `collections`, `datetime`, `time`, `functools`, `itertools`, `inspect`, `glob`, `re`, `math`, `random`, `pickle`, `json`, `csv`, `argparse`, `multiprocessing`, `queue`, `asyncio`, `html`, `xml`, `urllib`, `http`, `tkinter`, `unittest`, `sys`…

External packages are found on **PyPI** (pypi.org) and installed in the terminal with `pip install` (see lesson 1.1). A few examples:

| Field | Packages |
|---|---|
| Data science | NumPy (numerical computing), pandas (data tables), Matplotlib and Seaborn (plots), SciPy (scientific functions), scikit-learn (machine learning), TensorFlow and PyTorch (deep learning), Pillow and OpenCV (images), Jupyter (notebooks) |
| Web | requests (HTTP requests), Scrapy (web crawler), Flask, Django and Tornado (frameworks), BeautifulSoup (HTML parsing), pystache (templating) |
| Other | pydub and librosa (audio), pygame (games), PyOpenGL and pyglet (3D), NetworkX (graphs), PyQt (GUIs), pytest (tests) |

### Three very useful standard modules

**`datetime` and `time`**: dates, durations and timing.

```python
from datetime import date, datetime, timedelta
import time

now = datetime.now()
print(now.year, now.strftime("%d/%m/%Y %H:%M"))
print(date(2026, 12, 25) - date(2026, 10, 5))        # a duration (timedelta)
print(date(2026, 10, 5) + timedelta(days=100))

timestamp = time.time()                              # timestamp: seconds since 1 January 1970
print(timestamp, datetime.fromtimestamp(timestamp))  # a timestamp → a date

before = time.time()
for i in range(3):
    print("gonna sleep a bit…")
    time.sleep(0.5)                                  # pauses the program for 0.5 s
print(f"total time: {time.time() - before:.1f} s")

start = time.perf_counter()
total = sum(i * i for i in range(1_000_000))
print(f"computed in {time.perf_counter() - start:.3f} s")
```

> 💡 To time code, use `time.perf_counter()`: it is a high-precision clock that never goes backwards, unlike `time.time()` which follows the system clock (it can be adjusted during the measurement).

**`collections`**: `Counter` counts elements, `defaultdict` creates missing values.

```python
from collections import Counter, defaultdict

words = "the cat and the dog and the fish".split()
count = Counter(words)
print(count["the"], count["bear"])         # 3 0: no KeyError
print(count.most_common(2))

by_initial = defaultdict(list)
for word in words:
    by_initial[word[0]].append(word)
print(dict(by_initial))
```

**`argparse`**: reading command-line arguments (`python stats.py 1342 --top 5`).

```python
import argparse

parser = argparse.ArgumentParser(description="Word statistics")
parser.add_argument("ids", type=int, nargs="+", help="book identifiers")
parser.add_argument("--top", type=int, default=10, help="number of words to display")

args = parser.parse_args(["1342", "84", "--top", "5"])   # for real: parse_args() reads sys.argv
print(args.ids, args.top)
```

> 💡 **Running a Python program** from a terminal: `python3 script.py` (a file), `python3 -m module` (a module, e.g. `python3 -m http.server`), `python3 -c "print('hello')"` (a string of code).

> 🎯 **Key points**: a module = a `.py` file, a package = a folder with `__init__.py`; `import x`, `import x as y`, `from x import f`; protect the entry point with `if __name__ == "__main__":`; never name your files like existing modules.
