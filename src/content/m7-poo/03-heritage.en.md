### Inheriting from a class

A class can **inherit** from another one: put the parent class between parentheses. The child class gets **all the members** (attributes and methods) it does not redefine.

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def __str__(self) -> str:
        return f"{type(self).__name__}(name={self.name})"

    def speak(self):
        return f"{self.name} says something"


class Dog(Animal):              # Dog inherits from Animal
    def speak(self):            # redefinition (override)
        return f"{self.name} says woof!"


class Cat(Animal):
    def speak(self):
        return f"{self.name} says meow!"


for animal in [Animal("Animal"), Dog("Fido"), Cat("Garfield")]:
    print(animal, "→", animal.speak())
```

`Dog` has neither `__init__` nor `__str__`: it uses those of `Animal`.

### Polymorphism

In the loop above, we call `speak()` without caring about the exact type of the object: **each class answers the same message in its own way**. This is polymorphism. A function that accepts “any animal” will also work with a child class written later.

> 💡 This is also the spirit of **duck typing** (session 1): in Python, what counts is what the object can **do** (does it have a `speak` method?), not how it was declared.

### `super()`: calling the parent's version

When a child class redefines a method but wants to **extend** (not replace) the parent's one, it calls it with `super()`. This is very common in `__init__`:

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def describe(self):
        return f"I am {self.name}"


class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)          # initialise the "Animal" part
        self.breed = breed              # then what is specific to dogs

    def describe(self):
        return super().describe() + f", a {self.breed}"


rex = Dog("Rex", "beagle")
print(rex.describe())
print(isinstance(rex, Dog), isinstance(rex, Animal), issubclass(Dog, Animal))
```

### Class hierarchies

Inheritance can have several levels: this is a **class hierarchy**. All classes ultimately inherit from `object`, “the mother of all classes”.

```python
class Shape2D:
    """Common blueprint for all shapes: an "abstract" class."""

    def area(self):
        raise NotImplementedError("each shape must define area()")

    def __str__(self):
        return f"{type(self).__name__} with area {self.area():.2f}"


class Rectangle2D(Shape2D):
    def __init__(self, width, height):
        self.width, self.height = width, height

    def area(self):
        return self.width * self.height


class Square2D(Rectangle2D):            # a square IS a rectangle
    def __init__(self, side):
        super().__init__(side, side)


shapes = [Rectangle2D(2, 3), Square2D(2)]
for s in shapes:
    print(s)
print(Square2D.__mro__)                 # method resolution order
```

The `Shape2D` class acts as a **blueprint**: it imposes an interface (`area`) that child classes must fill in. The standard `abc` module (`ABC`, `@abstractmethod`) can even forbid instantiating an abstract class.

### Multiple inheritance: handle with care

A class can inherit from **several** classes: `class TkVendingMachine(Machine, tk.Frame):`. Python then looks for methods in a precise order (the *MRO*, visible with `Class.__mro__`). It quickly gets messy: **composition** (an object that *contains* other objects, lesson 7.4) is usually preferred.

> ⚠️ “Is-a” or “has-a”? Use inheritance when the child **is a** kind of parent (a `Dog` is an `Animal`). If an object **uses** or **contains** another object (a `Machine` has `Product`s), use composition.

> 🎯 **Key points**: `class Child(Parent):`; members that are not redefined are inherited; redefining a method = polymorphism; `super().method()` calls the parent's version; `isinstance` / `issubclass` test the hierarchy; prefer composition to multiple inheritance.
