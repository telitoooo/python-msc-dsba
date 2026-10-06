# PyLab : Python par la pratique (MSc DSBA)

Plateforme d'entraînement de type LMS, **bilingue français / anglais**, qui suit l'intégralité du cours
« Python – MSc DSBA » (8 séances, 319 diapositives) : rappels théoriques courts, exemples exécutables,
puis exercices de difficulté croissante à résoudre dans un éditeur intégré, avec **vérification automatique**.
Python s'exécute directement dans le navigateur grâce à [Pyodide](https://pyodide.org) (Python 3.14) :
aucun serveur d'exécution n'est nécessaire.

- **11 modules, 50 leçons, 64 exercices, 192 niveaux** (chaque exercice en 3 niveaux : Core, Extra, Stretch) :

  | Séance | Modules |
  |---|---|
  | 1 | 1. Variables, types et expressions · 2. Structures de contrôle |
  | 2 | 3. Fonctions · 4. Structures de données |
  | 3 | 5. Fichiers, système, modules et exceptions |
  | 4 | 6. Fonctions avancées, portées et mutabilité |
  | 5 | 7. Programmation orientée objet et interfaces graphiques |
  | 6 | 8. NumPy · 9. Pandas et visualisation |
  | 7 | 10. Code pythonique, qualité et efficacité |
  | 8 | 11. Applications web |

- **Plan du cours** (`#/syllabus`) : chaque séance du PDF, ses notions (avec les numéros de diapositives)
  et les leçons qui les traitent, avec la progression
- Bouton **FR / EN** dans l'en-tête : interface, rappels théoriques et énoncés traduits instantanément
  (le choix est mémorisé ; par défaut, la langue du navigateur)
- Éditeur **CodeMirror 6** (coloration Python, autocomplétion, `Ctrl/⌘ + Entrée` pour exécuter)
- **Terminal intégré** : sorties en direct, erreurs en rouge avec une explication pédagogique,
  `input()` alimenté par la zone « Entrées », **figures matplotlib** et images Pillow affichées
- **Bibliothèques** chargées à la demande : NumPy, pandas, matplotlib, Pillow, SciPy (fournies par Pyodide),
  Flask et seaborn (installés depuis PyPI au premier `import`, connexion internet requise)
- **Vrai dossier de travail** : chaque exécution part d'un dossier neuf (`/home/pyodide/projet`) contenant les
  fichiers fournis par l'exercice ; le panneau « Dossier de travail » montre les fichiers créés ou modifiés
- **Plusieurs fichiers** : certains exercices ajoutent des modules éditables en onglets (`banque/compte.py`…)
- Bouton **« Voir la solution »** (masqué par défaut) + « Charger dans l'éditeur »
- Boucles infinies interrompues automatiquement (10 s) ou avec le bouton **Arrêter**
- Progression et code sauvegardés dans le navigateur (localStorage), thème clair/sombre, responsive

Ce que le navigateur ne permet pas est simulé, de façon fidèle au cours : `tkinter` (module `minitk`,
même API, rendu textuel), les requêtes HTTP vers Internet (module `fakeweb`, même API que `requests`),
et le serveur Flask (`app.run()` est simulé ; on teste l'application avec `app.test_client()`).

## 1. Lancer le site tout de suite (sans Node.js)

Le dossier `dist/` contient la version compilée, prête à l'emploi (il n'est pas versionné dans Git :
on le régénère avec `npm run build`). Il suffit de le servir en HTTP :

```bash
cd dist && python3 -m http.server 8000
```

Puis ouvrez <http://localhost:8000>. Une connexion internet est nécessaire au premier chargement
(Pyodide est téléchargé depuis le CDN jsDelivr, puis mis en cache par le navigateur).

> Ouvrir `dist/index.html` par double-clic ne fonctionne pas : les navigateurs bloquent les modules
> JavaScript et les Web Workers en `file://`.

## 2. Développer (modifier le code ou le contenu)

