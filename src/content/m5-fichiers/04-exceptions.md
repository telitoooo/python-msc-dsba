### Erreurs de syntaxe et exceptions

- Une **erreur de syntaxe** (`SyntaxError`, `IndentationError`) empêche le programme de démarrer : Python ne comprend pas le texte.
- Une **exception** survient **pendant l'exécution** : le code est correct, mais une opération échoue (fichier absent, division par zéro, conversion impossible…). Si personne ne l'intercepte, le programme s'arrête et affiche un *traceback*.

| Exception | Cas typique |
|---|---|
| `ValueError` | bon type, mauvaise valeur : `int("abc")` |
| `TypeError` | mauvais type : `"3" + 1` |
| `ZeroDivisionError` | `4 / 0` |
| `KeyError` / `IndexError` | clé absente / indice hors limites |
| `FileNotFoundError` | `open("absent.txt")` |
| `Exception` | la « mère » de presque toutes les exceptions |

### `try` / `except` : intercepter une exception

```python
def inverse(x):
    try:
        return 1 / x
    except ZeroDivisionError:
        print("Impossible de diviser par zéro")
        return None

print(inverse(4))
print(inverse(0))
```

On peut prévoir **plusieurs `except`**, et récupérer l'objet exception avec `as` pour afficher son message :

```python
for texte in ["42", "abc", "0"]:
    try:
        valeur = 100 / int(texte)
    except ValueError as e:
        print(f"{texte!r} : pas un entier ({e})")
    except ZeroDivisionError:
        print(f"{texte!r} : division par zéro")
    else:                                   # seulement si aucune exception
        print(f"{texte!r} : 100 / {texte} = {valeur}")
    finally:                                # toujours exécuté (nettoyage)
        print("  -> valeur traitée")
```

> ⚠️ **Interceptez des exceptions précises.** Un `except Exception:` (ou pire, un `except:` nu) attrape aussi vos fautes de frappe (`NameError`…) et cache les vrais bugs. Réservez-le aux cas où vous affichez ou journalisez l'erreur.

### Le cas typique : lire un fichier qui peut ne pas exister

```python
import json

def charger_config(chemin):
    try:
        with open(chemin, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"{chemin} introuvable : configuration par défaut")
        return {"theme": "clair"}

print(charger_config("config.json"))
```

> 💡 Python encourage le style **EAFP** (*Easier to Ask Forgiveness than Permission*) : on tente l'opération et on gère l'échec, plutôt que de tout vérifier avant (`if os.path.exists(...)`). C'est plus sûr : le fichier peut disparaître entre la vérification et l'ouverture.

### `raise` : signaler une erreur soi-même

Quand une fonction reçoit une donnée invalide, elle doit **lever une exception** avec un message clair, plutôt que renvoyer une valeur bizarre (`None`, `-1`…).

```python
def racine(x):
    if x < 0:
        raise ValueError(f"racine d'un nombre négatif : {x}")
    return x ** 0.5

print(racine(9))
try:
    racine(-4)
except ValueError as e:
    print("Erreur :", e)
```

### Créer ses propres exceptions

Une exception personnalisée se déclare en une ligne (les classes seront détaillées dans un cours suivant) :

```python
class SoldeInsuffisant(Exception):
    """Levée quand un retrait dépasse le solde."""

def retirer(solde, montant):
    if montant > solde:
        raise SoldeInsuffisant(f"solde {solde} €, retrait demandé {montant} €")
    return solde - montant

try:
    retirer(50, 80)
except SoldeInsuffisant as e:
    print("Refusé :", e)
```

> 🎯 **À retenir** : `try` / `except TypeErreur as e` / `else` / `finally` ; interceptez des exceptions précises ; `raise ValueError("message")` pour signaler une donnée invalide ; `class MonErreur(Exception): pass` pour créer la vôtre.
