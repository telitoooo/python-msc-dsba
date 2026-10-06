### Hériter d'une classe

Une classe peut **hériter** d'une autre : on indique la classe mère entre parenthèses. La classe fille récupère **tous les membres** (attributs et méthodes) qu'elle ne redéfinit pas.

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def __str__(self) -> str:
        return f"{type(self).__name__}(name={self.name})"

    def speak(self):
        return f"{self.name} says something"


class Dog(Animal):              # Dog hérite d'Animal
    def speak(self):            # redéfinition (override)
        return f"{self.name} says woof!"


class Cat(Animal):
    def speak(self):
        return f"{self.name} says meow!"


for animal in [Animal("Animal"), Dog("Fido"), Cat("Garfield")]:
    print(animal, "→", animal.speak())
```

`Dog` n'a pas de `__init__` ni de `__str__` : il utilise ceux d'`Animal`.

### Le polymorphisme

Dans la boucle ci-dessus, on appelle `speak()` sans se soucier du type exact de l'objet : **chaque classe répond au même message à sa façon**. C'est le polymorphisme. Une fonction qui accepte « n'importe quel animal » fonctionnera aussi avec une classe fille écrite plus tard.

> 💡 C'est aussi l'esprit du **duck typing** (séance 1) : en Python, ce qui compte, c'est ce que l'objet sait **faire** (a-t-il une méthode `speak` ?), pas sa déclaration.

### `super()` : appeler la version de la classe mère

Quand une classe fille redéfinit une méthode mais veut **compléter** (et non remplacer) celle de la mère, elle l'appelle avec `super()`. C'est très fréquent dans `__init__` :

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def describe(self):
        return f"I am {self.name}"


class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)          # initialise la partie « Animal »
        self.breed = breed              # puis ce qui est propre au chien

    def describe(self):
        return super().describe() + f", a {self.breed}"


rex = Dog("Rex", "beagle")
print(rex.describe())
print(isinstance(rex, Dog), isinstance(rex, Animal), issubclass(Dog, Animal))
```

### Hiérarchies de classes

L'héritage peut avoir plusieurs niveaux : c'est une **hiérarchie de classes**. Toutes les classes héritent finalement d'`object`, « la mère de toutes les classes ».

```python
class Shape2D:
    """Plan commun à toutes les formes : une classe « abstraite »."""

    def area(self):
        raise NotImplementedError("chaque forme doit définir area()")

    def __str__(self):
        return f"{type(self).__name__} d'aire {self.area():.2f}"


class Rectangle2D(Shape2D):
    def __init__(self, width, height):
        self.width, self.height = width, height

    def area(self):
        return self.width * self.height


class Square2D(Rectangle2D):            # un carré EST un rectangle
    def __init__(self, side):
        super().__init__(side, side)


shapes = [Rectangle2D(2, 3), Square2D(2)]
for s in shapes:
    print(s)
print(Square2D.__mro__)                 # ordre de recherche des méthodes
```

La classe `Shape2D` sert de **modèle** : elle impose une interface (`area`) que les classes filles doivent remplir. Le module standard `abc` (`ABC`, `@abstractmethod`) permet même d'interdire l'instanciation d'une classe abstraite.

### Héritage multiple : à manier avec précaution

Une classe peut hériter de **plusieurs** classes : `class TkVendingMachine(Machine, tk.Frame):`. Python cherche alors les méthodes dans un ordre précis (le *MRO*, visible avec `Classe.__mro__`). C'est vite confus : on préfère généralement la **composition** (un objet qui *contient* d'autres objets, leçon 7.4).

> ⚠️ « Est-un » ou « a-un » ? Utilisez l'héritage quand la fille **est une** sorte de mère (un `Dog` est un `Animal`). Si un objet **utilise** ou **contient** un autre objet (une `Machine` a des `Product`), utilisez la composition.

> 🎯 **À retenir** : `class Fille(Mere):` ; les membres non redéfinis sont hérités ; redéfinir une méthode = polymorphisme ; `super().methode()` appelle la version de la mère ; `isinstance` / `issubclass` testent la hiérarchie ; préférez la composition à l'héritage multiple.
