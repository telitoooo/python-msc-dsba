### A variable is a label

A **variable** binds a **name** to a **value**. It is created with the assignment operator `=`: the value on the right (an **expression**, built from constants, variables and operators) is computed, then stored under the name on the left.

```python
age = 22
first_name = "Ada"
print(first_name, "is", age)

age = age + 1      # rebinding: the expression age + 1 evaluates to 23, then age refers to 23
print("One year later:", age)
```

> ⚠️ **`=` is not a mathematical equality.** `age = age + 1` means: “compute `age + 1`, then store the result in `age`”. To *compare* two values, use `==`. By rebinding its variables, the program makes its **state evolve**.

### Elementary types

Python guesses the type from the value: no need to declare variables, **typing is dynamic** (implicit). The `type()` function returns the type of any object.

| Type | Name | Examples | Typical use |
|---|---|---|---|
| `int` | integer (**unlimited** precision) | `42`, `-7`, `1_000_000`, `2 ** 100` | counts, indices |
| `float` | floating-point number (64 bits, ~15 significant digits, up to ±1.8 × 10³⁰⁸) | `3.14`, `-0.5`, `2e3` | measures, means |
| `complex` | complex number (pair of `float`s) | `3 + 4j`, `complex(1, -2)` | scientific computing |
| `bool` | boolean | `True`, `False` | result of a test |
| `str` | string of characters | `"Python"`, `'DSBA'` | text |
| `NoneType` | “nothing”: a single value | `None` | absence of value |

```python
height = 1.78
is_student = True
program = "MSc DSBA"
z = 3 + 4j

print(type(height), type(is_student), type(program), type(z), type(None))
print(type(10), type(10.0), type("10"))   # three different types!
print(2 ** 100)                           # integers have no limit
```

> 💡 **Tip**: the decimal separator is the **dot** (`1.78`), never the comma. `1,78` creates… a tuple of two integers (see module 4).

### Dynamic typing and *duck typing*

The same variable can successively refer to values of different types:

```python
a = 3
print(a, type(a))
a = "foobar"
print(a, type(a))
a = "3.0"
print(float(a) + 1)       # convert when needed
```

In Python, what matters is not what an object **is** (its declared type), but what it **can do**: this is ***duck typing*** (“if it walks like a duck and it quacks like a duck, then it must be a duck”). For instance, `len()` works with any object that has a length: string, list, dictionary…

```python
for obj in ["duck", [1, 2, 3], {"a": 1}]:
    print(type(obj).__name__, "→", len(obj))
```

### Naming variables well

- Letters, digits and `_` only, **not starting with a digit**: `grade_1` ✅ `1st_grade` ❌
- Python is case-sensitive: `Age` and `age` are two different variables.
- Python convention: **snake_case** (`unit_price`, `nb_students`).
- Prefer explicit names: `class_average` rather than `m`.
- Reserved words (`if`, `for`, `def`, `True`…) are forbidden.

### Multiple assignment

```python
x, y = 3, 4          # two assignments in a single line
print("x =", x, "and y =", y)

x, y = y, x          # swapping values, without a temporary variable
print("after the swap: x =", x, "and y =", y)

a = b = 0            # same value for two variables
print(a, b)
```

### Identity: `id()` and `is`

Every object has an **identity**, a unique integer constant over its whole lifetime, returned by `id()`. The `is` operator tests whether two names refer to **the same object** (same `id`), whereas `==` tests whether two values are **equal**. This distinction will be essential with lists and objects (module 6).

```python
a = 3
c = a
print(id(a), id(c), a is c)     # c refers to the same object as a
b = [1, 2]
d = [1, 2]
print(b == d, b is d)           # True False
print(None is None, type(None))
```

> 💡 To test whether a variable is `None`, write `x is None` (not `x == None`).

### The special value `None`

`None` represents **the absence of a value** (its type is `NoneType`, a “singleton”: there is only one `None` value). You will meet it often, for instance as the result of a function that returns nothing (module 3).

> ⚠️ A variable must exist **before** being used. Otherwise Python stops with `NameError: name '...' is not defined`. Also check the spelling: `Name` ≠ `name`.

> 🎯 **Key points**: `name = value` creates or replaces a variable; dynamic typing and *duck typing*; `type(x)` gives the type; elementary types: `int`, `float`, `complex`, `bool`, `str` and `None`; `id()` and `is` for identity, `==` for equality.
