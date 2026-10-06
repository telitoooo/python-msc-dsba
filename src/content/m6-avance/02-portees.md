### Rappel : une fonction crée une portée

Chaque appel de fonction crée une **portée locale**. Une variable affectée dans la fonction est **locale**, même si une variable globale porte le même nom :

```python
m = "Hello, world"

def moyenne(a, b):
    m = (a + b) / 2        # m locale : la globale n'est pas touchée
    return m

x = moyenne(1, 2)
print(m)                   # Hello, world
```

> ⚠️ Contrairement à d'autres langages, **`if`, `for` et `while` ne créent pas de portée** en Python : une variable créée dans une boucle existe encore après.

### `global` : modifier une variable globale

Le cours montre un usage typique : compter combien de fois une fonction est appelée par un algorithme.

```python
appels = 0

def f(x):
    global appels           # « appels » désigne la variable globale
    appels += 1
    return x ** 3 + x + 1

def dichotomie(fonction, a, b, eps=0.001):
    """Cherche un zéro de fonction entre a et b (signes opposés)."""
    while b - a > eps:
        milieu = (a + b) / 2
        if fonction(a) * fonction(milieu) <= 0:
            b = milieu
        else:
            a = milieu
    return (a + b) / 2

print(round(dichotomie(f, -2, 2), 3), "en", appels, "appels de f")
```

> 💡 `global` est pratique pour un petit script, mais rend le code fragile (n'importe quelle fonction peut modifier l'état). Une **fermeture** (ci-dessous) donne le même service sans variable globale.

### `nonlocal` : modifier la variable d'une fonction englobante

`global` vise la portée du module ; `nonlocal` vise la **fonction englobante la plus proche**.

```python
x = "global"

def externe():
    x = "externe"
    def interne():
        nonlocal x          # x de « externe », pas la globale
        x = "modifié par interne"
    interne()
    print("externe :", x)

externe()
print("module  :", x)
```

Ordre de recherche d'un nom (règle **LEGB**) : **L**ocale → fonctions **E**nglobantes → **G**lobale → **B**uilt-in.

### Les fermetures (*closures*)

Une fonction définie dans une autre **capture** les variables de la fonction englobante, et s'en souvient même après la fin de l'appel. C'est le principe des **usines à fonctions** :

```python
def test(a):
    def ajouter(b):
        nonlocal a
        a += 1
        return a + b
    return ajouter            # on renvoie la fonction elle-même

func = test(4)
print(func(4))                # 9  (a vaut 5)
print(func(4))                # 10 (a vaut 6 : l'état est conservé)

def puissance(n):
    return lambda x: x ** n

carre, cube = puissance(2), puissance(3)
print(carre(5), cube(2))
```

### Le piège de la liaison tardive

Une fermeture capture la **variable**, pas sa **valeur** du moment. La valeur est lue au moment de l'**appel** :

```python
fonctions = [lambda x: x * k for k in range(3)]
print([f(10) for f in fonctions])    # [20, 20, 20] et non [0, 10, 20] !
```

Les trois `lambda` partagent le même `k`, qui vaut 2 à la fin de la boucle. Pour figer la valeur, on la passe en **paramètre par défaut** (évalué une seule fois, à la création) :

```python
fonctions = [lambda x, k=k: x * k for k in range(3)]
print([f(10) for f in fonctions])    # [0, 10, 20]
```

> 🎯 **À retenir** : `global` vise le module, `nonlocal` la fonction englobante ; une fermeture capture les variables de sa portée englobante ; attention à la liaison tardive dans les boucles (`k=k`).
