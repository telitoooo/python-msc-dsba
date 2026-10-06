### Fichiers, dossiers et chemins

Les fichiers sont rangés dans une **arborescence de dossiers** qui part d'une racine : `/` sous macOS et Linux, `C:\` sous Windows. Pour désigner un fichier, on utilise un **chemin** :

- **absolu** : depuis la racine, ex. `/home/ada/cours/notes.txt` ;
- **relatif** : depuis le **dossier de travail courant** (*current working directory*), ex. `notes.txt` ou `data/ventes.csv`. `.` désigne le dossier courant et `..` le dossier parent.

> 💡 **Sur ce site**, chaque exécution démarre dans un dossier neuf, `/home/pyodide/projet`, qui contient `main.py` (votre code) et les éventuels fichiers fournis par l'exercice. Sous le terminal, le panneau **Dossier de travail** affiche les fichiers que votre programme a créés ou modifiés.

### Ouvrir un fichier : `open()` et `with`

`open(chemin, mode, encoding=...)` renvoie un **objet fichier**. Le bloc `with` le **ferme automatiquement** à la fin, même en cas d'erreur : c'est la forme à privilégier.

```python
with open("courses.txt", "w", encoding="utf-8") as f:
    f.write("pain\n")
    f.write("lait\n")

with open("courses.txt", "r", encoding="utf-8") as f:
    contenu = f.read()

print(contenu)
print(repr(contenu))   # repr montre les \n cachés
```

Sans `with`, il faut penser à fermer soi-même : `f = open(...)` … `f.close()`. Un fichier mal fermé peut perdre les dernières données écrites.

### Les modes d'ouverture

| Mode | Effet |
|---|---|
| `"r"` | lecture (mode par défaut) ; `FileNotFoundError` si le fichier n'existe pas |
| `"w"` | écriture : crée le fichier, ou **l'écrase** s'il existe |
| `"a"` | ajout (*append*) à la fin ; crée le fichier si besoin |
| `"x"` | création exclusive ; erreur si le fichier existe déjà |
| `"b"` | à combiner pour les fichiers binaires : `"rb"`, `"wb"` (images, pickle…) |

> ⚠️ **Toujours préciser `encoding="utf-8"`** pour les fichiers texte. Sans cela, l'encodage par défaut dépend du système (notamment sous Windows) et les accents peuvent être corrompus.

### Lire un fichier

| Méthode | Résultat |
|---|---|
| `f.read()` | tout le contenu en une seule chaîne |
| `f.readline()` | la ligne suivante (avec son `\n`) |
| `f.readlines()` | la liste de toutes les lignes |
| `for ligne in f:` | parcours ligne par ligne, sans tout charger en mémoire |

```python
with open("journal.txt", "w", encoding="utf-8") as f:
    f.write("lundi;12\nmardi;15\nmercredi;9\n")

total = 0
with open("journal.txt", encoding="utf-8") as f:
    for ligne in f:                       # chaque ligne finit par "\n"
        jour, valeur = ligne.strip().split(";")
        total += int(valeur)
        print(f"{jour:<9} {valeur:>3}")
print("Total :", total)
```

> ⚠️ Chaque ligne lue **conserve son `\n` final** : nettoyez-la avec `strip()` avant de la découper, et attention aux lignes vides en fin de fichier.

### Écrire dans un fichier

`write()` écrit une chaîne **sans ajouter de retour à la ligne** : ajoutez vous-même les `\n`. On peut aussi utiliser `print(..., file=f)`.

```python
notes = {"Ada": 17, "Alan": 14}

with open("notes.csv", "w", encoding="utf-8") as f:
    f.write("nom;note\n")
    for nom, note in notes.items():
        f.write(f"{nom};{note}\n")

with open("notes.csv", "a", encoding="utf-8") as f:   # "a" : ajout à la fin
    print("Grace", 19, sep=";", file=f)

with open("notes.csv", encoding="utf-8") as f:
    print(f.read())
```

> 🎯 **À retenir** : `with open(chemin, mode, encoding="utf-8") as f:` ; `"r"` lit, `"w"` écrase, `"a"` ajoute ; `for ligne in f` + `strip()` pour lire proprement ; `write` n'ajoute pas de `\n`.
