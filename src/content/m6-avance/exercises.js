import { md, py, test } from "../helpers.js";

const r = String.raw;

const DICHOTOMIE = py`
  def dichotomie(fonction, a, b, eps=0.001):
      """Cherche un zéro de fonction entre a et b (de signes opposés)."""
      while b - a > eps:
          milieu = (a + b) / 2
          if fonction(a) * fonction(milieu) <= 0:
              b = milieu
          else:
              a = milieu
      return (a + b) / 2
`;

const BT = "\`"; // backtick, impossible à écrire directement dans py\`…\`

const PROJET = {
  "projet/README.md": "# Projet\n",
  "projet/.gitignore": "__pycache__/\n",
  "projet/.git/config": "[core]\n",
  "projet/src/__init__.py": "",
  "projet/src/main.py": "print('hello')\n",
  "projet/tests/test_main.py": "def test_main():\n    assert True\n",
};

export default {
  // ---------------------------------------------------------------- 6.1
  "m6-l1": [
    {
      id: "ex1",
      title: "Le programme vu par l'interpréteur",
      tiers: {
        core: {
          title: "Des fonctions comme valeurs",
          prompt: md`
            1. \`appliquer(fonction, valeurs)\` : renvoie la liste des \`fonction(v)\` pour chaque \`v\`.
            2. \`composer(f, g)\` : **renvoie une fonction** qui à \`x\` associe \`f(g(x))\`.
            3. \`OPERATIONS\` : un dictionnaire qui associe \`"+"\`, \`"-"\`, \`"*"\`, \`"/"\` à des fonctions
               (des \`lambda\`) à deux paramètres.
            4. \`calculer(a, symbole, b)\` : utilise le dictionnaire **sans aucun \`if\`** ; si le symbole est
               inconnu, lève \`ValueError("Opération inconnue : %")\`.
          `,
          hint: md`
            \`composer\` peut renvoyer \`lambda x: f(g(x))\`. Dans \`calculer\`, \`OPERATIONS[symbole]\` lève
            une \`KeyError\` si la clé est absente : interceptez-la pour lever une \`ValueError\`.
          `,
          starter: py`
            def appliquer(fonction, valeurs):
                ...


            def composer(f, g):
                """Renvoie la fonction x -> f(g(x))."""
                ...


            OPERATIONS = {
                # "+": lambda a, b: ...,
            }


            def calculer(a, symbole, b):
                ...


            print(appliquer(abs, [-3, 1, -2]))
            plus_un_puis_double = composer(lambda x: 2 * x, lambda x: x + 1)
            print(plus_un_puis_double(5))
            print(calculer(6, "*", 7), calculer(1, "/", 4))
          `,
          solution: py`
            def appliquer(fonction, valeurs):
                return [fonction(v) for v in valeurs]


            def composer(f, g):
                """Renvoie la fonction x -> f(g(x))."""
                return lambda x: f(g(x))


            OPERATIONS = {
                "+": lambda a, b: a + b,
                "-": lambda a, b: a - b,
                "*": lambda a, b: a * b,
                "/": lambda a, b: a / b,
            }


            def calculer(a, symbole, b):
                try:
                    operation = OPERATIONS[symbole]
                except KeyError:
                    raise ValueError(f"Opération inconnue : {symbole}")
                return operation(a, b)


            print(appliquer(abs, [-3, 1, -2]))
            plus_un_puis_double = composer(lambda x: 2 * x, lambda x: x + 1)
            print(plus_un_puis_double(5))
            print(calculer(6, "*", 7), calculer(1, "/", 4))
          `,
          tests: [
            test("`appliquer(abs, [-3, 1, -2])` → `[3, 1, 2]`", "appliquer(abs, [-3, 1, -2]) == [3, 1, 2] and appliquer(str.upper, ['a', 'b']) == ['A', 'B']"),
            test("`composer` renvoie une fonction : f(g(x))", "composer(lambda x: 2 * x, lambda x: x + 1)(5) == 12 and composer(len, str)(12345) == 5"),
            test(
              "`OPERATIONS` contient quatre fonctions",
              "set(OPERATIONS) == {'+', '-', '*', '/'} and all(callable(f) for f in OPERATIONS.values())",
              "OPERATIONS",
            ),
            test("`calculer` donne les bons résultats", "calculer(6, '*', 7) == 42 and calculer(1, '/', 4) == 0.25 and calculer(5, '-', 8) == -3 and calculer(2, '+', 2) == 4"),
            test("Symbole inconnu → `ValueError`", "raises(ValueError, calculer, 1, '%', 2)"),
            test("Aucun `if` : c'est le dictionnaire qui choisit la fonction", "not uses('If')"),
          ],
        },
        extra: {
          title: "Ordre d'exécution et built-ins écrasés",
          prompt: md`
            1. **Sans exécuter**, prédisez l'ordre dans lequel les lettres s'affichent, et écrivez-le dans
               \`ordre\` (par exemple \`"ABCDEF"\`). Souvenez-vous : \`def\` ne fait que définir.
            2. La seconde partie plante : elle a écrasé des fonctions intégrées. Corrigez-la **en renommant
               les variables**, sans changer ce qu'elle calcule ni la ligne \`lettres = list("abc")\`.
          `,
          hint: md`
            La fonction \`g\` est-elle appelée quelque part ? Pour la partie 2, renommez \`list\` en
            \`nombres\` et \`sum\` en \`total\` partout où ils désignent vos données.
          `,
          starter: py`
            # 1. Dans quel ordre les lettres s'affichent-elles ?
            print("A")

            def f():
                print("B")
                return "C"

            print("D")
            x = f()
            print(x)

            def g():
                print("E")

            print("F")

            ordre = ""   # votre prédiction


            # 2. Ce programme plante : corrigez-le sans changer ce qu'il calcule.
            list = [4, 8, 15, 16, 23, 42]
            sum = 0
            for n in list:
                sum += n
            print("Total :", sum)
            print("Maximum :", max(list))
            lettres = list("abc")
            print("Moyenne :", sum / len(list), "|", lettres)
          `,
          solution: py`
            # 1. Dans quel ordre les lettres s'affichent-elles ?
            print("A")

            def f():
                print("B")
                return "C"

            print("D")
            x = f()
            print(x)

            def g():
                print("E")

            print("F")

            ordre = "ADBCF"   # g n'est jamais appelée : E ne s'affiche pas


            # 2. Ce programme plante : corrigez-le sans changer ce qu'il calcule.
            nombres = [4, 8, 15, 16, 23, 42]
            total = 0
            for n in nombres:
                total += n
            print("Total :", total)
            print("Maximum :", max(nombres))
            lettres = list("abc")
            print("Moyenne :", total / len(nombres), "|", lettres)
          `,
          tests: [
            test("`ordre` est la bonne prédiction", "ordre == 'ADBCF'", "ordre"),
            test("Plus aucun built-in écrasé (`list`, `sum`, `max`…)", "not assigns('list', 'sum', 'max', 'min', 'len', 'print')"),
            test("`lettres` vaut `['a', 'b', 'c']`", "lettres == ['a', 'b', 'c']", "lettres"),
            test("Les résultats sont inchangés", "'Total : 108' in OUTPUT and 'Maximum : 42' in OUTPUT and 'Moyenne : 18.0' in OUTPUT"),
          ],
        },
        stretch: {
          title: "Hands-On 13 : le jeu de Nim",
          prompt: md`
            On part de \`batons\` bâtons ; chaque joueur, à tour de rôle, en prend entre 1 et \`max_prise\`.
            **Celui qui prend le dernier bâton gagne.** Une stratégie est une **fonction**
            \`strategie(batons, max_prise)\` qui renvoie le nombre de bâtons pris.

            1. \`coup_aleatoire\` : un nombre au hasard entre 1 et \`max_prise\`, sans dépasser ce qui reste.
            2. \`coup_gagnant\` : trouvez la stratégie gagnante sur papier d'abord (indice : restes de division).
               Si aucun coup ne gagne, prenez 1 bâton.
            3. \`partie(batons, max_prise, joueur_1, joueur_2, bavard=False)\` : fait jouer les deux stratégies
               (le joueur 1 commence) et renvoie le numéro du gagnant. Un coup illégal lève une \`ValueError\`.
               Si \`bavard\`, chaque coup est affiché : \`Joueur 1 prend 2 → reste 20\`.
          `,
          hint: md`
            Laissez toujours à l'adversaire un **multiple de \`max_prise + 1\`** : quoi qu'il prenne, vous
            pourrez revenir au multiple suivant. Il faut donc prendre \`batons % (max_prise + 1)\`.
          `,
          starter: py`
            import random


            def coup_aleatoire(batons, max_prise):
                ...


            def coup_gagnant(batons, max_prise):
                ...


            def partie(batons, max_prise, joueur_1, joueur_2, bavard=False):
                """Renvoie 1 ou 2 : le numéro du joueur qui prend le dernier bâton."""
                ...


            random.seed(2026)
            victoires = sum(partie(22, 3, coup_gagnant, coup_aleatoire) == 1 for _ in range(1000))
            print("Stratégie gagnante contre le hasard :", victoires, "victoires sur 1000")
            partie(22, 3, coup_aleatoire, coup_gagnant, bavard=True)
          `,
          solution: py`
            import random


            def coup_aleatoire(batons, max_prise):
                return random.randint(1, min(max_prise, batons))


            def coup_gagnant(batons, max_prise):
                reste = batons % (max_prise + 1)
                return reste if reste != 0 else 1


            def partie(batons, max_prise, joueur_1, joueur_2, bavard=False):
                """Renvoie 1 ou 2 : le numéro du joueur qui prend le dernier bâton."""
                joueurs = {1: joueur_1, 2: joueur_2}
                courant = 1
                while True:
                    prise = joueurs[courant](batons, max_prise)
                    if not 1 <= prise <= min(max_prise, batons):
                        raise ValueError(f"coup illégal : {prise} bâton(s)")
                    batons -= prise
                    if bavard:
                        print(f"Joueur {courant} prend {prise} → reste {batons}")
                    if batons == 0:
                        return courant
                    courant = 3 - courant


            random.seed(2026)
            victoires = sum(partie(22, 3, coup_gagnant, coup_aleatoire) == 1 for _ in range(1000))
            print("Stratégie gagnante contre le hasard :", victoires, "victoires sur 1000")
            partie(22, 3, coup_aleatoire, coup_gagnant, bavard=True)
          `,
          explanation: md`
            Les positions multiples de \`max_prise + 1\` sont **perdantes** pour celui qui doit jouer. Avec 22 bâtons
            et 3 au maximum, le premier joueur prend \`22 % 4 = 2\` et laisse 20 : il gagne à coup sûr.
            Les stratégies étant de simples fonctions, \`partie\` peut faire jouer n'importe lesquelles.
          `,
          tests: [
            test(
              "`coup_aleatoire` reste dans les règles et varie",
              "all(1 <= coup_aleatoire(2, 3) <= 2 for _ in range(200)) and {coup_aleatoire(10, 3) for _ in range(300)} == {1, 2, 3}",
            ),
            test(
              "`coup_gagnant` : 22 → 2, 7 → 3, 3 → 3, et 8 (position perdante) → 1",
              "[coup_gagnant(b, 3) for b in (22, 7, 3, 8)] == [2, 3, 3, 1]",
              "[coup_gagnant(b, 3) for b in (22, 7, 3, 8)]",
            ),
            test("Gagnant contre « prend 1 » en commençant à 22", "partie(22, 3, coup_gagnant, lambda b, m: 1) == 1"),
            test("À 20 bâtons, le premier joueur perd contre la stratégie gagnante", "partie(20, 3, lambda b, m: 1, coup_gagnant) == 2"),
            test("1000 victoires sur 1000 contre le hasard", "victoires == 1000", "victoires"),
            test("Un coup illégal lève `ValueError`", "raises(ValueError, partie, 5, 3, lambda b, m: 4, coup_gagnant)"),
            test("Mode bavard : `Joueur 1 prend 1 → reste 4`", "'Joueur 1 prend 1 → reste 4' in capture(partie, 5, 3, coup_gagnant, coup_gagnant, bavard=True)"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 6.2
  "m6-l2": [
    {
      id: "ex1",
      title: "Fermetures et usines à fonctions",
      tiers: {
        core: {
          title: "Une usine à multiplicateurs",
          prompt: md`
            1. \`make_multiplier(k)\` renvoie une **fonction** qui multiplie son argument par \`k\`.
            2. \`multiplicateurs\` : la liste des 10 fonctions obtenues pour \`k\` allant de 1 à 10.
            3. \`resultats\` : la liste des résultats de chacune de ces fonctions appliquée à 5.
          `,
          hint: md`
            Définissez une fonction interne \`def multiplier(x): return x * k\` puis \`return multiplier\`
            (sans parenthèses). Ensuite : \`[make_multiplier(k) for k in range(1, 11)]\`.
          `,
          starter: py`
            def make_multiplier(k):
                ...


            multiplicateurs = ...
            resultats = ...
            print(resultats)
          `,
          solution: py`
            def make_multiplier(k):
                def multiplier(x):
                    return x * k      # k est capturé : c'est une fermeture
                return multiplier


            multiplicateurs = [make_multiplier(k) for k in range(1, 11)]
            resultats = [f(5) for f in multiplicateurs]
            print(resultats)
          `,
          tests: [
            test("`make_multiplier(3)(7)` → 21", "make_multiplier(3)(7) == 21", "make_multiplier(3)(7)"),
            test("`make_multiplier` renvoie une fonction", "callable(make_multiplier(2))"),
            test("10 multiplicateurs", "len(multiplicateurs) == 10 and all(callable(f) for f in multiplicateurs)"),
            test("`resultats` vaut `[5, 10, …, 50]`", "resultats == list(range(5, 55, 5))", "resultats"),
            test("Chaque fonction garde son propre `k`", "multiplicateurs[0](10) == 10 and multiplicateurs[9](10) == 100"),
          ],
        },
        extra: {
          title: "Compter sans variable globale",
          prompt: md`
            1. \`make_counter()\` renvoie une fonction qui renvoie 1, puis 2, puis 3… à chaque appel.
               Deux compteurs doivent être **indépendants**.
            2. Le cours compte les appels d'une fonction avec \`global\`. Faites mieux avec une fermeture :
               \`espionner(f)\` renvoie le couple \`(g, nb_appels)\` où \`g\` se comporte exactement comme \`f\`
               mais compte ses appels, et \`nb_appels()\` renvoie ce nombre.

            Le programme utilise \`espionner\` pour mesurer combien d'évaluations la \`dichotomie\` (fournie) demande.
          `,
          hint: md`
            Dans \`espionner\` : une variable \`compteur = 0\`, une fonction \`g(*args)\` qui fait
            \`nonlocal compteur\`, l'incrémente et renvoie \`f(*args)\`, et une fonction \`nb_appels()\` qui renvoie \`compteur\`.
          `,
          starter: py`
            def make_counter():
                ...


            def espionner(f):
                """Renvoie (g, nb_appels)."""
                ...


            ${DICHOTOMIE}

            compteur = make_counter()
            print(compteur(), compteur(), compteur())

            f, nb_appels = espionner(lambda x: x ** 3 + x + 1)
            racine = dichotomie(f, -2, 2)
            print(f"racine ≈ {racine:.3f}, trouvée en {nb_appels()} évaluations")
          `,
          solution: py`
            def make_counter():
                valeur = 0

                def suivant():
                    nonlocal valeur
                    valeur += 1
                    return valeur

                return suivant


            def espionner(f):
                """Renvoie (g, nb_appels)."""
                compteur = 0

                def g(*args):
                    nonlocal compteur
                    compteur += 1
                    return f(*args)

                def nb_appels():
                    return compteur

                return g, nb_appels


            ${DICHOTOMIE}

            compteur = make_counter()
            print(compteur(), compteur(), compteur())

            f, nb_appels = espionner(lambda x: x ** 3 + x + 1)
            racine = dichotomie(f, -2, 2)
            print(f"racine ≈ {racine:.3f}, trouvée en {nb_appels()} évaluations")
          `,
          tests: [
            test("Le compteur renvoie 1, 2, 3", "(lambda c: [c(), c(), c()])(make_counter()) == [1, 2, 3]"),
            test("Deux compteurs sont indépendants", "(lambda a, b: [a(), a(), b()])(make_counter(), make_counter()) == [1, 2, 1]"),
            test("`g` se comporte comme `f`", "espionner(abs)[0](-3) == 3 and espionner(pow)[0](2, 10) == 1024"),
            test("`nb_appels()` compte les appels", "(lambda g, n: (n(), g(1), g(2), n()))(*espionner(abs)) == (0, 1, 2, 2)"),
            test("La dichotomie a demandé 24 évaluations", "nb_appels() == 24", "nb_appels()"),
            test("`nonlocal` est utilisé, pas `global`", "uses('Nonlocal') and not uses('Global')"),
          ],
        },
        stretch: {
          title: "Liaison tardive et portées imbriquées",
          prompt: md`
            1. **Avant d'exécuter**, prédisez la valeur de \`[f(10) for f in fs]\` et rangez-la dans
               \`prediction\`. Puis construisez \`fs_corrige\`, une liste de trois fonctions telle que
               \`[f(10) for f in fs_corrige]\` vaille \`[0, 10, 20]\`.
            2. Prédisez \`p1\` (valeur renvoyée par \`externe()\`), \`p2\` (la variable globale \`x\` après cet
               appel) et \`p3\` (la variable globale \`x\` après \`modifie_global()\`). Le programme affiche ensuite
               les vraies valeurs : comparez.
          `,
          hint: md`
            Une \`lambda\` lit \`k\` au moment de l'appel, quand la boucle est terminée. Un paramètre par défaut
            (\`lambda x, k=k: x * k\`) est évalué à la création. \`nonlocal\` vise la fonction englobante,
            \`global\` le module.
          `,
          starter: py`
            # 1. Le piège de la liaison tardive
            fs = [lambda x: x * k for k in range(3)]
            prediction = ...      # votre prédiction de [f(10) for f in fs]
            print([f(10) for f in fs])

            fs_corrige = ...      # [f(10) for f in fs_corrige] doit valoir [0, 10, 20]


            # 2. global ou nonlocal ?
            x = "global"

            def externe():
                x = "externe"
                def interne():
                    nonlocal x
                    x = "interne"
                interne()
                return x

            def modifie_global():
                global x
                x = "modifié"

            p1 = ...   # valeur renvoyée par externe()
            p2 = ...   # x (global) après l'appel externe()
            p3 = ...   # x (global) après l'appel modifie_global()

            r1 = externe()
            r2 = x
            modifie_global()
            r3 = x
            print(r1, r2, r3)
          `,
          solution: py`
            # 1. Le piège de la liaison tardive
            fs = [lambda x: x * k for k in range(3)]
            prediction = [20, 20, 20]     # les trois lambdas lisent le même k, qui vaut 2
            print([f(10) for f in fs])

            fs_corrige = [lambda x, k=k: x * k for k in range(3)]


            # 2. global ou nonlocal ?
            x = "global"

            def externe():
                x = "externe"
                def interne():
                    nonlocal x
                    x = "interne"
                interne()
                return x

            def modifie_global():
                global x
                x = "modifié"

            p1 = "interne"   # interne() a modifié le x d'externe
            p2 = "global"    # le x global n'a pas été touché
            p3 = "modifié"   # global x : la variable du module est modifiée

            r1 = externe()
            r2 = x
            modifie_global()
            r3 = x
            print(r1, r2, r3)
          `,
          tests: [
            test("`prediction` vaut `[20, 20, 20]`", "prediction == [20, 20, 20]", "prediction"),
            test("`fs_corrige` donne `[0, 10, 20]`", "len(fs_corrige) == 3 and [f(10) for f in fs_corrige] == [0, 10, 20]"),
            test("`p1` : valeur renvoyée par `externe()`", "p1 == 'interne'", "p1"),
            test("`p2` : `x` global après `externe()`", "p2 == 'global'", "p2"),
            test("`p3` : `x` global après `modifie_global()`", "p3 == 'modifié'", "p3"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 6.3
  "m6-l3": [
    {
      id: "ex1",
      title: "Identité, alias et copies",
      tiers: {
        core: {
          title: "Hands-On 11 : ajouter à une liste imbriquée",
          prompt: md`
            1. \`append_to_nested_list(nested, valeur)\` ajoute \`valeur\` à la fin de **chaque sous-liste**
               et renvoie la liste : \`[[1, 2], [3, 4], [5]]\` → \`[[1, 2, 'new'], [3, 4, 'new'], [5, 'new']]\`.
            2. Avant d'exécuter : \`nested_list\` est-elle modifiée ? Répondez dans \`nested_modifiee\` (booléen).
            3. \`append_to_nested_list_copie(nested, valeur)\` fait la même chose **sans toucher à son argument**.
               Prouvez-le avec \`id()\` : \`ids_differents\` doit indiquer si \`copie\` et \`originale\` sont des objets distincts.
          `,
          hint: md`
            La version qui ne modifie rien construit de **nouvelles** sous-listes :
            \`[sous_liste + [valeur] for sous_liste in nested]\` (\`+\` crée une nouvelle liste, \`append\` modifie).
          `,
          starter: py`
            def append_to_nested_list(nested, valeur):
                ...


            def append_to_nested_list_copie(nested, valeur):
                ...


            nested_list = [[1, 2], [3, 4], [5]]
            new_list = append_to_nested_list(nested_list, "new")
            nested_modifiee = ...      # nested_list a-t-elle été modifiée ?
            print(nested_list, id(new_list) == id(nested_list))

            originale = [[1, 2], [3, 4], [5]]
            copie = append_to_nested_list_copie(originale, "new")
            ids_differents = ...
            print(originale, copie)
          `,
          solution: py`
            def append_to_nested_list(nested, valeur):
                for sous_liste in nested:
                    sous_liste.append(valeur)
                return nested


            def append_to_nested_list_copie(nested, valeur):
                return [sous_liste + [valeur] for sous_liste in nested]


            nested_list = [[1, 2], [3, 4], [5]]
            new_list = append_to_nested_list(nested_list, "new")
            nested_modifiee = True      # new_list et nested_list sont le même objet
            print(nested_list, id(new_list) == id(nested_list))

            originale = [[1, 2], [3, 4], [5]]
            copie = append_to_nested_list_copie(originale, "new")
            ids_differents = id(copie) != id(originale)
            print(originale, copie)
          `,
          tests: [
            test(
              "`append_to_nested_list` ajoute à chaque sous-liste",
              "new_list == [[1, 2, 'new'], [3, 4, 'new'], [5, 'new']]",
              "new_list",
            ),
            test("Elle renvoie la liste reçue (même objet) : `nested_modifiee` vaut `True`", "new_list is nested_list and nested_modifiee is True"),
            test("La version copie donne le même résultat", "copie == [[1, 2, 'new'], [3, 4, 'new'], [5, 'new']]", "copie"),
            test("… sans modifier son argument", "originale == [[1, 2], [3, 4], [5]]", "originale"),
            test("Les sous-listes de la copie sont de nouveaux objets", "ids_differents is True and all(a is not b for a, b in zip(copie, originale))"),
          ],
        },
        extra: {
          title: "Prédire alias, copy et deepcopy",
          prompt: md`
            Pour chaque cas, **prédisez** le résultat avant d'exécuter, puis vérifiez avec le terminal.
            Dessinez au brouillon le schéma « boîtes et flèches » de chaque situation.

            - \`p1\` : la liste \`l\` du cas 1 ;
            - \`p2\`, \`p3\`, \`p4\` : la liste \`ancienne\` après une modification faite **via** un alias, une copie
              superficielle, puis une copie profonde ;
            - \`p3_meme_id\` : \`id(ancienne) == id(superficielle)\` ?
          `,
          hint: md`
            \`l = [a, a, a]\` contient trois références vers la même liste. Une copie superficielle crée une
            nouvelle liste extérieure, mais **partage** les listes intérieures.
          `,
          starter: py`
            import copy

            # Cas 1
            a = ["foo", "bar"]
            l = [a, a, a]
            l[1] = "bar"
            l[0][1] = "baz"
            p1 = ...

            # Cas 2 : alias
            ancienne = [[1, 2, 3], [4, 5, 6], [7, 8, "a"]]
            alias = ancienne
            alias[2][2] = 9
            p2 = ...

            # Cas 3 : copie superficielle
            ancienne = [[1, 2, 3], [4, 5, 6], [7, 8, "a"]]
            superficielle = copy.copy(ancienne)
            superficielle[2][2] = 9
            p3 = ...
            p3_meme_id = ...

            # Cas 4 : copie profonde
            ancienne = [[1, 2, 3], [4, 5, 6], [7, 8, "a"]]
            profonde = copy.deepcopy(ancienne)
            profonde[2][2] = 9
            p4 = ...

            print(l)
            print(ancienne)
          `,
          solution: py`
            import copy

            # Cas 1
            a = ["foo", "bar"]
            l = [a, a, a]
            l[1] = "bar"
            l[0][1] = "baz"
            p1 = [["foo", "baz"], "bar", ["foo", "baz"]]   # l[0] et l[2] sont la même liste a

            # Cas 2 : alias
            ancienne = [[1, 2, 3], [4, 5, 6], [7, 8, "a"]]
            alias = ancienne
            alias[2][2] = 9
            p2 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]           # un seul objet, deux noms

            # Cas 3 : copie superficielle
            ancienne = [[1, 2, 3], [4, 5, 6], [7, 8, "a"]]
            superficielle = copy.copy(ancienne)
            superficielle[2][2] = 9
            p3 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]           # les sous-listes sont partagées
            p3_meme_id = False                               # mais la liste extérieure est neuve

            # Cas 4 : copie profonde
            ancienne = [[1, 2, 3], [4, 5, 6], [7, 8, "a"]]
            profonde = copy.deepcopy(ancienne)
            profonde[2][2] = 9
            p4 = [[1, 2, 3], [4, 5, 6], [7, 8, "a"]]         # tout a été dupliqué

            print(l)
            print(ancienne)
          `,
          explanation: md`
            \`copy.copy\` suffit quand les éléments sont immuables ; dès qu'ils sont eux-mêmes mutables et qu'on
            veut les modifier indépendamment, il faut \`deepcopy\`, qui coûte plus cher : il duplique toute la structure.
          `,
          tests: [
            test("`p1` (cas 1)", "p1 == [['foo', 'baz'], 'bar', ['foo', 'baz']]", "p1"),
            test("`p2` (alias)", "p2 == [[1, 2, 3], [4, 5, 6], [7, 8, 9]]", "p2"),
            test("`p3` (copie superficielle)", "p3 == [[1, 2, 3], [4, 5, 6], [7, 8, 9]]", "p3"),
            test("`p3_meme_id`", "p3_meme_id is False", "p3_meme_id"),
            test("`p4` (copie profonde)", "p4 == [[1, 2, 3], [4, 5, 6], [7, 8, 'a']]", "p4"),
          ],
        },
        stretch: {
          title: "Produit de matrices",
          prompt: md`
            Les matrices sont des listes de listes (une liste par ligne).

            1. \`creer_matrice(n, m, valeur=0)\` : matrice \`n × m\` dont les lignes sont **indépendantes**.
               Exécutez d'abord le code de départ : que construit \`[[0] * 3] * 2\` ?
            2. \`produit(A, B)\` : produit d'une matrice \`n × p\` par une matrice \`p × m\`, qui donne une matrice
               \`n × m\` : \`C[i][j] = somme des A[i][k] * B[k][j]\`. Si les dimensions ne correspondent pas,
               levez une \`ValueError\` avec un message clair (**ne renvoyez pas \`None\`**). Les matrices reçues
               ne doivent pas être modifiées.
          `,
          hint: md`
            \`[[valeur] * m for _ in range(n)]\` crée \`n\` lignes distinctes. Dimensions : \`n = len(A)\`,
            \`p = len(A[0])\`, \`m = len(B[0])\` ; il faut \`len(B) == p\`.
          `,
          starter: py`
            def creer_matrice(n, m, valeur=0):
                ...


            def produit(A, B):
                ...


            piege = [[0] * 3] * 2
            piege[0][0] = 1
            print(piege, "← pourquoi ?")

            A = [[1, 2], [3, 4]]
            B = [[5, 6], [7, 8]]
            print(produit(A, B))
            print(produit([[1, 2, 3]], [[1], [2], [3]]))
            try:
                produit(A, [[1, 2, 3]])
            except ValueError as e:
                print("Erreur :", e)
          `,
          solution: py`
            def creer_matrice(n, m, valeur=0):
                return [[valeur] * m for _ in range(n)]


            def produit(A, B):
                n, p = len(A), len(A[0])
                if len(B) != p:
                    raise ValueError(f"dimensions incompatibles : {n}×{p} et {len(B)}×{len(B[0])}")
                m = len(B[0])
                C = creer_matrice(n, m)
                for i in range(n):
                    for j in range(m):
                        C[i][j] = sum(A[i][k] * B[k][j] for k in range(p))
                return C


            piege = [[0] * 3] * 2
            piege[0][0] = 1
            print(piege, "← pourquoi ?")

            A = [[1, 2], [3, 4]]
            B = [[5, 6], [7, 8]]
            print(produit(A, B))
            print(produit([[1, 2, 3]], [[1], [2], [3]]))
            try:
                produit(A, [[1, 2, 3]])
            except ValueError as e:
                print("Erreur :", e)
          `,
          explanation: md`
            \`[[0] * 3] * 2\` répète **la même** ligne deux fois : \`id(piege[0]) == id(piege[1])\`. Modifier une
            case modifie donc toute la colonne. Avec \`[[0] * 3 for _ in range(2)]\`, chaque ligne est un nouvel objet.
          `,
          tests: [
            test(
              "`creer_matrice` crée des lignes indépendantes",
              "creer_matrice(2, 3) == [[0, 0, 0], [0, 0, 0]] and (lambda M: (M[0].__setitem__(0, 1), M)[1])(creer_matrice(2, 2)) == [[1, 0], [0, 0]]",
            ),
            test("Produit 2×2", "produit([[1, 2], [3, 4]], [[5, 6], [7, 8]]) == [[19, 22], [43, 50]]", "produit([[1, 2], [3, 4]], [[5, 6], [7, 8]])"),
            test(
              "Produits rectangulaires (1×3 · 3×1 et 2×3 · 3×2)",
              "produit([[1, 2, 3]], [[1], [2], [3]]) == [[14]] and produit([[1, 2, 3], [4, 5, 6]], [[7, 8], [9, 10], [11, 12]]) == [[58, 64], [139, 154]]",
            ),
            test("Dimensions incompatibles → `ValueError` avec un message", "raises(ValueError, produit, [[1, 2]], [[1, 2]]) and bool(error_message(produit, [[1, 2]], [[1, 2]]))"),
            test(
              "Les matrices reçues ne sont pas modifiées et le résultat a des lignes indépendantes",
              "(lambda A, B: (produit(A, B), A, B)[1:] == ([[1], [2]], [[3]]))([[1], [2]], [[3]]) and (lambda R: (R[0].__setitem__(0, -1), R[1][0])[1])(produit([[1], [2]], [[3]])) == 6",
            ),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 6.4
  "m6-l4": [
    {
      id: "ex1",
      title: "Arguments : pièges et souplesse",
      tiers: {
        core: {
          title: "L'argument par défaut mutable",
          prompt: md`
            Exécutez le code de départ et observez les « surprises ». Quand la valeur par défaut est-elle créée ?

            Corrigez \`ajouter_article\` et \`noter\` pour que **chaque appel sans argument reparte d'un objet
            vide**, tout en continuant à modifier et renvoyer le panier ou le carnet s'il est fourni.
            Énoncez la règle générale en une phrase, en commentaire.
          `,
          hint: md`
            Valeur par défaut \`None\`, puis dans le corps : \`if panier is None: panier = []\`.
          `,
          starter: py`
            def ajouter_article(article, panier=[]):
                panier.append(article)
                return panier


            def noter(eleve, note, carnet={}):
                carnet.setdefault(eleve, []).append(note)
                return carnet


            print(ajouter_article("pomme"))
            print(ajouter_article("poire"))     # surprise !
            print(noter("Ada", 15))
            print(noter("Alan", 12))            # surprise !
          `,
          solution: py`
            # Règle : jamais de liste, dict ou set comme valeur par défaut ; utiliser None.

            def ajouter_article(article, panier=None):
                if panier is None:
                    panier = []
                panier.append(article)
                return panier


            def noter(eleve, note, carnet=None):
                if carnet is None:
                    carnet = {}
                carnet.setdefault(eleve, []).append(note)
                return carnet


            print(ajouter_article("pomme"))
            print(ajouter_article("poire"))
            print(noter("Ada", 15))
            print(noter("Alan", 12))
          `,
          explanation: md`
            La valeur par défaut est évaluée **une seule fois**, quand \`def\` s'exécute : tous les appels qui
            l'utilisent partagent le même objet. On le voit avec \`ajouter_article.__defaults__\`.
          `,
          tests: [
            test("Chaque appel repart d'un panier vide", "ajouter_article('pomme') == ['pomme'] and ajouter_article('poire') == ['poire']"),
            test("Un panier fourni est modifié et renvoyé", "(lambda p: ajouter_article('x', p) is p and p == ['a', 'x'])(['a'])"),
            test("Chaque appel repart d'un carnet vide", "noter('Ada', 15) == {'Ada': [15]} and noter('Alan', 12) == {'Alan': [12]}"),
            test("Un carnet fourni est complété", "noter('Ada', 18, {'Ada': [15]}) == {'Ada': [15, 18]}"),
            test("Les valeurs par défaut sont `None`", "ajouter_article.__defaults__ == (None,) and noter.__defaults__ == (None,)"),
            test("L'affichage ne montre plus de surprise", "\"['poire']\" in OUTPUT and \"{'Alan': [12]}\" in OUTPUT"),
          ],
        },
        extra: {
          title: "*args, options nommées et déballage",
          prompt: md`
            1. \`resumer(*valeurs, verbose=False, start=0)\` renvoie \`start\` + la somme des valeurs.
               \`verbose\` et \`start\` sont **nommés obligatoirement** (*keyword-only*), puisqu'ils viennent après
               \`*valeurs\`. Si \`verbose\`, la fonction affiche \`3 valeurs, total = 115\`.
            2. Calculez \`total\` en appelant \`resumer\` avec les éléments de \`nombres\` **déballés** par \`*\` et
               les options du dictionnaire \`options\` **déballées** par \`**\`.

            Que renvoie \`resumer(1, True)\` ? Pourquoi \`True\` n'active-t-il pas le mode bavard ?
          `,
          hint: md`
            \`total = resumer(*nombres, **options)\` équivaut à \`resumer(4, 5, 6, start=100, verbose=True)\`.
          `,
          starter: py`
            def resumer(*valeurs, verbose=False, start=0):
                ...


            print(resumer(1, 2, 3))
            print(resumer(1, 2, 3, start=10))
            print(resumer(1, True))

            nombres = [4, 5, 6]
            options = {"start": 100, "verbose": True}
            total = ...
            print(total)
          `,
          solution: py`
            def resumer(*valeurs, verbose=False, start=0):
                total = start + sum(valeurs)
                if verbose:
                    print(f"{len(valeurs)} valeurs, total = {total}")
                return total


            print(resumer(1, 2, 3))
            print(resumer(1, 2, 3, start=10))
            print(resumer(1, True))      # 2 : True est une VALEUR (il vaut 1), pas l'option verbose

            nombres = [4, 5, 6]
            options = {"start": 100, "verbose": True}
            total = resumer(*nombres, **options)
            print(total)
          `,
          explanation: md`
            \`*args\` améliore une interface quand la fonction traite réellement « autant de valeurs qu'on veut ».
            Pour des paramètres de natures différentes, des noms explicites documentent mieux ce qui est attendu.
          `,
          tests: [
            test("`resumer()` → 0, `resumer(1, 2, 3)` → 6", "resumer() == 0 and resumer(1, 2, 3) == 6"),
            test("`start` décale le total", "resumer(1, 2, 3, start=10) == 16"),
            test("Mode bavard : `2 valeurs, total = 3`", r`capture(resumer, 1, 2, verbose=True) == '2 valeurs, total = 3\n'`),
            test(
              "`verbose` et `start` sont nommés obligatoirement",
              "all(__import__('inspect').signature(resumer).parameters[p].kind.name == 'KEYWORD_ONLY' for p in ('verbose', 'start')) and resumer(1, True) == 2",
            ),
            test("`total` vaut 115, obtenu par déballage `*` et `**`", "total == 115 and '*nombres' in SOURCE and '**options' in SOURCE", "total"),
          ],
        },
        stretch: {
          title: "Une fonction qui mémorise",
          prompt: md`
            \`fib\` (fournie) est la version récursive naïve du cours ; elle compte ses appels dans la variable
            globale \`appels\`.

            1. \`memoiser(f)\` renvoie une nouvelle fonction qui se comporte comme \`f\` (arguments positionnels,
               en nombre quelconque) mais **mémorise** ses résultats dans un dictionnaire : un même appel n'est
               jamais calculé deux fois.
            2. Remplacez \`fib\` par sa version mémoïsée, puis relancez le calcul de \`fib(25)\` en remettant
               le compteur à zéro : \`nb_appels\` doit tomber de 242 785 à 26.

            Pourquoi faut-il **réaffecter le nom \`fib\`** pour que la récursion profite du cache ?
          `,
          hint: md`
            Une fermeture : \`cache = {}\`, puis \`def g(*args):\` qui calcule \`f(*args)\` seulement si \`args\`
            (un tuple, donc utilisable comme clé) n'est pas dans \`cache\`. Ensuite \`fib = memoiser(fib)\`.
          `,
          starter: py`
            def memoiser(f):
                ...


            appels = 0

            def fib(n):
                global appels
                appels += 1
                if n < 2:
                    return 1
                return fib(n - 1) + fib(n - 2)


            print(fib(25), "en", appels, "appels (sans mémoïsation)")

            fib = ...            # version mémoïsée
            appels = 0
            resultat = fib(25)
            nb_appels = appels
            print(resultat, "en", nb_appels, "appels (avec mémoïsation)")
          `,
          solution: py`
            def memoiser(f):
                cache = {}

                def g(*args):
                    if args not in cache:
                        cache[args] = f(*args)
                    return cache[args]

                return g


            appels = 0

            def fib(n):
                global appels
                appels += 1
                if n < 2:
                    return 1
                return fib(n - 1) + fib(n - 2)


            print(fib(25), "en", appels, "appels (sans mémoïsation)")

            fib = memoiser(fib)  # les appels récursifs « fib(...) » passent désormais par le cache
            appels = 0
            resultat = fib(25)
            nb_appels = appels
            print(resultat, "en", nb_appels, "appels (avec mémoïsation)")
          `,
          explanation: md`
            À l'intérieur de \`fib\`, l'appel \`fib(n - 1)\` cherche le nom \`fib\` **dans la portée globale au
            moment de l'appel** (règle LEGB). Après \`fib = memoiser(fib)\`, ce nom désigne la version avec cache.
            C'est exactement ce que fait le décorateur \`@functools.cache\` de la bibliothèque standard.
          `,
          tests: [
            test("`memoiser` renvoie une fonction équivalente", "memoiser(lambda x: x * 2)(21) == 42 and memoiser(pow)(2, 10) == 1024"),
            test(
              "Un même appel n'est calculé qu'une fois",
              "(lambda vus: (lambda g: (g(1), g(1), g(2), g(1), vus)[4])(memoiser(lambda x: vus.append(x) or x)))([]) == [1, 2]",
            ),
            test("`resultat` vaut 121393", "resultat == 121393", "resultat"),
            test("Avec mémoïsation : 26 appels seulement", "nb_appels == 26", "nb_appels"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 6.5
  "m6-l5": [
    {
      id: "ex1",
      title: "Penser récursif",
      tiers: {
        core: {
          title: "Premières fonctions récursives",
          prompt: md`
            1. \`factorielle(n)\` en **récursif** ; elle lève \`ValueError\` si \`n < 0\` (au lieu d'une \`RecursionError\`).
            2. \`somme_chiffres(n)\` en **récursif** : somme des chiffres de l'entier \`n ≥ 0\` (\`1234\` → 10).
            3. \`fib(n)\` en **itératif**, avec la définition du cours : \`fib(0) = fib(1) = 1\`. Elle doit calculer
               \`fib(80)\` instantanément.
          `,
          hint: md`
            Somme des chiffres : le dernier chiffre est \`n % 10\`, le reste du nombre est \`n // 10\` ; cas de
            base : \`n < 10\`. Fibonacci itératif : \`a, b = b, a + b\` dans une boucle.
          `,
          starter: py`
            def factorielle(n):
                ...


            def somme_chiffres(n):
                ...


            def fib(n):
                ...


            print(factorielle(5), somme_chiffres(1234), [fib(i) for i in range(8)])
          `,
          solution: py`
            def factorielle(n):
                if n < 0:
                    raise ValueError("factorielle d'un nombre négatif")
                if n == 0:
                    return 1
                return n * factorielle(n - 1)


            def somme_chiffres(n):
                if n < 10:
                    return n
                return n % 10 + somme_chiffres(n // 10)


            def fib(n):
                a, b = 1, 1
                for _ in range(n):
                    a, b = b, a + b
                return a


            print(factorielle(5), somme_chiffres(1234), [fib(i) for i in range(8)])
          `,
          tests: [
            test("`factorielle` : 0 → 1, 5 → 120, 10 → 3628800", "[factorielle(n) for n in (0, 5, 10)] == [1, 120, 3628800]"),
            test("`factorielle(-1)` → `ValueError`", "raises(ValueError, factorielle, -1)"),
            test("`factorielle` est récursive", "recursive('factorielle')"),
            test("`somme_chiffres` : 1234 → 10, 90817 → 25, 0 → 0", "[somme_chiffres(n) for n in (1234, 90817, 0, 9)] == [10, 25, 0, 9] and recursive('somme_chiffres')"),
            test("`fib` : 1, 1, 2, 3, 5, 8, 13, 21", "[fib(i) for i in range(8)] == [1, 1, 2, 3, 5, 8, 13, 21]"),
            test("`fib` est itérative et calcule `fib(80)`", "not recursive('fib') and fib(80) == 37889062373143906"),
          ],
        },
        extra: {
          title: "Afficher une arborescence",
          prompt: md`
            Écrivez \`arbre(dossier, profondeur_max=None, caches=False)\` qui renvoie la **liste des lignes**
            représentant l'arborescence, avec ces caractères :

            \`\`\`text
            projet
            |-- README.md
            |-- src
            |   |-- __init__.py
            |   \`-- main.py
            \`-- tests
                \`-- test_main.py
            \`\`\`

            - les entrées de chaque dossier sont triées par nom (\`sorted\`) ;
            - les fichiers et dossiers cachés (nom commençant par \`.\`) sont ignorés, sauf si \`caches=True\` ;
            - \`profondeur_max\` limite le nombre de niveaux affichés sous la racine (\`1\` : seulement ses enfants).

            Le dossier \`projet/\` est fourni. C'est un problème naturellement **récursif** : la fonction qui
            affiche un dossier se rappelle sur chaque sous-dossier. Que doit-elle transmettre pour que
            l'indentation soit juste ?
          `,
          hint: md`
            Une fonction auxiliaire récursive \`parcourir(dossier, prefixe, profondeur)\` : pour chaque entrée,
            ajoutez \`prefixe + "|-- "\` (ou \`\` "\`-- " \`\` pour la dernière) ; pour descendre dans un sous-dossier,
            le nouveau préfixe est \`prefixe + "|   "\` (ou \`prefixe + "    "\` après la dernière entrée).
          `,
          files: PROJET,
          starter: py`
            import os


            def arbre(dossier, profondeur_max=None, caches=False):
                ...


            print("\n".join(arbre("projet")))
          `,
          solution: py`
            import os


            def arbre(dossier, profondeur_max=None, caches=False):
                lignes = [os.path.basename(os.path.normpath(dossier))]

                def parcourir(chemin, prefixe, profondeur):
                    if profondeur_max is not None and profondeur > profondeur_max:
                        return
                    noms = sorted(n for n in os.listdir(chemin) if caches or not n.startswith("."))
                    for i, nom in enumerate(noms):
                        dernier = i == len(noms) - 1
                        lignes.append(prefixe + ("${BT}-- " if dernier else "|-- ") + nom)
                        sous_chemin = os.path.join(chemin, nom)
                        if os.path.isdir(sous_chemin):
                            parcourir(sous_chemin, prefixe + ("    " if dernier else "|   "), profondeur + 1)

                parcourir(dossier, "", 1)
                return lignes


            print("\n".join(arbre("projet")))
          `,
          explanation: md`
            Le TD demande aussi de lire le dossier et les options depuis la ligne de commande : avec \`argparse\`
            (leçon 5.5), il suffit d'ajouter un argument positionnel \`dossier\` et deux options
            \`--profondeur\` et \`--caches\` (\`action="store_true"\`).
          `,
          tests: [
            test(
              "Arborescence par défaut (fichiers cachés ignorés)",
              "arbre('projet') == ['projet', '|-- README.md', '|-- src', '|   |-- __init__.py', '|   `-- main.py', '`-- tests', '    `-- test_main.py']",
              "arbre('projet')",
            ),
            test(
              "Avec `caches=True`",
              "arbre('projet', caches=True)[:4] == ['projet', '|-- .git', '|   `-- config', '|-- .gitignore'] and len(arbre('projet', caches=True)) == 10",
              "arbre('projet', caches=True)",
            ),
            test(
              "Avec `profondeur_max=1`",
              "arbre('projet', profondeur_max=1) == ['projet', '|-- README.md', '|-- src', '`-- tests']",
              "arbre('projet', profondeur_max=1)",
            ),
            test("Le parcours est récursif", "recursive()"),
            test("Le programme affiche l'arbre", "'`-- test_main.py' in OUTPUT"),
          ],
        },
        stretch: {
          title: "Le problème des N reines",
          prompt: md`
            Placez \`N\` reines sur un échiquier \`N × N\` sans qu'aucune n'en menace une autre (même ligne, même
            colonne ou même diagonale).

            - \`n_reines(n)\` renvoie la liste de **toutes** les solutions ; une solution est un tuple où
              \`solution[ligne]\` est la colonne de la reine de cette ligne ;
            - \`afficher(solution)\` renvoie le plateau en texte : \`Q\` pour une reine, \`.\` sinon, une ligne par rangée.

            Il y a 2 solutions pour \`N = 4\` et 92 pour \`N = 8\`. Mais si vous obtenez 92 avec un affichage faux,
            vous avez résolu le comptage, pas le problème ! Quelle représentation d'un placement partiel rend
            le test « cette case est-elle menacée ? » le moins coûteux ?
          `,
          hint: md`
            Retour arrière (*backtracking*) : une fonction récursive \`placer(colonnes)\` essaie chaque colonne
            pour la ligne \`len(colonnes)\`. Une case \`(ligne, col)\` est sûre si, pour chaque reine \`(l, c)\`
            déjà placée, \`col != c\` et \`abs(col - c) != ligne - l\`.
          `,
          starter: py`
            def n_reines(n):
                ...


            def afficher(solution):
                ...


            solutions = n_reines(4)
            print(len(solutions), "solutions pour N = 4")
            print(afficher(solutions[0]))
            print(len(n_reines(8)), "solutions pour N = 8")
          `,
          solution: py`
            def n_reines(n):
                solutions = []

                def placer(colonnes):
                    ligne = len(colonnes)
                    if ligne == n:
                        solutions.append(tuple(colonnes))
                        return
                    for col in range(n):
                        if all(col != c and abs(col - c) != ligne - l for l, c in enumerate(colonnes)):
                            colonnes.append(col)
                            placer(colonnes)
                            colonnes.pop()      # retour arrière

                placer([])
                return solutions


            def afficher(solution):
                n = len(solution)
                return "\n".join(
                    "".join("Q" if solution[ligne] == col else "." for col in range(n))
                    for ligne in range(n)
                )


            solutions = n_reines(4)
            print(len(solutions), "solutions pour N = 4")
            print(afficher(solutions[0]))
            print(len(n_reines(8)), "solutions pour N = 8")
          `,
          explanation: md`
            Une liste de colonnes (une par ligne) garantit par construction une reine par ligne : il ne reste
            qu'à tester colonnes et diagonales. Pour aller plus vite, on peut tenir trois ensembles (colonnes,
            diagonales \`l + c\` et \`l - c\` occupées) : le test devient alors immédiat.
          `,
          tests: [
            test("N = 4 : les 2 solutions", "sorted(n_reines(4)) == [(1, 3, 0, 2), (2, 0, 3, 1)]", "n_reines(4)"),
            test("N = 1, 2, 3 : 1, 0 et 0 solution", "[len(n_reines(k)) for k in (1, 2, 3)] == [1, 0, 0]"),
            test(
              "N = 8 : 92 solutions, toutes valides",
              "len(n_reines(8)) == 92 and all(len(set(s)) == 8 and len({l + c for l, c in enumerate(s)}) == 8 and len({l - c for l, c in enumerate(s)}) == 8 for s in n_reines(8))",
            ),
            test(
              "`afficher` dessine le plateau",
              r`afficher((1, 3, 0, 2)) == '.Q..\n...Q\nQ...\n..Q.'`,
              "afficher((1, 3, 0, 2))",
            ),
            test("La recherche est récursive", "recursive()"),
          ],
        },
      },
    },
  ],
};
