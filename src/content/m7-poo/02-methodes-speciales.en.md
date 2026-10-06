### Methods called “behind the scenes”

**Special methods** (or *dunder methods*, for *double underscore*) have a name surrounded by two underscores. You almost never call them directly: Python triggers them at **specific moments**. `__init__` is one of them: it is called at instantiation.

| You write… | Python calls… | Purpose |
|---|---|---|
| `Dog("Fido")` | `__init__(self, …)` | initialise the object |
| `print(d)`, `str(d)`, f-string | `__str__(self)` | readable text for the user |
| `d` in the console, in a list | `__repr__(self)` | representation for the developer |
| `a == b` | `__eq__(self, other)` | **value** equality |
| `a < b`, `sorted(...)` | `__lt__(self, other)` | comparison, sorting |
| `a + b` | `__add__(self, other)` | addition |
| `len(obj)` | `__len__(self)` | length |
| `obj[i]` / `obj[i] = v` | `__getitem__` / `__setitem__` | square-bracket access |
| `x in obj` | `__contains__(self, x)` | membership test |
| `obj(x)` | `__call__(self, x)` | object callable like a function |

### `__str__` and `__repr__`: displaying an object

```python
class Dog:
    def __init__(self, name, age=0):
        self.name = name
        self.age = age

    def __str__(self) -> str:
        return f"Dog(name={self.name}, age={self.age})"

    def __repr__(self) -> str:
        return f"Dog({self.name!r}, {self.age})"


d = Dog("Fido", 3)
print(d)                 # calls __str__
print([d, Dog("Rex")])   # a list displays the __repr__ of its elements
```

Without `__str__`, `print(d)` displays something like `<__main__.Dog object at 0x7f…>`: the class name and the memory address.

### `__eq__`: identity or equality?

By default, `a == b` compares **identities** (like `a is b`): two objects created separately are different, even with the same attributes. To compare **values**, define `__eq__`:

```python
class Point2D:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __eq__(self, other):
        return isinstance(other, Point2D) and (self.x, self.y) == (other.x, other.y)


p, q = Point2D(1, 2), Point2D(1, 2)
print(p == q, p is q, id(p) == id(q))   # True False False
```

### `__getitem__` and `__setitem__`: using square brackets

```python
class Building:
    def __init__(self, floors):
        self._floors = [None] * floors

    def __setitem__(self, floor_number, data):
        self._floors[floor_number] = data

    def __getitem__(self, floor_number):
        return self._floors[floor_number]

    def __len__(self):
        return len(self._floors)


building = Building(4)
building[0] = "Reception"      # __setitem__
building[2] = "DEF Inc"
print(building[2], len(building))
```

Compare with a version without special methods: `building.occupy(2, "DEF Inc")` then `building.get_floor_data(2)`. Square brackets make the object as natural as a list.

### `__call__`: an object you call like a function

```python
class Dog:
    def __init__(self, name):
        self.name = name

    def __call__(self, name):
        if name == self.name:
            print(f"{self.name} says woof!")
        else:
            print(f"{self.name} ignores it")


d = Dog("Fido")
d("Fido")      # calls d.__call__("Fido")
d("Rex")
print(callable(d))
```

A callable object can replace a function anywhere (GUI callbacks, the function given to the dichotomy…), while **keeping a state** in its attributes.

### Operator overloading

```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)   # a NEW object

    def __mul__(self, k):
        return Vector(self.x * k, self.y * k)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"


print(Vector(1, 2) + Vector(3, 4), Vector(1, 2) * 3)
```

> 💡 `dir(obj)` lists all its members, including inherited special methods: try `dir(3)` or `dir([])`.

> ⚠️ An operator like `+` should usually **return a new object** without modifying the operands: `a + b` must not change `a`.

> 🎯 **Key points**: `__init__` (creation), `__str__`/`__repr__` (display), `__eq__`/`__lt__` (comparison), `__add__`… (operators), `__len__`, `__getitem__`/`__setitem__` (square brackets), `__call__` (call like a function).
