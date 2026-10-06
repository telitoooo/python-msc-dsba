### Building a list in one line

A **list comprehension** builds a new list from an existing sequence, in a concise and readable way.

```python
# Classic loop version
squares = []
for x in range(1, 6):
    squares.append(x ** 2)
print(squares)

# Comprehension version: same result
squares = [x ** 2 for x in range(1, 6)]
print(squares)
```

The syntax reads almost like a sentence: `[expression for element in sequence]` → “the expression, for each element of the sequence”.

### Filtering with `if`

```python
numbers = [5, 12, 7, 20, 3, 18]
even = [n for n in numbers if n % 2 == 0]
big_doubled = [n * 2 for n in numbers if n > 10]
print(even, big_doubled)

words = ["data", "AI", "python", "SQL"]
print([w.lower() for w in words if len(w) > 2])
```

### Transforming with `if ... else`

To **choose a value** (rather than filter), the conditional expression goes **before** the `for`:

```python
grades = [8, 15, 11, 6]
results = ["passed" if g >= 10 else "failed" for g in grades]
print(results)
```

> ⚠️ Position of the `if`: **at the end** it **filters** (`[x for x in l if cond]`); **at the beginning** with an `else` it **transforms** each element (`[a if cond else b for x in l]`).

### Dictionary and set comprehensions

```python
words = ["data", "python", "ai", "pandas"]

lengths = {word: len(word) for word in words}        # dict
initials = {word[0] for word in words}                # set
print(lengths)
print(sorted(initials))

prices = {"coffee": 2.5, "tea": 2.0, "juice": 3.5}
prices_with_tax = {product: round(p * 1.1, 2) for product, p in prices.items()}
print(prices_with_tax)
```

The course even builds a dictionary from **two** loops: one key per `(i, j)` pair:

```python
a = [1, 2, 3, 4]
b = [5, 6, 7]
dct = {(i, j): i * j for i in a for j in b}
print(dct)          # {(1, 5): 5, (1, 6): 6, …, (4, 7): 28}
```

A more complex example: completing a distance table given in one direction only (if `y` is not in `dists[x]`, look in `dists[y]`, otherwise `None`):

```python
dists = {"A": {"B": 140, "E": 200, "F": 200}, "B": {"C": 260, "F": 140},
         "C": {"D": 360}, "D": {"F": 280}, "E": {"F": 120}, "F": {}}
d_complete = {x: {y: dists[x][y] if y in dists[x]
                     else dists[y][x] if x in dists[y]
                     else None
                  for y in dists.keys()}
              for x in dists.keys()}
print(d_complete["F"])
```

### Nested comprehensions

```python
matrix = [[1, 2, 3], [4, 5, 6]]

flat = [x for row in matrix for x in row]    # same order as two nested for loops
print(flat)

table = [[i * j for j in range(1, 4)] for i in range(1, 4)]
print(table)
```

### Generator expressions

With **parentheses** (or without brackets, inside a function call), you get a *generator expression*: values are produced one at a time, without creating an intermediate list. A generator is meant to be **consumed** (by a loop, `sum`, `tuple()`…): printing it directly does not show its values.

```python
t = (1.12, 2.34, 3.45, 4.56, 5.67)
i = (int(x) for x in t)
print(i)              # <generator object <genexpr> at 0x…>
print(tuple(i))       # (1, 2, 3, 4, 5): it must be converted to be printed
```

```python
print(sum(x ** 2 for x in range(1, 11)))     # sum of the squares from 1 to 10
print(max(len(w) for w in ["a", "abc", "ab"]))
print(any(n < 0 for n in [3, -1, 4]))        # at least one negative?
```

> 💡 **Readability first**: if a comprehension does not fit on one line or becomes hard to read, go back to a classic loop.

> 🎯 **Key points**: `[expr for x in seq if cond]`; `{k: v for ...}` for a dict; `{expr for ...}` for a set; final `if` = filter, initial `a if c else b` = transformation; `(…)` = generator, to be consumed.
