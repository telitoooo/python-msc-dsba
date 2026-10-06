import { md } from "../helpers.js";

export default {
  "m4-l1": {
    ex1: {
      title: "Working with lists",
      core: {
        title: "The grade book",
        prompt: md`
          Starting from \`notes = [12, 15, 8, 17, 10, 16]\`, in this order:

          1. \`moyenne\`: the average of the grades;
          2. \`meilleure\`: the best grade;
          3. append the grade \`19\` at the end of the list;
          4. remove the worst grade (**without hard-coding \`8\`**: your code must work for any list);
          5. \`top3\`: the three best grades, from highest to lowest.
        `,
        hint: md`
          \`sum()\`, \`len()\`, \`max()\`, \`min()\`, \`.append()\`, \`.remove()\`.
          For the top 3: \`sorted(notes, reverse=True)\` then a slice \`[:3]\`.
        `,
        tests: [
          "`moyenne` is 13.0",
          "`meilleure` is 17",
          "`notes` is `[12, 15, 17, 10, 16, 19]`",
          "`top3` is `[19, 17, 16]`",
          "Works with `notes = [10, 20, 5]`",
        ],
      },
      extra: {
        title: "Functions on lists",
        prompt: md`
          Write three functions that **return a new list** without modifying the one they receive:

          - \`filtrer_positifs(nombres)\`: the strictly positive numbers;
          - \`sans_doublons(valeurs)\`: the values without duplicates, **in order of appearance**
            (without using \`set\`);
          - \`rotation(valeurs, k)\`: shifts the elements \`k\` steps to the right;
            \`rotation([1, 2, 3, 4, 5], 2)\` → \`[4, 5, 1, 2, 3]\`. Handle \`k\` larger than the length
            and the empty list.
        `,
        hint: md`
          For the rotation, two slices are enough: the last \`k\` elements \`valeurs[-k:]\`
          followed by the rest \`valeurs[:-k]\`. Bring \`k\` within bounds with \`k % len(valeurs)\`.
        `,
        explanation: md`Case \`k = 0\`: \`valeurs[-0:]\` is the whole list and \`valeurs[:-0]\` is empty, so the list stays unchanged.`,
        tests: [
          "`filtrer_positifs([3, -1, 0, 5, -7])` → `[3, 5]`",
          "The original list is not modified",
          "`sans_doublons([3, 1, 3, 2, 1])` → `[3, 1, 2]`",
          "`sans_doublons` does not use `set`",
          "`rotation([1, 2, 3, 4, 5], 2)` → `[4, 5, 1, 2, 3]`",
          "`rotation` with `k = 0` and `k = 7`",
          "`rotation([], 3)` → `[]`",
        ],
      },
      stretch: {
        title: "Grids and matrices",
        prompt: md`
          A matrix is represented by a **list of lists** (one list per row).

          - \`creer_grille(n, m, valeur=0)\`: a grid of \`n\` rows and \`m\` columns filled with \`valeur\`;
          - \`transposer(matrice)\`: swaps rows and columns;
          - \`aplatir(matrice)\`: a single list containing all the elements, row by row.

          \`\`\`text
          transposer([[1, 2, 3], [4, 5, 6]])  →  [[1, 4], [2, 5], [3, 6]]
          aplatir([[1, 2], [3], [4, 5, 6]])   →  [1, 2, 3, 4, 5, 6]
          \`\`\`

          ⚠️ Trap: \`[[0] * m] * n\` creates \`n\` **aliases** of the same row. Changing one cell then changes the whole column!
        `,
        hint: md`
          For the grid, append a **new** list \`[valeur] * m\` at each iteration of a loop.
          To transpose: column \`j\` is made of \`ligne[j]\` for each row.
        `,
        explanation: md`
          With comprehensions (lesson 4.5), these functions fit in one line:
          \`[[valeur] * m for _ in range(n)]\`, \`[list(col) for col in zip(*matrice)]\`,
          \`[x for ligne in matrice for x in ligne]\`.
        `,
        tests: [
          "`creer_grille(2, 3)` → `[[0, 0, 0], [0, 0, 0]]`",
          "`creer_grille(2, 2, '.')`",
          "The rows are independent (no alias)",
          "`transposer` a 2×3 matrix",
          "`aplatir([[1, 2], [3], [4, 5, 6]])`",
          "`aplatir([])` → `[]`",
        ],
      },
    },
    ex2: {
      title: "Cards, palindromes and spies",
      core: {
        title: "Hands-On 3: the deck of cards",
        prompt: md`
          Create the list \`deck\` of the 52 cards of a deck, as strings \`"♠A"\`, \`"♠K"\`… from the lists \`suits\`
          and \`ranks\`, with **two nested loops**: all the \`♠\` cards first (in the order of \`ranks\`), then the \`♥\`
          ones, etc.

          Then \`hearts\`: the 13 heart cards (\`♥\`), obtained by **slicing** \`deck\`.
        `,
        tests: [
          "`deck` contains 52 distinct cards",
          "The order: `♠A`, `♠K`… then `♥A`",
          "`hearts`: the 13 hearts",
          "Two nested loops",
        ],
      },
      extra: {
        title: "Hands-On 4: reversing and palindromes",
        prompt: md`
          1. Reverse a list in **three different ways**, each in a function that returns a **new** list:
             - \`rev_slice(l)\`: with a slice;
             - \`rev_loop(l)\`: with a loop (no slicing, no \`reversed\`);
             - \`rev_builtin(l)\`: with the \`reversed\` function.

             \`rev([]) == []\`, \`rev([1]) == [1]\`, \`rev([1, 2, 3]) == [3, 2, 1]\`.
          2. \`is_palindrome(word)\`: with a **loop** comparing the i-th character to the i-th one from the end
             (no \`[::-1]\`). \`"anna"\`, \`"civic"\`, \`"level"\`, \`"hannah"\` are palindromes.
        `,
        tests: [
          "The three functions reverse",
          "The original list is not modified",
          "Three different methods",
          "`is_palindrome`",
          "`is_palindrome` uses a loop, without `[::-1]`",
        ],
      },
      stretch: {
        title: "Spy game and lists of tuples",
        prompt: md`
          1. *“Spy Game” Hands-On*: \`spy_game(nums)\` returns \`True\` if the list contains \`0\`, \`0\` and \`7\`
             **in this order** (not necessarily consecutive):
             \`spy_game([1, 2, 4, 0, 0, 7, 5])\` → \`True\`, \`spy_game([1, 0, 2, 4, 0, 5, 7])\` → \`True\`,
             \`spy_game([1, 7, 2, 0, 4, 5, 0])\` → \`False\`.
          2. *“Lists and tuples” Hands-on*: \`transform(l)\` turns a list of tuples into a **tuple of lists**,
             and \`transpose(l)\` does the same while **transposing**:

          \`\`\`text
          transform([(1, 2, 3), (4, 5, 6), (7, 8, 9)])  →  ([1, 2, 3], [4, 5, 6], [7, 8, 9])
          transpose([(1, 2, 3), (4, 5, 6), (7, 8, 9)])  →  ([1, 4, 7], [2, 5, 8], [3, 6, 9])
          \`\`\`
        `,
        hint: md`
          For the spy game, keep the list of digits still expected \`code = [0, 0, 7]\` and remove the first one
          as soon as it appears. For \`transpose\`, \`zip(*l)\` groups the i-th elements of each tuple.
        `,
        tests: [
          "The three examples from the course",
          "Other cases",
          "`transform`",
          "`transpose`",
        ],
      },
    },
  },
  "m4-l2": {
    ex1: {
      title: "Tuples and unpacking",
      core: {
        title: "Coordinates and min-max",
        prompt: md`
          1. Unpack \`point = (3, 4)\` into \`x\` and \`y\` **in a single line**, then compute \`distance\`,
             the distance from the point to the origin: \`√(x² + y²)\`.
          2. Write \`min_max(valeurs)\` returning the **tuple** \`(minimum, maximum)\`.
          3. Call \`min_max([4, 1, 9, 3])\` and unpack the result into \`bas\` and \`haut\`.
        `,
        hint: md`\`x, y = point\`; the square root is obtained with \`** 0.5\`; \`return min(valeurs), max(valeurs)\`.`,
        tests: [
          "`x` is 3 and `y` is 4",
          "`distance` is 5.0",
          "`min_max([4, 1, 9, 3])` returns `(1, 9)`",
          "`min_max` does return a tuple",
          "`bas` and `haut` are 1 and 9",
        ],
      },
      extra: {
        title: "Quick statistics",
        prompt: md`
          1. \`stats(valeurs)\` returns the tuple \`(count, mean, median)\`, **without modifying** the list it receives.
             The median is the middle value of the sorted list; for an even count, it is the mean
             of the two middle values.
          2. With \`mesures = [10, 20, 30, 40, 50]\`, use starred unpacking to get, in one line,
             \`premiere\`, \`milieu\` (list of the intermediate values) and \`derniere\`.
        `,
        hint: md`
          Sort with \`sorted()\` (which does not modify the original, unlike \`.sort()\`).
          Middle index: \`n // 2\`. Starred unpacking: \`a, *b, c = liste\`.
        `,
        tests: [
          "`stats([3, 1, 2])` → `(3, 2.0, 2)`",
          "`stats([4, 1, 3, 2])` → `(4, 2.5, 2.5)`",
          "`stats([7])` → `(1, 7.0, 7)`",
          "The list passed to `stats` is not modified",
          "`premiere`, `milieu`, `derniere` are correct",
          "Starred unpacking is used",
        ],
      },
      stretch: {
        title: "Ranking and nearest neighbour",
        prompt: md`
          1. Sort \`etudiants\` (list of \`(name, grade)\` tuples) into \`classement\`: by **decreasing grade**,
             then by **alphabetical name** in case of a tie. Create \`podium\`, the list of the top 3 **names**.
          2. \`distance(p1, p2)\`: Euclidean distance between two points \`(x, y)\`.
          3. \`plus_proche(points, cible)\`: returns the point of the list closest to \`cible\`.
             This is the heart of the *k-nearest neighbours* algorithm (k-NN) in machine learning!
        `,
        hint: md`
          \`sorted(etudiants, key=lambda e: (-e[1], e[0]))\`: the minus sign reverses the order of the grades.
          For the closest one: \`min(points, key=lambda p: distance(p, cible))\`.
        `,
        tests: [
          "`classement` sorted by grade ↓ then name ↑",
          "`podium` is `['Grace', 'Ada', 'Margaret']`",
          "`distance((0, 0), (3, 4))` → 5.0",
          "`distance((1, 2), (1, 2))` → 0",
          "Closest to (4, 4): (5, 5)",
          "Closest to (4, 1): (0, 0)",
        ],
      },
    },
    ex2: {
      title: "Tuples in action",
      core: {
        title: "Hands-on 5: age categories with a list of tuples",
        prompt: md`
          Take the age categories again (Hands-on 3), but this time **without an \`if\` / \`elif\` chain**: the
          categories are data, stored in the list of tuples \`CATEGORIES\` \`(min age, max age, name)\`.

          \`category(age)\` loops over the list, **unpacking** each tuple (\`for low, high, name in CATEGORIES\`),
          and returns the name of the right category (\`None\` if none matches).
        `,
        tests: [
          "The five categories",
          "The bounds",
          "Impossible age → `None`",
          "Unpacking in the loop, no `elif`",
        ],
      },
      extra: {
        title: "Hands-On 6: 2D rotation",
        prompt: md`
          A point of the plane is represented by a **tuple** \`(x, y)\`.

          1. \`rotate(point, angle)\` returns the **new** point obtained by rotating around the origin by an angle
             in radians: x' = x·cos θ − y·sin θ, y' = x·sin θ + y·cos θ (both coordinates rounded to 10 decimals).
          2. \`rotate_all(points, angle)\` returns the list of rotated points.
          3. \`translate(point, dx, dy)\` returns the translated point.

          Since a tuple is immutable, a point is never modified: a new one is created.
        `,
        tests: [
          "`rotate((1, 0), π/2)` → (0, 1)",
          "`rotate` returns a tuple",
          "Half-turn of a square",
          "`translate`",
          "Four quarter turns → back to the start",
        ],
      },
      stretch: {
        title: "Roots: None or a tuple",
        prompt: md`
          1. \`root_quadratic(a, b, c)\` (course example) returns \`None\` if there is no real root, a **one**-element
             tuple for a double root, otherwise a tuple of two roots **sorted in increasing order**.
          2. \`describe(a, b, c)\` returns \`"No roots"\`, \`"One root: -1.0"\` or \`"Two roots: 1.0 and 2.0"\`: it must
             handle **both return types** of \`root_quadratic\`.
          3. \`count_real_roots(equations)\`: for a list of \`(a, b, c)\` tuples, the total number of real roots
             (unpack the tuples with \`*\` in the call: \`root_quadratic(*eq)\`).
        `,
        tests: [
          "`root_quadratic`: None, 1-tuple, 2-tuple",
          "Sorted roots even when a < 0",
          "`describe`",
          "`count_real_roots`",
        ],
      },
    },
  },
  "m4-l3": {
    ex1: {
      title: "Dictionaries in action",
      core: {
        title: "Managing a stock",
        prompt: md`
          Starting from \`stock = {"pommes": 10, "bananes": 5, "cerises": 0}\`:

          1. add \`"kiwis"\` with a quantity of 8;
          2. increase the bananas by 3;
          3. delete the cherries;
          4. \`total\`: the total quantity in stock;
          5. \`quantite_mangues\`: the quantity of mangoes, **0 if absent** (without raising an error);
          6. print each fruit in the format \`pommes : 10\` by looping over \`stock.items()\`.
        `,
        hint: md`Useful tools: \`stock["kiwis"] = 8\`, \`stock["bananes"] += 3\`, \`del stock["cerises"]\`, \`sum(stock.values())\`, \`stock.get("mangues", 0)\`.`,
        tests: [
          "`stock` is `{'pommes': 10, 'bananes': 8, 'kiwis': 8}`",
          "`total` is 26",
          "`quantite_mangues` is 0, obtained with `get`",
          "Prints `pommes : 10` and `kiwis : 8`",
          "The loop uses `.items()`",
        ],
      },
      extra: {
        title: "Word frequency",
        prompt: md`
          1. \`compter_mots(texte)\` returns a dictionary \`{word: number of occurrences}\`.
             Words are separated by spaces and counted **in lowercase**.
          2. Compute \`frequences = compter_mots(texte)\` for the given text.
          3. \`mot_frequent\`: the most frequent word.
        `,
        hint: md`
          \`texte.lower().split()\` gives the list of words. Counting pattern:
          \`compte[mot] = compte.get(mot, 0) + 1\`. For the maximum: \`max(frequences, key=frequences.get)\`.
        `,
        explanation: md`The standard library also offers \`collections.Counter\`: \`Counter(texte.lower().split()).most_common(1)\`.`,
        tests: [
          "`compter_mots('a b a')` → `{'a': 2, 'b': 1}`",
          "`compter_mots('')` → `{}`",
          "Case-insensitive: `'Data data DATA'`",
          "`frequences` is correct",
          "`mot_frequent` is `'le'`",
        ],
      },
      stretch: {
        title: "Transaction analysis",
        prompt: md`
          Each transaction is a dictionary \`{"client", "ville", "montant"}\`: this is the typical shape
          of a data row. Write:

          - \`total_par_client(transactions)\` → \`{client: total amount}\`;
          - \`meilleur_client(transactions)\` → the name of the client with the largest total;
          - \`clients_par_ville(transactions)\` → \`{city: sorted list of clients, without duplicates}\`.

          This is exactly what a \`groupby\` does in pandas!
        `,
        hint: md`
          Reuse \`total_par_client\` in \`meilleur_client\`. To group:
          \`if ville not in resultat: resultat[ville] = []\`, then add the client if it is not already there;
          sort each list at the end.
        `,
        tests: [
          "`total_par_client` on the given data",
          "`total_par_client([])` → `{}`",
          "`meilleur_client` → `'Grace'`",
          "`meilleur_client` on other data",
          "`clients_par_ville`: sorted lists, no duplicates",
        ],
      },
    },
    ex2: {
      title: "Login, keys and distances",
      core: {
        title: "Hands-On 7: a login system",
        prompt: md`
          The accounts are a **list of dictionaries** \`users\`.

          1. \`find_user(users, name)\` returns the user's dictionary, or \`None\` if it does not exist.
          2. The program reads the user name **as long as it does not exist** (prints \`Unknown user\`), then the
             password **as long as it is wrong** (prints \`Wrong password\`), and finally \`Welcome, Alice!\`.
        `,
        tests: [
          "`find_user`",
          "Unknown name reported",
          "Wrong password reported",
          "Welcome message",
          "Charlie at the first attempt",
        ],
      },
      extra: {
        title: "Hashable keys and distances",
        prompt: md`
          1. \`is_hashable(x)\` returns \`True\` if \`x\` can be used as a dictionary key (try \`hash(x)\` in a
             \`try\` / \`except TypeError\`).
          2. \`distances\` is a dictionary whose keys are **tuples** of cities. \`get_distance(d, a, b)\`
             returns the distance between \`a\` and \`b\` in one direction **or the other**, and raises \`KeyError\` if it
             is unknown (or 0 if \`a == b\`).
          3. \`route_length(d, route)\` returns the length of a route (list of cities).
        `,
        tests: [
          "`is_hashable`",
          "`get_distance` in both directions",
          "Unknown distance → `KeyError`",
          "`route_length`",
        ],
      },
      stretch: {
        title: "Completing a distance table",
        prompt: md`
          The course's \`dists\` table gives each distance in **one** direction only. Write:

          1. \`complete(dists)\`: a (nested) **dictionary comprehension** returning the complete table
             \`{x: {y: distance or None}}\` for every pair of cities, as in the course (the distance from \`x\` to
             \`y\` is \`dists[x][y]\` if it exists, otherwise \`dists[y][x]\` if it exists, otherwise \`None\`);
          2. \`nearest(table, city)\`: the city closest to \`city\` (other than itself), ignoring the \`None\` values.
        `,
        tests: [
          "`complete` is symmetric",
          "Values of F",
          "A dictionary comprehension",
          "`nearest`",
        ],
      },
    },
  },
  "m4-l4": {
    ex1: {
      title: "Set operations",
      core: {
        title: "Course registrations",
        prompt: md`
          Two sets of students are registered for the Python and SQL courses. Create:

          - \`les_deux\`: registered for both courses;
          - \`au_moins_un\`: registered for at least one course;
          - \`python_seulement\`: registered for Python but not for SQL;
          - \`un_seul\`: registered for only one of the two courses;
          - \`nb_etudiants\`: the total number of different students.
        `,
        hint: md`Operators: \`&\` (intersection), \`|\` (union), \`-\` (difference), \`^\` (symmetric difference).`,
        tests: [
          "`les_deux` = Grace and Linus",
          "`au_moins_un` contains 6 people",
          "`python_seulement` = Ada and Alan",
          "`un_seul` = Ada, Alan, Margaret, Tim",
          "`nb_etudiants` is 6",
        ],
      },
      extra: {
        title: "Duplicates and common letters",
        prompt: md`
          Write three short functions (one or two lines each) thanks to sets:

          - \`valeurs_uniques(valeurs)\`: **sorted** list of the distinct values;
          - \`a_des_doublons(valeurs)\`: \`True\` if a value appears more than once;
          - \`lettres_communes(mot1, mot2)\`: **set** of the letters present in both words,
            ignoring case.
        `,
        hint: md`A set removes duplicates: compare \`len(set(valeurs))\` and \`len(valeurs)\`.`,
        tests: [
          "`valeurs_uniques([3, 1, 3, 2, 1])` → `[1, 2, 3]`",
          "`valeurs_uniques` returns a list",
          "`a_des_doublons([1, 2, 1])` → `True`",
          "`a_des_doublons([1, 2, 3])` → `False`",
          "`lettres_communes('Python', 'typo')` → `{'p', 'y', 't', 'o'}`",
          "No common letter → empty set",
        ],
      },
      stretch: {
        title: "Pangrams and anagrams",
        prompt: md`
          1. \`est_pangramme(phrase)\`: \`True\` if the sentence contains **all 26 letters** of the alphabet
             (ignoring case).
          2. \`anagrammes(mot1, mot2)\`: \`True\` if both words use exactly the same letters,
             **the same number of times** (case and spaces ignored). Example: \`"chien"\` / \`"niche"\`.

          ⚠️ Trap: comparing \`set(mot1) == set(mot2)\` is not enough for anagrams. Why?
        `,
        hint: md`
          Pangram: the set \`set("abcdefghijklmnopqrstuvwxyz")\` must be **included** (\`<=\`) in
          the set of the sentence's letters. Anagrams: compare the **sorted** lists of letters.
        `,
        explanation: md`
          A set does not keep the **number** of occurrences: \`set("aab") == set("abb") == {"a", "b"}\`.
          Sorting the letters (or counting them with a dictionary) keeps that information.
        `,
        tests: [
          "The example sentence is a pangram",
          "`'Bonjour tout le monde'` is not one",
          "`'chien'` / `'niche'` → `True`",
          "`'Marie'` / `'aimer'` → `True` (case ignored)",
          "`'aab'` / `'abb'` → `False` (the trap!)",
          "`'abc'` / `'abcd'` → `False`",
        ],
      },
    },
    ex2: {
      title: "Duplicates, neighbours and routes",
      core: {
        title: "Hands-On 8: removing and finding duplicates",
        prompt: md`
          With **sets**:

          1. \`remove_duplicates(lst)\` returns the list without duplicates, **in order of first appearance**
             (a \`seen\` set remembers the elements already met);
          2. \`find_duplicates_sets(lst)\` returns the **set** of the elements that appear more than once.

          Why are sets useful here? The test \`x in seen\` is almost instantaneous, even for a very
          long list.
        `,
        tests: [
          "`remove_duplicates` keeps the order",
          "`find_duplicates_sets`",
          "Does return a set",
          "Fast on 100,000 elements",
        ],
      },
      extra: {
        title: "Neighbouring countries",
        prompt: md`
          \`neighbors\` is the list of the borders of North and Central America: each border is a
          **set** of two countries.

          1. \`adjacency(neighbors)\` returns a dictionary \`country → set of its neighbours\`;
          2. \`reachable(adj, start)\` returns the **set** of the countries that can be reached from \`start\` by
             crossing borders (\`start\` included): start from \`{start}\` and add the neighbours of the reached
             countries until nothing changes.
        `,
        tests: [
          "`adjacency`: neighbours of Guatemala",
          "Canada has only one neighbour, and so does Panama",
          "Every country can be reached from Canada",
          "On a graph made of two pieces",
        ],
      },
      stretch: {
        title: "All routes with Floyd-Warshall",
        prompt: md`
          *The course's “difficult” exercise*: find the **route** (the shortest path in number of borders) from
          each country to every other country, with the **Floyd-Warshall algorithm**:

          1. initialise \`dist[(a, b)]\` to 0 if a = b, 1 if a and b are neighbours, infinity (\`float("inf")\`) otherwise,
             and \`nxt[(a, b)] = b\` for two neighbours (the next country on the route);
          2. for each intermediate country \`k\`, then each pair \`(i, j)\`: if going through \`k\` is shorter
             (\`dist[(i, k)] + dist[(k, j)] < dist[(i, j)]\`), update \`dist[(i, j)]\` and \`nxt[(i, j)] = nxt[(i, k)]\`.

          \`shortest_routes(countries, neighbors)\` returns the pair \`(dist, nxt)\`, and \`route(nxt, a, b)\` rebuilds
          the list of countries from \`a\` to \`b\`.
        `,
        hint: md`
          To rebuild the route: start from \`[a]\`, then as long as the last country is not \`b\`, append
          \`nxt[(last, b)]\`. The order of the three loops matters: \`k\` must be the **outer** loop.
        `,
        tests: [
          "The route from Canada to Panama",
          "Distances in number of borders",
          "Distances are symmetric",
          "Each route only crosses existing borders",
        ],
      },
    },
  },
  "m4-l5": {
    ex1: {
      title: "Comprehensions",
      core: {
        title: "Lists in one line",
        prompt: md`
          Starting from \`nombres = list(range(1, 21))\`, create **only with list comprehensions**
          (no classic \`for\` loop):

          - \`carres\`: the squares of all the numbers;
          - \`pairs\`: the even numbers;
          - \`carres_impairs\`: the squares of the odd numbers;
          - \`etiquettes\`: for the first 5 numbers, \`"pair"\` (even) or \`"impair"\` (odd).
        `,
        hint: md`
          Filter: \`[n for n in nombres if n % 2 == 0]\`. Conditional transformation:
          \`["pair" if n % 2 == 0 else "impair" for n in nombres[:5]]\`.
        `,
        tests: [
          "`carres`: 20 squares, from 1 to 400",
          "`pairs`: 2, 4, …, 20",
          "`carres_impairs`: 1, 9, 25, …, 361",
          "`etiquettes` are correct",
          "Comprehensions used, no classic `for` loop",
        ],
      },
      extra: {
        title: "Dictionary and set comprehensions",
        prompt: md`
          From the list \`mots\`, create:

          - \`longueurs\`: dictionary \`{word: length}\` (**dictionary** comprehension);
          - \`longs\`: the words of more than 4 letters, **in uppercase** (list comprehension);
          - \`initiales\`: the set of first letters (**set** comprehension);
          - \`total_lettres\`: the total number of letters, with \`sum()\` and a generator expression.
        `,
        hint: md`Three one-liners: \`{m: len(m) for m in mots}\`, \`{m[0] for m in mots}\`, \`sum(len(m) for m in mots)\`.`,
        tests: [
          "`longueurs` is correct",
          "`longs` is `['PYTHON', 'SCIENCE', 'PANDAS', 'NUMPY']`",
          "`initiales` is `{'p', 'd', 's', 'i', 'n'}`",
          "`total_lettres` is 30",
          "Dict, set and list comprehensions used",
        ],
      },
      stretch: {
        title: "Matrices and report cards",
        prompt: md`
          Still without a classic \`for\` loop:

          1. \`table\`: the 5 × 5 multiplication table as a list of lists
             (\`table[i][j]\` = \`(i + 1) × (j + 1)\`);
          2. \`diagonale\`: the diagonal elements of \`table\` (\`[1, 4, 9, 16, 25]\`);
          3. \`moyennes\`: \`{name: average rounded to 2 decimals}\` from the \`notes\` dictionary;
          4. \`admis\`: **sorted** list of the names whose average is ≥ 10.
        `,
        hint: md`
          Nested comprehension: \`[[i * j for j in range(1, 6)] for i in range(1, 6)]\`.
          For the averages, loop over \`notes.items()\`.
        `,
        tests: [
          "`table` is a 5 × 5 matrix",
          "`table[2][3]` is 12 and `table[4][4]` is 25",
          "`diagonale` is `[1, 4, 9, 16, 25]`",
          "`moyennes` are correct",
          "`admis` is `['Ada', 'Grace']`",
          "No classic `for` loop",
        ],
      },
    },
    ex2: {
      title: "The course's comprehensions",
      core: {
        title: "Hands-On 9: comprehensions",
        prompt: md`
          Only with **comprehensions**:

          1. \`squares\`: the squares of the numbers from 1 to 10;
          2. \`odd_squares\`: the same, but only for odd numbers;
          3. \`primes\`: the prime numbers up to 100 (a number \`n ≥ 2\` is prime if \`all(n % d != 0 …)\`
             for every \`d\` from 2 to n − 1);
          4. \`uc_users\`: the names of \`users\` in uppercase, and \`positive_amounts\`: the positive amounts of
             \`amounts\` (course examples).
        `,
        tests: [
          "`squares` and `odd_squares`",
          "`primes`: 25 prime numbers up to 100",
          "`uc_users` and `positive_amounts`",
          "No classic `for` loop",
        ],
      },
      extra: {
        title: "Dictionary comprehensions and generators",
        prompt: md`
          1. \`products\`: the dictionary \`{(i, j): i * j}\` for every \`i\` of \`a\` and \`j\` of \`b\` (two \`for\`
             in the same comprehension, as in the course);
          2. \`gen\`: a **generator expression** of the integer parts of the numbers in \`t\`, then \`as_tuple\`:
             these values converted into a tuple (\`tuple(gen)\`);
          3. \`codes\`: the dictionary \`{letter: ASCII code}\` for the letters of \`"python"\` (\`ord\`);
          4. \`by_length\`: a dictionary \`{length: sorted list of the words of that length}\` for the words of
             \`words\` (a dictionary comprehension **containing** a list comprehension).
        `,
        tests: [
          "`products`: 12 pairs",
          "`gen` is a generator and `as_tuple` is (1, 2, 3, 4, 5)",
          "`codes`",
          "`by_length`",
          "Dictionary comprehensions and generator",
        ],
      },
      stretch: {
        title: "Hands-On 10 in one line, and matrices",
        prompt: md`
          1. \`pattern(n)\` returns (without printing it) the star pattern of Hands-On 10 as **one string**:
             the lines \`"* "\`, \`"* * "\`… up to n stars then back down, separated by \`"\\n"\`. Use a
             comprehension (\`['* ' * i for i in range(n + 1)]\`) and \`"\\n".join(...)\`, as in the course.
          2. \`parse_matrix(text)\` turns \`"1 2 3\\n4 5 6"\` into \`[[1, 2, 3], [4, 5, 6]]\` (nested comprehension);
          3. \`column_sums(m)\` returns the list of the sums of each column (with \`zip(*m)\`).
        `,
        tests: [
          "`pattern(3)`",
          "`pattern(5)`: 9 lines",
          "`parse_matrix`",
          "`column_sums`",
          "`join` and comprehensions",
        ],
      },
    },
  },
};
