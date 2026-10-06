### Construire un programme

Les briques de base d'un programme sont :

- les **expressions**, qui calculent des valeurs ;
- les **variables**, qui **mémorisent des valeurs** (lier un nom à une valeur) ;
- les **fonctions**, qui **mémorisent des calculs** (lier un nom à un calcul).

On définit ses propres briques, puis on les assemble. Plus qu'un jeu de Lego, c'est un **Meccano** : les blocs doivent interagir, les données circulent de l'un à l'autre, et l'ensemble doit **tourner** sans accroc.

### Pourquoi des fonctions ?

Une **fonction** est un bloc de code nommé et réutilisable. Elle permet de :

- **ne pas se répéter** (principe *DRY : Don't Repeat Yourself*) ;
- **découper** un problème complexe en petites étapes ;
- **tester** chaque morceau séparément.

Exemple du cours : chercher par **dichotomie** le zéro de x³ + x + 1 dans l'intervalle [−2, 2] (on coupe l'intervalle en deux et on garde la moitié où la fonction change de signe). Sans fonction, l'expression est écrite **quatre fois** :

```python
a = -2
b = 2
if (a**3 + a + 1) * (b**3 + b + 1) < 0:
    while abs(a - b) > 0.00001:
        h = (a + b) / 2
        if (a**3 + a + 1) * (h**3 + h + 1) < 0:
            b = h
        else:
            a = h
    print(f"zero of x^3+x+1 between {a} and {b} at:", (a + b) / 2)
else:
    print(f"x^3 + x + 1 has the same sign in {a} and {b}")
```

Pas très élégant, et source d'erreurs : changer de fonction oblige à modifier quatre lignes. **Solution : définir une fonction.**

### Définir et appeler une fonction

```python
def f(x):
    return x**3 + x + 1          # nom : f, paramètre : x, valeur de retour : l'expression du return

a, b = -2, 2
if f(a) * f(b) < 0:
    while abs(a - b) > 0.00001:
        h = (a + b) / 2
        if f(a) * f(h) < 0:
            b = h
        else:
            a = h
    print(f"zero of x^3+x+1 between {a} and {b} at:", (a + b) / 2)
```

- `def` + nom + parenthèses avec les **paramètres** + **`:`** (ne l'oubliez pas !) ;
- le corps est indenté ;
- `return` **renvoie** une valeur à l'appelant… et termine immédiatement la fonction ;
- une chaîne entre triples guillemets juste sous le `def` est la **docstring** : elle documente la fonction (`help(f)`).

```python
def aire_cercle(rayon):
    """Renvoie l'aire d'un cercle de rayon donné."""
    return 3.14159 * rayon ** 2

print(aire_cercle(1))
surface_totale = aire_cercle(1) + aire_cercle(2)   # le résultat s'utilise comme une valeur
print(round(surface_totale, 2))
```

> 💡 **Paramètre ou argument ?** Le *paramètre* est la variable dans la définition (`rayon`) ; l'*argument* est la valeur passée lors de l'appel (`2.5`).

### `return` n'est pas `print` !

C'est **la** confusion n°1 des débutants. `print` affiche à l'écran ; `return` transmet une valeur au reste du programme.

```python
def double_print(x):
    print(x * 2)

def double_return(x):
    return x * 2

a = double_print(5)    # affiche 10... mais a vaut None !
b = double_return(5)   # n'affiche rien, b vaut 10
print("a =", a, "| b =", b)
print(double_return(5) + 1)    # OK : 11
```

Une fonction sans `return` renvoie `None`. Règle d'or : **une fonction de calcul renvoie son résultat** ; c'est au programme principal de décider de l'afficher.

### Plusieurs `return` : sortie anticipée

```python
def signe(n):
    if n > 0:
        return "positif"
    if n < 0:
        return "négatif"
    return "nul"            # atteint seulement si n == 0

print(signe(5), signe(-2), signe(0))
```

### Les fonctions sont des valeurs

Comme une variable, un nom de fonction peut être **réaffecté** : une fonction est un objet comme un autre.

```python
def carre(x):
    return x * x

puissance = carre          # un deuxième nom pour la même fonction
print(puissance(7))
carre = abs                # on réaffecte le nom carre (à éviter dans un vrai programme !)
print(carre(-3), puissance(-3))
```

### Le flot d'exécution et la pile d'appels

Le texte d'un programme se lit de haut en bas, mais son **exécution** saute de fonction en fonction. Pour cela, l'ordinateur doit **transmettre les arguments** et **se souvenir d'où revenir** à la fin de chaque appel : il utilise une **pile** (*stack*), une structure « dernier entré, premier sorti » (*LIFO*).

```python
# Program flow : f appelle g ou h, qui rappellent f…
def f(x):
    print(x, end=" ")
    if x == 1:
        return 1
    elif x % 2 == 0:
        return g(x)
    else:
        return h(x)

def g(x):
    return f(x // 2)

def h(x):
    return f(3 * x + 1)

f(6)          # 6 3 10 5 16 8 4 2 1 : 17 appels empilés avant de tous se terminer
print()
```

> 💡 Visualisez la pile d'appels avec **Python Tutor** (pythontutor.com) : chaque appel y apparaît comme un cadre empilé.

> ⚠️ Une fonction doit être **définie avant d'être appelée** (plus haut dans le fichier), et définir une fonction n'exécute pas son code : il faut l'appeler avec des parenthèses `ma_fonction()`.

> 🎯 **À retenir** : variables = valeurs mémorisées, fonctions = calculs mémorisés ; `def nom(params):` + bloc indenté ; `return` renvoie une valeur et sort de la fonction (sinon `None`) ; les appels s'empilent sur la pile d'appels.
