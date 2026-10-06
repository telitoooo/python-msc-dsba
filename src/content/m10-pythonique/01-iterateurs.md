### Itérable, itérateur : ce que fait vraiment `for`

Un **itérable** est un objet qu'on peut parcourir avec `for` : liste, chaîne, dictionnaire, fichier, `range`… La boucle `for` lui demande un **itérateur** avec `iter()`, puis appelle `next()` jusqu'à ce que l'itérateur lève l'exception `StopIteration`.

```python
names = ["Ada", "Alan", "Grace"]
it = iter(names)            # l'itérateur garde la position courante
print(next(it))
print(next(it))
print(next(it))
try:
    next(it)
except StopIteration:
    print("fin : c'est ainsi que for sait s'arrêter")
```

### Compréhension de liste ou expression génératrice ?

Avec des **crochets**, une compréhension construit **toute la liste** en mémoire. Avec des **parenthèses**, on obtient une **expression génératrice** : les valeurs sont produites **une par une, à la demande** (évaluation paresseuse).

```python
import sys

list_comprehension = [i for i in range(11) if i % 2 == 0]
print(list_comprehension)

generator_expression = (i for i in range(11) if i % 2 == 0)
print(generator_expression)                  # <generator object …> : rien n'est encore calculé
for i in generator_expression:
    print(i, end=" ")
print()

big_list = [i * i for i in range(1_000_000)]
big_gen = (i * i for i in range(1_000_000))
print(sys.getsizeof(big_list), "octets contre", sys.getsizeof(big_gen))
print(sum(i * i for i in range(1_000_000)))  # sum consomme le générateur sans liste
```

Les générateurs sont **plus économes en mémoire** (et souvent plus rapides) quand on ne parcourt les valeurs **qu'une fois**.

> ⚠️ Un générateur s'**épuise** : une fois parcouru, il est vide. Pour le reparcourir, il faut le recréer (ou le convertir en liste avec `list(...)`).

### Écrire ses propres itérables avec `yield`

Une fonction qui contient `yield` est une **fonction génératrice** : l'appeler ne l'exécute pas, mais renvoie un générateur. À chaque `next()`, elle s'exécute jusqu'au prochain `yield`, renvoie la valeur, puis se **met en pause** en gardant ses variables locales.

```python
def myrange(a, b):
    i = a
    while i < b:
        yield i          # donne i, puis se met en pause ici
        i = i + 1

for i in myrange(3, 7):
    print(i)

gen = myrange(0, 2)
print(next(gen), next(gen), list(gen))   # 0 1 [] : déjà épuisé
```

> ⚠️ Ne confondez pas `yield` et `return` : `return` **termine** la fonction et renvoie une seule valeur ; `yield` **suspend** la fonction et peut produire une suite (éventuellement infinie) de valeurs.

```python
def fibonacci():
    """Suite de Fibonacci infinie : on ne prend que ce dont on a besoin."""
    a, b = 1, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fibonacci(), 10)))     # les 10 premiers termes
```

### Le protocole itérateur dans une classe

Pour qu'un objet soit itérable « à la main », on définit deux méthodes spéciales : `__iter__` (renvoie l'itérateur, souvent `self`) et `__next__` (renvoie l'élément suivant ou lève `StopIteration`). Ici, l'état est mémorisé **dans l'objet**.

```python
class PowTwo:
    """Classe qui implémente un itérateur des puissances de deux."""

    def __init__(self, max=0):
        self.max = max

    def __iter__(self):
        self.n = 0
        return self

    def __next__(self):
        if self.n <= self.max:
            result = 2 ** self.n
            self.n += 1
            return result
        raise StopIteration


numbers = PowTwo(3)
i = iter(numbers)
print(next(i), next(i))
print(list(PowTwo(5)))          # for, list(), sum()… utilisent ce protocole
```

> 🎯 **À retenir** : `for` = `iter()` + `next()` jusqu'à `StopIteration` ; `[…]` construit une liste, `(…)` un générateur paresseux et économe ; `yield` transforme une fonction en générateur (pause entre deux valeurs) ; une classe itérable définit `__iter__` et `__next__`.
