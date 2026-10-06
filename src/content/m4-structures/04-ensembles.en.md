### A collection without duplicates

A **set** is an **unordered** collection of **unique** elements. As in maths, you can compute unions, intersections and differences.

```python
languages = {"Python", "SQL", "R", "Python"}
print(languages)               # the duplicate is gone (unpredictable order)
print(len(languages), "SQL" in languages)

cities = ["Paris", "Lyon", "Paris", "Nice", "Lyon"]
unique = set(cities)           # deduplicating a list
print(sorted(unique))          # sorted → sorted list, stable display
```

> ⚠️ `{}` creates an **empty dictionary**, not a set! The empty set is written `set()`.

Two ways to see a set: the **mathematical concept** (no duplicates), or a **dictionary with keys only** (keys are unique). A set can replace a list when the order does not matter.

```python
ingredients1 = {"flour", "water", "salt", "yeast"}
ingredients2 = set(["water", "salt", "flour", "yeast"])
print(ingredients1 == ingredients2)        # True: order does not matter

x = set("abc")
y = set("aeiou")
print(sorted(x | y), sorted(x & y), sorted(x - y), x <= y)
```

### Adding and removing

```python
skills = set()
skills.add("Python")
skills.add("SQL")
skills.add("Python")      # already there: no effect
skills.discard("Excel")   # removes if present, without error
skills.remove("SQL")      # removes, but KeyError if absent
print(skills)
```

### Set operations

| Operation | Operator | Method | Contains… |
|---|---|---|---|
| Union | `a \| b` | `a.union(b)` | the elements of `a` **or** `b` |
| Intersection | `a & b` | `a.intersection(b)` | the elements of `a` **and** `b` |
| Difference | `a - b` | `a.difference(b)` | the elements of `a` **except** those of `b` |
| Symmetric difference | `a ^ b` | `a.symmetric_difference(b)` | the elements of **only one** of them |
| Inclusion | `a <= b` | `a.issubset(b)` | `True` if all of `a` is in `b` |

```python
python = {"Ada", "Alan", "Grace", "Linus"}
sql = {"Grace", "Linus", "Margaret"}

print("Both        :", sorted(python & sql))
print("At least one:", sorted(python | sql))
print("Python only :", sorted(python - sql))
print("Only one    :", sorted(python ^ sql))
print({"Ada", "Alan"} <= python)
```

### When to use a set?

- **Deduplicate** values: `set(list)`;
- **Test membership** very quickly (`x in big_set` is almost instantaneous, even with millions of elements, unlike a list);
- **Compare** two collections: common, missing, new elements…

> ⚠️ A set has **no order** nor indices (`s[0]` is impossible), and its elements must be immutable (no list in a set). For a reproducible display, use `sorted(s)`.

> 🎯 **Key points**: `set()` = unique elements, no order; `|`, `&`, `-`, `^` to combine; `set(list)` to deduplicate; `in` is very fast.
