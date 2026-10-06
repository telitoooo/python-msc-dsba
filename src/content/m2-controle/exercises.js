import { md, py, test } from "../helpers.js";

export default {
  // ---------------------------------------------------------------- 2.1
  "m2-l1": [
    {
      id: "ex1",
      title: "Prendre des décisions",
      tiers: {
        core: {
          title: "Mention au baccalauréat",
          prompt: md`
            À partir de \`note\` (sur 20), rangez dans \`mention\` la chaîne correspondante, puis affichez-la.

            | Note | Mention |
            |---|---|
            | ≥ 16 | \`"Très bien"\` |
            | ≥ 14 | \`"Bien"\` |
            | ≥ 12 | \`"Assez bien"\` |
            | ≥ 10 | \`"Passable"\` |
            | < 10 | \`"Ajourné"\` |

            Gardez la ligne \`note = ...\` en haut du programme : les tests la remplacent par d'autres valeurs.
          `,
          hint: md`Une chaîne \`if\` / \`elif\` / \`else\`, en commençant par la condition la plus exigeante (\`note >= 16\`).`,
          starter: py`
            note = 13.5

            mention = ""
            # Votre code ici


            print(mention)
          `,
          solution: py`
            note = 13.5

            if note >= 16:
                mention = "Très bien"
            elif note >= 14:
                mention = "Bien"
            elif note >= 12:
                mention = "Assez bien"
            elif note >= 10:
                mention = "Passable"
            else:
                mention = "Ajourné"

            print(mention)
          `,
          tests: [
            test("13.5 → `Assez bien`", "mention == 'Assez bien'", "mention"),
            test("18 → `Très bien`", "run_with(note=18)['mention'] == 'Très bien'"),
            test("9.5 → `Ajourné`", "run_with(note=9.5)['mention'] == 'Ajourné'"),
            test(
              "Bornes exactes : 16, 14, 12 et 10",
              "[run_with(note=n)['mention'] for n in (16, 14, 12, 10)] == ['Très bien', 'Bien', 'Assez bien', 'Passable']",
            ),
            test("La mention est affichée", "'Assez bien' in OUTPUT"),
          ],
        },
        extra: {
          title: "Le tarif du cinéma",
          prompt: md`
            Calculez le \`prix\` d'une place de cinéma selon \`age\`, \`etudiant\` (booléen) et \`jour\` :

            - moins de 12 ans : **6 €** ;
            - sinon, étudiant **ou** 65 ans et plus : **8.5 €** ;
            - sinon : **12 €** ;
            - le **mercredi**, tous les tarifs sont réduits de **2 €**.

            Affichez \`Prix : 6.5 €\` (pour les valeurs de départ).
          `,
          hint: md`
            Calculez d'abord le tarif de base avec \`if\` / \`elif\` / \`else\`, **puis** appliquez la réduction
            avec un second \`if\` indépendant.
          `,
          starter: py`
            age = 22
            etudiant = True
            jour = "mercredi"

            prix = 0
            # Votre code ici


            print("Prix :", prix, "€")
          `,
          solution: py`
            age = 22
            etudiant = True
            jour = "mercredi"

            if age < 12:
                prix = 6
            elif etudiant or age >= 65:
                prix = 8.5
            else:
                prix = 12

            if jour == "mercredi":
                prix -= 2

            print("Prix :", prix, "€")
          `,
          tests: [
            test("Étudiant de 22 ans un mercredi : 6.5 €", "prix == 6.5", "prix"),
            test("Enfant de 10 ans un lundi : 6 €", "run_with(age=10, etudiant=False, jour='lundi')['prix'] == 6"),
            test("Enfant **étudiant** de 10 ans : toujours 6 €", "run_with(age=10, etudiant=True, jour='lundi')['prix'] == 6"),
            test("Senior de 70 ans un samedi : 8.5 €", "run_with(age=70, etudiant=False, jour='samedi')['prix'] == 8.5"),
            test("Adulte de 30 ans un lundi : 12 €", "run_with(age=30, etudiant=False, jour='lundi')['prix'] == 12"),
            test("Adulte de 30 ans un mercredi : 10 €", "run_with(age=30, etudiant=False, jour='mercredi')['prix'] == 10"),
          ],
        },
        stretch: {
          title: "Équation du second degré",
          prompt: md`
            Résolvez \`a·x² + b·x + c = 0\`. Calculez le discriminant \`delta = b² - 4ac\`, rangez dans
            \`nb_solutions\` le nombre de solutions réelles (0, 1 ou 2) et affichez-les :

            - \`delta > 0\` : deux solutions \`(-b - √delta) / 2a\` et \`(-b + √delta) / 2a\` ;
            - \`delta == 0\` : une solution \`-b / 2a\` ;
            - \`delta < 0\` : aucune solution réelle.

            **Cas particulier** : si \`a == 0\`, l'équation \`b·x + c = 0\` a une solution \`-c / b\`
            (on suppose \`b ≠ 0\`). La racine carrée s'obtient avec \`** 0.5\`.
          `,
          hint: md`
            Traitez \`a == 0\` **en premier** (sinon division par zéro), puis distinguez les trois cas selon \`delta\`
            avec \`if\` / \`elif\` / \`else\` imbriqués dans le \`else\`.
          `,
          starter: py`
            a = 1
            b = -3
            c = 2

            nb_solutions = 0
            # Votre code ici

          `,
          solution: py`
            a = 1
            b = -3
            c = 2

            if a == 0:
                nb_solutions = 1
                print("Équation du 1er degré, x =", -c / b)
            else:
                delta = b ** 2 - 4 * a * c
                if delta > 0:
                    nb_solutions = 2
                    x1 = (-b - delta ** 0.5) / (2 * a)
                    x2 = (-b + delta ** 0.5) / (2 * a)
                    print("Deux solutions :", x1, "et", x2)
                elif delta == 0:
                    nb_solutions = 1
                    print("Une solution double :", -b / (2 * a))
                else:
                    nb_solutions = 0
                    print("Aucune solution réelle")
          `,
          tests: [
            test("x² - 3x + 2 = 0 : deux solutions", "nb_solutions == 2", "nb_solutions"),
            test("Les solutions 1.0 et 2.0 sont affichées", "'1.0' in OUTPUT and '2.0' in OUTPUT"),
            test(
              "x² + 2x + 1 = 0 : une solution (-1.0)",
              "(lambda e: e['nb_solutions'] == 1 and '-1.0' in e['OUTPUT'])(run_with(a=1, b=2, c=1))",
            ),
            test("x² + 1 = 0 : aucune solution", "run_with(a=1, b=0, c=1)['nb_solutions'] == 0"),
            test(
              "2x - 4 = 0 (a = 0) : une solution (2.0)",
              "(lambda e: e['nb_solutions'] == 1 and '2.0' in e['OUTPUT'])(run_with(a=0, b=2, c=-4))",
            ),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Âges, lois et calendrier",
      tiers: {
        core: {
          title: "Hands-on 3 : how old?",
          prompt: md`
            Écrivez \`category(age)\` qui renvoie la catégorie d'âge :

            | Âge | Catégorie |
            |---|---|
            | 0 à 12 | \`"Kid"\` |
            | 13 à 19 | \`"Teenager"\` |
            | 20 à 30 | \`"Young Adult"\` |
            | 31 à 64 | \`"Adult"\` |
            | 65 et plus | \`"Senior"\` |

            Le programme lit ensuite un âge avec \`input()\` et affiche sa catégorie.
          `,
          stdin: "25",
          starter: py`
            def category(age):
                ...


            age = int(input("Your age? "))
            print(category(age))
          `,
          solution: py`
            def category(age):
                if age <= 12:
                    return "Kid"
                elif age <= 19:
                    return "Teenager"
                elif age <= 30:
                    return "Young Adult"
                elif age <= 64:
                    return "Adult"
                else:
                    return "Senior"


            age = int(input("Your age? "))
            print(category(age))
          `,
          tests: [
            test("25 ans → `Young Adult`", "category(25) == 'Young Adult' and 'Young Adult' in OUTPUT"),
            test("Bornes : 12, 13, 19, 20, 30, 31, 64, 65", "[category(a) for a in (12, 13, 19, 20, 30, 31, 64, 65)] == ['Kid', 'Teenager', 'Teenager', 'Young Adult', 'Young Adult', 'Adult', 'Adult', 'Senior']"),
            test("0 et 100 ans", "category(0) == 'Kid' and category(100) == 'Senior'"),
          ],
        },
        extra: {
          title: "Hands-on 6 : legal age",
          prompt: md`
            Selon le pays (\`"us"\`, \`"uk"\` ou \`"de"\`), on peut voter à 18 ans partout, mais boire de l'alcool
            à 21 ans aux États-Unis, 18 ans au Royaume-Uni et 16 ans en Allemagne (bière et vin).

            1. \`rights(age, country)\` renvoie le tuple \`(can_vote, can_drink)\` de deux booléens ; pour un pays inconnu,
               elle lève \`ValueError\`.
            2. Le programme lit l'âge puis la nationalité, et affiche \`Vote: yes\` / \`Vote: no\` puis
               \`Alcohol: yes\` / \`Alcohol: no\`.
          `,
          hint: md`Un \`if\` / \`elif\` sur le pays fixe l'âge légal pour l'alcool ; \`raise ValueError("unknown country")\` sinon.`,
          stdin: "17\nde",
          starter: py`
            def rights(age, country):
                ...


            age = int(input("Age? "))
            country = input("Nationality (us / uk / de)? ").strip().lower()
            can_vote, can_drink = rights(age, country)
            print("Vote:", "yes" if can_vote else "no")
            print("Alcohol:", "yes" if can_drink else "no")
          `,
          solution: py`
            def rights(age, country):
                if country == "us":
                    drinking_age = 21
                elif country == "uk":
                    drinking_age = 18
                elif country == "de":
                    drinking_age = 16
                else:
                    raise ValueError("unknown country")
                return age >= 18, age >= drinking_age


            age = int(input("Age? "))
            country = input("Nationality (us / uk / de)? ").strip().lower()
            can_vote, can_drink = rights(age, country)
            print("Vote:", "yes" if can_vote else "no")
            print("Alcohol:", "yes" if can_drink else "no")
          `,
          tests: [
            test("17 ans en Allemagne : pas de vote, alcool autorisé", "rights(17, 'de') == (False, True) and 'Vote: no' in OUTPUT and 'Alcohol: yes' in OUTPUT"),
            test("20 ans aux États-Unis : vote oui, alcool non", "rights(20, 'us') == (True, False)"),
            test("18 ans au Royaume-Uni : les deux", "rights(18, 'uk') == (True, True) and rights(17, 'uk') == (False, False)"),
            test("Pays inconnu → `ValueError`", "raises(ValueError, rights, 30, 'fr')"),
            test("Le programme lit les entrées (`US` en majuscules accepté)", "'Alcohol: no' in run_with(stdin='19\\nUS\\n')['OUTPUT']"),
          ],
        },
        stretch: {
          title: "Hands-on 7 bis : la date de Pâques",
          prompt: md`
            *« More difficult: compute the Easter date for a given year. »* Écrivez \`easter(year)\` qui renvoie le tuple
            \`(mois, jour)\` du dimanche de Pâques (calendrier grégorien), avec l'**algorithme de Meeus / Jones / Butcher**
            (tout en divisions entières \`//\` et restes \`%\`) :

            \`\`\`text
            a = année % 19          b = année // 100        c = année % 100
            d = b // 4              e = b % 4               f = (b + 8) // 25
            g = (b - f + 1) // 3    h = (19a + b - d - g + 15) % 30
            i = c // 4              k = c % 4               l = (32 + 2e + 2i - h - k) % 7
            m = (a + 11h + 22l) // 451
            mois = (h + l - 7m + 114) // 31
            jour = (h + l - 7m + 114) % 31 + 1
            \`\`\`

            Écrivez aussi \`is_leap(year)\` (règle des années bissextiles du Hands-on 7) et affichez les dates de Pâques
            de 2024 à 2030 au format \`2024: 31/3 (leap year)\`.
          `,
          starter: py`
            def is_leap(year):
                ...


            def easter(year):
                ...


            for year in range(2024, 2031):
                month, day = easter(year)
                print(f"{year}: {day}/{month}" + (" (leap year)" if is_leap(year) else ""))
          `,
          solution: py`
            def is_leap(year):
                return year % 400 == 0 or (year % 4 == 0 and year % 100 != 0)


            def easter(year):
                a = year % 19
                b, c = year // 100, year % 100
                d, e = b // 4, b % 4
                f = (b + 8) // 25
                g = (b - f + 1) // 3
                h = (19 * a + b - d - g + 15) % 30
                i, k = c // 4, c % 4
                l = (32 + 2 * e + 2 * i - h - k) % 7
                m = (a + 11 * h + 22 * l) // 451
                month = (h + l - 7 * m + 114) // 31
                day = (h + l - 7 * m + 114) % 31 + 1
                return month, day


            for year in range(2024, 2031):
                month, day = easter(year)
                print(f"{year}: {day}/{month}" + (" (leap year)" if is_leap(year) else ""))
          `,
          tests: [
            test("Pâques 2024 : 31 mars", "easter(2024) == (3, 31)", "easter(2024)"),
            test("2025 : 20 avril, 2019 : 21 avril", "easter(2025) == (4, 20) and easter(2019) == (4, 21)"),
            test("2000, 1961 et 2038", "easter(2000) == (4, 23) and easter(1961) == (4, 2) and easter(2038) == (4, 25)"),
            test("`is_leap`", "[is_leap(y) for y in (1900, 2000, 2024, 2023)] == [False, True, True, False]"),
            test("La liste 2024 → 2030 est affichée", "'2024: 31/3 (leap year)' in LINES and '2030: 21/4' in LINES"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 2.2
  "m2-l2": [
    {
      id: "ex1",
      title: "Répéter des calculs",
      tiers: {
        core: {
          title: "Accumulateurs et compteurs",
          prompt: md`
            Avec **une boucle \`for\`** sur les entiers de 1 à 100 (sans utiliser \`sum()\`), calculez :

            - \`total\` : la somme 1 + 2 + … + 100 ;
            - \`somme_pairs\` : la somme des nombres pairs ;
            - \`nb_multiples_7\` : le nombre de multiples de 7.
          `,
          hint: md`
            \`range(1, 101)\` va de 1 à 100. Dans la boucle : \`total += n\` ; puis un \`if n % 2 == 0\`
            pour les pairs et un \`if n % 7 == 0\` pour compter.
          `,
          starter: py`
            total = 0
            somme_pairs = 0
            nb_multiples_7 = 0

            # Une seule boucle peut suffire !
            for n in range(1, 101):
                ...

            print(total, somme_pairs, nb_multiples_7)
          `,
          solution: py`
            total = 0
            somme_pairs = 0
            nb_multiples_7 = 0

            for n in range(1, 101):
                total += n
                if n % 2 == 0:
                    somme_pairs += n
                if n % 7 == 0:
                    nb_multiples_7 += 1

            print(total, somme_pairs, nb_multiples_7)
          `,
          tests: [
            test("`total` vaut 5050", "total == 5050", "total"),
            test("`somme_pairs` vaut 2550", "somme_pairs == 2550", "somme_pairs"),
            test("`nb_multiples_7` vaut 14", "nb_multiples_7 == 14", "nb_multiples_7"),
            test("Une boucle `for` est utilisée, sans `sum()`", "uses('For') and not calls('sum')"),
          ],
        },
        extra: {
          title: "Hands-on 4 : table de multiplication et voyelles",
          prompt: md`
            1. Affichez la table de multiplication de \`n\`, de 1 à 10, au format :

            \`\`\`text
            7 x 1 = 7
            7 x 2 = 14
            ...
            7 x 10 = 70
            \`\`\`

            2. Comptez dans \`nb_voyelles\` les voyelles (a, e, i, o, u, y) du mot \`mot\`.
          `,
          hint: md`
            Pour la table : \`print(f"{n} x {i} = {n * i}")\` dans une boucle.
            Pour les voyelles : parcourez le mot lettre par lettre et testez \`lettre in "aeiouy"\`.
          `,
          starter: py`
            n = 7
            mot = "anticonstitutionnellement"

            # 1. Table de multiplication


            # 2. Voyelles
            nb_voyelles = 0


            print("Voyelles :", nb_voyelles)
          `,
          solution: py`
            n = 7
            mot = "anticonstitutionnellement"

            # 1. Table de multiplication
            for i in range(1, 11):
                print(f"{n} x {i} = {n * i}")

            # 2. Voyelles
            nb_voyelles = 0
            for lettre in mot:
                if lettre in "aeiouy":
                    nb_voyelles += 1

            print("Voyelles :", nb_voyelles)
          `,
          tests: [
            test("La table affiche `7 x 1 = 7` … `7 x 10 = 70`", "'7 x 1 = 7' in LINES and '7 x 10 = 70' in LINES"),
            test("Exactement 10 lignes de table", "sum(1 for l in LINES if ' x ' in l) == 10"),
            test("Table de 3 : `3 x 4 = 12`", "'3 x 4 = 12' in run_with(n=3)['OUTPUT']"),
            test("`nb_voyelles` vaut 10", "nb_voyelles == 10", "nb_voyelles"),
            test("`'python'` contient 2 voyelles (y, o)", "run_with(mot='python')['nb_voyelles'] == 2"),
          ],
        },
        stretch: {
          title: "Les nombres premiers",
          prompt: md`
            Un nombre est **premier** s'il est supérieur ou égal à 2 et n'est divisible que par 1 et par lui-même.

            Affichez sur une ligne tous les nombres premiers strictement inférieurs à \`limite\`, et comptez-les
            dans \`nb_premiers\` (il y en a 15 sous 50).

            Utilisez deux boucles imbriquées : pour chaque candidat, cherchez un diviseur.
          `,
          hint: md`
            Pour chaque \`n\`, une variable \`premier = True\` ; dans une boucle sur \`d\` de 2 à \`n - 1\`,
            si \`n % d == 0\` alors \`premier = False\` (et \`break\` pour gagner du temps).
            Bonus : il suffit de tester les diviseurs jusqu'à \`√n\`.
          `,
          starter: py`
            limite = 50
            nb_premiers = 0

            for n in range(2, limite):
                ...

            print()
            print(nb_premiers, "nombres premiers sous", limite)
          `,
          solution: py`
            limite = 50
            nb_premiers = 0

            for n in range(2, limite):
                premier = True
                d = 2
                while d * d <= n:          # inutile d'aller au-delà de √n
                    if n % d == 0:
                        premier = False
                        break
                    d += 1
                if premier:
                    nb_premiers += 1
                    print(n, end=" ")

            print()
            print(nb_premiers, "nombres premiers sous", limite)
          `,
          explanation: md`
            Si \`n = a × b\` avec \`a ≤ b\`, alors \`a ≤ √n\` : tester les diviseurs jusqu'à \`√n\` suffit.
            Pour de très grandes limites, on utilise le **crible d'Ératosthène**.
          `,
          tests: [
            test("`nb_premiers` vaut 15 sous 50", "nb_premiers == 15", "nb_premiers"),
            test("47 et 2 sont affichés, pas 49", "'47' in OUTPUT and '2 ' in OUTPUT and '49' not in OUTPUT"),
            test("25 nombres premiers sous 100", "run_with(limite=100)['nb_premiers'] == 25"),
            test("4 nombres premiers sous 10", "run_with(limite=10)['nb_premiers'] == 4"),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Motifs, entraînement et facteurs premiers",
      tiers: {
        core: {
          title: "Hands-on 10 : un motif d'étoiles",
          prompt: md`
            Avec deux boucles \`for\` imbriquées, affichez ce motif pour \`n = 5\` (chaque étoile est suivie d'une espace) :

            \`\`\`text
            *
            * *
            * * *
            * * * *
            * * * * *
            * * * *
            * * *
            * *
            *
            \`\`\`
          `,
          hint: md`
            Première moitié : \`for i in range(1, n + 1)\` puis une boucle intérieure qui affiche \`"* "\` i fois avec
            \`end=""\`. Seconde moitié : \`range(n - 1, 0, -1)\`.
          `,
          starter: py`
            n = 5

          `,
          solution: py`
            n = 5

            for i in range(1, n + 1):
                for j in range(i):
                    print("* ", end="")
                print("")
            for i in range(n - 1, 0, -1):
                for j in range(i):
                    print("* ", end="")
                print("")
          `,
          explanation: md`
            Version en une ligne vue au module 4 : \`l = ['* ' * i for i in range(n + 1)]\` puis
            \`print('\\n'.join(l[1:]) + '\\n' + '\\n'.join(reversed(l[1:-1])))\`.
          `,
          tests: [
            test("9 lignes pour n = 5", "len(LINES) == 9", "LINES"),
            test("Le sommet a 5 étoiles", "LINES[4] == '* * * * *' and LINES[0] == '*' and LINES[8] == '*'", "LINES"),
            test("Fonctionne pour n = 3", "[l.strip() for l in run_with(n=3)['OUTPUT'].splitlines() if l.strip()] == ['*', '* *', '* * *', '* *', '*']"),
            test("Des boucles imbriquées sont utilisées", "uses('For') and SOURCE.count('for ') >= 2"),
          ],
        },
        extra: {
          title: "Hands-on 4 : l'entraîneur de calcul",
          prompt: md`
            Transformez la table de multiplication en **entraîneur** : pour chaque question \`(a, b)\` de la liste
            \`questions\`, demandez \`a x b = \` avec \`input()\`.

            - bonne réponse : affichez \`Correct!\` et ajoutez 1 à \`score\` ;
            - mauvaise réponse (ou saisie qui n'est pas un nombre) : affichez \`Wrong: 7 x 8 = 56\` ;
            - à la fin : \`Score: 2/4\`.
          `,
          stdin: "56\n54\n130\nabc",
          starter: py`
            questions = [(7, 8), (6, 9), (12, 11), (9, 9)]
            score = 0

          `,
          solution: py`
            questions = [(7, 8), (6, 9), (12, 11), (9, 9)]
            score = 0

            for a, b in questions:
                answer = input(f"{a} x {b} = ")
                if answer.strip().isdigit() and int(answer) == a * b:
                    print("Correct!")
                    score += 1
                else:
                    print(f"Wrong: {a} x {b} = {a * b}")

            print(f"Score: {score}/{len(questions)}")
          `,
          tests: [
            test("`score` vaut 2", "score == 2", "score"),
            test("Les corrections sont affichées", "'Wrong: 12 x 11 = 132' in OUTPUT and 'Wrong: 9 x 9 = 81' in OUTPUT"),
            test("Le score final est affiché", "'Score: 2/4' in OUTPUT"),
            test("Toutes justes → 4/4", "'Score: 4/4' in run_with(stdin='56\\n54\\n132\\n81\\n')['OUTPUT']"),
          ],
        },
        stretch: {
          title: "Hands-on 13 : nombres premiers et factorisation",
          prompt: md`
            **Sans liste ni dictionnaire** (seulement des boucles et des variables) :

            1. \`is_prime(n)\` renvoie \`True\` si \`n\` est premier ;
            2. \`factorize(n)\` renvoie la décomposition de \`n\` en facteurs premiers sous forme de **chaîne** :
               \`factorize(360)\` → \`"360 = 2^3 x 3^2 x 5"\` (exposant omis quand il vaut 1),
               \`factorize(13)\` → \`"13 = 13"\`, \`factorize(1)\` → \`"1 = 1"\`.
          `,
          hint: md`
            Pour chaque diviseur \`d\` à partir de 2 : tant que \`n % d == 0\`, divisez \`n\` par \`d\` et comptez l'exposant ;
            ajoutez le facteur à la chaîne s'il apparaît. Arrêtez quand \`d * d > n\` : ce qui reste (si > 1) est premier.
          `,
          starter: py`
            def is_prime(n):
                ...


            def factorize(n):
                ...


            print(is_prime(97), is_prime(91))
            print(factorize(360))
            print(factorize(9973))
          `,
          solution: py`
            def is_prime(n):
                if n < 2:
                    return False
                d = 2
                while d * d <= n:
                    if n % d == 0:
                        return False
                    d += 1
                return True


            def factorize(n):
                text = ""
                rest = n
                d = 2
                while d * d <= rest:
                    exponent = 0
                    while rest % d == 0:
                        rest //= d
                        exponent += 1
                    if exponent > 0:
                        factor = str(d) if exponent == 1 else f"{d}^{exponent}"
                        text = factor if text == "" else text + " x " + factor
                    d += 1
                if rest > 1:
                    text = str(rest) if text == "" else text + " x " + str(rest)
                if text == "":
                    text = "1"
                return f"{n} = {text}"


            print(is_prime(97), is_prime(91))
            print(factorize(360))
            print(factorize(9973))
          `,
          tests: [
            test("`is_prime`", "[n for n in range(30) if is_prime(n)] == [2, 3, 5, 7, 11, 13, 17, 19, 23, 29] and not is_prime(91)"),
            test("`factorize(360)`", "factorize(360) == '360 = 2^3 x 3^2 x 5'", "factorize(360)"),
            test("Nombre premier et 1", "factorize(13) == '13 = 13' and factorize(1) == '1 = 1'"),
            test("D'autres nombres", "factorize(1024) == '1024 = 2^10' and factorize(2 * 3 * 3 * 7 * 101) == '12726 = 2 x 3^2 x 7 x 101'"),
            test("Ni liste ni dictionnaire", "not any(uses(k) for k in ('List', 'ListComp', 'Dict', 'DictComp', 'Set', 'SetComp'))"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 2.3
  "m2-l3": [
    {
      id: "ex1",
      title: "Boucles conditionnelles",
      tiers: {
        core: {
          title: "Doubler son capital",
          prompt: md`
            Un capital placé à \`taux\` = 5 % par an est multiplié chaque année par \`1 + taux\`.

            Avec une boucle \`while\`, calculez le nombre d'\`annees\` nécessaires pour que le \`capital\`
            atteigne (au moins) l'\`objectif\`, c'est-à-dire le double du capital de départ.
          `,
          hint: md`
            \`while capital < objectif:\` puis, dans la boucle, \`capital *= 1 + taux\` et \`annees += 1\`.
          `,
          starter: py`
            capital = 1000
            taux = 0.05
            objectif = 2 * capital
            annees = 0

            # Tant que le capital n'a pas atteint l'objectif...


            print(f"Capital doublé en {annees} ans ({capital:.2f} €)")
          `,
          solution: py`
            capital = 1000
            taux = 0.05
            objectif = 2 * capital
            annees = 0

            while capital < objectif:
                capital *= 1 + taux
                annees += 1

            print(f"Capital doublé en {annees} ans ({capital:.2f} €)")
          `,
          explanation: md`
            Règle des 72 : un placement à \`t\` % double en environ \`72 / t\` ans (ici 72 / 5 ≈ 14,4 → 15 ans).
          `,
          tests: [
            test("Il faut 15 ans à 5 %", "annees == 15", "annees"),
            test("Une boucle `while` est utilisée", "uses('While')"),
            test("À 10 % : 8 ans", "run_with(taux=0.10)['annees'] == 8"),
            test("500 € à 7 % : 11 ans", "run_with(capital=500, taux=0.07)['annees'] == 11"),
          ],
        },
        extra: {
          title: "Hands-on 12 : la suite de Syracuse (Collatz)",
          prompt: md`
            Partant d'un entier \`n\`, on répète : si \`n\` est pair, on le divise par 2 ; sinon on le remplace
            par \`3n + 1\`. La conjecture de Syracuse affirme qu'on finit toujours par atteindre 1.

            Calculez :
            - \`etapes\` : le nombre d'étapes pour atteindre 1 ;
            - \`maximum\` : la plus grande valeur atteinte (valeur de départ comprise).

            Pour \`n = 27\`, on trouve 111 étapes et un maximum de 9232 !
          `,
          hint: md`
            Initialisez \`maximum = n\` avant la boucle \`while n != 1:\`. Utilisez \`//\` pour rester en entiers.
          `,
          starter: py`
            n = 27
            etapes = 0
            maximum = n

            # Votre boucle ici


            print("Étapes :", etapes, "| maximum :", maximum)
          `,
          solution: py`
            n = 27
            etapes = 0
            maximum = n

            while n != 1:
                if n % 2 == 0:
                    n = n // 2
                else:
                    n = 3 * n + 1
                etapes += 1
                if n > maximum:
                    maximum = n

            print("Étapes :", etapes, "| maximum :", maximum)
          `,
          tests: [
            test("`etapes` vaut 111 pour n = 27", "etapes == 111", "etapes"),
            test("`maximum` vaut 9232 pour n = 27", "maximum == 9232", "maximum"),
            test("n = 6 : 8 étapes, maximum 16", "pick(run_with(n=6), 'etapes', 'maximum') == (8, 16)"),
            test("n = 1 : 0 étape", "run_with(n=1)['etapes'] == 0"),
          ],
        },
        stretch: {
          title: "Hands-on 8 : devine le nombre",
          prompt: md`
            Programmez le jeu « devine le nombre » : le joueur saisit des propositions avec \`input()\` jusqu'à
            trouver \`secret\`.

            - si la saisie n'est pas un nombre (\`isdigit()\`) : afficher \`Entrée invalide\` et passer au tour
              suivant **sans compter l'essai** (\`continue\`) ;
            - sinon, afficher \`Trop petit\` ou \`Trop grand\` ;
            - une fois trouvé : afficher \`Bravo ! Trouvé en 6 essais.\` et sortir de la boucle (\`break\`).

            Le nombre d'essais valides est stocké dans \`essais\`. Les propositions sont dans la zone **Entrées**.
          `,
          hint: md`
            Structure : \`while True:\` → \`input\` → test \`isdigit()\` + \`continue\` → \`essais += 1\` →
            comparaison avec \`secret\` → \`break\` quand c'est gagné.
          `,
          stdin: "50\nabc\n25\n37\n43\n40\n42",
          starter: py`
            secret = 42
            essais = 0

            while True:
                proposition = input("Votre proposition : ")
                ...

          `,
          solution: py`
            secret = 42
            essais = 0

            while True:
                proposition = input("Votre proposition : ")
                if not proposition.isdigit():
                    print("Entrée invalide")
                    continue
                essais += 1
                nombre = int(proposition)
                if nombre < secret:
                    print("Trop petit")
                elif nombre > secret:
                    print("Trop grand")
                else:
                    print(f"Bravo ! Trouvé en {essais} essais.")
                    break
          `,
          tests: [
            test("`essais` vaut 6 (l'entrée `abc` n'est pas comptée)", "essais == 6", "essais"),
            test("Affiche `Bravo ! Trouvé en 6 essais.`", "'Bravo ! Trouvé en 6 essais.' in OUTPUT"),
            test("Affiche `Entrée invalide` pour `abc`", "'Entrée invalide' in OUTPUT"),
            test("2 × `Trop grand` et 3 × `Trop petit`", "OUTPUT.count('Trop grand') == 2 and OUTPUT.count('Trop petit') == 3"),
            test("Trouvé du premier coup → 1 essai", "run_with(stdin='42\\n')['essais'] == 1"),
            test("`while`, `break` et `continue` sont utilisés", "uses('While', 'Break', 'Continue')"),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Boucles interactives et PGCD",
      tiers: {
        core: {
          title: "Hands-on 2 bis : convertir jusqu'à « end »",
          prompt: md`
            Modifiez le convertisseur Fahrenheit → Celsius pour qu'il **répète** la conversion jusqu'à ce que l'utilisateur
            tape \`end\` :

            - à chaque tour, lisez une saisie avec \`input()\` ;
            - si c'est \`end\`, sortez de la boucle (\`break\`) ;
            - sinon, affichez par exemple \`212.0 °F = 100.0 °C\` (1 décimale) et ajoutez 1 à \`count\`.

            À la fin, affichez \`3 conversions\`.
          `,
          stdin: "32\n212\n98.6\nend",
          starter: py`
            count = 0

          `,
          solution: py`
            count = 0

            while True:
                text = input("Temperature in °F (or end)? ")
                if text == "end":
                    break
                fahrenheit = float(text)
                celsius = (fahrenheit - 32) * 5 / 9
                print(f"{fahrenheit} °F = {celsius:.1f} °C")
                count += 1

            print(count, "conversions")
          `,
          tests: [
            test("3 conversions", "count == 3 and '3 conversions' in OUTPUT", "count"),
            test("Les résultats sont affichés", "'212.0 °F = 100.0 °C' in OUTPUT and '98.6 °F = 37.0 °C' in OUTPUT and '32.0 °F = 0.0 °C' in OUTPUT"),
            test("`end` immédiat → 0 conversion", "run_with(stdin='end\\n')['count'] == 0"),
            test("`while` et `break`", "uses('While', 'Break')"),
          ],
        },
        extra: {
          title: "Hands-on 10 : le PGCD de trois façons",
          prompt: md`
            Le **PGCD** (plus grand commun diviseur, *GCD*) de deux entiers positifs se calcule de plusieurs façons :

            1. \`gcd_sub(a, b)\` — **soustractions** (boucle \`while\`) : si a > b, gcd(a, b) = gcd(a − b, b) ;
               si b > a, gcd(a, b) = gcd(a, b − a) ; et gcd(a, a) = a ;
            2. \`gcd_mod(a, b)\` — **algorithme d'Euclide** (boucle \`while\`), beaucoup plus rapide :
               gcd(a, b) = gcd(b, a mod b), et gcd(a, 0) = a ;
            3. \`gcd_for(a, b)\` — avec une **boucle \`for\`** : on essaie les diviseurs du plus grand possible au plus petit.
          `,
          starter: py`
            import math


            def gcd_sub(a, b):
                ...


            def gcd_mod(a, b):
                ...


            def gcd_for(a, b):
                ...


            print(gcd_sub(84, 36), gcd_mod(84, 36), gcd_for(84, 36), math.gcd(84, 36))
          `,
          solution: py`
            import math


            def gcd_sub(a, b):
                while a != b:
                    if a > b:
                        a = a - b
                    else:
                        b = b - a
                return a


            def gcd_mod(a, b):
                while b != 0:
                    a, b = b, a % b
                return a


            def gcd_for(a, b):
                for d in range(min(a, b), 0, -1):
                    if a % d == 0 and b % d == 0:
                        return d


            print(gcd_sub(84, 36), gcd_mod(84, 36), gcd_for(84, 36), math.gcd(84, 36))
          `,
          tests: [
            test("`gcd_sub(84, 36)` vaut 12", "gcd_sub(84, 36) == 12 and gcd_sub(7, 7) == 7 and gcd_sub(17, 5) == 1"),
            test("`gcd_mod` est correct", "all(gcd_mod(a, b) == math.gcd(a, b) for a in range(1, 60) for b in range(1, 60))"),
            test("`gcd_for` est correct", "all(gcd_for(a, b) == math.gcd(a, b) for a in range(1, 40) for b in range(1, 40))"),
            test("`gcd_sub` est correct", "all(gcd_sub(a, b) == math.gcd(a, b) for a in range(1, 40) for b in range(1, 40))"),
            test("Deux `while` et un `for`", "'while' in __import__('inspect').getsource(gcd_sub) and 'while' in __import__('inspect').getsource(gcd_mod) and 'for ' in __import__('inspect').getsource(gcd_for)"),
          ],
        },
        stretch: {
          title: "Le else des boucles et le do … while",
          prompt: md`
            1. \`first_divisor(n)\` renvoie le plus petit diviseur de \`n\` supérieur à 1, avec une boucle \`for … else\` :
               le \`else\` (aucun \`break\`) signifie que \`n\` est premier, et la fonction renvoie alors \`n\`.
            2. \`read_positive()\` émule un **\`do … while\`** : elle demande un entier strictement positif avec \`input()\`,
               affiche \`Invalid\` et redemande tant que la saisie n'est pas valide, puis renvoie l'entier. Le programme
               l'appelle et range le résultat dans \`value\`.
            3. \`count_digits(n)\` compte les chiffres d'un entier positif **sans le convertir en chaîne** : divisez par 10
               dans une boucle qui s'exécute **au moins une fois** (ainsi \`count_digits(0)\` vaut 1).
          `,
          stdin: "abc\n0\n7",
          starter: py`
            def first_divisor(n):
                ...


            def read_positive():
                ...


            def count_digits(n):
                ...


            value = read_positive()
            print(value, first_divisor(91), first_divisor(97), count_digits(2024))
          `,
          solution: py`
            def first_divisor(n):
                for d in range(2, n):
                    if n % d == 0:
                        break
                else:
                    return n
                return d


            def read_positive():
                while True:
                    text = input("A positive integer? ")
                    if text.isdigit() and int(text) > 0:
                        return int(text)
                    print("Invalid")


            def count_digits(n):
                digits = 0
                while True:
                    digits += 1
                    n //= 10
                    if n == 0:
                        break
                return digits


            value = read_positive()
            print(value, first_divisor(91), first_divisor(97), count_digits(2024))
          `,
          tests: [
            test("`first_divisor`", "first_divisor(91) == 7 and first_divisor(97) == 97 and first_divisor(100) == 2"),
            test(
              "Une boucle `for … else` est utilisée",
              "any(isinstance(node, __import__('ast').For) and node.orelse for node in __import__('ast').walk(__import__('ast').parse(SOURCE)))",
            ),
            test("`read_positive` redemande tant que c'est invalide", "value == 7 and OUTPUT.count('Invalid') == 2"),
            test("`count_digits`", "count_digits(2024) == 4 and count_digits(0) == 1 and count_digits(9) == 1 and count_digits(10 ** 12) == 13"),
            test("Sans conversion en chaîne dans `count_digits`", "'str(' not in __import__('inspect').getsource(count_digits) and 'len(' not in __import__('inspect').getsource(count_digits)"),
          ],
        },
      },
    },
  ],
};
