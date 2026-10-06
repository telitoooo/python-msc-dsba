### Syntax errors and exceptions

- A **syntax error** (`SyntaxError`, `IndentationError`) prevents the program from starting: Python does not understand the text.
- An **exception** occurs **during execution**: the code is correct, but an operation fails (missing file, division by zero, impossible conversion…). If nobody catches it, the program stops and displays a *traceback*.

| Exception | Typical case |
|---|---|
| `ValueError` | right type, wrong value: `int("abc")` |
| `TypeError` | wrong type: `"3" + 1` |
| `ZeroDivisionError` | `4 / 0` |
| `KeyError` / `IndexError` | missing key / index out of range |
| `FileNotFoundError` | `open("missing.txt")` |
| `Exception` | the “mother” of almost all exceptions |

### `try` / `except`: catching an exception

```python
def inverse(x):
    try:
        return 1 / x
    except ZeroDivisionError:
        print("Cannot divide by zero")
        return None

print(inverse(4))
print(inverse(0))
```

You can have **several `except`** clauses, and get the exception object with `as` to display its message:

```python
for text in ["42", "abc", "0"]:
    try:
        value = 100 / int(text)
    except ValueError as e:
        print(f"{text!r}: not an integer ({e})")
    except ZeroDivisionError:
        print(f"{text!r}: division by zero")
    else:                                   # only if no exception occurred
        print(f"{text!r}: 100 / {text} = {value}")
    finally:                                # always executed (clean-up)
        print("  -> value processed")
```

> ⚠️ **Catch specific exceptions.** An `except Exception:` (or worse, a bare `except:`) also catches your typos (`NameError`…) and hides real bugs. Keep it for cases where you display or log the error.

### The typical case: reading a file that may not exist

```python
import json

def load_config(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"{path} not found: default configuration")
        return {"theme": "light"}

print(load_config("config.json"))
```

> 💡 Python encourages the **EAFP** style (*Easier to Ask Forgiveness than Permission*): you try the operation and handle the failure, rather than checking everything beforehand (`if os.path.exists(...)`). It is safer: the file may disappear between the check and the opening.

### `raise`: signalling an error yourself

When a function receives invalid data, it should **raise an exception** with a clear message, rather than return a weird value (`None`, `-1`…).

```python
def square_root(x):
    if x < 0:
        raise ValueError(f"square root of a negative number: {x}")
    return x ** 0.5

print(square_root(9))
try:
    square_root(-4)
except ValueError as e:
    print("Error:", e)
```

### Creating your own exceptions

A custom exception is declared in one line (classes will be detailed in a later session):

```python
class InsufficientFunds(Exception):
    """Raised when a withdrawal exceeds the balance."""

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFunds(f"balance {balance} €, withdrawal requested {amount} €")
    return balance - amount

try:
    withdraw(50, 80)
except InsufficientFunds as e:
    print("Refused:", e)
```

> 🎯 **Key points**: `try` / `except ErrorType as e` / `else` / `finally`; catch specific exceptions; `raise ValueError("message")` to signal invalid data; `class MyError(Exception): pass` to create your own.
