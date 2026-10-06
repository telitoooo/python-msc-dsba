### `argparse`: reading command-line arguments

A program often receives **arguments** when it starts, conventionally as `--name=value`:

```text
user@name:~/python101$ python3 -m my_module --num_iter=34
number of iterations 34
```

The `argparse` module declares the expected arguments (type, default value, help), reads `sys.argv`, converts the values and automatically generates the `--help` text.

```python
import argparse

parser = argparse.ArgumentParser(description="argparse demo")
parser.add_argument("name", help="positional argument (mandatory)")
parser.add_argument("--num_iter", type=int, default=10, help="number of iterations")
parser.add_argument("--verbose", action="store_true", help="flag: True if present")

# In a real program: args = parser.parse_args()  (reads the command line)
# Here we simulate the line: python3 my_module.py Ada --num_iter=34 --verbose
args = parser.parse_args(["Ada", "--num_iter=34", "--verbose"])
print("number of iterations", args.num_iter, "|", args.name, args.verbose)
print(parser.parse_args(["Bob"]))          # default values
```

### The Zen of Python

`import this` prints Python's design principles (Tim Peters): *Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex. Flat is better than nested. Readability counts. Errors should never pass silently…*

```python
import codecs
import this        # prints the Zen on the first import only (Python stays loaded afterwards)

zen = codecs.decode(this.s, "rot13")   # the text is stored ROT13-encoded: it can be shown again
print(zen.splitlines()[2:6])
```

### Style guides: PEP 8

Every project should follow common **conventions** (naming, line breaking…): consistent code is more **readable**, easier to **maintain**, and contains fewer bugs. The official guide is **PEP 8** (Google's style guide is another one). The essential rules:

| Element | Convention | Example |
|---|---|---|
| variables, functions, modules | `snake_case` | `total_price`, `compute_mean()` |
| classes | `CapWords` | `VendingMachine` |
| constants | `UPPER_CASE` | `MAX_QUANTITY` |
| indentation | 4 spaces | |
| lines | 79 characters (often 99–120 in practice) | |
| imports | at the top of the file, one per line | `import os` |

> 💡 Tools check and fix style automatically: `flake8`, `pylint`, `black`, `ruff`.

### Docstrings and type hints

Every **module**, **class** and **function** deserves a docstring: a one-line summary, a more detailed description, then sections **Args** (arguments and types), **Returns** (what is returned), **Raises** (possible exceptions) and **Attributes** (for a class). **Type hints** are optional: Python does not check them at run time, they help the reader, the IDE and tools such as `mypy`.

```python
import math

def euclidean_distance(x: tuple[float, float], y: tuple[float, float]) -> float:
    """Computes the Euclidean distance between two points.

    Args:
        x: a tuple of two floats, the first point's coordinates.
        y: a tuple of two floats, the second point's coordinates.

    Returns:
        A positive float.
    """
    return math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)

help(euclidean_distance)
print(euclidean_distance.__annotations__)
```

### `match` / `case`: pattern matching

Since Python 3.10, `match` compares a value against **patterns**: more readable than a long `if` / `elif` ladder, it can also **destructure** a list or a tuple and capture variables.

```python
def execute(command: str) -> str:
    match command.split():
        case ["deposit", amount]:
            return f"deposit of {float(amount):.2f}"
        case ["withdraw", amount] if float(amount) > 0:     # guard: extra condition
            return f"withdrawal of {float(amount):.2f}"
        case ["balance"] | ["solde"]:                         # several patterns
            return "showing the balance"
        case []:
            return "empty command"
        case _:                                               # everything else
            return "unknown command"

for c in ["deposit 50", "withdraw 20", "solde", "", "dance"]:
    print(repr(c), "→", execute(c))
```

### Working as a team

- **Peer reviewing**: all code is reviewed by another member before being merged, to catch bugs early, enforce guidelines, improve quality and **spread the knowledge** of the code. A variant: **pair programming**, two people at the same screen.
- **Version control** (git, mercurial): everyone keeps the code up to date, you can browse the history, go back to a previous version, create **branches**. Beyond the scope of the course, but essential as soon as several people work together.

### Organising a project's files

Do not put the whole project in a single file: a big module is unreadable, several people edit it at the same time and nothing is reusable. Split it into **modules** (files) and **packages** (folders containing an `__init__.py`):

```text
project/
├── README.md             # what the project does, how to run it
├── requirements.txt      # dependencies: pip install -r requirements.txt
├── resources/config.yml
├── tests/                # unit tests
└── vending_machine/      # the main package
    ├── __init__.py
    ├── app.py
    ├── core/
    │   ├── __init__.py
    │   └── machine.py
    ├── analysis/
    │   ├── __init__.py
    │   ├── http_client.py
    │   └── log_parser.py
    └── www/templates/machine.html
```

Always run the interpreter from the **root** of the project, with the module option: `python -m vending_machine.app`. In `app.py` you then import `from vending_machine.core import machine`, and use `machine.VendingMachine(…)`.

> 🎯 **Key points**: `argparse` (`add_argument`, `type`, `default`, `action="store_true"`, `parse_args`); `import this`; PEP 8: `snake_case`, `CapWords`, `UPPER_CASE`, 4 spaces; Args / Returns / Raises docstrings; hints `x: int -> float`; `match` / `case`; reviews, git; packages with `__init__.py`, README and requirements.txt, `python -m`.
