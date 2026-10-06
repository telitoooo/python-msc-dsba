/**
 * Explications pédagogiques des erreurs Python les plus courantes (FR / EN).
 * Affichées sous le terminal quand le programme s'arrête sur une exception.
 */
const HINTS = {
  fr: {
    SyntaxError:
      "Python n'arrive pas à lire votre code : vérifiez les deux-points `:` après `if`, `for`, `def`…, les parenthèses et guillemets fermés, et l'utilisation de `==` (comparaison) plutôt que `=` (affectation).",
    IndentationError:
      "L'indentation (les espaces en début de ligne) est incorrecte. Le bloc qui suit un `:` doit être décalé de 4 espaces, et toutes les lignes d'un même bloc doivent être alignées.",
    TabError: "Vous mélangez tabulations et espaces. Utilisez uniquement des espaces (4 par niveau).",
    NameError:
      "Vous utilisez un nom (variable ou fonction) qui n'existe pas : faute de frappe, majuscule oubliée, ou variable utilisée avant d'être définie ?",
    UnboundLocalError:
      "Dans une fonction, vous lisez une variable avant de lui donner une valeur. Si vous affectez une variable dans une fonction, Python la considère locale à toute la fonction : passez plutôt la valeur en paramètre et renvoyez le résultat avec `return`.",
    TypeError:
      "Une opération est appliquée à un type qui ne la supporte pas (ex. `\"3\" + 1`). Vérifiez les types avec `type()` et convertissez avec `int()`, `float()` ou `str()`. Vérifiez aussi le nombre d'arguments passés aux fonctions (et le `self` des méthodes).",
    ValueError:
      "Le type est correct mais la valeur ne convient pas, par exemple `int(\"abc\")`, `int(\"3.5\")`, ou des tableaux NumPy de formes incompatibles.",
    ZeroDivisionError: "Division par zéro ! Testez le diviseur avec une condition avant de diviser.",
    IndexError:
      "Indice hors limites : une séquence de longueur `n` a des indices de `0` à `n - 1`. Vérifiez vos bornes de boucle (et la forme `shape` d'un tableau NumPy).",
    KeyError:
      "Cette clé n'existe pas dans le dictionnaire (ou cette colonne dans le DataFrame). Testez avec `cle in dico` ou utilisez `dico.get(cle, valeur_par_defaut)`.",
    AttributeError:
      "Cet objet ne possède pas cette méthode / cet attribut. Exemple : `append` existe pour les listes mais pas pour les tuples. Dans une classe, avez-vous bien écrit `self.attribut` dans `__init__` ?",
    EOFError:
      "Le programme appelle `input()` mais il n'y a plus de valeur à lire : ajoutez une valeur par ligne dans la zone « Entrées (stdin) ».",
    RecursionError:
      "Trop d'appels imbriqués : votre fonction récursive n'atteint jamais son cas de base, ou une boucle d'appels se répète sans fin.",
    SortieTropLongue:
      "Votre programme affiche énormément de texte : c'est souvent le signe d'une boucle infinie (`while` dont la condition ne devient jamais fausse).",
    ModuleNotFoundError:
      "Module introuvable : vérifiez son nom (le fichier `outils.py` s'importe avec `import outils`, sans `.py`). Dans le navigateur, numpy, pandas, matplotlib, PIL, scipy, flask et seaborn sont disponibles, mais pas `tkinter` (pas de fenêtres) ni les modules qui ont besoin du réseau ou de processus.",
    AssertionError: "Une assertion (`assert`) est fausse : la condition testée n'est pas vérifiée.",
    FileNotFoundError:
      "Ce fichier n'existe pas dans le dossier de travail. Vérifiez le nom, l'extension et le chemin (relatif au dossier courant, voir `os.getcwd()`), ou ouvrez le panneau « Dossier de travail ».",
    FileExistsError: "Ce fichier ou dossier existe déjà. Utilisez `exist_ok=True` avec `os.makedirs` / `Path.mkdir`.",
    IsADirectoryError: "Ce chemin désigne un dossier, pas un fichier : `open()` ne peut ouvrir que des fichiers.",
    NotADirectoryError: "Une partie du chemin est un fichier alors qu'un dossier était attendu.",
    PermissionError: "Vous n'avez pas le droit d'accéder à ce fichier ou dossier.",
    UnicodeDecodeError:
      "Le fichier n'est pas du texte UTF-8 (fichier binaire ?). Précisez le bon `encoding=` ou ouvrez-le en mode binaire `'rb'`.",
    JSONDecodeError: "Le texte n'est pas du JSON valide : vérifiez le contenu du fichier lu par `json.load`.",
    PicklingError: "Cet objet ne peut pas être sérialisé par pickle (ex. une fonction `lambda`).",
    ImportError: "L'import a échoué : le nom importé n'existe pas dans ce module (faute de frappe ?).",
    UnsupportedOperation:
      "Opération impossible dans ce mode d'ouverture : on ne lit pas un fichier ouvert en `'w'`, on n'écrit pas dans un fichier ouvert en `'r'`.",
    OverflowError: "Le nombre est trop grand pour être représenté (souvent avec des `float`).",
    StopIteration:
      "L'itérateur est épuisé : `next()` a été appelé alors qu'il n'y avait plus d'élément. Une boucle `for` gère cette fin automatiquement.",
    NotImplementedError:
      "Cette méthode est volontairement laissée vide dans la classe parente : redéfinissez-la dans la classe fille.",
    OSError:
      "Opération système impossible. Dans le navigateur, on ne peut ni ouvrir de port réseau, ni lancer de processus, ni ouvrir de fenêtre.",
    LinAlgError: "Erreur d'algèbre linéaire NumPy : matrice singulière ou dimensions incompatibles.",
  },
  en: {
    SyntaxError:
      "Python cannot read your code: check the colons `:` after `if`, `for`, `def`…, closed parentheses and quotes, and that you use `==` (comparison) rather than `=` (assignment).",
    IndentationError:
      "The indentation (spaces at the start of lines) is wrong. The block after a `:` must be shifted by 4 spaces, and all lines of a block must be aligned.",
    TabError: "You are mixing tabs and spaces. Use spaces only (4 per level).",
    NameError:
      "You are using a name (variable or function) that does not exist: typo, missing capital letter, or variable used before being defined?",
    UnboundLocalError:
      "Inside a function, you read a variable before giving it a value. If you assign a variable inside a function, Python treats it as local to the whole function: pass the value as a parameter and return the result instead.",
    TypeError:
      "An operation is applied to a type that does not support it (e.g. `\"3\" + 1`). Check types with `type()` and convert with `int()`, `float()` or `str()`. Also check the number of arguments given to functions (and the `self` of methods).",
    ValueError:
      "The type is right but the value is not, for instance `int(\"abc\")`, `int(\"3.5\")`, or NumPy arrays with incompatible shapes.",
    ZeroDivisionError: "Division by zero! Test the divisor with a condition before dividing.",
    IndexError:
      "Index out of range: a sequence of length `n` has indices `0` to `n - 1`. Check your loop bounds (and the `shape` of a NumPy array).",
    KeyError:
      "This key does not exist in the dictionary (or this column in the DataFrame). Test with `key in d` or use `d.get(key, default)`.",
    AttributeError:
      "This object has no such method / attribute. Example: `append` exists for lists but not for tuples. In a class, did you write `self.attribute` in `__init__`?",
    EOFError:
      "The program calls `input()` but there is no value left to read: add one value per line in the “Inputs (stdin)” box.",
    RecursionError:
      "Too many nested calls: your recursive function never reaches its base case, or a cycle of calls repeats forever.",
    SortieTropLongue:
      "Your program prints a huge amount of text: this is often the sign of an infinite loop (a `while` whose condition never becomes false).",
    ModuleNotFoundError:
      "Module not found: check its name (the file `tools.py` is imported with `import tools`, without `.py`). In the browser, numpy, pandas, matplotlib, PIL, scipy, flask and seaborn are available, but not `tkinter` (no windows) nor modules that need the network or processes.",
    AssertionError: "An assertion (`assert`) is false: the tested condition does not hold.",
    FileNotFoundError:
      "This file does not exist in the working folder. Check the name, the extension and the path (relative to the current folder, see `os.getcwd()`), or open the “Working folder” panel.",
    FileExistsError: "This file or folder already exists. Use `exist_ok=True` with `os.makedirs` / `Path.mkdir`.",
    IsADirectoryError: "This path is a folder, not a file: `open()` can only open files.",
    NotADirectoryError: "Part of the path is a file whereas a folder was expected.",
    PermissionError: "You are not allowed to access this file or folder.",
    UnicodeDecodeError:
      "The file is not UTF-8 text (binary file?). Give the right `encoding=` or open it in binary mode `'rb'`.",
    JSONDecodeError: "The text is not valid JSON: check the content of the file read by `json.load`.",
    PicklingError: "This object cannot be serialized by pickle (e.g. a `lambda` function).",
    ImportError: "The import failed: the imported name does not exist in this module (typo?).",
    UnsupportedOperation:
      "Impossible operation in this opening mode: you cannot read a file opened with `'w'`, nor write to a file opened with `'r'`.",
    OverflowError: "The number is too large to be represented (often with `float`).",
    StopIteration:
      "The iterator is exhausted: `next()` was called while there was no element left. A `for` loop handles this end automatically.",
    NotImplementedError:
      "This method is deliberately left empty in the parent class: override it in the child class.",
    OSError:
      "System operation impossible. In the browser you cannot open a network port, start a process or open a window.",
    LinAlgError: "NumPy linear algebra error: singular matrix or incompatible dimensions.",
  },
};

export function getErrorHint(type, lang = "fr") {
  return HINTS[lang]?.[type] ?? HINTS.fr[type] ?? null;
}
