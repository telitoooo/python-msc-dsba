import { md, py, test } from "../helpers.js";

export default {
  // ---------------------------------------------------------------- 4.1
  "m4-l1": [
    {
      id: "ex1",
      title: "Manipuler des listes",
      tiers: {
        core: {
          title: "Le carnet de notes",
          prompt: md`
            À partir de \`notes = [12, 15, 8, 17, 10, 16]\`, dans cet ordre :

            1. \`moyenne\` : la moyenne des notes ;
            2. \`meilleure\` : la meilleure note ;
            3. ajoutez la note \`19\` à la fin de la liste ;
            4. retirez la plus mauvaise note (**sans écrire \`8\` en dur** : votre code doit marcher pour toute liste) ;
            5. \`top3\` : les trois meilleures notes, de la plus haute à la plus basse.
          `,
          hint: md`
            \`sum()\`, \`len()\`, \`max()\`, \`min()\`, \`.append()\`, \`.remove()\`.
            Pour le top 3 : \`sorted(notes, reverse=True)\` puis un slicing \`[:3]\`.
          `,
          starter: py`
            notes = [12, 15, 8, 17, 10, 16]

            # 1. Moyenne
            moyenne = ...

            # 2. Meilleure note
            meilleure = ...

            # 3. Ajoutez 19 à la fin


            # 4. Retirez la plus mauvaise note


            # 5. Top 3 décroissant
            top3 = ...

            print(moyenne, meilleure, notes, top3)
          `,
          solution: py`
            notes = [12, 15, 8, 17, 10, 16]

            moyenne = sum(notes) / len(notes)
            meilleure = max(notes)
            notes.append(19)
            notes.remove(min(notes))
            top3 = sorted(notes, reverse=True)[:3]

            print(moyenne, meilleure, notes, top3)
          `,
          tests: [
            test("`moyenne` vaut 13.0", "moyenne == 13.0", "moyenne"),
            test("`meilleure` vaut 17", "meilleure == 17", "meilleure"),
            test("`notes` vaut `[12, 15, 17, 10, 16, 19]`", "notes == [12, 15, 17, 10, 16, 19]", "notes"),
            test("`top3` vaut `[19, 17, 16]`", "top3 == [19, 17, 16]", "top3"),
            test(
              "Fonctionne avec `notes = [10, 20, 5]`",
              "pick(run_with(notes=[10, 20, 5]), 'meilleure', 'notes', 'top3') == (20, [10, 20, 19], [20, 19, 10])",
            ),
          ],
        },
        extra: {
          title: "Fonctions sur les listes",
          prompt: md`
            Écrivez trois fonctions qui **renvoient une nouvelle liste** sans modifier celle reçue :

            - \`filtrer_positifs(nombres)\` : les nombres strictement positifs ;
            - \`sans_doublons(valeurs)\` : les valeurs sans doublons, **dans l'ordre d'apparition**
              (sans utiliser \`set\`) ;
            - \`rotation(valeurs, k)\` : décale les éléments de \`k\` crans vers la droite ;
              \`rotation([1, 2, 3, 4, 5], 2)\` → \`[4, 5, 1, 2, 3]\`. Gérez \`k\` plus grand que la longueur
              et la liste vide.
          `,
          hint: md`
            Pour la rotation, deux slicings suffisent : les \`k\` derniers éléments \`valeurs[-k:]\`
            suivis du reste \`valeurs[:-k]\`. Ramenez \`k\` dans les bornes avec \`k % len(valeurs)\`.
          `,
          starter: py`
            def filtrer_positifs(nombres):
                ...


            def sans_doublons(valeurs):
                ...


            def rotation(valeurs, k):
                ...


            print(filtrer_positifs([3, -1, 0, 5, -7]))
            print(sans_doublons([3, 1, 3, 2, 1]))
            print(rotation([1, 2, 3, 4, 5], 2))
          `,
          solution: py`
            def filtrer_positifs(nombres):
                resultat = []
                for n in nombres:
                    if n > 0:
                        resultat.append(n)
                return resultat


            def sans_doublons(valeurs):
                resultat = []
                for v in valeurs:
                    if v not in resultat:
                        resultat.append(v)
                return resultat


            def rotation(valeurs, k):
                if not valeurs:
                    return []
                k = k % len(valeurs)
                return valeurs[-k:] + valeurs[:-k]


            print(filtrer_positifs([3, -1, 0, 5, -7]))
            print(sans_doublons([3, 1, 3, 2, 1]))
            print(rotation([1, 2, 3, 4, 5], 2))
          `,
          explanation: md`
            Cas \`k = 0\` : \`valeurs[-0:]\` est la liste entière et \`valeurs[:-0]\` est vide, donc la liste reste inchangée.
          `,
          tests: [
            test("`filtrer_positifs([3, -1, 0, 5, -7])` → `[3, 5]`", "filtrer_positifs([3, -1, 0, 5, -7]) == [3, 5]", "filtrer_positifs([3, -1, 0, 5, -7])"),
            test("La liste d'origine n'est pas modifiée", "(lambda l: (filtrer_positifs(l), l)[1])([3, -1, 5]) == [3, -1, 5]"),
            test("`sans_doublons([3, 1, 3, 2, 1])` → `[3, 1, 2]`", "sans_doublons([3, 1, 3, 2, 1]) == [3, 1, 2]", "sans_doublons([3, 1, 3, 2, 1])"),
            test("`sans_doublons` n'utilise pas `set`", "not calls('set')"),
            test("`rotation([1, 2, 3, 4, 5], 2)` → `[4, 5, 1, 2, 3]`", "rotation([1, 2, 3, 4, 5], 2) == [4, 5, 1, 2, 3]", "rotation([1, 2, 3, 4, 5], 2)"),
            test("`rotation` avec `k = 0` et `k = 7`", "rotation([1, 2, 3], 0) == [1, 2, 3] and rotation([1, 2, 3, 4, 5], 7) == [4, 5, 1, 2, 3]"),
            test("`rotation([], 3)` → `[]`", "rotation([], 3) == []", "rotation([], 3)"),
          ],
        },
        stretch: {
          title: "Grilles et matrices",
          prompt: md`
            Une matrice se représente par une **liste de listes** (une liste par ligne).

            - \`creer_grille(n, m, valeur=0)\` : grille de \`n\` lignes et \`m\` colonnes remplie de \`valeur\` ;
            - \`transposer(matrice)\` : échange lignes et colonnes ;
            - \`aplatir(matrice)\` : une seule liste contenant tous les éléments, ligne par ligne.

            \`\`\`text
            transposer([[1, 2, 3], [4, 5, 6]])  →  [[1, 4], [2, 5], [3, 6]]
            aplatir([[1, 2], [3], [4, 5, 6]])   →  [1, 2, 3, 4, 5, 6]
            \`\`\`

            ⚠️ Piège : \`[[0] * m] * n\` crée \`n\` **alias** de la même ligne. Modifier une case modifie alors toute la colonne !
          `,
          hint: md`
            Pour la grille, ajoutez une **nouvelle** liste \`[valeur] * m\` à chaque tour d'une boucle.
            Pour transposer : la colonne \`j\` est formée de \`ligne[j]\` pour chaque ligne.
          `,
          starter: py`
            def creer_grille(n, m, valeur=0):
                ...


            def transposer(matrice):
                ...


            def aplatir(matrice):
                ...


            g = creer_grille(3, 3)
            g[0][0] = 1
            print(g)
            print(transposer([[1, 2, 3], [4, 5, 6]]))
            print(aplatir([[1, 2], [3], [4, 5, 6]]))
          `,
          solution: py`
            def creer_grille(n, m, valeur=0):
                grille = []
                for _ in range(n):
                    grille.append([valeur] * m)   # une nouvelle liste à chaque ligne
                return grille


            def transposer(matrice):
                if not matrice:
                    return []
                resultat = []
                for j in range(len(matrice[0])):
                    colonne = []
                    for ligne in matrice:
                        colonne.append(ligne[j])
                    resultat.append(colonne)
                return resultat


            def aplatir(matrice):
                resultat = []
                for ligne in matrice:
                    resultat.extend(ligne)
                return resultat


            g = creer_grille(3, 3)
            g[0][0] = 1
            print(g)
            print(transposer([[1, 2, 3], [4, 5, 6]]))
            print(aplatir([[1, 2], [3], [4, 5, 6]]))
          `,
          explanation: md`
            Avec les compréhensions (leçon 4.5), ces fonctions tiennent en une ligne :
            \`[[valeur] * m for _ in range(n)]\`, \`[list(col) for col in zip(*matrice)]\`,
            \`[x for ligne in matrice for x in ligne]\`.
          `,
          tests: [
            test("`creer_grille(2, 3)` → `[[0, 0, 0], [0, 0, 0]]`", "creer_grille(2, 3) == [[0, 0, 0], [0, 0, 0]]", "creer_grille(2, 3)"),
            test("`creer_grille(2, 2, '.')`", "creer_grille(2, 2, '.') == [['.', '.'], ['.', '.']]", "creer_grille(2, 2, '.')"),
            test(
              "Les lignes sont indépendantes (pas d'alias)",
              "(lambda g: (g[0].__setitem__(0, 1), g)[1])(creer_grille(3, 3)) == [[1, 0, 0], [0, 0, 0], [0, 0, 0]]",
            ),
            test("`transposer` une matrice 2×3", "transposer([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]]", "transposer([[1, 2, 3], [4, 5, 6]])"),
            test("`aplatir([[1, 2], [3], [4, 5, 6]])`", "aplatir([[1, 2], [3], [4, 5, 6]]) == [1, 2, 3, 4, 5, 6]", "aplatir([[1, 2], [3], [4, 5, 6]])"),
            test("`aplatir([])` → `[]`", "aplatir([]) == []", "aplatir([])"),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Cartes, palindromes et espions",
      tiers: {
        core: {
          title: "Hands-On 3 : le jeu de cartes",
          prompt: md`
            Créez la liste \`deck\` des 52 cartes d'un jeu, sous forme de chaînes \`"♠A"\`, \`"♠K"\`… à partir des
            listes \`suits\` (couleurs) et \`ranks\` (valeurs), avec **deux boucles imbriquées** : toutes les cartes de
            \`♠\` d'abord (dans l'ordre de \`ranks\`), puis celles de \`♥\`, etc.

            Puis \`hearts\` : les 13 cartes de cœur (\`♥\`), obtenues par **découpage** (slicing) de \`deck\`.
          `,
          starter: py`
            suits = ["♠", "♥", "♦", "♣"]
            ranks = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"]

            deck = []
            hearts = ...

            print(len(deck), deck[:5], hearts)
          `,
          solution: py`
            suits = ["♠", "♥", "♦", "♣"]
            ranks = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"]

            deck = []
            for suit in suits:
                for rank in ranks:
                    deck.append(suit + rank)
            hearts = deck[13:26]

            print(len(deck), deck[:5], hearts)
          `,
          tests: [
            test("`deck` contient 52 cartes distinctes", "len(deck) == 52 and len(set(deck)) == 52", "len(deck)"),
            test("L'ordre : `♠A`, `♠K`… puis `♥A`", "deck[0] == '♠A' and deck[1] == '♠K' and deck[13] == '♥A' and deck[-1] == '♣2'", "deck[:3]"),
            test("`hearts` : les 13 cœurs", "hearts == ['♥' + r for r in ranks]", "hearts"),
            test("Deux boucles imbriquées", "SOURCE.count('for ') >= 2 and calls('append')"),
          ],
        },
        extra: {
          title: "Hands-On 4 : inverser et palindromes",
          prompt: md`
            1. Inversez une liste de **trois façons** différentes, chacune dans une fonction qui renvoie une **nouvelle** liste :
               - \`rev_slice(l)\` : avec un découpage ;
               - \`rev_loop(l)\` : avec une boucle (sans découpage ni \`reversed\`) ;
               - \`rev_builtin(l)\` : avec la fonction \`reversed\`.

               \`rev([]) == []\`, \`rev([1]) == [1]\`, \`rev([1, 2, 3]) == [3, 2, 1]\`.
            2. \`is_palindrome(word)\` : avec une **boucle** qui compare le i-ème caractère au i-ème en partant de la fin
               (sans \`[::-1]\`). \`"anna"\`, \`"civic"\`, \`"level"\`, \`"hannah"\` sont des palindromes.
          `,
          starter: py`
            def rev_slice(l):
                ...


            def rev_loop(l):
                ...


            def rev_builtin(l):
                ...


            def is_palindrome(word):
                ...


            print(rev_slice([1, 2, 3]), rev_loop([1, 2, 3]), rev_builtin([1, 2, 3]))
            print([w for w in ["anna", "civic", "python", "hannah"] if is_palindrome(w)])
          `,
          solution: py`
            def rev_slice(l):
                return l[::-1]


            def rev_loop(l):
                result = []
                for x in l:
                    result.insert(0, x)
                return result


            def rev_builtin(l):
                return list(reversed(l))


            def is_palindrome(word):
                for i in range(len(word) // 2):
                    if word[i] != word[-1 - i]:
                        return False
                return True


            print(rev_slice([1, 2, 3]), rev_loop([1, 2, 3]), rev_builtin([1, 2, 3]))
            print([w for w in ["anna", "civic", "python", "hannah"] if is_palindrome(w)])
          `,
          tests: [
            test("Les trois fonctions inversent", "all(f(l) == l[::-1] for f in (rev_slice, rev_loop, rev_builtin) for l in ([], [1], [1, 2, 3], list('python')))"),
            test("La liste d'origine n'est pas modifiée", "(lambda l: (rev_slice(l), rev_loop(l), rev_builtin(l), l)[3])([1, 2, 3]) == [1, 2, 3]"),
            test("Trois méthodes différentes", "'reversed' not in __import__('inspect').getsource(rev_loop) and '[::' not in __import__('inspect').getsource(rev_loop) and 'reversed' in __import__('inspect').getsource(rev_builtin)"),
            test("`is_palindrome`", "all(is_palindrome(w) for w in ('anna', 'civic', 'level', 'hannah', '', 'a')) and not is_palindrome('python') and not is_palindrome('ab')"),
            test("`is_palindrome` utilise une boucle, sans `[::-1]`", "'for' in __import__('inspect').getsource(is_palindrome) and '[::' not in __import__('inspect').getsource(is_palindrome)"),
          ],
        },
        stretch: {
          title: "Spy game et listes de tuples",
          prompt: md`
            1. *Hands-On « Spy Game »* : \`spy_game(nums)\` renvoie \`True\` si la liste contient \`0\`, \`0\` et \`7\`
               **dans cet ordre** (pas forcément consécutifs) :
               \`spy_game([1, 2, 4, 0, 0, 7, 5])\` → \`True\`, \`spy_game([1, 0, 2, 4, 0, 5, 7])\` → \`True\`,
               \`spy_game([1, 7, 2, 0, 4, 5, 0])\` → \`False\`.
            2. *Hands-on « lists and tuples »* : \`transform(l)\` transforme une liste de tuples en **tuple de listes**,
               et \`transpose(l)\` fait de même en **transposant** :

            \`\`\`text
            transform([(1, 2, 3), (4, 5, 6), (7, 8, 9)])  →  ([1, 2, 3], [4, 5, 6], [7, 8, 9])
            transpose([(1, 2, 3), (4, 5, 6), (7, 8, 9)])  →  ([1, 4, 7], [2, 5, 8], [3, 6, 9])
            \`\`\`
          `,
          hint: md`
            Pour le spy game, gardez la liste des chiffres encore attendus \`code = [0, 0, 7]\` et retirez le premier
            dès qu'il apparaît. Pour \`transpose\`, \`zip(*l)\` regroupe les i-èmes éléments de chaque tuple.
          `,
          starter: py`
            def spy_game(nums):
                ...


            def transform(l):
                ...


            def transpose(l):
                ...


            print(spy_game([1, 2, 4, 0, 0, 7, 5]), spy_game([1, 7, 2, 0, 4, 5, 0]))
            print(transform([(1, 2, 3), (4, 5, 6), (7, 8, 9)]))
            print(transpose([(1, 2, 3), (4, 5, 6), (7, 8, 9)]))
          `,
          solution: py`
            def spy_game(nums):
                code = [0, 0, 7]
                for n in nums:
                    if code and n == code[0]:
                        code.pop(0)
                return len(code) == 0


            def transform(l):
                return tuple(list(t) for t in l)


            def transpose(l):
                return tuple(list(column) for column in zip(*l))


            print(spy_game([1, 2, 4, 0, 0, 7, 5]), spy_game([1, 7, 2, 0, 4, 5, 0]))
            print(transform([(1, 2, 3), (4, 5, 6), (7, 8, 9)]))
            print(transpose([(1, 2, 3), (4, 5, 6), (7, 8, 9)]))
          `,
          tests: [
            test("Les trois exemples du cours", "spy_game([1, 2, 4, 0, 0, 7, 5]) is True and spy_game([1, 0, 2, 4, 0, 5, 7]) is True and spy_game([1, 7, 2, 0, 4, 5, 0]) is False"),
            test("Autres cas", "spy_game([0, 7, 0]) is False and spy_game([0, 0, 0, 7]) is True and spy_game([]) is False"),
            test("`transform`", "transform([(1, 2, 3), (4, 5, 6), (7, 8, 9)]) == ([1, 2, 3], [4, 5, 6], [7, 8, 9])", "transform([(1, 2, 3), (4, 5, 6), (7, 8, 9)])"),
            test("`transpose`", "transpose([(1, 2, 3), (4, 5, 6), (7, 8, 9)]) == ([1, 4, 7], [2, 5, 8], [3, 6, 9]) and transpose([(1, 2), (3, 4), (5, 6)]) == ([1, 3, 5], [2, 4, 6])", "transpose([(1, 2, 3), (4, 5, 6), (7, 8, 9)])"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 4.2
  "m4-l2": [
    {
      id: "ex1",
      title: "Tuples et déballage",
      tiers: {
        core: {
          title: "Coordonnées et min-max",
          prompt: md`
            1. Déballez \`point = (3, 4)\` dans \`x\` et \`y\` **en une seule ligne**, puis calculez \`distance\`,
               la distance du point à l'origine : \`√(x² + y²)\`.
            2. Écrivez \`min_max(valeurs)\` qui renvoie le **tuple** \`(minimum, maximum)\`.
            3. Appelez \`min_max([4, 1, 9, 3])\` et déballez le résultat dans \`bas\` et \`haut\`.
          `,
          hint: md`\`x, y = point\` ; la racine carrée s'obtient avec \`** 0.5\` ; \`return min(valeurs), max(valeurs)\`.`,
          starter: py`
            point = (3, 4)

            # 1. Déballage + distance


            # 2.
            def min_max(valeurs):
                ...


            # 3.


            print(x, y, distance)
            print(bas, haut)
          `,
          solution: py`
            point = (3, 4)

            x, y = point
            distance = (x ** 2 + y ** 2) ** 0.5


            def min_max(valeurs):
                return min(valeurs), max(valeurs)


            bas, haut = min_max([4, 1, 9, 3])

            print(x, y, distance)
            print(bas, haut)
          `,
          tests: [
            test("`x` vaut 3 et `y` vaut 4", "(x, y) == (3, 4)", "(x, y)"),
            test("`distance` vaut 5.0", "distance == 5.0", "distance"),
            test("`min_max([4, 1, 9, 3])` renvoie `(1, 9)`", "min_max([4, 1, 9, 3]) == (1, 9)", "min_max([4, 1, 9, 3])"),
            test("`min_max` renvoie bien un tuple", "isinstance(min_max([2, 5]), tuple)"),
            test("`bas` et `haut` valent 1 et 9", "(bas, haut) == (1, 9)", "(bas, haut)"),
          ],
        },
        extra: {
          title: "Statistiques express",
          prompt: md`
            1. \`stats(valeurs)\` renvoie le tuple \`(effectif, moyenne, mediane)\`, **sans modifier** la liste reçue.
               La médiane est la valeur centrale de la liste triée ; pour un effectif pair, c'est la moyenne
               des deux valeurs centrales.
            2. Avec \`mesures = [10, 20, 30, 40, 50]\`, utilisez le déballage étoilé pour obtenir en une ligne
               \`premiere\`, \`milieu\` (liste des valeurs intermédiaires) et \`derniere\`.
          `,
          hint: md`
            Triez avec \`sorted()\` (qui ne modifie pas l'original, contrairement à \`.sort()\`).
            Indice du milieu : \`n // 2\`. Déballage étoilé : \`a, *b, c = liste\`.
          `,
          starter: py`
            def stats(valeurs):
                ...


            mesures = [10, 20, 30, 40, 50]
            # Déballage étoilé :


            print(stats([3, 1, 2]), stats([4, 1, 3, 2]))
            print(premiere, milieu, derniere)
          `,
          solution: py`
            def stats(valeurs):
                n = len(valeurs)
                moyenne = sum(valeurs) / n
                tri = sorted(valeurs)
                if n % 2 == 1:
                    mediane = tri[n // 2]
                else:
                    mediane = (tri[n // 2 - 1] + tri[n // 2]) / 2
                return n, moyenne, mediane


            mesures = [10, 20, 30, 40, 50]
            premiere, *milieu, derniere = mesures

            print(stats([3, 1, 2]), stats([4, 1, 3, 2]))
            print(premiere, milieu, derniere)
          `,
          tests: [
            test("`stats([3, 1, 2])` → `(3, 2.0, 2)`", "stats([3, 1, 2]) == (3, 2.0, 2)", "stats([3, 1, 2])"),
            test("`stats([4, 1, 3, 2])` → `(4, 2.5, 2.5)`", "stats([4, 1, 3, 2]) == (4, 2.5, 2.5)", "stats([4, 1, 3, 2])"),
            test("`stats([7])` → `(1, 7.0, 7)`", "stats([7]) == (1, 7.0, 7)", "stats([7])"),
            test("La liste passée à `stats` n'est pas modifiée", "(lambda l: (stats(l), l)[1])([3, 1, 2]) == [3, 1, 2]"),
            test(
              "`premiere`, `milieu`, `derniere` corrects",
              "(premiere, milieu, derniere) == (10, [20, 30, 40], 50)",
              "(premiere, milieu, derniere)",
            ),
            test("Le déballage étoilé est utilisé", "uses('Starred')"),
          ],
        },
        stretch: {
          title: "Classement et plus proche voisin",
          prompt: md`
            1. Triez \`etudiants\` (liste de tuples \`(nom, note)\`) dans \`classement\` : par **note décroissante**,
               puis par **nom alphabétique** en cas d'égalité. Créez \`podium\`, la liste des 3 premiers **noms**.
            2. \`distance(p1, p2)\` : distance euclidienne entre deux points \`(x, y)\`.
            3. \`plus_proche(points, cible)\` : renvoie le point de la liste le plus proche de \`cible\`.
               C'est le cœur de l'algorithme des *k plus proches voisins* (k-NN) en machine learning !
          `,
          hint: md`
            \`sorted(etudiants, key=lambda e: (-e[1], e[0]))\` : le signe moins inverse l'ordre des notes.
            Pour le plus proche : \`min(points, key=lambda p: distance(p, cible))\`.
          `,
          starter: py`
            etudiants = [("Ada", 17.5), ("Alan", 14.0), ("Grace", 19.0), ("Linus", 14.0), ("Margaret", 16.5)]

            # 1.
            classement = ...
            podium = ...


            # 2.
            def distance(p1, p2):
                ...


            # 3.
            def plus_proche(points, cible):
                ...


            print(classement)
            print(podium)
            print(plus_proche([(1, 1), (5, 5), (2, 3)], (4, 4)))
          `,
          solution: py`
            etudiants = [("Ada", 17.5), ("Alan", 14.0), ("Grace", 19.0), ("Linus", 14.0), ("Margaret", 16.5)]

            classement = sorted(etudiants, key=lambda e: (-e[1], e[0]))
            podium = [nom for nom, note in classement[:3]]


            def distance(p1, p2):
                (x1, y1), (x2, y2) = p1, p2
                return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5


            def plus_proche(points, cible):
                return min(points, key=lambda p: distance(p, cible))


            print(classement)
            print(podium)
            print(plus_proche([(1, 1), (5, 5), (2, 3)], (4, 4)))
          `,
          tests: [
            test(
              "`classement` trié par note ↓ puis nom ↑",
              "classement == [('Grace', 19.0), ('Ada', 17.5), ('Margaret', 16.5), ('Alan', 14.0), ('Linus', 14.0)]",
              "classement",
            ),
            test("`podium` vaut `['Grace', 'Ada', 'Margaret']`", "podium == ['Grace', 'Ada', 'Margaret']", "podium"),
            test("`distance((0, 0), (3, 4))` → 5.0", "distance((0, 0), (3, 4)) == 5.0", "distance((0, 0), (3, 4))"),
            test("`distance((1, 2), (1, 2))` → 0", "distance((1, 2), (1, 2)) == 0", "distance((1, 2), (1, 2))"),
            test("Plus proche de (4, 4) : (5, 5)", "plus_proche([(1, 1), (5, 5), (2, 3)], (4, 4)) == (5, 5)", "plus_proche([(1, 1), (5, 5), (2, 3)], (4, 4))"),
            test("Plus proche de (4, 1) : (0, 0)", "plus_proche([(0, 0), (10, 0)], (4, 1)) == (0, 0)", "plus_proche([(0, 0), (10, 0)], (4, 1))"),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Tuples en action",
      tiers: {
        core: {
          title: "Hands-on 5 : les catégories d'âge avec une liste de tuples",
          prompt: md`
            Reprenez les catégories d'âge (Hands-on 3), mais cette fois **sans chaîne de \`if\` / \`elif\`** : les
            catégories sont des données, rangées dans la liste de tuples \`CATEGORIES\` \`(âge min, âge max, nom)\`.

            \`category(age)\` parcourt la liste en **déballant** chaque tuple (\`for low, high, name in CATEGORIES\`)
            et renvoie le nom de la bonne catégorie (\`None\` si aucune ne convient).
          `,
          starter: py`
            CATEGORIES = [
                (0, 12, "Kid"),
                (13, 19, "Teenager"),
                (20, 30, "Young Adult"),
                (31, 64, "Adult"),
                (65, 150, "Senior"),
            ]


            def category(age):
                ...


            for age in (5, 15, 25, 45, 80):
                print(age, category(age))
          `,
          solution: py`
            CATEGORIES = [
                (0, 12, "Kid"),
                (13, 19, "Teenager"),
                (20, 30, "Young Adult"),
                (31, 64, "Adult"),
                (65, 150, "Senior"),
            ]


            def category(age):
                for low, high, name in CATEGORIES:
                    if low <= age <= high:
                        return name
                return None


            for age in (5, 15, 25, 45, 80):
                print(age, category(age))
          `,
          tests: [
            test("Les cinq catégories", "[category(a) for a in (5, 15, 25, 45, 80)] == ['Kid', 'Teenager', 'Young Adult', 'Adult', 'Senior']"),
            test("Les bornes", "[category(a) for a in (12, 13, 30, 31, 65)] == ['Kid', 'Teenager', 'Young Adult', 'Adult', 'Senior']"),
            test("Âge impossible → `None`", "category(-1) is None and category(200) is None"),
            test("Déballage dans la boucle, sans `elif`", "SOURCE.count('elif') == 0 and 'for low, high, name in' in SOURCE.replace('(', '').replace(')', '')"),
          ],
        },
        extra: {
          title: "Hands-On 6 : rotation 2D",
          prompt: md`
            On représente un point du plan par un **tuple** \`(x, y)\`.

            1. \`rotate(point, angle)\` renvoie le **nouveau** point obtenu par rotation autour de l'origine d'un angle
               en radians : x' = x·cos θ − y·sin θ, y' = x·sin θ + y·cos θ (les deux coordonnées arrondies à 10 décimales).
            2. \`rotate_all(points, angle)\` renvoie la liste des points tournés.
            3. \`translate(point, dx, dy)\` renvoie le point translaté.

            Un tuple étant immuable, on ne modifie jamais un point : on en crée un nouveau.
          `,
          starter: py`
            import math


            def rotate(point, angle):
                ...


            def rotate_all(points, angle):
                ...


            def translate(point, dx, dy):
                ...


            square = [(1, 0), (0, 1), (-1, 0), (0, -1)]
            print(rotate((1, 0), math.pi / 2), rotate_all(square, math.pi), translate((1, 2), 3, -1))
          `,
          solution: py`
            import math


            def rotate(point, angle):
                x, y = point
                c, s = math.cos(angle), math.sin(angle)
                return round(x * c - y * s, 10), round(x * s + y * c, 10)


            def rotate_all(points, angle):
                return [rotate(p, angle) for p in points]


            def translate(point, dx, dy):
                x, y = point
                return x + dx, y + dy


            square = [(1, 0), (0, 1), (-1, 0), (0, -1)]
            print(rotate((1, 0), math.pi / 2), rotate_all(square, math.pi), translate((1, 2), 3, -1))
          `,
          tests: [
            test("`rotate((1, 0), π/2)` → (0, 1)", "rotate((1, 0), math.pi / 2) == (0.0, 1.0)", "rotate((1, 0), math.pi / 2)"),
            test("`rotate` renvoie un tuple", "type(rotate((2, 3), 1)) is tuple"),
            test("Demi-tour d'un carré", "rotate_all([(1, 0), (0, 1)], math.pi) == [(-1.0, 0.0), (0.0, -1.0)]", "rotate_all([(1, 0), (0, 1)], math.pi)"),
            test("`translate`", "translate((1, 2), 3, -1) == (4, 1)"),
            test("Rotation d'un quart de tour, quatre fois → retour au départ", "(lambda p: rotate(rotate(rotate(rotate(p, math.pi / 2), math.pi / 2), math.pi / 2), math.pi / 2))((3, 4)) == (3.0, 4.0)"),
          ],
        },
        stretch: {
          title: "Racines : None ou un tuple",
          prompt: md`
            1. \`root_quadratic(a, b, c)\` (exemple du cours) renvoie \`None\` s'il n'y a pas de racine réelle, un tuple
               à **un** élément pour une racine double, sinon un tuple de deux racines **triées par ordre croissant**.
            2. \`describe(a, b, c)\` renvoie \`"No roots"\`, \`"One root: -1.0"\` ou \`"Two roots: 1.0 and 2.0"\` : elle doit
               gérer **les deux types de retour** de \`root_quadratic\`.
            3. \`count_real_roots(equations)\` : pour une liste de tuples \`(a, b, c)\`, le nombre total de racines réelles
               (déballez les tuples avec \`*\` dans l'appel : \`root_quadratic(*eq)\`).
          `,
          starter: py`
            def root_quadratic(a, b, c):
                ...


            def describe(a, b, c):
                ...


            def count_real_roots(equations):
                ...


            for coefs in [(1, 2, 1), (1, -3, 2), (1, 0, 1)]:
                print(coefs, describe(*coefs))
          `,
          solution: py`
            def root_quadratic(a, b, c):
                d = b ** 2 - 4 * a * c
                if d < 0:
                    return None
                elif d == 0:
                    return (-b / (2 * a),)
                else:
                    r1 = (-b - d ** 0.5) / (2 * a)
                    r2 = (-b + d ** 0.5) / (2 * a)
                    return (min(r1, r2), max(r1, r2))


            def describe(a, b, c):
                roots = root_quadratic(a, b, c)
                if roots is None:
                    return "No roots"
                if len(roots) == 1:
                    return f"One root: {roots[0]}"
                return f"Two roots: {roots[0]} and {roots[1]}"


            def count_real_roots(equations):
                total = 0
                for eq in equations:
                    roots = root_quadratic(*eq)
                    if roots:
                        total += len(roots)
                return total


            for coefs in [(1, 2, 1), (1, -3, 2), (1, 0, 1)]:
                print(coefs, describe(*coefs))
          `,
          tests: [
            test("`root_quadratic` : None, 1-tuple, 2-tuple", "root_quadratic(1, 0, 1) is None and root_quadratic(1, 2, 1) == (-1.0,) and root_quadratic(1, -3, 2) == (1.0, 2.0)"),
            test("Racines triées même si a < 0", "root_quadratic(-1, 3, -2) == (1.0, 2.0)", "root_quadratic(-1, 3, -2)"),
            test("`describe`", "[describe(*c) for c in [(1, 2, 1), (1, -3, 2), (1, 0, 1)]] == ['One root: -1.0', 'Two roots: 1.0 and 2.0', 'No roots']"),
            test("`count_real_roots`", "count_real_roots([(1, 2, 1), (1, -3, 2), (1, 0, 1)]) == 3 and count_real_roots([]) == 0"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 4.3
  "m4-l3": [
    {
      id: "ex1",
      title: "Dictionnaires en action",
      tiers: {
        core: {
          title: "Gérer un stock",
          prompt: md`
            À partir de \`stock = {"pommes": 10, "bananes": 5, "cerises": 0}\` :

            1. ajoutez \`"kiwis"\` avec une quantité de 8 ;
            2. augmentez les bananes de 3 ;
            3. supprimez les cerises ;
            4. \`total\` : la quantité totale en stock ;
            5. \`quantite_mangues\` : la quantité de mangues, **0 si absentes** (sans provoquer d'erreur) ;
            6. affichez chaque fruit au format \`pommes : 10\` en parcourant \`stock.items()\`.
          `,
          hint: md`\`stock["kiwis"] = 8\`, \`stock["bananes"] += 3\`, \`del stock["cerises"]\`, \`sum(stock.values())\`, \`stock.get("mangues", 0)\`.`,
          starter: py`
            stock = {"pommes": 10, "bananes": 5, "cerises": 0}

            # 1, 2, 3 : modifications


            # 4.
            total = ...

            # 5.
            quantite_mangues = ...

            # 6. Affichage


            print(stock, total, quantite_mangues)
          `,
          solution: py`
            stock = {"pommes": 10, "bananes": 5, "cerises": 0}

            stock["kiwis"] = 8
            stock["bananes"] += 3
            del stock["cerises"]

            total = sum(stock.values())
            quantite_mangues = stock.get("mangues", 0)

            for fruit, quantite in stock.items():
                print(fruit, ":", quantite)

            print(stock, total, quantite_mangues)
          `,
          tests: [
            test("`stock` vaut `{'pommes': 10, 'bananes': 8, 'kiwis': 8}`", "stock == {'pommes': 10, 'bananes': 8, 'kiwis': 8}", "stock"),
            test("`total` vaut 26", "total == 26", "total"),
            test("`quantite_mangues` vaut 0, obtenu avec `get`", "quantite_mangues == 0 and calls('get')", "quantite_mangues"),
            test("Affiche `pommes : 10` et `kiwis : 8`", "'pommes : 10' in LINES and 'kiwis : 8' in LINES"),
            test("Le parcours utilise `.items()`", "calls('items')"),
          ],
        },
        extra: {
          title: "Fréquence des mots",
          prompt: md`
            1. \`compter_mots(texte)\` renvoie un dictionnaire \`{mot: nombre d'occurrences}\`.
               Les mots sont séparés par des espaces et comptés **en minuscules**.
            2. Calculez \`frequences = compter_mots(texte)\` pour le texte fourni.
            3. \`mot_frequent\` : le mot le plus fréquent.
          `,
          hint: md`
            \`texte.lower().split()\` donne la liste des mots. Pattern de comptage :
            \`compte[mot] = compte.get(mot, 0) + 1\`. Pour le maximum : \`max(frequences, key=frequences.get)\`.
          `,
          starter: py`
            def compter_mots(texte):
                ...


            texte = "Le chat et le chien et le poisson"
            frequences = ...
            mot_frequent = ...

            print(frequences)
            print("Mot le plus fréquent :", mot_frequent)
          `,
          solution: py`
            def compter_mots(texte):
                compte = {}
                for mot in texte.lower().split():
                    compte[mot] = compte.get(mot, 0) + 1
                return compte


            texte = "Le chat et le chien et le poisson"
            frequences = compter_mots(texte)
            mot_frequent = max(frequences, key=frequences.get)

            print(frequences)
            print("Mot le plus fréquent :", mot_frequent)
          `,
          explanation: md`
            La bibliothèque standard propose aussi \`collections.Counter\` : \`Counter(texte.lower().split()).most_common(1)\`.
          `,
          tests: [
            test("`compter_mots('a b a')` → `{'a': 2, 'b': 1}`", "compter_mots('a b a') == {'a': 2, 'b': 1}", "compter_mots('a b a')"),
            test("`compter_mots('')` → `{}`", "compter_mots('') == {}", "compter_mots('')"),
            test("Insensible à la casse : `'Data data DATA'`", "compter_mots('Data data DATA') == {'data': 3}", "compter_mots('Data data DATA')"),
            test(
              "`frequences` est correct",
              "frequences == {'le': 3, 'chat': 1, 'et': 2, 'chien': 1, 'poisson': 1}",
              "frequences",
            ),
            test("`mot_frequent` vaut `'le'`", "mot_frequent == 'le'", "mot_frequent"),
          ],
        },
        stretch: {
          title: "Analyse de transactions",
          prompt: md`
            Chaque transaction est un dictionnaire \`{"client", "ville", "montant"}\` : c'est la forme
            typique d'une ligne de données. Écrivez :

            - \`total_par_client(transactions)\` → \`{client: montant total}\` ;
            - \`meilleur_client(transactions)\` → le nom du client au plus gros total ;
            - \`clients_par_ville(transactions)\` → \`{ville: liste triée des clients, sans doublon}\`.

            C'est exactement ce que fait un \`groupby\` en pandas !
          `,
          hint: md`
            Réutilisez \`total_par_client\` dans \`meilleur_client\`. Pour regrouper :
            \`if ville not in resultat: resultat[ville] = []\`, puis ajoutez le client s'il n'y est pas déjà ;
            triez chaque liste à la fin.
          `,
          starter: py`
            transactions = [
                {"client": "Ada", "ville": "Londres", "montant": 120},
                {"client": "Alan", "ville": "Manchester", "montant": 80},
                {"client": "Ada", "ville": "Londres", "montant": 45},
                {"client": "Grace", "ville": "New York", "montant": 200},
                {"client": "Alan", "ville": "Manchester", "montant": 60},
                {"client": "Linus", "ville": "Helsinki", "montant": 30},
                {"client": "Margaret", "ville": "New York", "montant": 95},
            ]


            def total_par_client(transactions):
                ...


            def meilleur_client(transactions):
                ...


            def clients_par_ville(transactions):
                ...


            print(total_par_client(transactions))
            print(meilleur_client(transactions))
            print(clients_par_ville(transactions))
          `,
          solution: py`
            transactions = [
                {"client": "Ada", "ville": "Londres", "montant": 120},
                {"client": "Alan", "ville": "Manchester", "montant": 80},
                {"client": "Ada", "ville": "Londres", "montant": 45},
                {"client": "Grace", "ville": "New York", "montant": 200},
                {"client": "Alan", "ville": "Manchester", "montant": 60},
                {"client": "Linus", "ville": "Helsinki", "montant": 30},
                {"client": "Margaret", "ville": "New York", "montant": 95},
            ]


            def total_par_client(transactions):
                totaux = {}
                for t in transactions:
                    totaux[t["client"]] = totaux.get(t["client"], 0) + t["montant"]
                return totaux


            def meilleur_client(transactions):
                totaux = total_par_client(transactions)
                return max(totaux, key=totaux.get)


            def clients_par_ville(transactions):
                resultat = {}
                for t in transactions:
                    ville = t["ville"]
                    if ville not in resultat:
                        resultat[ville] = []
                    if t["client"] not in resultat[ville]:
                        resultat[ville].append(t["client"])
                for ville in resultat:
                    resultat[ville].sort()
                return resultat


            print(total_par_client(transactions))
            print(meilleur_client(transactions))
            print(clients_par_ville(transactions))
          `,
          tests: [
            test(
              "`total_par_client` sur les données fournies",
              "total_par_client(transactions) == {'Ada': 165, 'Alan': 140, 'Grace': 200, 'Linus': 30, 'Margaret': 95}",
              "total_par_client(transactions)",
            ),
            test("`total_par_client([])` → `{}`", "total_par_client([]) == {}", "total_par_client([])"),
            test("`meilleur_client` → `'Grace'`", "meilleur_client(transactions) == 'Grace'", "meilleur_client(transactions)"),
            test(
              "`meilleur_client` sur d'autres données",
              "meilleur_client([{'client': 'X', 'ville': 'A', 'montant': 10}, {'client': 'Y', 'ville': 'A', 'montant': 15}, {'client': 'X', 'ville': 'A', 'montant': 10}]) == 'X'",
            ),
            test(
              "`clients_par_ville` : listes triées, sans doublon",
              "clients_par_ville(transactions) == {'Londres': ['Ada'], 'Manchester': ['Alan'], 'New York': ['Grace', 'Margaret'], 'Helsinki': ['Linus']}",
              "clients_par_ville(transactions)",
            ),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Login, clés et distances",
      tiers: {
        core: {
          title: "Hands-On 7 : un système de login",
          prompt: md`
            Les comptes sont une **liste de dictionnaires** \`users\`.

            1. \`find_user(users, name)\` renvoie le dictionnaire de l'utilisateur, ou \`None\` s'il n'existe pas.
            2. Le programme lit le nom d'utilisateur **tant qu'il n'existe pas** (affiche \`Unknown user\`), puis le mot
               de passe **tant qu'il est faux** (affiche \`Wrong password\`), et enfin \`Welcome, Alice!\`.
          `,
          stdin: "Bob2\nAlice\nabcd\n1234",
          starter: py`
            users = [
                {"username": "Alice", "password": "1234"},
                {"username": "Bob", "password": "pwd"},
                {"username": "Charlie", "password": "paris41"},
            ]


            def find_user(users, name):
                ...


          `,
          solution: py`
            users = [
                {"username": "Alice", "password": "1234"},
                {"username": "Bob", "password": "pwd"},
                {"username": "Charlie", "password": "paris41"},
            ]


            def find_user(users, name):
                for user in users:
                    if user["username"] == name:
                        return user
                return None


            while True:
                user = find_user(users, input("User name? "))
                if user is not None:
                    break
                print("Unknown user")

            while input("Password? ") != user["password"]:
                print("Wrong password")

            print(f"Welcome, {user['username']}!")
          `,
          tests: [
            test("`find_user`", "find_user(users, 'Bob')['password'] == 'pwd' and find_user(users, 'Zoe') is None"),
            test("Nom inconnu signalé", "OUTPUT.count('Unknown user') == 1"),
            test("Mot de passe faux signalé", "OUTPUT.count('Wrong password') == 1"),
            test("Message de bienvenue", "'Welcome, Alice!' in OUTPUT"),
            test("Charlie du premier coup", "(lambda out: 'Welcome, Charlie!' in out and 'Unknown' not in out and 'Wrong' not in out)(run_with(stdin='Charlie\\nparis41\\n')['OUTPUT'])"),
          ],
        },
        extra: {
          title: "Clés hachables et distances",
          prompt: md`
            1. \`is_hashable(x)\` renvoie \`True\` si \`x\` peut servir de clé de dictionnaire (essayez \`hash(x)\` dans un
               \`try\` / \`except TypeError\`).
            2. \`distances\` est un dictionnaire dont les clés sont des **tuples** de villes. \`get_distance(d, a, b)\`
               renvoie la distance entre \`a\` et \`b\` dans un sens **ou dans l'autre**, et lève \`KeyError\` si elle
               est inconnue (ou 0 si \`a == b\`).
            3. \`route_length(d, route)\` renvoie la longueur d'un itinéraire (liste de villes).
          `,
          starter: py`
            distances = {("A", "B"): 100, ("A", "C"): 200, ("B", "C"): 150, ("C", "D"): 90}


            def is_hashable(x):
                ...


            def get_distance(d, a, b):
                ...


            def route_length(d, route):
                ...


            print(is_hashable((1, 2)), is_hashable([1, 2]))
            print(get_distance(distances, "C", "A"), route_length(distances, ["A", "B", "C", "D"]))
          `,
          solution: py`
            distances = {("A", "B"): 100, ("A", "C"): 200, ("B", "C"): 150, ("C", "D"): 90}


            def is_hashable(x):
                try:
                    hash(x)
                    return True
                except TypeError:
                    return False


            def get_distance(d, a, b):
                if a == b:
                    return 0
                if (a, b) in d:
                    return d[(a, b)]
                if (b, a) in d:
                    return d[(b, a)]
                raise KeyError((a, b))


            def route_length(d, route):
                total = 0
                for i in range(len(route) - 1):
                    total += get_distance(d, route[i], route[i + 1])
                return total


            print(is_hashable((1, 2)), is_hashable([1, 2]))
            print(get_distance(distances, "C", "A"), route_length(distances, ["A", "B", "C", "D"]))
          `,
          tests: [
            test("`is_hashable`", "[is_hashable(x) for x in (3, '3', (1, 2), [1, 2], {'a': 1}, {1, 2}, frozenset({1}))] == [True, True, True, False, False, False, True]"),
            test("`get_distance` dans les deux sens", "get_distance(distances, 'A', 'C') == 200 and get_distance(distances, 'C', 'A') == 200 and get_distance(distances, 'D', 'D') == 0"),
            test("Distance inconnue → `KeyError`", "raises(KeyError, get_distance, distances, 'A', 'D')"),
            test("`route_length`", "route_length(distances, ['A', 'B', 'C', 'D']) == 340 and route_length(distances, ['D', 'C', 'A']) == 290 and route_length(distances, ['A']) == 0"),
          ],
        },
        stretch: {
          title: "Compléter une table de distances",
          prompt: md`
            La table \`dists\` du cours ne donne chaque distance que dans **un** sens. Écrivez :

            1. \`complete(dists)\` : une **compréhension de dictionnaire** (imbriquée) qui renvoie la table complète
               \`{x: {y: distance ou None}}\` pour tous les couples de villes, comme dans le cours (la distance de \`x\` à
               \`y\` est \`dists[x][y]\` si elle existe, sinon \`dists[y][x]\` si elle existe, sinon \`None\`) ;
            2. \`nearest(table, city)\` : la ville la plus proche de \`city\` (autre qu'elle-même), en ignorant les \`None\`.
          `,
          starter: py`
            dists = {"A": {"B": 140, "E": 200, "F": 200}, "B": {"C": 260, "F": 140},
                     "C": {"D": 360}, "D": {"F": 280}, "E": {"F": 120}, "F": {}}


            def complete(dists):
                ...


            def nearest(table, city):
                ...


            table = complete(dists)
            print(table["F"])
            print(nearest(table, "F"), nearest(table, "C"))
          `,
          solution: py`
            dists = {"A": {"B": 140, "E": 200, "F": 200}, "B": {"C": 260, "F": 140},
                     "C": {"D": 360}, "D": {"F": 280}, "E": {"F": 120}, "F": {}}


            def complete(dists):
                return {x: {y: dists[x][y] if y in dists[x]
                               else dists[y][x] if x in dists[y]
                               else None
                            for y in dists}
                        for x in dists}


            def nearest(table, city):
                candidates = {other: d for other, d in table[city].items() if d is not None and other != city}
                return min(candidates, key=candidates.get)


            table = complete(dists)
            print(table["F"])
            print(nearest(table, "F"), nearest(table, "C"))
          `,
          tests: [
            test("`complete` est symétrique", "(lambda t: all(t[x][y] == t[y][x] for x in t for y in t))(complete(dists))"),
            test("Valeurs de F", "complete(dists)['F'] == {'A': 200, 'B': 140, 'C': None, 'D': 280, 'E': 120, 'F': None}", "complete(dists)['F']"),
            test("Une compréhension de dictionnaire", "uses('DictComp')"),
            test("`nearest`", "nearest(complete(dists), 'F') == 'E' and nearest(complete(dists), 'C') == 'B' and nearest(complete(dists), 'A') == 'B'"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 4.4
  "m4-l4": [
    {
      id: "ex1",
      title: "Opérations sur les ensembles",
      tiers: {
        core: {
          title: "Inscriptions aux cours",
          prompt: md`
            Deux ensembles d'étudiants sont inscrits aux cours de Python et de SQL. Créez :

            - \`les_deux\` : inscrits aux deux cours ;
            - \`au_moins_un\` : inscrits à au moins un cours ;
            - \`python_seulement\` : inscrits en Python mais pas en SQL ;
            - \`un_seul\` : inscrits à un seul des deux cours ;
            - \`nb_etudiants\` : le nombre total d'étudiants différents.
          `,
          hint: md`Opérateurs : \`&\` (intersection), \`|\` (union), \`-\` (différence), \`^\` (différence symétrique).`,
          starter: py`
            python = {"Ada", "Alan", "Grace", "Linus"}
            sql = {"Grace", "Linus", "Margaret", "Tim"}

            les_deux = ...
            au_moins_un = ...
            python_seulement = ...
            un_seul = ...
            nb_etudiants = ...

            print(sorted(les_deux))
            print(sorted(un_seul))
            print(nb_etudiants)
          `,
          solution: py`
            python = {"Ada", "Alan", "Grace", "Linus"}
            sql = {"Grace", "Linus", "Margaret", "Tim"}

            les_deux = python & sql
            au_moins_un = python | sql
            python_seulement = python - sql
            un_seul = python ^ sql
            nb_etudiants = len(au_moins_un)

            print(sorted(les_deux))
            print(sorted(un_seul))
            print(nb_etudiants)
          `,
          tests: [
            test("`les_deux` = Grace et Linus", "les_deux == {'Grace', 'Linus'}", "les_deux"),
            test("`au_moins_un` contient 6 personnes", "au_moins_un == {'Ada', 'Alan', 'Grace', 'Linus', 'Margaret', 'Tim'}", "au_moins_un"),
            test("`python_seulement` = Ada et Alan", "python_seulement == {'Ada', 'Alan'}", "python_seulement"),
            test("`un_seul` = Ada, Alan, Margaret, Tim", "un_seul == {'Ada', 'Alan', 'Margaret', 'Tim'}", "un_seul"),
            test("`nb_etudiants` vaut 6", "nb_etudiants == 6", "nb_etudiants"),
          ],
        },
        extra: {
          title: "Doublons et lettres communes",
          prompt: md`
            Écrivez trois fonctions courtes (une ou deux lignes chacune) grâce aux ensembles :

            - \`valeurs_uniques(valeurs)\` : liste **triée** des valeurs distinctes ;
            - \`a_des_doublons(valeurs)\` : \`True\` si une valeur apparaît plusieurs fois ;
            - \`lettres_communes(mot1, mot2)\` : **ensemble** des lettres présentes dans les deux mots,
              sans tenir compte des majuscules.
          `,
          hint: md`Un ensemble supprime les doublons : comparez \`len(set(valeurs))\` et \`len(valeurs)\`.`,
          starter: py`
            def valeurs_uniques(valeurs):
                ...


            def a_des_doublons(valeurs):
                ...


            def lettres_communes(mot1, mot2):
                ...


            print(valeurs_uniques([3, 1, 3, 2, 1]))
            print(a_des_doublons([1, 2, 1]), a_des_doublons([1, 2, 3]))
            print(sorted(lettres_communes("Python", "typo")))
          `,
          solution: py`
            def valeurs_uniques(valeurs):
                return sorted(set(valeurs))


            def a_des_doublons(valeurs):
                return len(set(valeurs)) < len(valeurs)


            def lettres_communes(mot1, mot2):
                return set(mot1.lower()) & set(mot2.lower())


            print(valeurs_uniques([3, 1, 3, 2, 1]))
            print(a_des_doublons([1, 2, 1]), a_des_doublons([1, 2, 3]))
            print(sorted(lettres_communes("Python", "typo")))
          `,
          tests: [
            test("`valeurs_uniques([3, 1, 3, 2, 1])` → `[1, 2, 3]`", "valeurs_uniques([3, 1, 3, 2, 1]) == [1, 2, 3]", "valeurs_uniques([3, 1, 3, 2, 1])"),
            test("`valeurs_uniques` renvoie une liste", "isinstance(valeurs_uniques([2, 2]), list)"),
            test("`a_des_doublons([1, 2, 1])` → `True`", "a_des_doublons([1, 2, 1]) is True", "a_des_doublons([1, 2, 1])"),
            test("`a_des_doublons([1, 2, 3])` → `False`", "a_des_doublons([1, 2, 3]) is False", "a_des_doublons([1, 2, 3])"),
            test(
              "`lettres_communes('Python', 'typo')` → `{'p', 'y', 't', 'o'}`",
              "lettres_communes('Python', 'typo') == {'p', 'y', 't', 'o'}",
              "lettres_communes('Python', 'typo')",
            ),
            test("Aucune lettre commune → ensemble vide", "lettres_communes('abc', 'xyz') == set()", "lettres_communes('abc', 'xyz')"),
          ],
        },
        stretch: {
          title: "Pangrammes et anagrammes",
          prompt: md`
            1. \`est_pangramme(phrase)\` : \`True\` si la phrase contient **les 26 lettres** de l'alphabet
               (sans tenir compte des majuscules).
            2. \`anagrammes(mot1, mot2)\` : \`True\` si les deux mots utilisent exactement les mêmes lettres,
               **le même nombre de fois** (majuscules et espaces ignorés). Exemple : \`"chien"\` / \`"niche"\`.

            ⚠️ Piège : comparer \`set(mot1) == set(mot2)\` ne suffit pas pour les anagrammes. Pourquoi ?
          `,
          hint: md`
            Pangramme : l'ensemble \`set("abcdefghijklmnopqrstuvwxyz")\` doit être **inclus** (\`<=\`) dans
            l'ensemble des lettres de la phrase. Anagrammes : comparez les listes **triées** de lettres.
          `,
          starter: py`
            def est_pangramme(phrase):
                ...


            def anagrammes(mot1, mot2):
                ...


            print(est_pangramme("Portez ce vieux whisky au juge blond qui fume"))
            print(anagrammes("chien", "niche"), anagrammes("aab", "abb"))
          `,
          solution: py`
            ALPHABET = set("abcdefghijklmnopqrstuvwxyz")


            def est_pangramme(phrase):
                return ALPHABET <= set(phrase.lower())


            def anagrammes(mot1, mot2):
                a = mot1.lower().replace(" ", "")
                b = mot2.lower().replace(" ", "")
                return sorted(a) == sorted(b)


            print(est_pangramme("Portez ce vieux whisky au juge blond qui fume"))
            print(anagrammes("chien", "niche"), anagrammes("aab", "abb"))
          `,
          explanation: md`
            Un ensemble ne retient pas le **nombre** d'occurrences : \`set("aab") == set("abb") == {"a", "b"}\`.
            Trier les lettres (ou les compter avec un dictionnaire) conserve cette information.
          `,
          tests: [
            test("La phrase d'exemple est un pangramme", "est_pangramme('Portez ce vieux whisky au juge blond qui fume') is True"),
            test("`'Bonjour tout le monde'` n'en est pas un", "est_pangramme('Bonjour tout le monde') is False"),
            test("`'chien'` / `'niche'` → `True`", "anagrammes('chien', 'niche') is True"),
            test("`'Marie'` / `'aimer'` → `True` (casse ignorée)", "anagrammes('Marie', 'aimer') is True"),
            test("`'aab'` / `'abb'` → `False` (le piège !)", "anagrammes('aab', 'abb') is False"),
            test("`'abc'` / `'abcd'` → `False`", "anagrammes('abc', 'abcd') is False"),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Doublons, voisins et routes",
      tiers: {
        core: {
          title: "Hands-On 8 : supprimer et trouver les doublons",
          prompt: md`
            Avec des **ensembles** :

            1. \`remove_duplicates(lst)\` renvoie la liste sans doublons, **dans l'ordre de première apparition**
               (un ensemble \`seen\` mémorise les éléments déjà rencontrés) ;
            2. \`find_duplicates_sets(lst)\` renvoie l'**ensemble** des éléments qui apparaissent plusieurs fois.

            Quel est l'intérêt des ensembles ici ? Le test \`x in seen\` est quasi instantané, même pour une très
            longue liste.
          `,
          starter: py`
            def remove_duplicates(lst):
                ...


            def find_duplicates_sets(lst):
                ...


            my_list = [1, 2, 3, 2, 4, 5, 3, 6]
            print(remove_duplicates(my_list))
            print("Duplicate elements in the list:", find_duplicates_sets(my_list))
          `,
          solution: py`
            def remove_duplicates(lst):
                seen = set()
                result = []
                for x in lst:
                    if x not in seen:
                        seen.add(x)
                        result.append(x)
                return result


            def find_duplicates_sets(lst):
                seen = set()
                duplicates = set()
                for x in lst:
                    if x in seen:
                        duplicates.add(x)
                    seen.add(x)
                return duplicates


            my_list = [1, 2, 3, 2, 4, 5, 3, 6]
            print(remove_duplicates(my_list))
            print("Duplicate elements in the list:", find_duplicates_sets(my_list))
          `,
          tests: [
            test("`remove_duplicates` garde l'ordre", "remove_duplicates([1, 2, 3, 2, 4, 5, 3, 6]) == [1, 2, 3, 4, 5, 6] and remove_duplicates(['b', 'a', 'b']) == ['b', 'a']"),
            test("`find_duplicates_sets`", "find_duplicates_sets([1, 2, 3, 2, 4, 5, 3, 6]) == {2, 3} and find_duplicates_sets([1, 2]) == set()"),
            test("Renvoie bien un ensemble", "type(find_duplicates_sets([1, 1])) is set"),
            test("Rapide sur 100 000 éléments", "len(remove_duplicates(list(range(100_000)) * 2)) == 100_000"),
          ],
        },
        extra: {
          title: "Pays voisins",
          prompt: md`
            \`neighbors\` est la liste des frontières d'Amérique du Nord et centrale : chaque frontière est un
            **ensemble** de deux pays.

            1. \`adjacency(neighbors)\` renvoie un dictionnaire \`pays → ensemble de ses voisins\` ;
            2. \`reachable(adj, start)\` renvoie l'**ensemble** des pays qu'on peut atteindre depuis \`start\` en
               traversant des frontières (\`start\` compris) : partez de \`{start}\` et ajoutez les voisins des pays
               atteints jusqu'à ce que rien ne change.
          `,
          starter: py`
            countries = {"Canada", "USA", "Mexico", "Guatemala", "Belize", "El Salvador",
                         "Honduras", "Nicaragua", "Costa Rica", "Panama"}
            neighbors = [
                {"Canada", "USA"}, {"USA", "Mexico"}, {"Mexico", "Guatemala"}, {"Mexico", "Belize"},
                {"Guatemala", "Belize"}, {"Guatemala", "El Salvador"}, {"Guatemala", "Honduras"},
                {"Honduras", "Nicaragua"}, {"Nicaragua", "Costa Rica"}, {"Costa Rica", "Panama"},
            ]


            def adjacency(neighbors):
                ...


            def reachable(adj, start):
                ...


            adj = adjacency(neighbors)
            print(sorted(adj["Guatemala"]))
            print(reachable(adj, "Canada") == countries)
          `,
          solution: py`
            countries = {"Canada", "USA", "Mexico", "Guatemala", "Belize", "El Salvador",
                         "Honduras", "Nicaragua", "Costa Rica", "Panama"}
            neighbors = [
                {"Canada", "USA"}, {"USA", "Mexico"}, {"Mexico", "Guatemala"}, {"Mexico", "Belize"},
                {"Guatemala", "Belize"}, {"Guatemala", "El Salvador"}, {"Guatemala", "Honduras"},
                {"Honduras", "Nicaragua"}, {"Nicaragua", "Costa Rica"}, {"Costa Rica", "Panama"},
            ]


            def adjacency(neighbors):
                adj = {}
                for border in neighbors:
                    a, b = border
                    adj.setdefault(a, set()).add(b)
                    adj.setdefault(b, set()).add(a)
                return adj


            def reachable(adj, start):
                reached = {start}
                while True:
                    new = set()
                    for country in reached:
                        new |= adj.get(country, set())
                    if new <= reached:
                        return reached
                    reached |= new


            adj = adjacency(neighbors)
            print(sorted(adj["Guatemala"]))
            print(reachable(adj, "Canada") == countries)
          `,
          tests: [
            test("`adjacency` : voisins du Guatemala", "adjacency(neighbors)['Guatemala'] == {'Mexico', 'Belize', 'El Salvador', 'Honduras'}", "adjacency(neighbors).get('Guatemala')"),
            test("Le Canada n'a qu'un voisin, le Panama aussi", "adjacency(neighbors)['Canada'] == {'USA'} and adjacency(neighbors)['Panama'] == {'Costa Rica'}"),
            test("Tous les pays sont atteignables depuis le Canada", "reachable(adjacency(neighbors), 'Canada') == countries"),
            test("Sur un graphe en deux morceaux", "reachable(adjacency([{'a', 'b'}, {'c', 'd'}]), 'a') == {'a', 'b'}"),
          ],
        },
        stretch: {
          title: "Toutes les routes avec Floyd-Warshall",
          prompt: md`
            *Exercice « difficile » du cours* : trouver la **route** (le plus court chemin en nombre de frontières) de
            chaque pays vers chaque autre pays, avec l'**algorithme de Floyd-Warshall** :

            1. initialisez \`dist[(a, b)]\` à 0 si a = b, 1 si a et b sont voisins, l'infini (\`float("inf")\`) sinon,
               et \`nxt[(a, b)] = b\` pour deux voisins (le pays suivant sur la route) ;
            2. pour chaque pays intermédiaire \`k\`, puis chaque couple \`(i, j)\` : si passer par \`k\` est plus court
               (\`dist[(i, k)] + dist[(k, j)] < dist[(i, j)]\`), mettez à jour \`dist[(i, j)]\` et \`nxt[(i, j)] = nxt[(i, k)]\`.

            \`shortest_routes(countries, neighbors)\` renvoie le couple \`(dist, nxt)\`, et \`route(nxt, a, b)\` reconstruit
            la liste des pays de \`a\` à \`b\`.
          `,
          hint: md`
            Pour reconstruire la route : partez de \`[a]\`, puis tant que le dernier pays n'est pas \`b\`, ajoutez
            \`nxt[(dernier, b)]\`. L'ordre des trois boucles est important : \`k\` doit être la boucle **extérieure**.
          `,
          starter: py`
            countries = {"Canada", "USA", "Mexico", "Guatemala", "Belize", "El Salvador",
                         "Honduras", "Nicaragua", "Costa Rica", "Panama"}
            neighbors = [
                {"Canada", "USA"}, {"USA", "Mexico"}, {"Mexico", "Guatemala"}, {"Mexico", "Belize"},
                {"Guatemala", "Belize"}, {"Guatemala", "El Salvador"}, {"Guatemala", "Honduras"},
                {"Honduras", "Nicaragua"}, {"Nicaragua", "Costa Rica"}, {"Costa Rica", "Panama"},
            ]


            def shortest_routes(countries, neighbors):
                ...


            def route(nxt, a, b):
                ...


            dist, nxt = shortest_routes(countries, neighbors)
            print(route(nxt, "Canada", "Panama"), dist[("Canada", "Panama")])
          `,
          solution: py`
            countries = {"Canada", "USA", "Mexico", "Guatemala", "Belize", "El Salvador",
                         "Honduras", "Nicaragua", "Costa Rica", "Panama"}
            neighbors = [
                {"Canada", "USA"}, {"USA", "Mexico"}, {"Mexico", "Guatemala"}, {"Mexico", "Belize"},
                {"Guatemala", "Belize"}, {"Guatemala", "El Salvador"}, {"Guatemala", "Honduras"},
                {"Honduras", "Nicaragua"}, {"Nicaragua", "Costa Rica"}, {"Costa Rica", "Panama"},
            ]


            def shortest_routes(countries, neighbors):
                dist = {}
                nxt = {}
                for a in countries:
                    for b in countries:
                        if a == b:
                            dist[(a, b)] = 0
                        elif {a, b} in neighbors:
                            dist[(a, b)] = 1
                            nxt[(a, b)] = b
                        else:
                            dist[(a, b)] = float("inf")
                for k in countries:
                    for i in countries:
                        for j in countries:
                            if dist[(i, k)] + dist[(k, j)] < dist[(i, j)]:
                                dist[(i, j)] = dist[(i, k)] + dist[(k, j)]
                                nxt[(i, j)] = nxt[(i, k)]
                return dist, nxt


            def route(nxt, a, b):
                path = [a]
                while path[-1] != b:
                    path.append(nxt[(path[-1], b)])
                return path


            dist, nxt = shortest_routes(countries, neighbors)
            print(route(nxt, "Canada", "Panama"), dist[("Canada", "Panama")])
          `,
          tests: [
            test(
              "La route du Canada au Panama",
              "route(nxt, 'Canada', 'Panama') == ['Canada', 'USA', 'Mexico', 'Guatemala', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama']",
              "route(nxt, 'Canada', 'Panama')",
            ),
            test("Distances en nombre de frontières", "dist[('Canada', 'Panama')] == 7 and dist[('El Salvador', 'Belize')] == 2 and dist[('Belize', 'Panama')] == 5 and dist[('USA', 'USA')] == 0"),
            test("Les distances sont symétriques", "all(dist[(a, b)] == dist[(b, a)] for a in countries for b in countries)"),
            test(
              "Chaque route ne traverse que des frontières existantes",
              "all({p, q} in neighbors for a in countries for b in countries if a != b for p, q in zip(route(nxt, a, b), route(nxt, a, b)[1:]))",
            ),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 4.5
  "m4-l5": [
    {
      id: "ex1",
      title: "Compréhensions",
      tiers: {
        core: {
          title: "Listes en une ligne",
          prompt: md`
            À partir de \`nombres = list(range(1, 21))\`, créez **uniquement avec des compréhensions de liste**
            (aucune boucle \`for\` classique) :

            - \`carres\` : les carrés de tous les nombres ;
            - \`pairs\` : les nombres pairs ;
            - \`carres_impairs\` : les carrés des nombres impairs ;
            - \`etiquettes\` : pour les 5 premiers nombres, \`"pair"\` ou \`"impair"\`.
          `,
          hint: md`
            Filtre : \`[n for n in nombres if n % 2 == 0]\`. Transformation conditionnelle :
            \`["pair" if n % 2 == 0 else "impair" for n in nombres[:5]]\`.
          `,
          starter: py`
            nombres = list(range(1, 21))

            carres = ...
            pairs = ...
            carres_impairs = ...
            etiquettes = ...

            print(carres)
            print(pairs)
            print(carres_impairs)
            print(etiquettes)
          `,
          solution: py`
            nombres = list(range(1, 21))

            carres = [n ** 2 for n in nombres]
            pairs = [n for n in nombres if n % 2 == 0]
            carres_impairs = [n ** 2 for n in nombres if n % 2 == 1]
            etiquettes = ["pair" if n % 2 == 0 else "impair" for n in nombres[:5]]

            print(carres)
            print(pairs)
            print(carres_impairs)
            print(etiquettes)
          `,
          tests: [
            test("`carres` : 20 carrés, de 1 à 400", "len(carres) == 20 and carres[0] == 1 and carres[-1] == 400 and carres[4] == 25", "carres"),
            test("`pairs` : 2, 4, …, 20", "pairs == list(range(2, 21, 2))", "pairs"),
            test("`carres_impairs` : 1, 9, 25, …, 361", "carres_impairs == [n * n for n in range(1, 20, 2)]", "carres_impairs"),
            test("`etiquettes` correctes", "etiquettes == ['impair', 'pair', 'impair', 'pair', 'impair']", "etiquettes"),
            test("Compréhensions utilisées, aucune boucle `for` classique", "uses('ListComp') and not uses('For')"),
          ],
        },
        extra: {
          title: "Dictionnaires et ensembles en compréhension",
          prompt: md`
            À partir de la liste \`mots\`, créez :

            - \`longueurs\` : dictionnaire \`{mot: longueur}\` (compréhension de **dictionnaire**) ;
            - \`longs\` : les mots de plus de 4 lettres, **en majuscules** (compréhension de liste) ;
            - \`initiales\` : l'ensemble des premières lettres (compréhension d'**ensemble**) ;
            - \`total_lettres\` : le nombre total de lettres, avec \`sum()\` et une expression génératrice.
          `,
          hint: md`\`{m: len(m) for m in mots}\`, \`{m[0] for m in mots}\`, \`sum(len(m) for m in mots)\`.`,
          starter: py`
            mots = ["python", "data", "science", "ia", "pandas", "numpy"]

            longueurs = ...
            longs = ...
            initiales = ...
            total_lettres = ...

            print(longueurs)
            print(longs)
            print(sorted(initiales), total_lettres)
          `,
          solution: py`
            mots = ["python", "data", "science", "ia", "pandas", "numpy"]

            longueurs = {mot: len(mot) for mot in mots}
            longs = [mot.upper() for mot in mots if len(mot) > 4]
            initiales = {mot[0] for mot in mots}
            total_lettres = sum(len(mot) for mot in mots)

            print(longueurs)
            print(longs)
            print(sorted(initiales), total_lettres)
          `,
          tests: [
            test(
              "`longueurs` est correct",
              "longueurs == {'python': 6, 'data': 4, 'science': 7, 'ia': 2, 'pandas': 6, 'numpy': 5}",
              "longueurs",
            ),
            test("`longs` vaut `['PYTHON', 'SCIENCE', 'PANDAS', 'NUMPY']`", "longs == ['PYTHON', 'SCIENCE', 'PANDAS', 'NUMPY']", "longs"),
            test("`initiales` vaut `{'p', 'd', 's', 'i', 'n'}`", "initiales == {'p', 'd', 's', 'i', 'n'}", "initiales"),
            test("`total_lettres` vaut 30", "total_lettres == 30", "total_lettres"),
            test("Compréhensions de dict, de set et de liste utilisées", "uses('DictComp', 'SetComp', 'ListComp')"),
          ],
        },
        stretch: {
          title: "Matrices et bulletins",
          prompt: md`
            Toujours sans boucle \`for\` classique :

            1. \`table\` : la table de multiplication 5 × 5 sous forme de liste de listes
               (\`table[i][j]\` = \`(i + 1) × (j + 1)\`) ;
            2. \`diagonale\` : les éléments diagonaux de \`table\` (\`[1, 4, 9, 16, 25]\`) ;
            3. \`moyennes\` : \`{nom: moyenne arrondie à 2 décimales}\` à partir du dictionnaire \`notes\` ;
            4. \`admis\` : liste **triée** des noms dont la moyenne est ≥ 10.
          `,
          hint: md`
            Compréhension imbriquée : \`[[i * j for j in range(1, 6)] for i in range(1, 6)]\`.
            Pour les moyennes, parcourez \`notes.items()\`.
          `,
          starter: py`
            notes = {
                "Ada": [15, 18, 12],
                "Alan": [9, 11, 7],
                "Grace": [17, 19, 20],
                "Linus": [8, 10, 9],
            }

            table = ...
            diagonale = ...
            moyennes = ...
            admis = ...

            print(table)
            print(diagonale)
            print(moyennes)
            print(admis)
          `,
          solution: py`
            notes = {
                "Ada": [15, 18, 12],
                "Alan": [9, 11, 7],
                "Grace": [17, 19, 20],
                "Linus": [8, 10, 9],
            }

            table = [[i * j for j in range(1, 6)] for i in range(1, 6)]
            diagonale = [table[i][i] for i in range(len(table))]
            moyennes = {nom: round(sum(n) / len(n), 2) for nom, n in notes.items()}
            admis = sorted(nom for nom, m in moyennes.items() if m >= 10)

            print(table)
            print(diagonale)
            print(moyennes)
            print(admis)
          `,
          tests: [
            test("`table` est une matrice 5 × 5", "len(table) == 5 and all(len(l) == 5 for l in table)"),
            test("`table[2][3]` vaut 12 et `table[4][4]` vaut 25", "table[2][3] == 12 and table[4][4] == 25", "table"),
            test("`diagonale` vaut `[1, 4, 9, 16, 25]`", "diagonale == [1, 4, 9, 16, 25]", "diagonale"),
            test(
              "`moyennes` correctes",
              "moyennes == {'Ada': 15.0, 'Alan': 9.0, 'Grace': 18.67, 'Linus': 9.0}",
              "moyennes",
            ),
            test("`admis` vaut `['Ada', 'Grace']`", "admis == ['Ada', 'Grace']", "admis"),
            test("Aucune boucle `for` classique", "uses('ListComp', 'DictComp') and not uses('For')"),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Les compréhensions du cours",
      tiers: {
        core: {
          title: "Hands-On 9 : compréhensions",
          prompt: md`
            Uniquement avec des **compréhensions** :

            1. \`squares\` : les carrés des nombres de 1 à 10 ;
            2. \`odd_squares\` : la même chose, mais seulement pour les nombres impairs ;
            3. \`primes\` : les nombres premiers jusqu'à 100 (un nombre \`n ≥ 2\` est premier si \`all(n % d != 0 …)\`
               pour tous les \`d\` de 2 à n − 1) ;
            4. \`uc_users\` : les prénoms de \`users\` en majuscules, et \`positive_amounts\` : les montants positifs de
               \`amounts\` (exemples du cours).
          `,
          starter: py`
            users = ["John", "Paul", "George", "Ringo"]
            amounts = [10, -7, 8, 19, -2]

            squares = ...
            odd_squares = ...
            primes = ...
            uc_users = ...
            positive_amounts = ...

            print(squares, odd_squares, primes, uc_users, positive_amounts, sep="\n")
          `,
          solution: py`
            users = ["John", "Paul", "George", "Ringo"]
            amounts = [10, -7, 8, 19, -2]

            squares = [n ** 2 for n in range(1, 11)]
            odd_squares = [n ** 2 for n in range(1, 11) if n % 2 == 1]
            primes = [n for n in range(2, 101) if all(n % d != 0 for d in range(2, n))]
            uc_users = [u.upper() for u in users]
            positive_amounts = [a for a in amounts if a > 0]

            print(squares, odd_squares, primes, uc_users, positive_amounts, sep="\n")
          `,
          tests: [
            test("`squares` et `odd_squares`", "squares == [1, 4, 9, 16, 25, 36, 49, 64, 81, 100] and odd_squares == [1, 9, 25, 49, 81]"),
            test("`primes` : 25 nombres premiers jusqu'à 100", "len(primes) == 25 and primes[:5] == [2, 3, 5, 7, 11] and primes[-1] == 97", "primes"),
            test("`uc_users` et `positive_amounts`", "uc_users == ['JOHN', 'PAUL', 'GEORGE', 'RINGO'] and positive_amounts == [10, 8, 19]"),
            test("Aucune boucle `for` classique", "not uses('For') and uses('ListComp')"),
          ],
        },
        extra: {
          title: "Dictionnaires et générateurs en compréhension",
          prompt: md`
            1. \`products\` : le dictionnaire \`{(i, j): i * j}\` pour tous les \`i\` de \`a\` et \`j\` de \`b\` (deux \`for\`
               dans une même compréhension, comme dans le cours) ;
            2. \`gen\` : une **expression génératrice** des parties entières des nombres de \`t\`, puis \`as_tuple\` :
               ces valeurs converties en tuple (\`tuple(gen)\`) ;
            3. \`codes\` : le dictionnaire \`{lettre: code ASCII}\` pour les lettres de \`"python"\` (\`ord\`) ;
            4. \`by_length\` : un dictionnaire \`{longueur: liste triée des mots de cette longueur}\` pour les mots de
               \`words\` (une compréhension de dictionnaire **contenant** une compréhension de liste).
          `,
          starter: py`
            a = [1, 2, 3, 4]
            b = [5, 6, 7]
            t = (1.12, 2.34, 3.45, 4.56, 5.67)
            words = ["data", "ai", "python", "pandas", "sql", "numpy", "r"]

            products = ...
            gen = ...
            as_tuple = ...
            codes = ...
            by_length = ...

            print(products[(4, 7)], as_tuple, codes, by_length, sep="\n")
          `,
          solution: py`
            a = [1, 2, 3, 4]
            b = [5, 6, 7]
            t = (1.12, 2.34, 3.45, 4.56, 5.67)
            words = ["data", "ai", "python", "pandas", "sql", "numpy", "r"]

            products = {(i, j): i * j for i in a for j in b}
            gen = (int(x) for x in t)
            as_tuple = tuple(gen)
            codes = {c: ord(c) for c in "python"}
            by_length = {n: sorted(w for w in words if len(w) == n) for n in {len(w) for w in words}}

            print(products[(4, 7)], as_tuple, codes, by_length, sep="\n")
          `,
          tests: [
            test("`products` : 12 couples", "len(products) == 12 and products[(1, 5)] == 5 and products[(4, 7)] == 28"),
            test("`gen` est un générateur et `as_tuple` vaut (1, 2, 3, 4, 5)", "type(gen).__name__ == 'generator' and as_tuple == (1, 2, 3, 4, 5)"),
            test("`codes`", "codes == {'p': 112, 'y': 121, 't': 116, 'h': 104, 'o': 111, 'n': 110}"),
            test("`by_length`", "by_length == {4: ['data'], 2: ['ai'], 6: ['pandas', 'python'], 3: ['sql'], 5: ['numpy'], 1: ['r']}", "by_length"),
            test("Compréhensions de dictionnaire et générateur", "uses('DictComp', 'GeneratorExp')"),
          ],
        },
        stretch: {
          title: "Hands-On 10 en une ligne, et des matrices",
          prompt: md`
            1. \`pattern(n)\` renvoie (sans l'afficher) le motif d'étoiles du Hands-On 10 sous forme d'**une chaîne** :
               les lignes \`"* "\`, \`"* * "\`… jusqu'à n étoiles puis redescendre, séparées par \`"\\n"\`. Utilisez une
               compréhension (\`['* ' * i for i in range(n + 1)]\`) et \`"\\n".join(...)\`, comme dans le cours.
            2. \`parse_matrix(text)\` transforme \`"1 2 3\\n4 5 6"\` en \`[[1, 2, 3], [4, 5, 6]]\` (compréhension imbriquée) ;
            3. \`column_sums(m)\` renvoie la liste des sommes de chaque colonne (avec \`zip(*m)\`).
          `,
          starter: py`
            def pattern(n):
                ...


            def parse_matrix(text):
                ...


            def column_sums(m):
                ...


            print(pattern(4))
            m = parse_matrix("1 2 3\n4 5 6\n7 8 9")
            print(m, column_sums(m))
          `,
          solution: py`
            def pattern(n):
                l = ["* " * i for i in range(n + 1)]
                return "\n".join(l[1:]) + "\n" + "\n".join(reversed(l[1:-1]))


            def parse_matrix(text):
                return [[int(x) for x in line.split()] for line in text.splitlines() if line.strip()]


            def column_sums(m):
                return [sum(column) for column in zip(*m)]


            print(pattern(4))
            m = parse_matrix("1 2 3\n4 5 6\n7 8 9")
            print(m, column_sums(m))
          `,
          tests: [
            test("`pattern(3)`", "pattern(3) == '* \\n* * \\n* * * \\n* * \\n* '", "pattern(3)"),
            test("`pattern(5)` : 9 lignes", "len(pattern(5).split('\\n')) == 9 and pattern(5).split('\\n')[4] == '* * * * * '"),
            test("`parse_matrix`", "parse_matrix('1 2 3\\n4 5 6') == [[1, 2, 3], [4, 5, 6]] and parse_matrix('7\\n\\n8') == [[7], [8]]"),
            test("`column_sums`", "column_sums([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) == [12, 15, 18]"),
            test("`join` et compréhensions", "calls('join') and uses('ListComp')"),
          ],
        },
      },
    },
  ],
};
