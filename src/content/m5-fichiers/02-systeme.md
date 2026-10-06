### Le module `os` : dialoguer avec le système

```python
import os

print("Dossier courant :", os.getcwd())
os.makedirs("data/brut", exist_ok=True)          # crée les dossiers intermédiaires
with open("data/ventes.csv", "w", encoding="utf-8") as f:
    f.write("jan;120\nfev;95\n")

print(os.listdir("."))                            # contenu d'un dossier
print(os.listdir("data"))
os.chdir("data")                                  # changer de dossier courant
print("Maintenant dans :", os.getcwd())
os.chdir("..")                                    # revenir au dossier parent
print(os.path.exists("data/ventes.csv"), os.path.isdir("data"))
print(os.path.getsize("data/ventes.csv"), "octets")
```

`os.path` manipule les chemins **sous forme de chaînes** :

| Fonction | Exemple → résultat |
|---|---|
| `os.path.join("data", "x.csv")` | `"data/x.csv"` (bon séparateur selon le système) |
| `os.path.basename("data/x.csv")` | `"x.csv"` |
| `os.path.dirname("data/x.csv")` | `"data"` |
| `os.path.splitext("x.csv")` | `("x", ".csv")` |
| `os.path.exists(p)`, `isfile(p)`, `isdir(p)` | tests d'existence |
| `os.path.getsize(p)`, `getmtime(p)` | taille en octets, date de modification |

### `glob` : trouver des fichiers par motif

`glob.glob(motif)` renvoie la liste des chemins qui correspondent : `*` remplace n'importe quelle suite de caractères, `?` un seul caractère, et `**` (avec `recursive=True`) parcourt tous les sous-dossiers.

```python
import glob, os

for nom in ["a.py", "b.py", "notes.txt", "src/c.py", "src/outils/d.py"]:
    os.makedirs(os.path.dirname(nom) or ".", exist_ok=True)
    open(nom, "w").close()                       # crée un fichier vide

print(sorted(glob.glob("*.py")))                     # dossier courant uniquement
print(sorted(glob.glob("**/*.py", recursive=True)))  # récursivement
```

### `pathlib` : les chemins bien faits

Le module moderne `pathlib` représente un chemin par un **objet `Path`**. L'opérateur `/` assemble les morceaux, sur tous les systèmes.

```python
from pathlib import Path

ici = Path(__file__).parent              # dossier qui contient ce script
data = ici / "data" / "villes.txt"       # '/' assemble les chemins
data.parent.mkdir(parents=True, exist_ok=True)
data.write_text("Paris\nLyon\n", encoding="utf-8")

print(data.exists(), data.name, data.stem, data.suffix)
print(data.read_text(encoding="utf-8").splitlines())
print(data.stat().st_size, "octets")

for chemin in ici.rglob("*.txt"):        # rglob = recherche récursive
    print(chemin.relative_to(ici))
```

| `os.path` / `glob` | `pathlib` |
|---|---|
| `os.path.join(a, b)` | `Path(a) / b` |
| `os.path.exists(p)` | `p.exists()` |
| `os.path.basename(p)` | `p.name` |
| `os.path.splitext(p)[1]` | `p.suffix` |
| `os.listdir(d)` | `d.iterdir()` |
| `glob.glob("**/*.py", recursive=True)` | `d.rglob("*.py")` |
| `open(p).read()` | `p.read_text()` |

> 💡 Préférez `pathlib` à la concaténation de chaînes : `"dossier" + "/" + nom` casse sous Windows, `Path("dossier") / nom` non. `os.path` reste très présent dans le code existant : les deux sont interchangeables.

### Variables d'environnement

Tout programme s'exécute dans un **environnement** : un bloc de paires `clé = valeur` (`PATH`, `HOME`…), que l'on affiche dans un terminal avec la commande `env` (ou `set` sous Windows). `PATH` liste les dossiers où le système cherche les programmes, comme `python3`. En Python, l'environnement est le dictionnaire `os.environ` :

```python
import os

for var in sorted(os.environ)[:5]:        # quelques variables
    print(var, "=", os.environ[var])

print(os.environ.get("HOME"))
os.environ["MON_PARAMETRE"] = "42"     # visible par ce programme et ses sous-processus
print(os.environ["MON_PARAMETRE"])

# Ajouter un dossier au PATH, puis le retirer (exemple du cours)
os.environ["PATH"] = os.environ.get("PATH", "/usr/bin") + ":/usr/local/bin"
print(os.environ["PATH"])
os.environ["PATH"] = os.environ["PATH"].replace(":/usr/local/bin", "")
print(os.environ["PATH"])
```

### Le terminal (shell, ligne de commande)

Console, terminal, shell, ligne de commande : c'est la même chose, une fenêtre où l'on tape des commandes. Les plus utiles, et leur équivalent Python :

| Commande | Effet | En Python |
|---|---|---|
| `ls` | lister les fichiers du dossier courant | `os.listdir()` |
| `pwd` | afficher le dossier de travail (*print working directory*) | `os.getcwd()` |
| `cd dossier` | changer de dossier | `os.chdir(dossier)` |
| `pushd` / `popd` | empiler / dépiler un dossier (pour y revenir ensuite) | |
| `mkdir` / `rmdir` | créer / supprimer un dossier | `os.makedirs()` / `os.rmdir()` |
| `rm` | supprimer un fichier | `os.remove()` |
| `cat` | afficher le contenu d'un fichier | `open(f).read()` |
| `file` | afficher le type d'un fichier | |
| `wc` | compter lignes, mots, caractères (*word count*) | `len(texte.split())` |
| `grep motif f` | chercher un motif dans un fichier | `[l for l in f if motif in l]` |

> 🎯 **À retenir** : `os` pour le système (dossier courant, listes, environnement), `glob` pour chercher par motif, `pathlib.Path` pour manipuler des chemins proprement (`/`, `.name`, `.suffix`, `.rglob()`, `.read_text()`).
