### Attributs d'instance et attributs de classe

Certaines données sont **propres à chaque objet** (le nom d'un chien) : ce sont des **attributs d'instance**, créés avec `self.` dans `__init__`. D'autres sont **partagées par toutes les instances** (le nombre de pattes) : ce sont des **attributs de classe**, déclarés directement dans le corps de la classe.

```python
class Dog:
    legs = 4                      # attribut de classe : partagé

    def __init__(self, name):
        self.name = name          # attribut d'instance : propre à chaque chien


d1, d2 = Dog("Fido"), Dog("Rex")
print(Dog.legs, d1.legs, d2.legs)   # 4 4 4 : lu depuis la classe

Dog.legs = 3                        # modifie la valeur PARTAGÉE
print(d1.legs, d2.legs)             # 3 3

Dog.legs = 4
d1.legs = 3                         # crée un attribut d'INSTANCE sur d1 qui masque celui de la classe
print(d1.legs, d2.legs, Dog.legs)   # 3 4 4
```

Quand on lit `d1.legs`, Python cherche d'abord dans l'**objet**, puis dans sa **classe**, puis dans les classes mères. Variables et méthodes d'une classe sont appelées ses **membres**.

### Les types Python sont des classes

`list`, `dict`, `set`, `tuple`, `str` et même `int` sont des classes ! On les instancie avec `list()`, `dict()`… et leurs « fonctions spécifiques » sont des méthodes.

```python
a = [1, 2, 3, 4]
print(type(a))                                     # <class 'list'>
print([m for m in dir(a) if not m.startswith("_")])
a.append(5)                                        # ≡ list.append(a, 5)

i = 5
print(type(i), i.bit_length())                     # même un entier est un objet : 5 = 0b101
```

### Encapsulation : protéger l'état d'un objet

Python ne rend rien vraiment privé, mais il existe des **conventions** :

- `self._stock` (un tiret bas) : attribut **interne**, « ne pas toucher de l'extérieur » ;
- `self.__secret` (deux tirets bas) : nom modifié par Python (*name mangling*) pour éviter les collisions avec les classes filles.

Pour contrôler l'accès à un attribut, on utilise une **propriété** (`@property`) : on lit et on écrit `objet.attribut` comme un attribut normal, mais une méthode est exécutée, ce qui permet de **valider** les valeurs.

```python
class Product:
    MAX_QUANTITY = 10                       # constante de classe

    def __init__(self, name, price, quantity=0):
        self.name = name
        self.price = price
        self.quantity = quantity            # passe par le setter ci-dessous

    @property
    def quantity(self):                     # lecture : p.quantity
        return self._quantity

    @quantity.setter
    def quantity(self, value):              # écriture : p.quantity = value
        if not 0 <= value <= Product.MAX_QUANTITY:
            raise ValueError(f"quantité invalide : {value}")
        self._quantity = value


p = Product("candy", 0.5, 8)
p.quantity -= 1
print(p.quantity)
try:
    p.quantity = 42
except ValueError as e:
    print("Refusé :", e)
```

### Méthodes de classe et méthodes statiques

- `@classmethod` reçoit la **classe** (`cls`) au lieu de l'instance : idéal pour proposer **d'autres constructeurs**.
- `@staticmethod` ne reçoit ni l'instance ni la classe : c'est une simple fonction rangée dans la classe.

```python
class Point2D:
    def __init__(self, x, y):
        self.x, self.y = x, y

    @classmethod
    def from_tuple(cls, pair):          # constructeur alternatif
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

### La composition : des objets qui contiennent des objets

Un distributeur automatique **a** des produits : il les **contient** dans un attribut, et **délègue** le travail à ces objets. C'est la **composition**.

```python
class Product:
    def __init__(self, name, price, quantity):
        self.name, self.price, self.quantity = name, price, quantity


class Machine:
    def __init__(self):
        self.products = {}                  # la machine CONTIENT des Product
        self.profit = 0.0

    def add(self, product):
        self.products[product.name] = product

    def buy(self, name):
        product = self.products[name]
        if product.quantity == 0:
            raise ValueError(f"{name} : épuisé")
        product.quantity -= 1               # délégation à l'objet Product
        self.profit += product.price
        return product.price


m = Machine()
m.add(Product("gums", 0.8, 2))
m.buy("gums")
print(m.products["gums"].quantity, m.profit)
```

> 💡 Pour **sauvegarder** un objet, on le convertit en structure simple (`dict`) puis en JSON ; une méthode de classe `from_dict` le reconstruit. `pickle` sait aussi sérialiser directement la plupart des objets (module 5).

> 🎯 **À retenir** : attribut de classe = partagé, attribut d'instance = propre à l'objet (et il masque celui de la classe) ; tout est objet en Python ; `_nom` = interne ; `@property` contrôle l'accès ; `@classmethod` pour d'autres constructeurs ; « a-un » → composition.