Prérequis : [Node.js](https://nodejs.org) 20 ou plus récent (version LTS conseillée). Pour les
vérifications de contenu : Python 3.14 avec `pip install numpy pandas matplotlib pillow flask seaborn`.

```bash
npm install              # installe les dépendances
npm run dev              # serveur de développement avec rechargement à chaud
npm run build            # régénère dist/
npm run check-content    # traductions FR / EN complètes + chaque notion du plan du cours couverte
npm run verify-content   # chaque solution passe ses tests, chaque code de départ échoue
npm run check-examples   # chaque exemple des leçons s'exécute sans erreur
```

`verify-content` et `check-examples` acceptent un préfixe pour ne vérifier qu'une partie :
`python3 scripts/verify_content.py m7 m8-l2`. Ne les lancez pas en même temps : ils utilisent le même
dossier de travail temporaire.

> ⚠️ Évitez de placer le projet dans un dossier synchronisé (OneDrive, iCloud…) : `node_modules/`
> (environ 150 Mo) et `.git/` y seraient synchronisés en permanence.

## 3. Publier sur GitHub Pages

> 👉 Guide pas à pas pour débutant (avec l'application GitHub Desktop, sans ligne de commande) :
> [PUBLIER-SUR-GITHUB.md](PUBLIER-SUR-GITHUB.md).

Le fichier `.github/workflows/deploy.yml` compile et publie automatiquement le site à chaque `git push`
sur la branche `main` (GitHub fournit Node.js et Python : rien à installer localement). Avant de
publier, il relance `check-content`, `verify-content` et `check-examples` : si une traduction manque,
si une notion n'est plus couverte, si une solution ne passe plus ses tests ou si un exemple plante,
la mise en ligne est bloquée.

Mise en place, une seule fois :

1. créer un dépôt **vide** sur github.com (sans README ni .gitignore) ;
2. relier le projet au dépôt et l'envoyer :

   ```bash
   git remote add origin https://github.com/VOTRE-PSEUDO/NOM-DU-DEPOT.git
   git push -u origin main
   ```

3. sur GitHub : *Settings → Pages → Build and deployment → Source : **GitHub Actions***.

Le site est ensuite en ligne à l'adresse `https://VOTRE-PSEUDO.github.io/NOM-DU-DEPOT/` (suivi du
déploiement dans l'onglet *Actions*). Pour publier une modification : `git add .`, `git commit -m "…"`,
`git push`.

## 4. Architecture

```text
src/
├── main.jsx, App.jsx            # point d'entrée, mise en page, routage par hash (#/lesson/m1-l1)
├── index.css                    # Tailwind CSS v4 + styles du contenu Markdown
├── i18n/
│   ├── LanguageContext.jsx      # contexte de langue : lang, toggle, t() (interface), tr() (contenu {fr, en})
│   └── ui.js                    # textes de l'interface en français et en anglais
├── lib/
│   ├── runner.py                # moteur Python : exécution, stdout/stdin, figures, traceback, tests
│   ├── pyodide.worker.js        # Web Worker qui charge Pyodide, les bibliothèques et exécute runner.py
│   ├── pythonRunner.js          # pilote du worker (file d'attente, délai max, arrêt)
│   ├── errorHints.js            # explications pédagogiques des exceptions (FR / EN)
│   ├── storage.js, config.js
├── hooks/                       # usePythonRun, useProgress, usePersistentState, useHashRoute, useTheme
├── components/
│   ├── editor/                  # CodeEditor, Terminal, CodeWorkspace, RunnableSnippet, FilesPanel, ErrorHint
│   ├── exercise/                # Exercise, TierTabs, TierPanel, TestResults, SolutionReveal
│   ├── layout/                  # Sidebar, TopBar (sélecteur FR / EN)
│   └── ui/                      # Markdown, InlineMarkdown, Button, ProgressBar
├── views/                       # HomeView, LessonView, SyllabusView, SandboxView, NotFoundView
└── content/                     # DONNÉES : leçons et exercices
    ├── index.js                 # liste des modules
    ├── syllabus.js              # plan du cours : séances du PDF → notions → leçons (+ mots-clés de contrôle)
    ├── i18n.js                  # defineModule() : fusionne exercices FR et traductions EN
    ├── tiers.js                 # définition Core / Extra / Stretch
    ├── helpers.js               # py``, md``, test()
    └── m1-variables/ … m11-web/
        ├── index.js             # métadonnées du module et des leçons ({fr, en})
        ├── 01-….md / 01-….en.md # rappel théorique FR / EN (Markdown, blocs ```python exécutables)
        ├── exercises.js         # exercices : énoncés FR, code, tests
        └── exercises.en.js      # traduction anglaise des textes des exercices
.github/workflows/deploy.yml     # vérifications + compilation + publication sur GitHub Pages
scripts/
├── export-content.mjs           # exporte les exercices en JSON
├── verify_content.py            # exécute chaque solution / code de départ avec runner.py et ses tests
├── check_examples.py            # exécute chaque exemple des leçons
└── check-content.mjs            # complétude FR / EN et couverture du plan du cours
```

## 5. Contenu bilingue

- **Interface** : `src/i18n/ui.js` (une clé, un texte par langue).
- **Métadonnées** (titres de modules et de leçons, objectifs) : objets `{ fr: "…", en: "…" }` dans `index.js`.
- **Théorie** : deux fichiers par leçon, `01-listes.md` et `01-listes.en.md` (même nombre de blocs de code).
- **Exercices** : `exercises.js` contient les énoncés en français **et** le code (commun aux deux langues) ;
  `exercises.en.js` ne contient que les textes anglais, dans la même structure :

  ```js
  "m4-l1": {
    ex1: {
      title: "Working with lists",
      core: {
        title: "The grade book",
        prompt: md`…`, hint: md`…`, explanation: md`…`,
        tests: ["`moyenne` is 13.0", "…"],   // libellés des tests, dans le même ordre
      },
    },
  },
  ```

`defineModule(module, exercises, exercisesEn)` (dans `src/content/i18n.js`) fusionne les deux.
`npm run check-content` signale toute traduction manquante ou identique au français.

## 6. Ajouter ou modifier un exercice

Chaque niveau (`core`, `extra`, `stretch`) d'un exercice suit ce format dans `exercises.js` :

```js
core: {
  title: "Convertir des minutes en heures",
  prompt: md`Énoncé en **Markdown** (écrire \` pour un backtick).`,
  hint: md`Indice facultatif.`,
  stdin: "25\n1.75",                 // facultatif : valeurs lues par input()
  files: { "livre.txt": "…" },       // facultatif : fichiers déposés dans le dossier de travail
  modules: { "outils.py": py`…` },   // facultatif : autres fichiers .py éditables (+ solutionModules)
  starter: py`
    total_minutes = 135
    heures = ...
  `,                                 // py`` : code brut, indentation commune retirée
  solution: py`
    total_minutes = 135
    heures = total_minutes // 60
  `,
  explanation: md`Commentaire facultatif affiché sous la solution.`,
  tests: [
    test("`heures` vaut 2", "heures == 2", "heures"),   // libellé, expression Python, valeur à afficher si échec
  ],
},
```

Chaque test est une **expression Python** évaluée après le code de l'élève. Elle a accès à toutes
ses variables et fonctions, ainsi qu'à ces outils :

| Outil | Rôle |
|---|---|
| `OUTPUT`, `LINES` | texte affiché par le programme (brut / lignes non vides) |
| `SOURCE` | code source de l'élève |
| `uses('For')`, `uses('ListComp')` | le code contient ce type de nœud AST |
| `calls('sum')` | le code appelle cette fonction ou méthode |
| `has_loop(f)` | la fonction `f` contient une boucle |
| `run_with(note=8)` | ré-exécute le programme en remplaçant `note = …` ; renvoie ses variables (+ `'OUTPUT'`, `'ERRORS'`, `'EXIT_CODE'`) |
| `run_with(stdin="42\n")`, `run_with(argv=["--top", "5"])` | ré-exécute avec d'autres entrées / arguments de ligne de commande |
| `run_testcase(MaClasseDeTest, f=fausse_f)` | exécute une classe `unittest.TestCase` de l'élève (en remplaçant éventuellement des noms) ; renvoie `{'run', 'failed', 'ok'}` |
| `pick(env, 'a', 'b')` | extrait plusieurs variables d'un `run_with` |
| `capture(f, *args)` | renvoie ce qu'affiche un appel de fonction |
| `approx(a, b)` | égalité approchée pour les `float` |
| `raises(ValueError, f, *args)`, `error_message(f, *args)` | exception levée / son message |
| `read_file(chemin)`, `file_exists(chemin)` | contenu des fichiers du dossier de travail |
| `recursive('f')`, `assigns('list')` | fonction récursive ? nom écrasé ? |
| `FILES`, `uses_in(fichier, 'For')`, `calls_in(fichier, 'print')` | analyse des modules éditables |
| `FIGURES` | figures matplotlib affichées : titres, axes, courbes, légendes… |

Dans les rappels théoriques, les blocs ` ```python ` sont exécutables. Variantes :
` ```python norun ` (exemple statique, par exemple une requête vers Internet),
` ```python setup ` (code ajouté, invisible, en tête des exemples suivants de la leçon),
` ```python stdin=Ada|25 ` (entrées pré-remplies), ` ```python raises=TypeError ` (exemple qui montre
volontairement une erreur).

Lancez ensuite `npm run verify-content` : le script vérifie que chaque solution passe 100 % de ses tests
et que le code de départ, lui, ne les passe pas.
