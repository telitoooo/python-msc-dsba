### The object paradigm

**Object-oriented programming** (OOP) splits a program into **objects** that bundle **data** (attributes) and **behaviour** (methods), and that interact with each other. It is the most widespread paradigm in software engineering, because:

- it forces you to think about the **architecture** of the project (which objects, which responsibilities);
- it makes **team work** easier: each person develops a separate component;
- each object is easy to **test** in isolation (unit tests, module 10).

### Class, object, instance

A house-building analogy:

| Concept | Analogy | In Python |
|---|---|---|
| **Class** | the architect's blueprint: it describes how to build a house, but it is not a house | `class Dog:` |
| **Object / instance** | a real house built from the blueprint | `d1 = Dog("Fido")` |
| **Attribute** | a feature of the house (colour, area) | `d1.name` |
| **Method** | a possible action (open the door) | `d1.bark()` |

We write **classes** (blueprints), then **instantiate** as many objects as needed.

### The 4 pillars of OOP

- **Abstraction**: show only the essential features of an object to the outside world and hide irrelevant details.
- **Encapsulation**: wrap data and functions together into a single unit, the class.
- **Inheritance**: a child class acquires the attributes and methods of a parent class (lesson 7.3).
- **Polymorphism**: objects of different classes answer the same message, each in its own way (lesson 7.3).

### Defining a class

`class` is to classes what `def` is to functions. The special method `__init__` is the **constructor**: it is called automatically when the object is created and initialises its attributes.

```python
class Dog(object):          # (object) is optional in Python 3
    def __init__(self, name, age=0):
        self.name = name    # instance attribute
        self.age = age

    def bark(self):         # method: a function defined inside the class
        print(f"{self.name} says woof!")

    def birthday(self):
        self.age += 1       # a method can modify the object


d1 = Dog("Fido")            # instantiate the class by calling it
d2 = Dog("Rex", 3)
d1.bark()
d2.bark()
d1.birthday()
print(d1.name, d1.age, "|", d2.name, d2.age)
print(type(d1), isinstance(d1, Dog))
```

- `self` is **the object the method works on**. It is always the **first parameter** of a method, but you do not pass it when calling: Python provides it.
- The **dot notation** `object.attribute` / `object.method()` accesses the members of an object.
- Each instance has **its own attributes**: modifying `d1` does not change `d2`.

### OOP through message passing

The idea behind OOP: objects that **send messages to each other**. Writing `b.f(x)` sends the message `f(x)` to the object `b`. Behind the scenes, Python calls the class function and passes the object as the first argument:

```python
class Dog:
    def __init__(self, name):
        self.name = name

    def greet(self, other):
        return f"{self.name} sniffs {other}"


d = Dog("Fido")
print(d.greet("Rex"))          # sends the message greet("Rex") to d
print(Dog.greet(d, "Rex"))     # strictly equivalent: b.f(x) ≡ Class.f(b, x)
```

### Attributes added on the fly

In Python you can add an attribute to **one** instance after its creation. It then exists for that object only:

```python
class Dog:
    def __init__(self, name):
        self.name = name

d1 = Dog("Fido")
d2 = Dog("Rex")
d1.age = 7                 # only on d1
print(d1.age)
print(hasattr(d2, "age"))  # False: d2.age would raise AttributeError
```

> ⚠️ It is possible but best avoided: declare **all** attributes in `__init__`. Objects whose attributes vary from one instance to another are hard to use (and a source of `AttributeError`).

> 💡 Forgetting `self` is the most frequent mistake: `def bark():` raises `TypeError: bark() takes 0 positional arguments but 1 was given` when calling `d.bark()`, and writing `name = name` instead of `self.name = name` creates a mere local variable, lost at the end of `__init__`.

> 🎯 **Key points**: a class is a blueprint; you instantiate it by calling it; `__init__` initialises the attributes through `self`; a method always receives the object as its first parameter (`self`); `b.f(x)` is equivalent to `Class.f(b, x)`.
