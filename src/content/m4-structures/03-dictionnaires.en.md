### Mapping keys to values

A **dictionary** (`dict`) maps unique **keys** to **values**. Access is no longer by position but by key: ideal to describe an object or build a lookup table.

```python
student = {"name": "Ada", "age": 22, "languages": ["Python", "SQL"]}

print(student["name"])                          # access by key
print(student.get("email", "not provided"))     # default value if the key is missing

student["age"] = 23                  # modify
student["email"] = "ada@example.com" # add a new key
del student["languages"]             # delete
print(student)
print("age" in student, len(student))           # in tests the KEYS
```

> ⚠️ `d["missing_key"]` raises a `KeyError`. Use `d.get(key, default)` or test `key in d` first.

### Looping over a dictionary

```python
stock = {"apples": 10, "bananas": 5, "kiwis": 8}

for fruit in stock:                    # loops over the keys
    print(fruit)

for quantity in stock.values():        # the values
    print(quantity)

for fruit, quantity in stock.items():  # the (key, value) pairs
    print(f"{fruit:<8}: {quantity}")

print(sum(stock.values()))
```

### Useful methods

| Method | Effect |
|---|---|
| `d.get(k, default)` | value of `k`, or `default` if missing |
| `d.keys()` / `d.values()` / `d.items()` | views on the keys / values / pairs |
| `d.pop(k)` | removes `k` and returns its value |
| `d.update(other)` | merges another dictionary |
| `d.setdefault(k, v)` | returns `d[k]`, creating it with `v` if it does not exist |

### The “count” pattern

Counting occurrences is the number one use of dictionaries in data analysis:

```python
text = "abracadabra"
count = {}
for letter in text:
    count[letter] = count.get(letter, 0) + 1
print(count)

most_frequent = max(count, key=count.get)      # key with the maximum value
print("Most frequent letter:", most_frequent)
```

### The “group” pattern

```python
people = [("Ada", "London"), ("Alan", "London"), ("Marie", "Paris")]
by_city = {}
for name, city in people:
    if city not in by_city:
        by_city[city] = []
    by_city[city].append(name)
print(by_city)
```

### Which keys?

A dictionary is an extension of lists: a list maps an **integer** (the position) to an element, a dictionary maps **any key** to an element (so there is no contiguity any more). Keys are **unique** and must be **immutable**: `str`, `int`, `float`, `bool`, `tuple`… but not lists. Why? Accessing a dictionary is very fast because Python stores each pair according to the **hash** of its key (`hash()`, not to be confused with `id()`): if a key could change, it could no longer be found.

```python
print(hash(3), hash("3"), hash((1, 2)))
try:
    hash([1, 2])
except TypeError as e:
    print("TypeError:", e)                  # unhashable type: 'list'

distances = {}                              # tuples as keys: allowed
distances[("A", "B")] = 100
distances[("A", "C")] = 200
distances[("B", "C")] = 150
print(distances[("A", "C")])

stock = {"apple": 20, "orange": 30, "banana": 10}
stock["orange"] -= 8                        # modify a value in place
print(stock)
```

Values, on the other hand, can be anything, including lists or other dictionaries (a structure close to JSON). The course's map of France nests **three levels** of dictionaries:

```python
france = {
    "La Baule-Escoublac": {"coords": (356, 638), "next": {"Saint-Nazaire": 15, "Guerande": 6}},
    "Saint-Nazaire": {"coords": (484, 563), "next": {"La Baule-Escoublac": 15, "Nantes": 63}},
}
print(france["Saint-Nazaire"]["next"]["Nantes"])     # 63 km
for city, info in france.items():
    print(city, info["coords"], sorted(info["next"]))
```

> 💡 A list of dictionaries sharing the same keys is exactly a data table: `pandas.DataFrame(list_of_dicts)` turns it into a table.

> 🎯 **Key points**: `{key: value}`; access `d[k]` or `d.get(k, default)`; loop with `.items()`; `d[k] = d.get(k, 0) + 1` to count; keys must be immutable (hashable); dictionaries can be nested.
