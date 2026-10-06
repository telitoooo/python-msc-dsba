### Why data structures?

To work on data, you must load them and **store them in memory** (RAM). There are several **data structures**, with different properties; the most important ones are the **cost of a lookup** (retrieving an element), the **cost of an insertion** (storing one) and the **internal organisation** of the data. Choosing your structure wisely is fundamental: for **efficiency**, **reusability**, and because it reflects our understanding of the problem (abstraction). Python's basic structures are **lists**, **tuples**, **dictionaries** and **sets**.

### Creating and reading a list

A **list** is an **ordered**, **mutable** sequence of values, written between square brackets. It can mix types (even if, in practice, it usually holds elements of the same kind).

```python
grades = [12, 15.5, 9, 17]
empty = []
mixed = ["Ada", 36, True]

print(grades[0], grades[-1])   # indexing: like strings
print(grades[1:3])             # slicing: [15.5, 9]
print(len(grades), 15.5 in grades)
```

Unlike strings, a list is **mutable**: its elements can be modified in place, and it can **grow**.

```python
users = ["John", "Paul", "George", "Ringo"]
print(users[0], users[-1])     # the first, the last
users[0] = "Andrew"            # overwriting an element
stuff = ["a", 1, 2.3, True, [1, 2, 3], (1, 2, 3), {"a": 1, "b": 2}]   # heterogeneous
print(["a"] * 5)               # repetition with *
users = users + ["Mick", "Keith"]   # concatenation with +
print(users, len(stuff))
```

> 💡 **Question from the course**: with `users = ['John', 'Paul', 'George', 'Ringo']`, what is `len(users)` after `users.append(['Mick', 'Keith'])`? Answer: **5** — `append` adds **one single** element, here a list. To add two elements you need `extend` (or `+`).

### Essential methods

| Method | Effect |
|---|---|
| `l.append(x)` | adds `x` at the end |
| `l.extend([x, y])` | adds several elements at the end |
| `l.insert(i, x)` | inserts `x` at index `i` |
| `l.remove(x)` | removes the **first** occurrence of `x` (error if absent) |
| `l.pop()` / `l.pop(i)` | removes and **returns** the last element / the one at index `i` |
| `l.index(x)` | index of the first occurrence of `x` |
| `l.count(x)` | number of occurrences of `x` |
| `l.sort()` / `l.reverse()` | sorts / reverses **in place** |
| `l.copy()` | returns a (shallow) copy |

```python
shopping = ["bread", "milk"]
shopping.append("eggs")
shopping.insert(0, "coffee")
shopping.extend(["rice", "tea"])
print(shopping)

last = shopping.pop()
shopping.remove("milk")
print(shopping, "| removed:", last)
```

### Useful functions on lists

```python
values = [4, 1, 9, 3]
print(len(values), sum(values), min(values), max(values))
print(sorted(values))                  # new sorted list
print(sorted(values, reverse=True))    # decreasing order
print(values)                          # the original has not changed
```

> ⚠️ **`sorted(l)` vs `l.sort()`**: `sorted` returns a *new* list; `.sort()` modifies the list *in place* and returns `None`. Writing `l = l.sort()` therefore replaces your list with `None`!

### Looping over a list

```python
fruits = ["apple", "kiwi", "mango"]

for fruit in fruits:                       # the most common
    print(fruit.upper())

for i, fruit in enumerate(fruits):         # with the index
    print(i, fruit)

result = []                                # building a new list
for fruit in fruits:
    if len(fruit) > 4:
        result.append(fruit)
print(result)
```

### Slicing in detail

Slicing `l[start:stop:step]` works as for strings (default values: `start = 0`, `stop` = the length, `step = 1`; negative indices allowed). But since a list is mutable, you can also **replace or remove a slice**:

```python
l = list(range(11))
print(l[2], l[2:5], l[::2])          # 2 [2, 3, 4] [0, 2, 4, 6, 8, 10]
print(l[6::-1])                      # right to left: [6, 5, 4, 3, 2, 1, 0]

l[2:5] = [20, 30]                    # replace a segment (different sizes: OK)
print(l)                             # [0, 1, 20, 30, 5, 6, 7, 8, 9, 10]
l[2:5] = []                          # remove elements
print(l)                             # [0, 1, 6, 7, 8, 9, 10]
l[::2] = ["a", "b", "c", "d"]        # "extended" slice: the replacement must have THE SAME size
print(l)                             # ['a', 1, 'b', 7, 'c', 9, 'd']
```

Three ways to **reverse** a list: `l[::-1]` (new list), `list(reversed(l))` (new list), `l.reverse()` (in place).

### The alias trap

`b = a` does **not** copy the list: `a` and `b` are two names for **the same object**.

```python
a = [1, 2, 3]
b = a            # alias: same list
b.append(4)
print(a)         # [1, 2, 3, 4]!

c = a.copy()     # real copy (or a[:] or list(a))
c.append(5)
print(a, c)
```

### Strings ↔ lists

```python
sentence = "Python for data science"
words = sentence.split()       # splits on spaces
print(words)
print("-".join(words))         # glues back with a separator
print(list("abc"))             # ['a', 'b', 'c']
```

> 🎯 **Key points**: lists are ordered and mutable; `append`, `pop`, `remove`, `sort`…; `*` repeats, `+` concatenates; slices can be replaced or removed; `sorted()` returns a new list; `b = a` creates an alias, `a.copy()` a copy.
