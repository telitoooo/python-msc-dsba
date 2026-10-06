### What is serialisation?

A text file only contains characters. To **save a Python structure** (dictionary of lists, map, game state…) and **load it back identically**, it must be turned into a sequence of bytes: this is **serialisation**. The reverse operation is **deserialisation**.

| Format | File | Human-readable | Other languages | Accepted objects |
|---|---|---|---|---|
| **JSON** | text | yes | yes (web standard) | dict, list, str, numbers, bool, None |
| **pickle** | binary | no | no (Python only) | almost every Python object |
| HDF5 | binary | no | yes | large numerical arrays |

### JSON: the universal exchange format

```python
import json

data = {
    "president": {"name": "Zaphod Beeblebrox", "species": "Betelgeusian"},
    "members": ["Ford", "Arthur", "Trillian"],
    "active": True,
    "budget": None,
}

with open("crew.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)   # indent: readable; ensure_ascii=False: accents

with open("crew.json", encoding="utf-8") as f:
    reloaded = json.load(f)

print(reloaded == data)
with open("crew.json", encoding="utf-8") as f:
    print(f.read())
```

To work with **strings** rather than files: `json.dumps(obj)` (*dump string*) and `json.loads(text)`.

> ⚠️ **JSON does not know every Python type**: a `tuple` comes back as a `list`, **dictionary keys become strings** (`{1: "a"}` → `{"1": "a"}`), and a `set` raises a `TypeError`. Remember to convert back after loading.

```python
import json

print(json.loads(json.dumps((3, 4))))         # [3, 4]: the tuple became a list
print(json.loads(json.dumps({1: "one"})))     # {'1': 'one'}: key converted to str
try:
    json.dumps({1, 2, 3})
except TypeError as e:
    print("Error:", e)
```

JSON is however **extendable**: the `default` parameter tells how to convert an object that JSON does not know.

```python
import json

print(json.dumps({"tags": {"python", "data"}}, default=sorted))   # a set becomes a sorted list
```

### pickle: saving (almost) any Python object

```python
import pickle

state = {"player": "Ada", "position": (3, 4), "inventory": {"sword", "map"}}

with open("game.pickle", "wb") as f:       # "wb": binary is mandatory!
    pickle.dump(state, f)

with open("game.pickle", "rb") as f:
    rebuilt = pickle.load(f)

print(rebuilt == state, type(rebuilt["position"]), type(rebuilt["inventory"]))
```

pickle can even serialise **functions** (by remembering their name, so they must still exist when loading):

```python
import math, pickle

data = pickle.dumps([math.sqrt, len])       # dumps: to a byte string
f_sqrt, f_len = pickle.loads(data)
print(f_sqrt(16), f_len("abc"))
```

> 💡 **HDF5** is a binary format independent of Python, designed for large volumes of numerical data (NumPy arrays, DataFrames). It is used through the `h5py` or `pandas` packages (`df.to_hdf(...)`), to be installed with `pip`.

> ⚠️ **Never deserialise a pickle of unknown origin**: `pickle.load` can execute arbitrary code. To exchange data with other people or other programs, prefer JSON.

### Which one to choose?

- **JSON** for simple data to **share**, archive or read by eye (configuration, web APIs, export).
- **pickle** to quickly **cache** complex Python objects that only your program will read again.

> 🎯 **Key points**: `json.dump(obj, f)` / `json.load(f)` in text mode; `pickle.dump(obj, f)` / `pickle.load(f)` in **binary** mode (`"wb"`, `"rb"`); JSON transforms tuples and keys, and rejects `set`s.
