### Arguments positionnels et nommés

Par défaut, les arguments sont associés aux paramètres **dans l'ordre** (positionnels). On peut aussi les **nommer** : l'ordre n'importe plus et l'appel devient plus lisible.

```python
def presenter(nom, age, ville):
    return f"{nom}, {age} ans, habite à {ville}."

print(presenter("Ada", 36, "Londres"))                 # positionnels
print(presenter(ville="Paris", nom="Marie", age=30))   # nommés
print(presenter("Alan", ville="Manchester", age=41))   # mélange : positionnels d'abord
```

### Des fonctions en paramètres

Revenons à la dichotomie de la leçon précédente. Un pas de plus : faire de la **dichotomie elle-même une fonction**, avec l'intervalle et la précision en paramètres… Mais la fonction étudiée `f` y serait encore « codée en dur ». Solution : **une fonction peut aussi être passée en argument !**

```python
def f(x):
    return x**3 + x + 1

def dichotomy(a, b, func, eps):
    if func(a) * func(b) < 0:
        while abs(a - b) > eps:
            h = (a + b) / 2
            if func(a) * func(h) < 0:
                b = h
            else:
                a = h
        print(f"zero of {func.__name__} between {a:.6f} and {b:.6f} at:", (a + b) / 2)
    else:
        print(f"{func.__name__} has the same sign in {a} and {b}")

dichotomy(-2, 2, f, 0.00001)
dichotomy(0, 2, lambda x: x * x - 2, 1e-9)   # √2 : une fonction anonyme (module 6)
```

Inconvénient : on ne peut plus afficher le code de la fonction étudiée… sauf avec le module `inspect` :

```python
import inspect

def f(x):
    return x**3 + x + 1

print(inspect.getsource(f))      # le texte source de la fonction
```

### Valeurs par défaut

Un paramètre peut avoir une **valeur par défaut**, utilisée si l'argument est omis. Les paramètres avec défaut se placent **après** les paramètres obligatoires.

```python
def f(x):
    return x**3 + x + 1

def dichotomy(func, a=-10, b=10, eps=0.000001):
    if func(a) * func(b) >= 0:
        return None
    while abs(a - b) > eps:
        h = (a + b) / 2
        if func(a) * func(h) < 0:
            b = h
        else:
            a = h
    return (a + b) / 2

# Arguments positionnels
print(dichotomy(f))
print(dichotomy(f, -2))
print(dichotomy(f, -2, 2))
print(dichotomy(f, -2, 2, 0.001))
# Arguments nommés : dans n'importe quel ordre, en sautant ceux qu'on ne change pas
print(dichotomy(f, eps=0.001, b=2))
```

> 💡 C'est exactement ainsi que fonctionnent `print(..., sep=" ", end="\n")` ou `round(x, ndigits=None)` : des paramètres optionnels avec des valeurs par défaut.

### Nombre variable d'arguments : `*args`

Un paramètre précédé de `*` récupère tous les arguments positionnels supplémentaires dans un **tuple**.

```python
def somme(*nombres):
    print("nombres =", nombres)
    total = 0
    for n in nombres:
        total += n
    return total

print(somme(1, 2, 3))
print(somme(10))
print(somme())
```

### Arguments nommés libres : `**kwargs`

Symétriquement, `**` récupère les arguments **nommés** supplémentaires dans un **dictionnaire** (module 4).

```python
def fiche(nom, **infos):
    print("Fiche de", nom)
    for cle in infos:
        print(" -", cle, ":", infos[cle])

fiche("Ada", langage="Python", promo="DSBA")
```

### Renvoyer plusieurs valeurs

Une fonction peut renvoyer plusieurs valeurs séparées par des virgules : Python les regroupe dans un **tuple**, que l'on « déballe » à l'appel.

```python
def division_euclidienne(a, b):
    return a // b, a % b

quotient, reste = division_euclidienne(17, 5)
print(quotient, reste)
```

> ⚠️ **Piège : valeur par défaut modifiable.** N'écrivez jamais `def ajouter(x, liste=[])` : la même liste est réutilisée d'un appel à l'autre ! Utilisez `liste=None`, puis `if liste is None: liste = []` dans le corps.

> 🎯 **À retenir** : arguments positionnels puis nommés ; une fonction peut être passée en argument ; `param=defaut` rend un argument optionnel (après les obligatoires) ; `*args` collecte un tuple, `**kwargs` un dictionnaire ; `return a, b` renvoie un tuple ; `inspect.getsource(f)` donne le code de `f`.
