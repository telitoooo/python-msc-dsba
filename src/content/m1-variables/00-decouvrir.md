### Un langage de programmation, c'est quoi ?

Un processeur (CPU) ne comprend ni le français ni l'anglais : il ne connaît que le **code machine**, une suite purement numérique d'instructions très élémentaires (lire / écrire un octet en mémoire, opérations arithmétiques et logiques, tests et sauts). Illisible pour un humain !

Un **langage de programmation** est un intermédiaire : on écrit des instructions lisibles, qui sont ensuite traduites en code machine par :

- un **compilateur**, qui traduit tout le programme **avant** l'exécution (C, C++, Rust, Go…) ;
- un **interpréteur**, qui lit et exécute le programme **au fur et à mesure** (Python, JavaScript, R…).

Il existe des centaines de langages (C, C++, Java, C#, JavaScript, Ruby, Rust, Haskell, Go, Fortran, OCaml, Swift, Kotlin, R, Scala…), avec des règles de syntaxe et de sémantique différentes, et des « types » variés : compilés, interprétés, orientés objet, impératifs, fonctionnels, concurrents…

### Python en bref

| Année | Étape |
|---|---|
| 1989 | Guido van Rossum (Pays-Bas) crée Python, langage de script interne |
| 1991 | première version publique (0.9.0) |
| 2000 / 2001 | Python 2.0 ; création de la Python Software Foundation |
| 2008 | Python 3.0 (non compatible avec Python 2) |
| 2021… | Python 3.10, 3.11… : une nouvelle version chaque année (ce site utilise Python 3.14) |

Guido van Rossum a longtemps été le « dictateur bienveillant à vie » (*BDFL*) du langage. Python est un langage **de haut niveau, multi-paradigme** :

- **interprété** → plus lent qu'un langage compilé, mais très souple ;
- **ramasse-miettes** (*garbage collected*) → pas de gestion manuelle de la mémoire ;
- **impératif**, **procédural**, **orienté objet** (module 7) et **fonctionnel** (module 10).

Il est utilisé surtout (mais pas seulement) pour la **data science**, les **services web** et les **scripts**, et figure en tête des classements de popularité (TIOBE, PYPL).

### Où écrire du code ?

1. **Dans l'interpréteur interactif** (la console Python, invite `>>>`) : idéal pour tester rapidement une ligne. On quitte avec `quit()`.
2. **Dans un fichier `.py`** écrit avec un éditeur de texte, puis exécuté.
3. **Dans un IDE** (environnement de développement) : IDLE (fourni avec Python), Spyder, PyCharm, Visual Studio Code… Pour un gros projet, l'IDE apporte coloration syntaxique, détection d'erreurs (*linters*), navigation dans le code, intégration de git…
4. **Dans un navigateur, avec un notebook Jupyter** (ou Google Colab) : utile pour les prototypes d'analyse de données.

```text
$ python hello.py              # exécute le fichier comme un SCRIPT
Hello World!
$ python -m hello              # exécute le MODULE hello (cherché dans le chemin de Python)
Hello World!
$ python -c "print('hello')"   # exécute directement une chaîne de code
hello
```

> 💡 Sur ce site, l'éditeur joue le rôle du fichier `main.py` et le bouton **Exécuter** celui de la commande `python main.py`.

### Les notebooks

Inspirés du logiciel Mathematica, les **notebooks** entremêlent du code et des explications (texte, formules, images). Ils contiennent deux sortes de **cellules** : les cellules de **code** (Python, exécutables) et les cellules de **texte** (Markdown, statiques). L'application Jupyter est en fait un **serveur web** affiché dans le navigateur (`pip install jupyter` puis `jupyter notebook`).

### Bibliothèques et `pip`

Python est livré avec une vaste **bibliothèque standard** (`math`, `random`, `os`, `json`, `datetime`…) : il suffit de l'**importer**. Beaucoup d'autres paquets (NumPy, pandas, matplotlib, scikit-learn…) se trouvent sur **PyPI**, le *Python Package Index* (plus de 500 000 paquets), et s'installent avec **pip** (« *Pip Installs Packages* », acronyme récursif).

```text
$ pip install numpy pandas            # selon les installations : pip3
$ pip install -r requirements.txt     # installe toutes les dépendances d'un projet
```

Un projet liste ses dépendances, avec leurs versions, dans un fichier `requirements.txt` :

```text
matplotlib==3.1.1
numpy==1.17.3
pandas==0.25.2
requests==2.19.1
```

> ⚠️ **`pip` est une commande du terminal, pas une instruction Python !** Écrire `pip install numpy` dans un programme provoque une `SyntaxError`. (Dans ce site, les paquets usuels sont déjà disponibles : il suffit de les importer.)

```python
import math, random              # deux modules de la bibliothèque standard

print(math.log2(10))
print(random.random())           # nombre au hasard dans [0, 1[
print(math.sqrt(16), math.pi)
```

### Trouver de l'aide

La documentation officielle (docs.python.org), les *cheat sheets*, *Python Notes for Professionals*, StackOverflow (beaucoup de réponses… il faut apprendre à juger leur fiabilité), et les assistants comme ChatGPT. Dans l'interpréteur, `help(objet)` affiche la documentation (la *docstring*) d'un module ou d'une fonction.

### Les principes de la syntaxe

- **Pas d'accolades ni de délimiteurs** : les blocs sont marqués par les **deux-points** `:` et l'**indentation** (4 espaces).
- `#` commence un **commentaire** (jusqu'à la fin de la ligne).
- `"""…"""` juste sous un `def` est une **docstring** : la documentation de la fonction, affichée par `help()`.
- Une instruction trop longue peut s'étendre sur plusieurs lignes : de préférence **entre parenthèses**, sinon avec une barre oblique inverse `\` en fin de ligne.
- Les chaînes s'écrivent entre guillemets doubles ou simples.

```python
# Commentaire sur une ligne
n = 10  # un commentaire peut aussi terminer une ligne

def f(x):
    """
    Compute the value of f for parameter x
    """
    y = x
    if x < 0:
        y = -x
    return y

a = b = c = d = e = 1        # affectation chaînée : la même valeur pour tous
# a = a + b + c +            ← incorrect : la ligne s'arrête sur un opérateur
#     d + e
a = (a + b + c +             # correct : entre parenthèses
     d + e)
a = a + b + c + \
    d + e                    # correct aussi, avec \
print(a, f(-3))
help(f)
```

### Anatomie d'un programme Python

Un programme complet enchaîne généralement : des **imports**, des **définitions** de fonctions documentées, la gestion des **erreurs** (`try` / `except`, module 5) et un point d'entrée protégé par `if __name__ == "__main__":` (module 5), qui n'est exécuté que lorsqu'on lance le fichier lui-même (et non quand on l'importe). Le premier exemple du cours récupère les titres du New York Times : vous le retrouverez commenté dans la leçon 11.3.

> 🎯 **À retenir** : Python est un langage interprété, multi-paradigme, créé en 1989 ; on l'utilise dans la console, des fichiers `.py`, un IDE ou des notebooks ; `python fichier.py`, `python -m module`, `python -c "code"` ; `pip install` (dans le terminal !) et `requirements.txt` ; indentation + `:`, `#`, docstrings et `help()`.
