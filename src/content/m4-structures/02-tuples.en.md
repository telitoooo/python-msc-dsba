### An unmodifiable sequence

A **tuple** looks like a list, but it is **immutable**: once created, you can neither add, remove nor modify an element. It is written with parentheses (often optional).

```python
point = (3, 4)
colour = 255, 128, 0            # parentheses are optional
singleton = (42,)               # one-element tuple: the comma is mandatory!
not_a_tuple = (42)              # this is just the integer 42

print(point[0], len(colour), type(singleton), type(not_a_tuple))
```

> ⚠️ `point[0] = 10` raises a `TypeError`: tuples have no `append`, `remove` or `sort`. Only `count()` and `index()` exist.

A tuple is more an **aggregate** than a sequence: its “domain” is the Cartesian product of other data (a point = an x **and** a y), atomic or structured. It has a **fixed** number of coordinates and cannot be extended… but you can **create a new tuple** by concatenation, and you can slice it.

```python
a = (5, 10, 15, 20)
b = (25, 30, 35, 40)
c = a + b                       # a NEW tuple
print(c, len(c), c[2:5])
```

### List or tuple?

| | List `[...]` | Tuple `(...)` |
|---|---|---|
| Mutable | yes | no |
| Typical use | collection that evolves (basket, results…) | fixed record (coordinates, date, data row) |
| Dictionary key | impossible | possible |

### Unpacking

You can spread the elements of a tuple (or a list) into several variables in one line. This is what makes the swap `a, b = b, a` possible (parallel assignment).

```python
point = (3, 4)
x, y = point
print("x =", x, "y =", y)

first_name, last_name, age = ("Grace", "Hopper", 85)
print(f"{first_name} {last_name}, {age}")

first, *rest = [10, 20, 30, 40]     # * collects "the rest" into a list
print(first, rest)
*start, last = [10, 20, 30, 40]
print(start, last)
```

### Returning several values from a function

```python
def min_max(values):
    return min(values), max(values)    # returns a tuple

low, high = min_max([12, 5, 19, 8])
print(low, high)
```

Pay attention to the **contract** of such a function: the course example computes the roots of a quadratic polynomial and returns `None` **or** a tuple. The caller has to handle both cases!

```python
def root_quadratic(a, b, c):
    d = b ** 2 - 4 * a * c
    if d < 0:
        return None
    elif d == 0:
        return (-b / (2 * a),)                      # a ONE-element tuple
    else:
        return (-b + d ** 0.5) / (2 * a), (-b - d ** 0.5) / (2 * a)

for coefs in [(1, 2, 1), (1, -3, 2), (1, 0, 1)]:
    roots = root_quadratic(*coefs)                  # * unpacks the tuple into 3 arguments
    if roots:
        print(f"Roots: {roots}")
    else:
        print("No roots")
```

### Tuples everywhere: `enumerate` and `zip`

`zip` pairs up the elements of several sequences, as tuples.

```python
names = ["Ada", "Alan", "Grace"]
grades = [17, 14, 19]

for name, grade in zip(names, grades):
    print(name, "→", grade)

print(list(zip(names, grades)))
```

### Sorting a list of tuples

By default, tuples are compared element by element. The `key` parameter lets you choose **the sorting criterion** thanks to a small anonymous `lambda` function.

```python
students = [("Ada", 17), ("Alan", 14), ("Grace", 19)]

print(sorted(students))                                      # by name
print(sorted(students, key=lambda s: s[1], reverse=True))    # by decreasing grade
print(sorted(students, key=lambda s: (-s[1], s[0])))         # grade ↓ then name ↑
```

> 💡 `lambda s: s[1]` is a tiny function equivalent to `def criterion(s): return s[1]`. It is widely used with `sorted`, `min`, `max`… and in pandas.

> 🎯 **Key points**: tuple = immutable sequence; `(x,)` for a single element; `+` creates a new tuple; unpacking `a, b = t` and `first, *rest = t`; `return a, b` returns a tuple (watch out for `None`); `sorted(..., key=lambda ...)` to sort on a criterion.
