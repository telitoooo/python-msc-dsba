### Variables, objets et identité

En Python, une variable est une **étiquette collée sur un objet**. Chaque objet a une **identité** (son adresse en mémoire), donnée par `id()`.

- `a == b` : les deux objets ont la **même valeur** ;
- `a is b` : les deux noms désignent **le même objet** (même `id`).

```python
a = [1, 2, 3]
b = a                  # b est un ALIAS : une deuxième étiquette sur la même liste
c = [1, 2, 3]          # une autre liste, de même valeur

print(a == b, a is b, id(a) == id(b))   # True True True
print(a == c, a is c)                    # True False
b.append(4)
print(a)                                 # [1, 2, 3, 4] : a a « changé » aussi !
```

### Mutable ou immuable ?

| Immuables (on ne peut pas les modifier) | Mutables (modifiables en place) |
|---|---|
| `int`, `float`, `bool`, `str`, `tuple`, `None` | `list`, `dict`, `set` |

Avec un objet **immuable**, l'aliasing est sans danger : toute « modification » crée un nouvel objet. Avec un objet **mutable**, une modification par un nom est visible par **tous** ses alias.

### Les éléments partagés restent partagés

```python
a = ["foo", "bar"]
l = [a, a, a]          # trois fois LA MÊME liste
print(l)
l[1] = "bar"           # remplace la 2e case : les autres ne bougent pas
print(l)
l[0][1] = "baz"        # modifie la liste a… visible dans toutes les cases qui la contiennent
print(l)
```

Pour que chaque case ait sa propre liste, il faut des **copies** (module `copy`) :

```python
import copy

a = ["foo", "bar"]
l = [copy.copy(a) for i in range(3)]    # trois listes distinctes
l[1] = "bar"
l[0][1] = "baz"                          # ne touche que la première
print(l)                                 # [['foo', 'baz'], 'bar', ['foo', 'bar']]
```

> ⚠️ C'est le même piège que `[[0] * 3] * 3` : on obtient trois références vers **une seule** ligne. Construisez plutôt chaque ligne séparément : `[[0] * 3 for _ in range(3)]`.

### Passer un objet mutable à une fonction

Le paramètre reçoit une référence vers **le même objet** que l'argument. Une fonction peut donc modifier une liste reçue… parfois sans que l'appelant s'y attende :

```python
def ajouter_bonus(notes):
    for i in range(len(notes)):
        notes[i] += 1          # modifie la liste de l'appelant !

mes_notes = [12, 15]
ajouter_bonus(mes_notes)
print(mes_notes)               # [13, 16]

def avec_bonus(notes):
    return [n + 1 for n in notes]   # version sans effet de bord : nouvelle liste

print(avec_bonus(mes_notes), mes_notes)
```

### Copier : superficielle ou profonde

| Opération | Résultat |
|---|---|
| `b = a` | aucune copie : un alias |
| `a.copy()`, `a[:]`, `list(a)`, `copy.copy(a)` | **copie superficielle** : nouvelle liste extérieure, mais les éléments sont **partagés** |
| `copy.deepcopy(a)` | **copie profonde** : tout est dupliqué récursivement |

```python
import copy

ancienne = [[1, 2, 3], [4, 5, 6]]
superficielle = copy.copy(ancienne)
profonde = copy.deepcopy(ancienne)

superficielle[0][0] = 99        # touche une liste intérieure PARTAGÉE
profonde[1][0] = -1             # touche une liste intérieure COPIÉE

print(ancienne)                 # [[99, 2, 3], [4, 5, 6]]
print(ancienne is superficielle, ancienne[0] is superficielle[0])   # False True
print(ancienne[1] is profonde[1])                                    # False
```

`id()` est votre ami pour comprendre ce qui se passe. L'expérience du cours, avec les trois façons de « copier » :

```python
import copy

for nom, copier in [("rien", lambda l: l), ("copy.copy", copy.copy), ("copy.deepcopy", copy.deepcopy)]:
    old_list = [[1, 2, 3], [4, 5, 6], [7, 8, "a"]]
    new_list = copier(old_list)
    new_list[2][2] = 9
    print(f"# {nom}")
    print(f"  ancienne : {old_list} id {id(old_list)}")
    print(f"  nouvelle : {new_list} id {id(new_list)}")
```

> 💡 `copy.copy` suffit quand les éléments sont immuables (liste de nombres, de chaînes). Il faut `deepcopy` dès que la structure contient des objets mutables qu'on veut modifier indépendamment. `deepcopy` a un **coût** : il parcourt et duplique toute la structure.

### L'égalité de vos propres objets : `__eq__`

Pour les objets que vous créez avec vos propres classes (séance 5), `==` compare par défaut les **identités** : deux objets construits à l'identique ne sont pas égaux ! Il faut définir la méthode spéciale `__eq__` pour dire ce que « égal » signifie :

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

print(Point(1, 2) == Point(1, 2))     # False : deux objets distincts

class PointEq:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __eq__(self, autre):
        return (self.x, self.y) == (autre.x, autre.y)

print(PointEq(1, 2) == PointEq(1, 2)) # True : on compare les valeurs
```

> 🎯 **À retenir** : `=` ne copie jamais ; `==` compare les valeurs, `is` les identités ; une fonction peut modifier une liste reçue ; copie superficielle = éléments partagés, `deepcopy` = tout dupliqué ; définissez `__eq__` pour comparer vos propres objets.
