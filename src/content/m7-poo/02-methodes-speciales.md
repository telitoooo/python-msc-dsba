### Des méthodes appelées « en coulisses »

Les **méthodes spéciales** (ou *dunder methods*, pour *double underscore*) portent un nom encadré par deux tirets bas. On ne les appelle presque jamais directement : Python les déclenche à des **moments précis**. `__init__` en est un exemple : il est appelé à l'instanciation.

| Vous écrivez… | Python appelle… | Rôle |
|---|---|---|
| `Dog("Fido")` | `__init__(self, …)` | initialiser l'objet |
| `print(d)`, `str(d)`, f-string | `__str__(self)` | texte lisible pour l'utilisateur |
| `d` dans la console, dans une liste | `__repr__(self)` | représentation pour le développeur |
| `a == b` | `__eq__(self, other)` | égalité de **valeur** |
| `a < b`, `sorted(...)` | `__lt__(self, other)` | comparaison, tri |
| `a + b` | `__add__(self, other)` | addition |
| `len(obj)` | `__len__(self)` | longueur |
| `obj[i]` / `obj[i] = v` | `__getitem__` / `__setitem__` | accès avec crochets |
| `x in obj` | `__contains__(self, x)` | test d'appartenance |
| `obj(x)` | `__call__(self, x)` | objet appelable comme une fonction |

### `__str__` et `__repr__` : afficher un objet

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
print(d)                 # appelle __str__
print([d, Dog("Rex")])   # une liste affiche le __repr__ de ses éléments
```

Sans `__str__`, `print(d)` affiche quelque chose comme `<__main__.Dog object at 0x7f…>` : le nom de la classe et l'adresse mémoire.

### `__eq__` : identité ou égalité ?

Par défaut, `a == b` compare les **identités** (comme `a is b`) : deux objets créés séparément sont différents, même avec les mêmes attributs. Pour comparer les **valeurs**, on définit `__eq__` :

```python
class Point2D:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __eq__(self, other):
        return isinstance(other, Point2D) and (self.x, self.y) == (other.x, other.y)


p, q = Point2D(1, 2), Point2D(1, 2)
print(p == q, p is q, id(p) == id(q))   # True False False
```

### `__getitem__` et `__setitem__` : utiliser les crochets

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

Comparez avec une version sans méthodes spéciales : `building.occupy(2, "DEF Inc")` puis `building.get_floor_data(2)`. Les crochets rendent l'objet aussi naturel qu'une liste.

### `__call__` : un objet qu'on appelle comme une fonction

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
d("Fido")      # appelle d.__call__("Fido")
d("Rex")
print(callable(d))
```

Un objet appelable peut remplacer une fonction partout (callbacks d'une interface graphique, fonction passée à la dichotomie…), tout en **gardant un état** dans ses attributs.

### Surcharger les opérateurs

```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)   # NOUVEL objet

    def __mul__(self, k):
        return Vector(self.x * k, self.y * k)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"


print(Vector(1, 2) + Vector(3, 4), Vector(1, 2) * 3)
```

> 💡 `dir(objet)` liste tous ses membres, y compris les méthodes spéciales héritées : essayez `dir(3)` ou `dir([])`.

> ⚠️ Un opérateur comme `+` doit en général **renvoyer un nouvel objet** sans modifier les opérandes : `a + b` ne doit pas changer `a`.

> 🎯 **À retenir** : `__init__` (création), `__str__`/`__repr__` (affichage), `__eq__`/`__lt__` (comparaison), `__add__`… (opérateurs), `__len__`, `__getitem__`/`__setitem__` (crochets), `__call__` (appel comme une fonction).
