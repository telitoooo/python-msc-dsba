import { md } from "../helpers.js";

export default {
  "m6-l1": {
    ex1: {
      title: "The program as seen by the interpreter",
      core: {
        title: "Functions as values",
        prompt: md`
          1. \`appliquer(fonction, valeurs)\`: returns the list of the \`fonction(v)\` for each \`v\`.
          2. \`composer(f, g)\`: **returns a function** mapping \`x\` to \`f(g(x))\`.
          3. \`OPERATIONS\`: a dictionary mapping \`"+"\`, \`"-"\`, \`"*"\`, \`"/"\` to functions
             (\`lambda\`s) with two parameters.
          4. \`calculer(a, symbole, b)\`: uses the dictionary **without any \`if\`**; if the symbol is
             unknown, raises \`ValueError("Opération inconnue : %")\`.
        `,
        hint: md`
          \`composer\` can return \`lambda x: f(g(x))\`. In \`calculer\`, \`OPERATIONS[symbole]\` raises
          a \`KeyError\` if the key is missing: catch it to raise a \`ValueError\`.
        `,
        tests: [
          "`appliquer(abs, [-3, 1, -2])` → `[3, 1, 2]`",
          "`composer` returns a function: f(g(x))",
          "`OPERATIONS` contains four functions",
          "`calculer` gives the right results",
          "Unknown symbol → `ValueError`",
          "No `if`: the dictionary chooses the function",
        ],
      },
      extra: {
        title: "Execution order and overwritten built-ins",
        prompt: md`
          1. **Without running it**, predict the order in which the letters are printed, and write it in
             \`ordre\` (for example \`"ABCDEF"\`). Remember: \`def\` only defines.
          2. The second part crashes: it has overwritten built-in functions. Fix it **by renaming
             the variables**, without changing what it computes nor the line \`lettres = list("abc")\`.
        `,
        hint: md`
          Is the function \`g\` called anywhere? For part 2, rename \`list\` to
          \`nombres\` and \`sum\` to \`total\` wherever they designate your data.
        `,
        tests: [
          "`ordre` is the right prediction",
          "No overwritten built-in any more (`list`, `sum`, `max`…)",
          "`lettres` is `['a', 'b', 'c']`",
          "The results are unchanged",
        ],
      },
      stretch: {
        title: "Hands-On 13: the Nim game",
        prompt: md`
          We start with \`batons\` sticks; each player in turn takes between 1 and \`max_prise\` of them.
          **Whoever takes the last stick wins.** A strategy is a **function**
          \`strategie(batons, max_prise)\` returning the number of sticks taken.

          1. \`coup_aleatoire\`: a random number between 1 and \`max_prise\`, without exceeding what is left.
          2. \`coup_gagnant\`: find the winning strategy on paper first (hint: remainders of division).
             If no move wins, take 1 stick.
          3. \`partie(batons, max_prise, joueur_1, joueur_2, bavard=False)\`: makes both strategies play
             (player 1 starts) and returns the number of the winner. An illegal move raises a \`ValueError\`.
             If \`bavard\` (verbose), each move is printed: \`Joueur 1 prend 2 → reste 20\`.
        `,
        hint: md`
          Always leave your opponent a **multiple of \`max_prise + 1\`**: whatever they take, you
          can come back to the next multiple. So you must take \`batons % (max_prise + 1)\`.
        `,
        explanation: md`
          Positions that are multiples of \`max_prise + 1\` are **losing** for the player who must move. With 22 sticks
          and at most 3, the first player takes \`22 % 4 = 2\` and leaves 20: a guaranteed win.
          Since strategies are simple functions, \`partie\` can make any of them play.
        `,
        tests: [
          "`coup_aleatoire` follows the rules and varies",
          "`coup_gagnant`: 22 → 2, 7 → 3, 3 → 3, and 8 (losing position) → 1",
          "Wins against “takes 1” starting at 22",
          "With 20 sticks, the first player loses against the winning strategy",
          "1000 wins out of 1000 against chance",
          "An illegal move raises `ValueError`",
          "Verbose mode: `Joueur 1 prend 1 → reste 4`",
        ],
      },
    },
  },
  "m6-l2": {
    ex1: {
      title: "Closures and function factories",
      core: {
        title: "A multiplier factory",
        prompt: md`
          1. \`make_multiplier(k)\` returns a **function** that multiplies its argument by \`k\`.
          2. \`multiplicateurs\`: the list of the 10 functions obtained for \`k\` from 1 to 10.
          3. \`resultats\`: the list of the results of each of these functions applied to 5.
        `,
        hint: md`
          Define an inner function \`def multiplier(x): return x * k\` then \`return multiplier\`
          (without parentheses). Then: \`[make_multiplier(k) for k in range(1, 11)]\`.
        `,
        tests: [
          "`make_multiplier(3)(7)` → 21",
          "`make_multiplier` returns a function",
          "10 multipliers",
          "`resultats` is `[5, 10, …, 50]`",
          "Each function keeps its own `k`",
        ],
      },
      extra: {
        title: "Counting without a global variable",
        prompt: md`
          1. \`make_counter()\` returns a function that returns 1, then 2, then 3… at each call.
             Two counters must be **independent**.
          2. The course counts the calls of a function with \`global\`. Do better with a closure:
             \`espionner(f)\` (spy on) returns the pair \`(g, nb_appels)\` where \`g\` behaves exactly like \`f\`
             but counts its calls, and \`nb_appels()\` returns that number.

          The program uses \`espionner\` to measure how many evaluations the (provided) \`dichotomie\` needs.
        `,
        hint: md`
          In \`espionner\`: a variable \`compteur = 0\`, a function \`g(*args)\` doing
          \`nonlocal compteur\`, incrementing it and returning \`f(*args)\`, and a function \`nb_appels()\` returning \`compteur\`.
        `,
        tests: [
          "The counter returns 1, 2, 3",
          "Two counters are independent",
          "`g` behaves like `f`",
          "`nb_appels()` counts the calls",
          "The dichotomy needed 24 evaluations",
          "`nonlocal` is used, not `global`",
        ],
      },
      stretch: {
        title: "Late binding and nested scopes",
        prompt: md`
          1. **Before running**, predict the value of \`[f(10) for f in fs]\` and store it in
             \`prediction\`. Then build \`fs_corrige\`, a list of three functions such that
             \`[f(10) for f in fs_corrige]\` is \`[0, 10, 20]\`.
          2. Predict \`p1\` (value returned by \`externe()\`), \`p2\` (the global variable \`x\` after this
             call) and \`p3\` (the global variable \`x\` after \`modifie_global()\`). The program then prints
             the real values: compare.
        `,
        hint: md`
          A \`lambda\` reads \`k\` when it is called, once the loop is over. A default parameter
          (\`lambda x, k=k: x * k\`) is evaluated at creation. \`nonlocal\` targets the enclosing function,
          \`global\` the module.
        `,
        tests: [
          "`prediction` is `[20, 20, 20]`",
          "`fs_corrige` gives `[0, 10, 20]`",
          "`p1`: value returned by `externe()`",
          "`p2`: global `x` after `externe()`",
          "`p3`: global `x` after `modifie_global()`",
        ],
      },
    },
  },
  "m6-l3": {
    ex1: {
      title: "Identity, aliases and copies",
      core: {
        title: "Hands-On 11: append to a nested list",
        prompt: md`
          1. \`append_to_nested_list(nested, valeur)\` appends \`valeur\` at the end of **each sub-list**
             and returns the list: \`[[1, 2], [3, 4], [5]]\` → \`[[1, 2, 'new'], [3, 4, 'new'], [5, 'new']]\`.
          2. Before running: is \`nested_list\` modified? Answer in \`nested_modifiee\` (boolean).
          3. \`append_to_nested_list_copie(nested, valeur)\` does the same thing **without touching its argument**.
             Prove it with \`id()\`: \`ids_differents\` must tell whether \`copie\` and \`originale\` are distinct objects.
        `,
        hint: md`
          The version that modifies nothing builds **new** sub-lists:
          \`[sous_liste + [valeur] for sous_liste in nested]\` (\`+\` creates a new list, \`append\` modifies).
        `,
        tests: [
          "`append_to_nested_list` appends to each sub-list",
          "It returns the list received (same object): `nested_modifiee` is `True`",
          "The copy version gives the same result",
          "… without modifying its argument",
          "The sub-lists of the copy are new objects",
        ],
      },
      extra: {
        title: "Predicting alias, copy and deepcopy",
        prompt: md`
          For each case, **predict** the result before running, then check with the terminal.
          Draw the “boxes and arrows” diagram of each situation on scrap paper.

          - \`p1\`: the list \`l\` of case 1;
          - \`p2\`, \`p3\`, \`p4\`: the list \`ancienne\` (old) after a modification made **through** an alias, a shallow
            copy, then a deep copy;
          - \`p3_meme_id\`: \`id(ancienne) == id(superficielle)\`?
        `,
        hint: md`
          \`l = [a, a, a]\` contains three references to the same list. A shallow copy creates a
          new outer list, but **shares** the inner lists.
        `,
        explanation: md`
          \`copy.copy\` is enough when the elements are immutable; as soon as they are mutable themselves and you
          want to modify them independently, you need \`deepcopy\`, which costs more: it duplicates the whole structure.
        `,
        tests: [
          "`p1` (case 1)",
          "`p2` (alias)",
          "`p3` (shallow copy)",
          "`p3_meme_id`",
          "`p4` (deep copy)",
        ],
      },
      stretch: {
        title: "Matrix product",
        prompt: md`
          Matrices are lists of lists (one list per row).

          1. \`creer_matrice(n, m, valeur=0)\`: an \`n × m\` matrix whose rows are **independent**.
             First run the starter code: what does \`[[0] * 3] * 2\` build?
          2. \`produit(A, B)\`: product of an \`n × p\` matrix by a \`p × m\` matrix, giving an
             \`n × m\` matrix: \`C[i][j] = sum of A[i][k] * B[k][j]\`. If the dimensions do not match,
             raise a \`ValueError\` with a clear message (**do not return \`None\`**). The matrices received
             must not be modified.
        `,
        hint: md`
          \`[[valeur] * m for _ in range(n)]\` creates \`n\` distinct rows. Dimensions: \`n = len(A)\`,
          \`p = len(A[0])\`, \`m = len(B[0])\`; you need \`len(B) == p\`.
        `,
        explanation: md`
          \`[[0] * 3] * 2\` repeats **the same** row twice: \`id(piege[0]) == id(piege[1])\`. Modifying a
          cell therefore modifies the whole column. With \`[[0] * 3 for _ in range(2)]\`, each row is a new object.
        `,
        tests: [
          "`creer_matrice` creates independent rows",
          "2×2 product",
          "Rectangular products (1×3 · 3×1 and 2×3 · 3×2)",
          "Incompatible dimensions → `ValueError` with a message",
          "The matrices received are not modified and the result has independent rows",
        ],
      },
    },
  },
  "m6-l4": {
    ex1: {
      title: "Arguments: traps and flexibility",
      core: {
        title: "The mutable default argument",
        prompt: md`
          Run the starter code and observe the “surprises”. When is the default value created?

          Fix \`ajouter_article\` and \`noter\` so that **each call without an argument starts from an empty
          object**, while still modifying and returning the basket or the notebook if one is provided.
          State the general rule in one sentence, as a comment.
        `,
        hint: md`Default value \`None\`, then in the body: \`if panier is None: panier = []\`.`,
        explanation: md`
          The default value is evaluated **only once**, when \`def\` runs: all the calls that
          use it share the same object. You can see it with \`ajouter_article.__defaults__\`.
        `,
        tests: [
          "Each call starts from an empty basket",
          "A provided basket is modified and returned",
          "Each call starts from an empty notebook",
          "A provided notebook is completed",
          "The default values are `None`",
          "The output shows no more surprise",
        ],
      },
      extra: {
        title: "*args, keyword options and unpacking",
        prompt: md`
          1. \`resumer(*valeurs, verbose=False, start=0)\` returns \`start\` + the sum of the values.
             \`verbose\` and \`start\` are **keyword-only**, since they come after
             \`*valeurs\`. If \`verbose\`, the function prints \`3 valeurs, total = 115\`.
          2. Compute \`total\` by calling \`resumer\` with the elements of \`nombres\` **unpacked** with \`*\` and
             the options of the \`options\` dictionary **unpacked** with \`**\`.

          What does \`resumer(1, True)\` return? Why doesn't \`True\` turn on the verbose mode?
        `,
        hint: md`\`total = resumer(*nombres, **options)\` is equivalent to \`resumer(4, 5, 6, start=100, verbose=True)\`.`,
        explanation: md`
          \`*args\` improves an interface when the function really handles “as many values as you want”.
          For parameters of different kinds, explicit names document better what is expected.
        `,
        tests: [
          "`resumer()` → 0, `resumer(1, 2, 3)` → 6",
          "`start` shifts the total",
          "Verbose mode: `2 valeurs, total = 3`",
          "`verbose` and `start` are keyword-only",
          "`total` is 115, obtained by unpacking with `*` and `**`",
        ],
      },
      stretch: {
        title: "A function that remembers",
        prompt: md`
          \`fib\` (provided) is the naive recursive version from the course; it counts its calls in the global
          variable \`appels\`.

          1. \`memoiser(f)\` returns a new function that behaves like \`f\` (positional arguments,
             any number of them) but **memoises** its results in a dictionary: the same call is
             never computed twice.
          2. Replace \`fib\` with its memoised version, then compute \`fib(25)\` again after resetting
             the counter: \`nb_appels\` must drop from 242,785 to 26.

          Why must you **reassign the name \`fib\`** for the recursion to benefit from the cache?
        `,
        hint: md`
          A closure: \`cache = {}\`, then \`def g(*args):\` computing \`f(*args)\` only if \`args\`
          (a tuple, hence usable as a key) is not in \`cache\`. Then \`fib = memoiser(fib)\`.
        `,
        explanation: md`
          Inside \`fib\`, the call \`fib(n - 1)\` looks up the name \`fib\` **in the global scope at the
          time of the call** (LEGB rule). After \`fib = memoiser(fib)\`, this name designates the cached version.
          This is exactly what the \`@functools.cache\` decorator of the standard library does.
        `,
        tests: [
          "`memoiser` returns an equivalent function",
          "The same call is computed only once",
          "`resultat` is 121393",
          "With memoisation: only 26 calls",
        ],
      },
    },
  },
  "m6-l5": {
    ex1: {
      title: "Thinking recursively",
      core: {
        title: "First recursive functions",
        prompt: md`
          1. \`factorielle(n)\` **recursively**; it raises \`ValueError\` if \`n < 0\` (instead of a \`RecursionError\`).
          2. \`somme_chiffres(n)\` **recursively**: sum of the digits of the integer \`n ≥ 0\` (\`1234\` → 10).
          3. \`fib(n)\` **iteratively**, with the course's definition: \`fib(0) = fib(1) = 1\`. It must compute
             \`fib(80)\` instantly.
        `,
        hint: md`
          Sum of digits: the last digit is \`n % 10\`, the rest of the number is \`n // 10\`; base
          case: \`n < 10\`. Iterative Fibonacci: \`a, b = b, a + b\` in a loop.
        `,
        tests: [
          "`factorielle`: 0 → 1, 5 → 120, 10 → 3628800",
          "`factorielle(-1)` → `ValueError`",
          "`factorielle` is recursive",
          "`somme_chiffres`: 1234 → 10, 90817 → 25, 0 → 0",
          "`fib`: 1, 1, 2, 3, 5, 8, 13, 21",
          "`fib` is iterative and computes `fib(80)`",
        ],
      },
      extra: {
        title: "Displaying a file tree",
        prompt: md`
          Write \`arbre(dossier, profondeur_max=None, caches=False)\` returning the **list of lines**
          representing the file tree, with these characters:

          \`\`\`text
          projet
          |-- README.md
          |-- src
          |   |-- __init__.py
          |   \`-- main.py
          \`-- tests
              \`-- test_main.py
          \`\`\`

          - the entries of each folder are sorted by name (\`sorted\`);
          - hidden files and folders (name starting with \`.\`) are ignored, unless \`caches=True\`;
          - \`profondeur_max\` limits the number of levels displayed below the root (\`1\`: only its children).

          The \`projet/\` folder is provided. It is a naturally **recursive** problem: the function that
          displays a folder calls itself on each subfolder. What must it pass on for the
          indentation to be right?
        `,
        hint: md`
          A recursive helper function \`parcourir(dossier, prefixe, profondeur)\`: for each entry,
          add \`prefixe + "|-- "\` (or \`\` "\`-- " \`\` for the last one); to go down into a subfolder,
          the new prefix is \`prefixe + "|   "\` (or \`prefixe + "    "\` after the last entry).
        `,
        explanation: md`
          The practical session also asks to read the folder and the options from the command line: with \`argparse\`
          (lesson 5.5), just add a positional argument \`dossier\` and two options
          \`--profondeur\` and \`--caches\` (\`action="store_true"\`).
        `,
        tests: [
          "Default tree (hidden files ignored)",
          "With `caches=True`",
          "With `profondeur_max=1`",
          "The traversal is recursive",
          "The program prints the tree",
        ],
      },
      stretch: {
        title: "The N queens problem",
        prompt: md`
          Place \`N\` queens on an \`N × N\` chessboard so that none threatens another (same row, same
          column or same diagonal).

          - \`n_reines(n)\` returns the list of **all** the solutions; a solution is a tuple where
            \`solution[row]\` is the column of the queen of that row;
          - \`afficher(solution)\` returns the board as text: \`Q\` for a queen, \`.\` otherwise, one line per row.

          There are 2 solutions for \`N = 4\` and 92 for \`N = 8\`. But if you get 92 with a wrong display,
          you have solved the counting, not the problem! Which representation of a partial placement makes
          the test “is this square threatened?” the cheapest?
        `,
        hint: md`
          Backtracking: a recursive function \`placer(colonnes)\` tries each column
          for row \`len(colonnes)\`. A square \`(ligne, col)\` is safe if, for each queen \`(l, c)\`
          already placed, \`col != c\` and \`abs(col - c) != ligne - l\`.
        `,
        explanation: md`
          A list of columns (one per row) guarantees by construction one queen per row: only
          columns and diagonals remain to be tested. To go faster, you can keep three sets (occupied columns,
          diagonals \`l + c\` and \`l - c\`): the test then becomes immediate.
        `,
        tests: [
          "N = 4: the 2 solutions",
          "N = 1, 2, 3: 1, 0 and 0 solutions",
          "N = 8: 92 solutions, all valid",
          "`afficher` draws the board",
          "The search is recursive",
        ],
      },
    },
  },
};
