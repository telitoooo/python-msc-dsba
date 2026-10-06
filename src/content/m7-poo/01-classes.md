### Le paradigme objet

La **programmation orientée objet** (POO) découpe un programme en **objets** qui regroupent des **données** (attributs) et des **comportements** (méthodes), et qui communiquent entre eux. C'est le paradigme le plus répandu en génie logiciel, car :

- il oblige à réfléchir à l'**architecture** du projet (quels objets, quelles responsabilités) ;
- il facilite le **travail en équipe** : chacun développe un composant séparé ;
- chaque objet se **teste** facilement de façon isolée (tests unitaires, module 10).

### Classe, objet, instance

Une analogie avec la construction de maisons :

| Concept | Analogie | En Python |
|---|---|---|
| **Classe** | le plan de l'architecte : il décrit comment construire une maison, mais ce n'est pas une maison | `class Dog:` |
| **Objet / instance** | une maison réelle construite à partir du plan | `d1 = Dog("Fido")` |
| **Attribut** | une caractéristique de la maison (couleur, surface) | `d1.name` |
| **Méthode** | une action possible (ouvrir la porte) | `d1.bark()` |

On écrit des **classes** (des plans), puis on **instancie** autant d'objets que nécessaire.

### Les 4 piliers de la POO

- **Abstraction** : ne montrer à l'extérieur que l'essentiel d'un objet et cacher les détails inutiles.
- **Encapsulation** : réunir données et fonctions dans une même unité, la classe.
- **Héritage** : une classe fille récupère les attributs et méthodes d'une classe mère (leçon 7.3).
- **Polymorphisme** : des objets de classes différentes répondent au même message chacun à leur façon (leçon 7.3).

### Définir une classe

`class` est aux classes ce que `def` est aux fonctions. La méthode spéciale `__init__` est le **constructeur** : elle est appelée automatiquement à la création de l'objet et initialise ses attributs.

```python
class Dog(object):          # (object) est facultatif en Python 3
    def __init__(self, name, age=0):
        self.name = name    # attribut d'instance
        self.age = age

    def bark(self):         # méthode : une fonction définie dans la classe
        print(f"{self.name} says woof!")

    def birthday(self):
        self.age += 1       # une méthode peut modifier l'objet


d1 = Dog("Fido")            # on instancie la classe en l'appelant
d2 = Dog("Rex", 3)
d1.bark()
d2.bark()
d1.birthday()
print(d1.name, d1.age, "|", d2.name, d2.age)
print(type(d1), isinstance(d1, Dog))
```

- `self` désigne **l'objet sur lequel la méthode travaille**. C'est toujours le **premier paramètre** d'une méthode, mais on ne le passe pas à l'appel : Python le fournit.
- La **notation pointée** `objet.attribut` / `objet.methode()` accède aux membres d'un objet.
- Chaque instance a **ses propres attributs** : modifier `d1` ne change pas `d2`.

### La POO par envoi de messages

L'idée de la POO : des objets qui **s'envoient des messages**. Écrire `b.f(x)`, c'est envoyer le message `f(x)` à l'objet `b`. En coulisses, Python appelle la fonction de la classe en passant l'objet comme premier argument :

```python
class Dog:
    def __init__(self, name):
        self.name = name

    def greet(self, other):
        return f"{self.name} sniffs {other}"


d = Dog("Fido")
print(d.greet("Rex"))          # envoi du message greet("Rex") à d
print(Dog.greet(d, "Rex"))     # strictement équivalent : b.f(x) ≡ Classe.f(b, x)
```

### Des attributs ajoutés à la volée

En Python, on peut ajouter un attribut à **une** instance après sa création. Il n'existe alors que pour cet objet :

```python
class Dog:
    def __init__(self, name):
        self.name = name

d1 = Dog("Fido")
d2 = Dog("Rex")
d1.age = 7                 # seulement sur d1
print(d1.age)
print(hasattr(d2, "age"))  # False : d2.age lèverait AttributeError
```

> ⚠️ C'est possible, mais à éviter : déclarez **tous** les attributs dans `__init__`. Un objet dont les attributs varient d'une instance à l'autre est difficile à utiliser (et source d'`AttributeError`).

> 💡 Oublier `self` est l'erreur la plus fréquente : `def bark():` provoque `TypeError: bark() takes 0 positional arguments but 1 was given` à l'appel `d.bark()`, et écrire `name = name` au lieu de `self.name = name` crée une simple variable locale, perdue à la fin de `__init__`.

> 🎯 **À retenir** : une classe est un plan ; on l'instancie en l'appelant ; `__init__` initialise les attributs via `self` ; une méthode reçoit toujours l'objet en premier paramètre (`self`) ; `b.f(x)` équivaut à `Classe.f(b, x)`.
