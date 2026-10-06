### Instance attributes and class attributes

Some data are **specific to each object** (a dog's name): these are **instance attributes**, created with `self.` in `__init__`. Others are **shared by all instances** (the number of legs): these are **class attributes**, declared directly in the class body.

```python
class Dog:
    legs = 4                      # class attribute: shared

    def __init__(self, name):
        self.name = name          # instance attribute: specific to each dog


d1, d2 = Dog("Fido"), Dog("Rex")
print(Dog.legs, d1.legs, d2.legs)   # 4 4 4: read from the class

Dog.legs = 3                        # changes the SHARED value
print(d1.legs, d2.legs)             # 3 3

Dog.legs = 4
d1.legs = 3                         # creates an INSTANCE attribute on d1 that hides the class one
print(d1.legs, d2.legs, Dog.legs)   # 3 4 4
```

When reading `d1.legs`, Python looks first in the **object**, then in its **class**, then in the parent classes. The variables and methods of a class are called its **members**.

### Python types are classes

`list`, `dict`, `set`, `tuple`, `str` and even `int` are classes! They are instantiated with `list()`, `dict()`… and their “specific functions” are methods.

```python
a = [1, 2, 3, 4]
print(type(a))                                     # <class 'list'>
print([m for m in dir(a) if not m.startswith("_")])
a.append(5)                                        # ≡ list.append(a, 5)

i = 5
print(type(i), i.bit_length())                     # even an integer is an object: 5 = 0b101
```

### Encapsulation: protecting an object's state

Python makes nothing truly private, but there are **conventions**:

- `self._stock` (one underscore): **internal** attribute, “do not touch from outside”;
- `self.__secret` (two underscores): name changed by Python (*name mangling*) to avoid clashes with child classes.

To control access to an attribute, use a **property** (`@property`): you read and write `obj.attribute` like a normal attribute, but a method runs, which lets you **validate** values.

```python
class Product:
    MAX_QUANTITY = 10                       # class constant

    def __init__(self, name, price, quantity=0):
        self.name = name
        self.price = price
        self.quantity = quantity            # goes through the setter below

    @property
    def quantity(self):                     # reading: p.quantity
        return self._quantity

    @quantity.setter
    def quantity(self, value):              # writing: p.quantity = value
        if not 0 <= value <= Product.MAX_QUANTITY:
            raise ValueError(f"invalid quantity: {value}")
        self._quantity = value


p = Product("candy", 0.5, 8)
p.quantity -= 1
print(p.quantity)
try:
    p.quantity = 42
except ValueError as e:
    print("Rejected:", e)
```

### Class methods and static methods

- `@classmethod` receives the **class** (`cls`) instead of the instance: ideal to offer **other constructors**.
- `@staticmethod` receives neither the instance nor the class: it is a plain function stored in the class.

```python
class Point2D:
    def __init__(self, x, y):
        self.x, self.y = x, y

    @classmethod
    def from_tuple(cls, pair):          # alternative constructor
        return cls(pair[0], pair[1])

    @classmethod
    def origin(cls):
        return cls(0, 0)

    @staticmethod
    def distance(a, b):
        return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** 0.5


p = Point2D.from_tuple((3, 4))
print(Point2D.distance(p, Point2D.origin()))
```

### Composition: objects that contain objects

A vending machine **has** products: it **contains** them in an attribute and **delegates** work to these objects. This is **composition**.

```python
class Product:
    def __init__(self, name, price, quantity):
        self.name, self.price, self.quantity = name, price, quantity


class Machine:
    def __init__(self):
        self.products = {}                  # the machine CONTAINS Products
        self.profit = 0.0

    def add(self, product):
        self.products[product.name] = product

    def buy(self, name):
        product = self.products[name]
        if product.quantity == 0:
            raise ValueError(f"{name}: sold out")
        product.quantity -= 1               # delegation to the Product object
        self.profit += product.price
        return product.price


m = Machine()
m.add(Product("gums", 0.8, 2))
m.buy("gums")
print(m.products["gums"].quantity, m.profit)
```

> 💡 To **save** an object, convert it to a simple structure (`dict`) then to JSON; a class method `from_dict` rebuilds it. `pickle` can also serialize most objects directly (module 5).

> 🎯 **Key points**: class attribute = shared, instance attribute = specific to the object (and it hides the class one); everything is an object in Python; `_name` = internal; `@property` controls access; `@classmethod` for other constructors; “has-a” → composition.
