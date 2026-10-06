import { md } from "../helpers.js";

export default {
  "m5-l1": {
    ex1: {
      title: "Reading and writing text files",
      core: {
        title: "A grade book on disk",
        prompt: md`
          Write two functions:

          - \`ecrire_notes(chemin, notes)\`: writes the \`notes\` dictionary to the file, one line
            \`name;grade\` per student (the file is **overwritten** if it exists);
          - \`lire_notes(chemin)\`: reads this file back and returns the dictionary \`{name: grade}\`, the grades
            being converted to \`float\`. Empty lines must be ignored.

          Use \`with open(...)\` with \`encoding="utf-8"\`. After running, open the **Working directory**
          panel below the terminal to see the file created.
        `,
        hint: md`
          When reading: \`for ligne in f:\`, then \`ligne.strip()\`; if the line is empty, \`continue\`;
          otherwise \`nom, note = ligne.split(";")\`.
        `,
        tests: [
          "`notes.txt` contains one `name;grade` line per student",
          "`lire_notes` reads the grades back as `float`",
          "Empty lines are ignored",
          "`ecrire_notes` overwrites the existing file (mode `\"w\"`)",
          "Files are opened with `with`",
        ],
      },
      extra: {
        title: "Word statistics of a book",
        prompt: md`
          The working directory contains \`livre.txt\`: the beginning of *Pride and Prejudice* by Jane Austen
          (the practical session downloads it from Project Gutenberg with \`requests\`, unavailable in the browser).

          1. \`lire_mots(chemin)\`: list of all the words, **in lowercase**, without punctuation. Rule:
             every letter (\`c.isalpha()\`) is kept, every other character becomes a space.
          2. \`compter_mots(mots)\`: dictionary \`{word: occurrences}\`, **written by hand**.
          3. \`ecrire_frequences(compte, chemin)\`: writes one \`word count\` line per word, from the most frequent
             to the least frequent, and in **alphabetical order** in case of a tie.

          The program then compares with \`collections.Counter\`, whose \`most_common(n)\` does the last step for you.
        `,
        hint: md`
          \`"".join(c if c.isalpha() else " " for c in texte)\` then \`.split()\`.
          For sorting: \`sorted(compte.items(), key=lambda paire: (-paire[1], paire[0]))\`.
        `,
        explanation: md`
          With \`Counter\`, everything fits in two lines: \`compte = Counter(mots)\` then
          \`compte.most_common(20)\`. Writing the manual version first helps you understand what it does.
        `,
        tests: [
          "`lire_mots` ignores punctuation and case",
          "`livre.txt` contains 153 words, 99 of them different",
          "`compter_mots` gives the same result as `Counter`",
          "`frequences.txt` starts with `a 6`, `of 6`, `is 5`, `it 5`",
          "One line per different word",
        ],
      },
      stretch: {
        title: "Reading the map of France",
        prompt: md`
          The file \`france_lite.map\` describes cities connected by roads, in two blocks separated by \`--\`:

          \`\`\`text
          La Baule-Escoublac:356:638          ← city:x:y
          ...
          --
          La Baule-Escoublac:Saint-Nazaire:15 ← cityA:cityB:distance
          \`\`\`

          1. \`lire_carte(chemin)\` returns **three nested dictionaries**:
             \`{city: {"coords": (x, y), "next": {neighbour: distance}}}\`, with integers.
             Roads are **two-way**: each road appears in the \`next\` of both its cities.
          2. \`voisins_tries(carte, ville)\` returns the list of \`(neighbour, distance)\`, from the closest to the farthest.

          Once this works, your code should also read the full \`france.map\` file from the session's resources.
        `,
        hint: md`
          Read all the non-empty lines, find the index of \`"--"\` with \`lignes.index("--")\`,
          then process \`lignes[:i]\` and \`lignes[i + 1:]\` separately with \`split(":")\`.
        `,
        tests: [
          "The map contains 8 cities",
          "Coordinates are a tuple of integers",
          "Neighbours of La Baule-Escoublac (roads in both directions)",
          "Nantes has only one neighbour: Saint-Nazaire at 63 km",
          "`voisins_tries` sorts by distance",
          "Works on another map",
        ],
      },
    },
  },
  "m5-l2": {
    ex1: {
      title: "Exploring a file tree",
      core: {
        title: "Finding files with glob",
        prompt: md`
          The working directory contains a small project \`analyse_ventes/\` (open the
          **Working directory** panel to browse it). With the \`glob\` module, create:

          - \`racine\`: the **sorted** list of the \`.py\` files located directly in \`analyse_ventes/\`;
          - \`tous\`: the **sorted** list of all the \`.py\` files of the project, subfolders included;
          - \`nb_csv\`: the number of \`.csv\` files in \`analyse_ventes/data/\`.
        `,
        hint: md`
          \`glob.glob("analyse_ventes/*.py")\` for a single level;
          \`glob.glob("analyse_ventes/**/*.py", recursive=True)\` for all levels.
        `,
        explanation: md`
          \`glob\` patterns **ignore hidden files** (whose name starts with a dot,
          such as \`.env\`). \`pathlib\` includes them.
        `,
        tests: [
          "`racine`: `app.py` and `config.py`",
          "`tous`: the 6 `.py` files, sorted",
          "`nb_csv` is 2",
          "The `glob` module is used",
        ],
      },
      extra: {
        title: "Inventory with pathlib",
        prompt: md`
          Do the exploration again with \`pathlib\`, the modern module for handling paths:

          - \`inventaire(dossier, extension)\`: sorted list of the pairs \`(relative path, size in bytes)\`
            of all the files with this extension, subfolders included. The path is relative to
            \`dossier\` and written with \`/\` (e.g. \`"data/ventes_2025.csv"\`);
          - \`taille_totale(dossier)\`: sum of the sizes of **all** the files of the folder (hidden ones included).

          The program also displays the last modification date of each file.
        `,
        hint: md`
          \`Path(dossier).rglob("*" + extension)\`, then \`p.relative_to(dossier).as_posix()\` and
          \`p.stat().st_size\`. To keep only files: \`p.is_file()\`.
        `,
        explanation: md`
          Compare with the \`os.path\` + \`glob\` version: \`pathlib\` gathers everything in a single object
          (\`.name\`, \`.suffix\`, \`.stat()\`, \`.rglob()\`…), which makes the code easier to read and maintain.
        `,
        tests: [
          "`inventaire(..., '.csv')` gives relative paths and sizes",
          "`inventaire(..., '.py')` lists the 6 modules, sorted",
          "`taille_totale` counts every file (hidden ones included)",
          "`pathlib` is used",
        ],
      },
      stretch: {
        title: "Tidying up a downloads folder",
        prompt: md`
          The \`telechargements/\` folder is a mess. Write \`ranger_par_extension(dossier)\` which:

          - moves each **file** located directly in \`dossier\` to a subfolder named after
            its extension, in lowercase and without the dot (\`rapport.pdf\` → \`pdf/rapport.pdf\`);
          - puts files without an extension in \`autres/\`;
          - ignores the existing subfolders;
          - returns a dictionary \`{subfolder name: number of files moved}\`.

          After running, the **Working directory** panel shows the moved files.
        `,
        hint: md`
          \`for p in Path(dossier).iterdir():\`; \`p.is_file()\`; \`p.suffix\` is \`""\` without an extension.
          Create the target with \`cible.mkdir(exist_ok=True)\` then move with \`p.rename(cible / p.name)\`.
          Careful: build the list of files **before** moving anything.
        `,
        tests: [
          "The summary counts the files per extension",
          "The CSV files are in `telechargements/csv/`",
          "`LISEZMOI` is put in `autres/`",
          "No file left at the root of the folder",
          "A second call moves nothing (subfolders ignored)",
        ],
      },
    },
    ex2: {
      title: "Environment and terminal commands",
      core: {
        title: "Configuring through the environment",
        prompt: md`
          Environment variables are read and modified with the \`os.environ\` dictionary. Write:

          1. \`lire_parametre(nom, defaut=None)\`: the value of the variable \`nom\`, or \`defaut\` if it does not
             exist (without a \`KeyError\`);
          2. \`ajouter_au_path(dossier)\`: adds \`dossier\` **at the end** of the \`PATH\` variable (folders are
             separated by \`:\`), **only if it is not already there**;
          3. \`retirer_du_path(dossier)\`: removes \`dossier\` from \`PATH\`.

          Example: with \`PATH = "/usr/bin:/bin"\`, \`ajouter_au_path("/opt/py")\` gives \`"/usr/bin:/bin:/opt/py"\`.
        `,
        hint: md`
          \`os.environ.get(nom, defaut)\`. For \`PATH\`: \`dossiers = os.environ.get("PATH", "").split(":")\`,
          then \`":".join(...)\` to rebuild the string (ignoring the empty pieces).
        `,
        tests: [
          "`lire_parametre`: value or default",
          "`ajouter_au_path` appends at the end",
          "No duplicate in `PATH`",
          "`retirer_du_path`",
          "`os.environ` is used",
        ],
      },
      extra: {
        title: "A mini wc",
        prompt: md`
          The terminal command \`wc\` (*word count*) displays the number of **lines**, **words** and
          **characters** of a file. Program it:

          1. \`wc(chemin)\` returns the tuple \`(lines, words, characters)\`. Like \`wc\`, lines are counted
             by counting the \`"\\n"\`; words are separated by whitespace;
          2. \`wc_motif(motif)\` applies \`wc\` to every file matching the \`glob\` pattern and returns
             a dictionary \`{path: (lines, words, characters)}\`, plus a \`"total"\` key that adds everything up.

          The \`textes/\` folder contains four files (one of them empty).
        `,
        hint: md`
          \`contenu.count("\\n")\`, \`len(contenu.split())\`, \`len(contenu)\`. For the total, add the
          tuples component by component (for instance with three counters).
        `,
        tests: [
          "`wc('textes/poeme.txt')` → (5, 21, 106)",
          "Empty file and file without a final line break",
          "`wc_motif`: one result per file",
          "The total",
          "A pattern without any match",
        ],
      },
      stretch: {
        title: "A mini grep",
        prompt: md`
          The command \`grep pattern files\` displays the lines of the files that contain a pattern.
          Program:

          1. \`grep(motif, chemins, ignorer_casse=False)\` returns the list of the lines found, in the format
             \`"path:number:line"\` (lines numbered from 1, without their \`"\\n"\`), in the order of the
             files then of the lines. With \`ignorer_casse=True\` (ignore case), \`"python"\` also finds \`"Python"\`;
          2. \`compter(motif, chemins)\` (like \`grep -c\`) returns \`{path: number of lines found}\`
             for each file (0 included).

          The program searches for \`python\` in all the \`textes/*.txt\` files, sorted.
        `,
        hint: md`
          \`for numero, ligne in enumerate(f, start=1):\`; compare \`motif.lower() in ligne.lower()\` if
          \`ignorer_casse\`. \`ligne.rstrip("\\n")\` removes the final line break.
        `,
        tests: [
          "Case-sensitive search",
          "`ignorer_casse=True`",
          "Lines numbered from 1",
          "`compter`",
          "The program displays the lines found",
        ],
      },
    },
  },
  "m5-l3": {
    ex1: {
      title: "JSON and pickle",
      core: {
        title: "Saving a configuration as JSON",
        prompt: md`
          1. \`sauver_json(objet, chemin)\` saves the object as JSON, **indented** (\`indent=2\`) and
             keeping accented characters (\`ensure_ascii=False\`).
          2. \`charger_json(chemin)\` reads the file back and returns the object.
          3. After the round trip, \`identiques\` must tell whether the configuration read back equals the original.

          Then open \`config.json\` in the **Working directory** panel: what do \`True\` and \`None\` become?
        `,
        hint: md`
          \`with open(chemin, "w", encoding="utf-8") as f: json.dump(objet, f, indent=2, ensure_ascii=False)\`
          and \`json.load(f)\` when reading.
        `,
        tests: [
          "`identiques` is `True`",
          "`config.json` is valid JSON",
          "The file is indented",
          "Accents are kept (`ensure_ascii=False`)",
          "`True` and `None` become `true` and `null`",
          "Round trip of a list",
        ],
      },
      extra: {
        title: "What JSON and pickle accept",
        prompt: md`
          Write \`essai_json(objet)\` and \`essai_pickle(objet)\`. Each one performs a round trip **in memory**
          (\`json.dumps\` then \`json.loads\`, \`pickle.dumps\` then \`pickle.loads\`) and returns:

          - \`"identique"\` if the rebuilt object equals the original;
          - \`"différent"\` if it has been transformed;
          - \`"erreur"\` if serialisation fails.

          Before running, **predict** the table displayed: what happens to a tuple, a set,
          an integer key, a \`lambda\`?
        `,
        hint: md`
          Wrap the round trip in a \`try\`. JSON raises a \`TypeError\` for an unknown type; pickle raises
          a \`PicklingError\` (or another exception): \`except Exception\` is acceptable here.
        `,
        explanation: md`
          JSON turns tuples into lists and keys into strings, and rejects \`set\`s: it is an **exchange**
          format, limited to the types every language understands. pickle faithfully rebuilds Python
          objects, but not \`lambda\`s (they have no name by which to find them again).
        `,
        tests: [
          "A simple dictionary: identical in both formats",
          "A tuple: different in JSON, identical in pickle",
          "A set: error in JSON, identical in pickle",
          "An integer key: different in JSON",
          "A `lambda`: error in both formats",
        ],
      },
      stretch: {
        title: "Saving the map of France",
        prompt: md`
          The \`lire_carte\` function from lesson 5.1 is provided. Save the map in two ways:

          1. \`sauver_carte_json(carte, chemin)\` and \`charger_carte_json(chemin)\`: when loading, the
             coordinates (which became lists in JSON) must **become tuples again**, so that the map
             read back equals the original;
          2. \`sauver_carte_pickle(carte, chemin)\` and \`charger_carte_pickle(chemin)\` (**binary** file).

          The program then compares both files: \`json_ok\`, \`pickle_ok\`, \`taille_json\`, \`taille_pickle\`.
          Which one would you rather send to someone else, and why?
        `,
        hint: md`
          After \`json.load\`, loop over \`carte.values()\` and replace \`infos["coords"]\` with
          \`tuple(infos["coords"])\`. For pickle: modes \`"wb"\` and \`"rb"\`, without \`encoding\`.
        `,
        explanation: md`
          The JSON file is readable, editable by hand and usable from any language:
          that is the one you send. The pickle is reserved for Python, and must never be loaded if it comes
          from an untrusted source.
        `,
        tests: [
          "The map read back from JSON equals the original",
          "The coordinates read back are tuples",
          "The map read back from pickle equals the original",
          "`carte.pickle` is a binary file",
          "The sizes are measured",
        ],
      },
    },
  },
  "m5-l4": {
    ex1: {
      title: "Defensive programming",
      core: {
        title: "Catching common errors",
        prompt: md`
          Write three functions that **never crash**:

          - \`division_sure(a, b)\`: returns \`a / b\`, or \`None\` in case of a division by zero;
          - \`lire_entier(texte, defaut=0)\`: returns \`int(texte)\`, or \`defaut\` if the conversion fails;
          - \`moyenne_fichier(chemin)\`: average of the numbers of the file (one per line), **ignoring**
            invalid or empty lines; returns \`None\` if the file does not exist or contains no number.

          The file \`mesures.txt\` is provided.
        `,
        hint: md`
          \`try: ... except ZeroDivisionError:\`, \`except ValueError:\` and \`except FileNotFoundError:\`.
          In \`moyenne_fichier\`, one \`try\` per line for the conversion, and another one around the \`open\`.
        `,
        tests: [
          "`division_sure(10, 4)` → 2.5 and `division_sure(1, 0)` → `None`",
          "`lire_entier`: `'42'` → 42, `'4.2'` → 0, `'abc'` with default -1 → -1",
          "`moyenne_fichier('mesures.txt')` → 12.0",
          "Missing file → `None`",
          "File without any number → `None`",
          "`try` / `except` blocks are used",
        ],
      },
      extra: {
        title: "Raising your own exceptions",
        prompt: md`
          1. \`verifier_note(note)\` returns the grade if it is valid, and otherwise **raises**:
             - a \`TypeError\` if it is not a number (\`int\` or \`float\`);
             - a \`ValueError\` with the message \`"<grade> est hors de [0, 20]"\` if it is out of range.
          2. \`analyser(textes)\` receives inputs (strings) and returns the tuple \`(notes, erreurs)\`:
             - the valid grades converted to \`float\`;
             - one message per rejected input: \`"'abc' n'est pas un nombre"\` if the conversion fails,
               or the message of the \`ValueError\` raised by \`verifier_note\`.

          (The messages are in French, as in the provided code.)
        `,
        hint: md`
          \`raise ValueError(f"{note} est hors de [0, 20]")\`. In \`analyser\`, use two separate \`try\`:
          one for \`float(texte)\` (message \`f"{texte!r} n'est pas un nombre"\`), one for \`verifier_note\`
          (message \`str(e)\`).
        `,
        tests: [
          "`verifier_note(15)` → 15",
          "Grade out of range → `ValueError`",
          "Message: `25 est hors de [0, 20]`",
          "String → `TypeError`",
          "`analyser` separates grades and errors",
          "`raise` is used",
        ],
      },
      stretch: {
        title: "A robust bank account",
        prompt: md`
          Program the bank account of the practical session: the balance survives restarts and **no input must
          cause a traceback**. The account is a dictionary \`{"solde": float, "historique": [...]}\`.

          - \`deposer(compte, montant)\` / \`retirer(compte, montant)\` (deposit / withdraw): raise \`ValueError\` if
            the amount is not strictly positive; \`retirer\` raises \`SoldeInsuffisant\` (provided) if the amount
            exceeds the balance. Each successful operation appends \`["dépôt", montant]\` or \`["retrait", montant]\`
            to the history.
          - \`sauvegarder(compte, chemin)\` (JSON) and \`charger(chemin, solde_initial=100.0)\`: if the file is
            missing **or unreadable**, \`charger\` returns a new account.
          - \`executer(compte, commande)\` handles \`"depot 50"\`, \`"retrait 30"\`, \`"solde"\`, \`"historique"\` and
            **returns** the message to display (in French), for example:

          | Command | Message returned |
          |---|---|
          | \`solde\` | \`Solde : 100.00 €\` |
          | \`depot 50\` | \`Dépôt de 50.00 € effectué. Solde : 150.00 €\` |
          | \`retrait abc\` | \`Montant invalide : abc\` |
          | \`retrait 500\` | \`Solde insuffisant : 150.00 €\` |
          | \`retrait -5\` | \`Le montant doit être positif\` |
          | \`historique\` | one line per operation, e.g. \`dépôt 50.00 €\` (or \`Aucune opération\`) |
          | other | \`Commande inconnue : bonjour\` |

          The \`main()\` function is provided: it reads the commands from the **Inputs** area.
        `,
        hint: md`
          In \`executer\`, split the command with \`split()\`. Convert the amount in a first
          \`try\` (\`except ValueError\` → \`Montant invalide\`), then call \`deposer\` / \`retirer\` in a
          second \`try\` (\`except (ValueError, SoldeInsuffisant) as e\` → \`str(e)\`).
        `,
        explanation: md`
          The practical session also suggests a version with \`pickle\`. For a state that others might read or fix
          by hand, JSON is preferable: it is readable and independent of Python.
        `,
        tests: [
          "`deposer` updates balance and history",
          "Negative or zero amount → `ValueError`",
          "Withdrawal too large → `SoldeInsuffisant`, balance unchanged",
          "`executer` returns the right messages",
          "`charger`: missing or corrupted file → new account",
          "`compte.json` contains the final state (120 € and 2 operations)",
          "The program displays no traceback",
        ],
      },
    },
  },
  "m5-l5": {
    ex1: {
      title: "Modules and the standard library",
      core: {
        title: "Hello, depending on the time",
        prompt: md`
          The program reads your name and greets you depending on the time (in French): *Bonjour* (good morning),
          *Bon après-midi* (good afternoon), *Bonsoir* (good evening) or *Bonne nuit* (good night). The bounds must
          be **named constants** (no “magic” numbers in the middle of the conditions):
          \`MATIN = 5\`, \`APRES_MIDI = 12\`, \`SOIR = 18\`, \`NUIT = 22\`.

          - \`salutation(heure)\`: \`"Bonjour"\` from 5:00 to 11:59, \`"Bon après-midi"\` from 12:00 to 17:59,
            \`"Bonsoir"\` from 18:00 to 21:59, \`"Bonne nuit"\` otherwise;
          - \`saluer(nom, maintenant=None)\`: returns for example \`"Bonjour Ada !"\`. If \`maintenant\`
            (a \`datetime\`) is not provided, use the current time with \`datetime.now()\`.
        `,
        hint: md`
          \`if MATIN <= heure < APRES_MIDI:\` …; the hour of a \`datetime\` is \`maintenant.hour\`.
          The \`maintenant\` parameter lets you **test** the function at any time of day.
        `,
        tests: [
          "Constants `MATIN`, `APRES_MIDI`, `SOIR`, `NUIT`",
          "`salutation` respects all the bounds",
          "`saluer` at 9:30 → `Bonjour Ada !`",
          "Without a date, the current time is used (`datetime.now()`)",
          "The program greets the user",
        ],
      },
      extra: {
        title: "Time flies",
        prompt: md`
          With the \`datetime\` and \`time\` modules:

          1. \`jours_vecus(naissance, aujourd_hui=None)\`: number of days between two \`date\`s
             (today by default, with \`date.today()\`);
          2. \`formater_timestamp(ts)\`: converts a *timestamp* (seconds since 1 January 1970) into the
             text \`"dd/mm/yyyy à hh:mm:ss"\`, in universal time (UTC);
          3. \`chronometrer(f, *args)\`: calls \`f(*args)\` and returns the tuple \`(result, duration in seconds)\`,
             measured with \`time.perf_counter()\`.

          Why \`perf_counter\` rather than \`time.time()\` to time code?
        `,
        hint: md`
          The difference of two \`date\`s is a \`timedelta\`: use \`.days\`.
          \`datetime.fromtimestamp(ts, timezone.utc).strftime("%d/%m/%Y à %H:%M:%S")\`.
        `,
        explanation: md`
          \`time.time()\` follows the system clock, which can be adjusted (network synchronisation, daylight
          saving time) during the measurement. \`perf_counter()\` is a **monotonic**, high-precision clock,
          designed to measure durations.
        `,
        tests: [
          "From 14/05/2003 to 05/10/2026: 8545 days",
          "By default, comparison with today",
          "`formater_timestamp(0)` → `01/01/1970 à 00:00:00`",
          "`formater_timestamp(1_800_000_000)` → `15/01/2027 à 08:00:00`",
          "`chronometrer` returns the result and a duration",
          "`perf_counter` is used",
        ],
      },
      stretch: {
        title: "Splitting the bank account into modules",
        prompt: md`
          The program in \`main.py\` works, but everything is in a single file. Split it into a
          **package** \`banque\` (see the tabs above the editor):

          \`\`\`text
          banque/
              __init__.py
              compte.py      # SoldeInsuffisant, nouveau_compte, deposer, retirer: no print or input
              stockage.py    # sauvegarder, charger (JSON)
          main.py            # only the interface: imports + main()
          \`\`\`

          \`main.py\` must no longer contain business logic, and \`compte.py\` no \`print\` or \`input\`:
          this separation is what makes the code **testable**. The behaviour of the program must not change.
        `,
        hint: md`
          In \`main.py\`: \`from banque.compte import SoldeInsuffisant, deposer, retirer\` and
          \`from banque.stockage import charger, sauvegarder\`. \`stockage.py\` needs \`nouveau_compte\`:
          \`from banque.compte import nouveau_compte\`.
        `,
        tests: [
          "`main.py` no longer contains business logic",
          "`main.py` imports from the `banque` package",
          "`compte.py` defines `deposer` and `retirer`, without `print` or `input`",
          "`stockage.py` handles the JSON backup",
          "The program behaves as before",
          "`compte.json` is saved",
        ],
      },
    },
  },
};
