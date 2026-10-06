### Automatic (implicit) conversions

Python converts on its own when there is no risk of loss: a computation mixing `int` and `float` gives a `float`. Booleans behave like `1` and `0`.

```python
print(3 + 2.0)        # 5.0 (float)
print(True + True)    # 2
print(10 / 5)         # 2.0: the / division always gives a float
```

### Explicit conversions

The name of a type acts as a **conversion operator**: if the conversion makes sense, it is performed.

| Function | Converts to | Examples |
|---|---|---|
| `int(x)` | integer (always in base 10) | `int("42")` → `42` · `int(3.99)` → `3` (truncation!) |
| `float(x)` | floating-point number | `float("3.5")` → `3.5` · `float(2)` → `2.0` |
| `str(x)` | text | `str(42)` → `"42"` |
| `bool(x)` | boolean | `bool(0)` → `False` · `bool("abc")` → `True` |
| `round(x, n)` | rounded to `n` decimals | `round(3.14159, 2)` → `3.14` |
| `list(x)`, `tuple(x)` | list, tuple (module 4) | `list("abc")` → `['a', 'b', 'c']` |

```python
text = "42"
number = int(text)
print(text * 2, "vs", number * 2)    # 4242 vs 84
print("Score: " + str(number))       # str() to concatenate
print(int(7.9), round(7.9))          # 7 vs 8
```

> ⚠️ **Classic errors**
> - `"42" + 1` → `TypeError`: you cannot add text and a number.
> - `int("3.5")` → `ValueError`: go through `float` first, `int(float("3.5"))`.
> - `int("abc")` → `ValueError`: it is not a base-10 number…
> - `round(2.5)` gives `2`: Python rounds “.5” to the nearest **even** number (banker's rounding).

### Number bases and character codes

`int(text, base)` reads a number written in another base; `bin`, `oct` and `hex` write an integer in base 2, 8 and 16. Each character has a **code** (Unicode, which extends ASCII): `ord(c)` gives the code of character `c`, `chr(i)` the character with code `i`.

```python
a = int("1234")
print(a)
a = int("abc", 16)              # "abc" read in hexadecimal: 10×256 + 11×16 + 12
print(a)
print(bin(10), oct(64), hex(255), int("1010", 2))

l = list("abc")
print(l)
codes = [ord(c) for c in l]     # ord(c): code of character c
print(codes)
s = "".join([chr(i) for i in codes])   # chr(i): character with code i
print(s, chr(ord("a") + 1), ord("é"))
```

> ⚠️ **Beware of text representations**: `str()` of a tuple, a list or a dictionary returns the **text printed** by `print`, brackets and quotes included. It is not the same as gluing the elements together!

```python
t = tuple("abc")
print(t)
s = str(("a", "b", "c"))
print(s, len(s))                 # "('a', 'b', 'c')": 15 characters
print(str(["a", "b", "c"]), str({"a": 1, "b": 2}))
print("".join(t))                # "abc": probably what you wanted
```

### True or false? (truthiness)

Any value can be interpreted as a boolean. Considered **false**: `0`, `0.0`, `""` (empty string), `None`, and empty collections (`[]`, `{}`…). Everything else is true, including `"0"` and `"False"`!

```python
print(bool(0), bool(42), bool(-3.5), bool(0.0))     # False True True False
print(bool(""), bool(" "), bool("0"), bool("False")) # False True True True
print(bool(None), bool([]), bool([0]))               # False False True
```

### Reading user input with `input()`

`input("question")` displays the question, waits for an input and **always returns a string (`str`)**. You must therefore convert it to compute.

> 💡 On this site, the typed values go in the **Inputs (stdin)** box, one per line: each call to `input()` reads the next line.

```python stdin=25
age_text = input("How old are you? ")
print(type(age_text))           # <class 'str'>
age = int(age_text)
print("In 10 years, you will be", age + 10)
```

> 🎯 **Key points**: `input()` returns text; convert with `int()`, `float()`, `str()`; `int()` truncates, `round()` rounds; `int(s, base)`, `bin`, `hex`, `ord`, `chr`; `str()` of a container gives its display; only “empty” or zero values are false.
