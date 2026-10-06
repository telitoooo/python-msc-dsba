### Ce qui se passe dans l'ordinateur

- Le **processeur (CPU)** exécute des instructions élémentaires : calculs, comparaisons, déplacements en mémoire.
- La **mémoire vive (RAM)** est rapide mais temporaire : elle contient les programmes en cours et leurs données.
- Le **disque** est lent mais permanent : il stocke les fichiers, dont les programmes eux-mêmes.

Sur le disque, les **fichiers** sont rangés dans une hiérarchie de dossiers. Chacun a un **chemin** (une simple chaîne, ex. `/usr/bin/python3`), des propriétés (taille, propriétaire) et des données : une suite de bits. Un fichier **texte** est lisible par un humain (les bits sont groupés en octets qui codent des caractères) ; un fichier **binaire** (image, vidéo, document Word…) n'est lisible que par les programmes qui connaissent son format.

Un **programme** est lui aussi un fichier binaire : des instructions en langage machine. Pour l'exécuter, il est copié du disque vers la RAM, d'où il envoie ses instructions au CPU. Votre code Python, lui, est un simple **fichier texte** (n'importe quel éditeur convient pour l'écrire) : il est exécuté par un autre programme, **l'interpréteur** `python3`, généralement rangé dans `/usr/bin/` ou dans un dossier listé par la variable d'environnement `PATH`.

Le **terminal** (console, shell) et l'**explorateur de fichiers** sont deux vues du même système de fichiers : on s'y déplace dans les dossiers, on crée, déplace et ouvre des fichiers, on lance des programmes. Même un navigateur web peut parcourir vos fichiers, par exemple grâce au petit serveur web intégré à Python :

```text
$ python3 -m http.server
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
::1 - - [12/Sep/2026 11:02:59] "GET / HTTP/1.1" 200 -
```

(ouvrez alors `http://localhost:8000` dans le navigateur pour voir le contenu du dossier courant).

L'interpréteur accepte en argument un chemin de fichier, un module ou directement une chaîne de code :

```text
python3 /home/ada/hello.py      # chemin complet d'un script
python3 hello.py                # script du dossier courant
python3 -m hello                # exécuter un module
python3 -c "print('bonjour')"   # exécuter une chaîne de code
```

### L'interpréteur lit votre code ligne par ligne

```python
import math                 # 1. charge le module math et lie le nom « math »

print("hey")                # 2. affiche immédiatement

def affine(x, a, b=0):      # 3. DÉFINIT la fonction : son corps n'est pas exécuté
    print("  calcul de affine")
    return a * x + b

x = math.sqrt(7)            # 4. crée la variable x
y = affine(x, 4, 3)         # 5. c'est seulement ici que le corps d'affine s'exécute
print("y vaut", y)          # 6.
```

> 💡 Pour **voir** l'exécution pas à pas (variables, cadres d'appel, objets), collez ce code dans [Python Tutor](https://pythontutor.com) : c'est l'outil idéal pour les leçons qui suivent.

### Mots-clés et fonctions intégrées

Les **mots-clés** font partie de la syntaxe : impossible de les réaffecter. Les voici tous :

```text
False   None    True    and     as      assert  async   await   break   class
continue        def     del     elif    else    except  finally for     from
global  if      import  in      is      lambda  nonlocal        not     or
pass    raise   return  try     while   with    yield
```

```python
import keyword
print(len(keyword.kwlist), keyword.iskeyword("lambda"), keyword.iskeyword("print"))
```

Les **fonctions et types intégrés** (*built-ins* : `int`, `float`, `str`, `list`, `dict`, `set`, `tuple`, `print`, `range`, `len`, `sorted`, `sum`…) ne sont pas des mots-clés, mais de simples noms connus de Python… que l'on **peut** donc écraser par erreur :

```python raises=TypeError
print(sum([1, 2, 3]))   # 6
sum = 0                 # légal : « sum » désigne maintenant un entier !
for n in [1, 2, 3]:
    sum += n
print(sum)              # 6
print(sum([4, 5]))      # TypeError: 'int' object is not callable
```

> ⚠️ Ne nommez jamais une variable `list`, `dict`, `str`, `sum`, `max`, `min`, `input` ou `print` : vous masqueriez la fonction intégrée pour le reste du programme. Préférez `total`, `valeurs`, `maximum`…

### Les fonctions sont des valeurs comme les autres

En Python, une fonction est un **objet** : on peut la ranger dans une variable, une liste ou un dictionnaire, la **passer en argument** et la **renvoyer**. On dit que les fonctions sont des *citoyens de première classe*.

```python
def carre(x):
    return x * x

f = carre                       # pas de parenthèses : on désigne la fonction
print(f(5), f.__name__)

def appliquer(fonction, valeurs):
    return [fonction(v) for v in valeurs]

print(appliquer(carre, [1, 2, 3]))
print(appliquer(abs, [-4, 2, -1]))
print(sorted(["Ada", "alan", "Grace"], key=str.lower))   # une fonction en argument !
```

### Les fonctions anonymes : `lambda`

`lambda paramètres: expression` crée une petite fonction sans nom, pratique pour un usage ponctuel :

```python
double = lambda x: 2 * x          # équivaut à : def double(x): return 2 * x
print(double(21))

operations = {
    "+": lambda a, b: a + b,
    "*": lambda a, b: a * b,
}
print(operations["*"](6, 7))

etudiants = [("Ada", 17), ("Alan", 14), ("Grace", 19)]
print(max(etudiants, key=lambda e: e[1]))
```

> 🎯 **À retenir** : l'interpréteur exécute le fichier de haut en bas ; `def` ne fait que **définir** ; les built-ins peuvent être écrasés, pas les mots-clés ; une fonction est une valeur que l'on peut passer, stocker et renvoyer.
