### Variables, objects and identity

In Python, a variable is a **label stuck on an object**. Each object has an **identity** (its address in memory), given by `id()`.

- `a == b`: both objects have the **same value**;
- `a is b`: both names designate **the same object** (same `id`).

```python
a = [1, 2, 3]
b = a                  # b is an ALIAS: a second label on the same list
c = [1, 2, 3]          # another list, with the same value

print(a == b, a is b, id(a) == id(b))   # True True True
print(a == c, a is c)                    # True False
b.append(4)
print(a)                                 # [1, 2, 3, 4]: a has "changed" too!
```

### Mutable or immutable?

| Immutable (cannot be modified) | Mutable (modifiable in place) |
|---|---|
| `int`, `float`, `bool`, `str`, `tuple`, `None` | `list`, `dict`, `set` |

With an **immutable** object, aliasing is harmless: any “modification” creates a new object. With a **mutable** object, a modification through one name is visible through **all** its aliases.

### Shared elements stay shared

```python
a = ["foo", "bar"]
l = [a, a, a]          # three times THE SAME list
print(l)
l[1] = "bar"           # replaces the 2nd cell: the others do not move
print(l)
l[0][1] = "baz"        # modifies the list a… visible in every cell containing it
print(l)
```

For each cell to have its own list, you need **copies** (`copy` module):

```python
import copy

a = ["foo", "bar"]
l = [copy.copy(a) for i in range(3)]    # three distinct lists
l[1] = "bar"
l[0][1] = "baz"                          # only touches the first one
print(l)                                 # [['foo', 'baz'], 'bar', ['foo', 'bar']]
```

> ⚠️ It is the same trap as `[[0] * 3] * 3`: you get three references to **a single** row. Build each row separately instead: `[[0] * 3 for _ in range(3)]`.

### Passing a mutable object to a function

The parameter receives a reference to **the same object** as the argument. A function can therefore modify a list it receives… sometimes without the caller expecting it:

```python
def add_bonus(grades):
    for i in range(len(grades)):
        grades[i] += 1         # modifies the caller's list!

my_grades = [12, 15]
add_bonus(my_grades)
print(my_grades)               # [13, 16]

def with_bonus(grades):
    return [g + 1 for g in grades]  # side-effect-free version: new list

print(with_bonus(my_grades), my_grades)
```

### Copying: shallow or deep

| Operation | Result |
|---|---|
| `b = a` | no copy: an alias |
| `a.copy()`, `a[:]`, `list(a)`, `copy.copy(a)` | **shallow copy**: new outer list, but the elements are **shared** |
| `copy.deepcopy(a)` | **deep copy**: everything is duplicated recursively |

```python
import copy

old = [[1, 2, 3], [4, 5, 6]]
shallow = copy.copy(old)
deep = copy.deepcopy(old)

shallow[0][0] = 99              # touches a SHARED inner list
deep[1][0] = -1                 # touches a COPIED inner list

print(old)                      # [[99, 2, 3], [4, 5, 6]]
print(old is shallow, old[0] is shallow[0])   # False True
print(old[1] is deep[1])                      # False
```

`id()` is your friend to understand what is going on. The course's experiment, with the three ways to “copy”:

```python
import copy

for name, copier in [("nothing", lambda l: l), ("copy.copy", copy.copy), ("copy.deepcopy", copy.deepcopy)]:
    old_list = [[1, 2, 3], [4, 5, 6], [7, 8, "a"]]
    new_list = copier(old_list)
    new_list[2][2] = 9
    print(f"# {name}")
    print(f"  old list: {old_list} at id {id(old_list)}")
    print(f"  new list: {new_list} at id {id(new_list)}")
```

> 💡 `copy.copy` is enough when the elements are immutable (list of numbers, of strings). You need `deepcopy` as soon as the structure contains mutable objects you want to modify independently. `deepcopy` has a **cost**: it goes through and duplicates the whole structure.

### Equality of your own objects: `__eq__`

For the objects you create with your own classes (session 5), `==` compares **identities** by default: two objects built identically are not equal! You must define the special method `__eq__` to say what “equal” means:

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

print(Point(1, 2) == Point(1, 2))     # False: two distinct objects

class PointEq:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)

print(PointEq(1, 2) == PointEq(1, 2)) # True: values are compared
```

> 🎯 **Key points**: `=` never copies; `==` compares values, `is` identities; a function can modify a list it receives; shallow copy = shared elements, `deepcopy` = everything duplicated; define `__eq__` to compare your own objects.
