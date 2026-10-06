### Creating strings

A string (`str`) is a **sequence of characters**. It is written between single quotes `'...'`, double quotes `"..."` or triple quotes `"""..."""` (over several lines).

```python
greeting = "Hello"
name = 'John'
long_string = """This is
quite a long
string"""
message1 = f"{greeting}, {name}!"            # formatting (f-string)
message2 = greeting + ", " + name + "!"      # concatenation
print(message1, message2, long_string, sep="\n")
```

### Escape sequences

How do you write a quote **inside** a string delimited by quotes? `text = "He said: "hi!""` is invalid! Use an **escape sequence**, introduced by the backslash `\`, or the other kind of quotes:

| Sequence | Meaning |
|---|---|
| `\"` / `\'` | double / single quote |
| `\n` | new line |
| `\t` | tab |
| `\\` | one backslash |

```python
text = "He said: \"hi!\""
text2 = 'He said: "hi!"'          # or: switch quotes
a = "line 1\nline 2"
b = "C:\\docs"                     # a single \ in the string
print(text, text2, a, b, sep="\n")
print(len(b))                      # 7: \\ counts as one character
print("Column A\tColumn B")
print(r"C:\docs\new")              # "raw" string (r): backslashes are not interpreted
```

### Basic operations

```python
first_name = "Ada"
print("Hello " + first_name)   # concatenation
print("=" * 20)                # repetition
print(len(first_name))         # length: 3
print("d" in first_name)       # membership: True
```

### Indexing and slicing

Each character has a **position** (index) starting at **0**. Negative indices start from the end.

```text
 P   y   t   h   o   n
 0   1   2   3   4   5
-6  -5  -4  -3  -2  -1
```

`s[start:stop:step]` extracts a substring: `start` is **included**, `stop` is **excluded**.

```python
word = "Python"
print(word[0], word[-1])   # P n
print(word[0:3])           # Pyt   (indices 0, 1, 2)
print(word[2:])            # thon  (until the end)
print(word[:2])            # Py    (from the start)
print(word[::2])           # Pto   (every other character)
print(word[::-1])          # nohtyP (reversed!)
```

> ⚠️ Strings are **immutable**: `word[0] = "J"` raises a `TypeError`. Create a new string instead: `word = "J" + word[1:]`.

### Functions and methods

A **function** receives **parameters** and produces a result, the **return value**: `len("Hello")` returns `5`. `print()` accepts several objects but returns nothing useful (`None`). A **method** is a function that belongs to a type of object (here `str`) and is called with a dot: `text.upper()`. A string method **returns a new string** without modifying the original.

| Method | Effect | Example → result |
|---|---|---|
| `upper()` / `lower()` | upper / lower case | `"Py".upper()` → `"PY"` |
| `title()` | Capital Letter For Each Word | `"ada lovelace".title()` → `"Ada Lovelace"` |
| `capitalize()` | first letter in upper case | `"python".capitalize()` → `"Python"` |
| `strip()` | removes spaces at both ends | `"  hi  ".strip()` → `"hi"` |
| `replace(a, b)` | replaces `a` with `b` | `"1,5".replace(",", ".")` → `"1.5"` |
| `find(x)` | position of `x` (or `-1`) | `"data".find("t")` → `2` |
| `count(x)` | number of occurrences | `"banana".count("a")` → `3` |
| `startswith(x)` / `endswith(x)` | starts / ends with `x`? | `"notes.txt".endswith(".txt")` → `True` |
| `isdigit()`, `isupper()`, `islower()` | only digits / upper case / lower case? | `"2024".isdigit()` → `True` |
| `split(sep)` | splits into a list | `"a b c".split(" ")` → `['a', 'b', 'c']` |
| `splitlines()` | splits into lines | `"l1\nl2".splitlines()` → `['l1', 'l2']` |
| `sep.join(list)` | glues a list of strings | `"-".join(["a", "b"])` → `"a-b"` |
| `center(n)`, `ljust(n)`, `rjust(n)` | centre / left-align / right-align on `n` characters | `"ok".center(6)` → `"  ok  "` |

```python
first_name = "john"
print(first_name.upper(), first_name.count("o"), first_name.replace("o", "@"))

raw = "   Data Science   "
clean = raw.strip()
print("[" + clean + "]", clean.lower())
print(raw)   # unchanged!

words = "Python for data science".split(" ")
print(words, "_".join(words))
print("line 1\nline 2\nline 3".splitlines())

for product, price in [("Keyboard", 49.9), ("Mouse", 19.5)]:
    print("|" + product.ljust(10) + "|" + str(price).rjust(7) + "|" + "OK".center(6) + "|")
```

### f-strings: easy formatting

Prefix the string with `f` and put expressions between braces. After `:` you can specify a format.

```python
name = "Grace"
average = 15.4567
nb = 1234567
print(f"{name} has an average of {average:.2f}/20")  # 2 decimals
print(f"Population: {nb:,} inhabitants")             # thousands separator
print(f"{name:>10}|{name:<10}|{name:^10}|")          # right, left, centre aligned
print(f"2 + 3 = {2 + 3}")                            # any expression
```

> 🎯 **Key points**: `"…"`, `'…'`, `"""…"""`; escapes `\"`, `\n`, `\t`, `\\`; indices start at 0, `s[start:stop]` excludes `stop`; methods return new strings (`strip`, `split`, `join`, `center`…); f-strings (`f"{x:.2f}"`) are the modern way to build text.
