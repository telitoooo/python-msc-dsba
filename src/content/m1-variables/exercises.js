import { md, py, test } from "../helpers.js";

export default {
  // ---------------------------------------------------------------- 1.1 (introduction)
  "m1-l0": [
    {
      id: "ex1",
      title: "Premiers programmes",
      tiers: {
        core: {
          title: "Hands-on 1 : greetings!",
          prompt: md`
            Écrivez un programme qui **lit votre prénom** avec \`input()\` et vous salue :

            \`\`\`text
            Hello, Ada!
            Your name has 3 letters.
            \`\`\`

            Rangez le prénom (sans espaces superflus, \`strip()\`) dans la variable \`name\`. Le prénom saisi se trouve
            dans la zone **Entrées** sous l'éditeur : changez-le pour tester.
          `,
          hint: md`\`name = input("What is your name? ").strip()\`, puis deux \`print\` avec des f-strings.`,
          stdin: "Ada",
          starter: py`
            # Read the name, then greet


          `,
          solution: py`
            name = input("What is your name? ").strip()
            print(f"Hello, {name}!")
            print(f"Your name has {len(name)} letters.")
          `,
          tests: [
            test("Le prénom est lu avec `input()` dans `name`", "calls('input') and name == 'Ada'", "name"),
            test("Affiche `Hello, Ada!`", "'Hello, Ada!' in OUTPUT"),
            test("Affiche le nombre de lettres", "'Your name has 3 letters.' in OUTPUT"),
            test("Fonctionne avec `  Grace  `", "(lambda out: 'Hello, Grace!' in out and '5 letters' in out)(run_with(stdin='  Grace  \\n')['OUTPUT'])"),
          ],
        },
        extra: {
          title: "Documenter et structurer un programme",
          prompt: md`
            Reprenez l'exemple du cours :

            1. \`area(radius)\` renvoie l'aire d'un disque (\`pi = 3.1415926535\`, puis \`pi * radius * radius\`) et possède
               une **docstring** qui explique ce qu'elle calcule ;
            2. \`main()\` lit le rayon (\`float(input(…))\`) et affiche, sur **une seule ligne de sortie** mais avec une
               instruction écrite sur **deux lignes** (entre parenthèses) :
               \`The area of a circle with radius 2.0 is 12.566370614.\` ;
            3. \`main()\` n'est appelée que si le fichier est exécuté directement : \`if __name__ == "__main__":\`.

            Affichez aussi la documentation de \`area\` avec \`help(area)\`.
          `,
          stdin: "2",
          starter: py`
            def area(radius):
                pi = 3.1415926535
                return pi * radius * radius


            radius = float(input('What is the radius? '))
            print(f'The area of a circle with radius {radius} is {area(radius)}.')
          `,
          solution: py`
            def area(radius):
                """Return the area of a disc of the given radius."""
                pi = 3.1415926535
                return pi * radius * radius


            def main():
                radius = float(input("What is the radius? "))
                print(f"The area of a circle with radius {radius} "
                      f"is {area(radius)}.")


            help(area)
            if __name__ == "__main__":
                main()
          `,
          tests: [
            test("`area(1)` vaut 3.1415926535", "approx(area(1), 3.1415926535) and approx(area(2), 12.566370614)"),
            test("`area` a une docstring", "area.__doc__ is not None and len(area.__doc__.strip()) > 10", "area.__doc__"),
            test("Le programme affiche l'aire pour un rayon de 2", "'The area of a circle with radius 2.0 is 12.566370614.' in OUTPUT"),
            test("Une fonction `main` est protégée par `if __name__ == \"__main__\":`", "callable(globals().get('main')) and '__name__' in SOURCE and '__main__' in SOURCE"),
            test("`help(area)` est appelé", "calls('help')"),
          ],
        },
        stretch: {
          title: "Lire un fichier requirements.txt",
          prompt: md`
            Un projet liste ses dépendances dans \`requirements.txt\` (une par ligne, \`nom==version\`, avec d'éventuels
            commentaires \`#\` et lignes vides).

            1. \`parse_requirements(text)\` renvoie un dictionnaire \`nom → version\` : le nom en **minuscules**,
               la version (une chaîne) si elle est fixée par \`==\`, sinon \`None\` (par exemple \`requests\` ou
               \`flask>=2.0\`, dont on garde le nom \`flask\`). Les commentaires (y compris en fin de ligne) et les
               lignes vides sont ignorés.
            2. \`format_requirements(deps)\` fait l'inverse : une ligne par dépendance, **triées par nom**, sous la forme
               \`nom==version\` ou juste \`nom\`, chaque ligne terminée par \`"\\n"\`.
          `,
          hint: md`
            Pour chaque ligne : \`line.split("#")[0].strip()\`, ignorer si vide. Pour \`>=\`, \`<=\`… : coupez au premier
            caractère qui n'est ni une lettre, ni un chiffre, ni \`-\`, \`_\` ou \`.\`.
          `,
          starter: py`
            REQUIREMENTS = """# Data science
            numpy==1.17.3
            pandas==0.25.2
            Pillow==5.2.0

            matplotlib==3.1.1   # plots
            requests
            flask>=2.0
            """


            def parse_requirements(text):
                ...


            def format_requirements(deps):
                ...


            deps = parse_requirements(REQUIREMENTS)
            print(deps)
            print(format_requirements(deps))
          `,
          solution: py`
            REQUIREMENTS = """# Data science
            numpy==1.17.3
            pandas==0.25.2
            Pillow==5.2.0

            matplotlib==3.1.1   # plots
            requests
            flask>=2.0
            """


            def parse_requirements(text):
                deps = {}
                for line in text.splitlines():
                    line = line.split("#")[0].strip()
                    if not line:
                        continue
                    if "==" in line:
                        name, version = line.split("==", 1)
                        deps[name.strip().lower()] = version.strip()
                    else:
                        end = 0
                        while end < len(line) and (line[end].isalnum() or line[end] in "-_."):
                            end += 1
                        deps[line[:end].lower()] = None
                return deps


            def format_requirements(deps):
                text = ""
                for name in sorted(deps):
                    version = deps[name]
                    text += f"{name}=={version}\n" if version else f"{name}\n"
                return text


            deps = parse_requirements(REQUIREMENTS)
            print(deps)
            print(format_requirements(deps))
          `,
          tests: [
            test(
              "Les versions fixées sont lues",
              "(lambda d: (d['numpy'], d['pandas'], d['matplotlib']))(parse_requirements(REQUIREMENTS)) == ('1.17.3', '0.25.2', '3.1.1')",
            ),
            test("Les noms sont en minuscules", "'pillow' in parse_requirements(REQUIREMENTS) and 'Pillow' not in parse_requirements(REQUIREMENTS)"),
            test("Version non fixée → `None`", "(lambda d: (d['requests'], d['flask']))(parse_requirements(REQUIREMENTS)) == (None, None)"),
            test("Commentaires et lignes vides ignorés", "len(parse_requirements(REQUIREMENTS)) == 6 and parse_requirements('# rien\\n\\n') == {}"),
            test(
              "`format_requirements` trie et met en forme",
              "format_requirements({'pandas': '2.0', 'flask': None, 'numpy': '1.26'}) == 'flask\\nnumpy==1.26\\npandas==2.0\\n'",
            ),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 1.1
  "m1-l1": [
    {
      id: "ex1",
      title: "Fiche d'identité",
      tiers: {
        core: {
          title: "Créer et inspecter des variables",
          prompt: md`
            Créez quatre variables décrivant un étudiant ou une étudiante :

            - \`prenom\` : une chaîne de caractères ;
            - \`age\` : un entier ;
            - \`taille\` : un nombre à virgule (en mètres) ;
            - \`etudiant\` : un booléen.

            Affichez ensuite chaque variable **suivie de son type**, une par ligne.
            Par exemple : \`print(prenom, type(prenom))\`.
          `,
          hint: md`
            Les booléens s'écrivent \`True\` ou \`False\` (avec une majuscule, sans guillemets).
            Une taille de 1 m 68 s'écrit \`1.68\`.
          `,
          starter: py`
            # 1. Créez vos quatre variables
            prenom = ...
            age = ...
            taille = ...
            etudiant = ...

            # 2. Affichez chaque variable suivie de son type
          `,
          solution: py`
            prenom = "Ada"
            age = 22
            taille = 1.68
            etudiant = True

            print(prenom, type(prenom))
            print(age, type(age))
            print(taille, type(taille))
            print(etudiant, type(etudiant))
          `,
          tests: [
            test("`prenom` est une chaîne (`str`)", "type(prenom) is str", "prenom"),
            test("`age` est un entier (`int`)", "type(age) is int", "age"),
            test("`taille` est un nombre à virgule (`float`)", "type(taille) is float", "taille"),
            test("`etudiant` est un booléen (`bool`)", "type(etudiant) is bool", "etudiant"),
            test(
              "Les quatre types sont affichés",
              `all(t in OUTPUT for t in ["<class 'str'>", "<class 'int'>", "<class 'float'>", "<class 'bool'>"])`,
            ),
          ],
        },
        extra: {
          title: "Faire tourner trois variables",
          prompt: md`
            Le code de départ définit trois variables \`x\`, \`y\` et \`z\`.

            1. **En une seule ligne**, faites « tourner » leurs valeurs : \`x\` prend la valeur de \`y\`,
               \`y\` celle de \`z\`, et \`z\` celle de \`x\`.
            2. Le \`print\` final doit alors afficher \`2 3 1\`.

            Interdit d'écrire directement \`x = 2\` : votre ligne doit fonctionner quelles que soient les valeurs de départ.
          `,
          hint: md`
            L'affectation multiple \`a, b = b, a\` évalue **d'abord** tout le côté droit, puis affecte.
            Généralisez à trois variables.
          `,
          starter: py`
            x = 1
            y = 2
            z = 3

            # Rotation en une seule ligne :


            print(x, y, z)
          `,
          solution: py`
            x = 1
            y = 2
            z = 3

            x, y, z = y, z, x

            print(x, y, z)
          `,
          explanation: md`
            Python calcule d'abord le tuple de droite \`(y, z, x)\` = \`(2, 3, 1)\` avec les **anciennes**
            valeurs, puis le distribue dans \`x\`, \`y\`, \`z\`. Sans affectation multiple, il faudrait une variable temporaire.
          `,
          tests: [
            test("`x`, `y`, `z` valent 2, 3 et 1", "(x, y, z) == (2, 3, 1)", "(x, y, z)"),
            test("La sortie affiche `2 3 1`", "'2 3 1' in OUTPUT"),
            test(
              "La rotation fonctionne avec d'autres valeurs (`'a'`, `'b'`, `'c'`)",
              "pick(run_with(x='a', y='b', z='c'), 'x', 'y', 'z') == ('b', 'c', 'a')",
            ),
          ],
        },
        stretch: {
          title: "Le piège des nombres à virgule",
          prompt: md`
            Les ordinateurs stockent les \`float\` en binaire, ce qui crée de minuscules erreurs d'arrondi.

            1. Calculez \`resultat = 0.1 + 0.2\` et affichez-le. Surprise ?
            2. Créez \`egal_naif\` : le booléen résultant de la comparaison \`resultat == 0.3\`.
            3. Créez \`egal_robuste\` : une comparaison **tolérante** qui vérifie que la différence absolue
               entre \`resultat\` et \`0.3\` (fonction \`abs()\`) est inférieure à \`1e-9\`.
            4. Créez \`type_division\` = le type de \`10 / 2\`, et \`type_division_entiere\` = le type de \`10 // 2\`.
               Pourquoi sont-ils différents ? (Les opérateurs \`/\` et \`//\` sont détaillés dans la leçon suivante.)
          `,
          hint: md`
            Une comparaison est une expression comme une autre : \`egal_naif = resultat == 0.3\` range \`True\` ou \`False\` dans la variable.
          `,
          starter: py`
            # 1.
            resultat = ...
            print(resultat)

            # 2.
            egal_naif = ...

            # 3.
            egal_robuste = ...

            # 4.
            type_division = ...
            type_division_entiere = ...

            print(egal_naif, egal_robuste, type_division, type_division_entiere)
          `,
          solution: py`
            resultat = 0.1 + 0.2
            print(resultat)                     # 0.30000000000000004

            egal_naif = resultat == 0.3         # False !
            egal_robuste = abs(resultat - 0.3) < 1e-9

            type_division = type(10 / 2)        # float, même si la division tombe juste
            type_division_entiere = type(10 // 2)

            print(egal_naif, egal_robuste, type_division, type_division_entiere)
          `,
          explanation: md`
            \`/\` renvoie **toujours** un \`float\` (\`10 / 2\` vaut \`5.0\`), tandis que \`//\` entre deux entiers renvoie un \`int\`.
            En data science, on compare les flottants avec une tolérance (c'est ce que fait \`math.isclose\` ou \`numpy.isclose\`).
          `,
          tests: [
            test("`resultat` vaut `0.1 + 0.2`", "resultat == 0.1 + 0.2", "resultat"),
            test("`egal_naif` vaut `False`", "egal_naif is False", "egal_naif"),
            test("`egal_robuste` vaut `True` et utilise `abs()`", "egal_robuste is True and calls('abs')", "egal_robuste"),
            test("`type_division` est `float`", "type_division is float", "type_division"),
            test("`type_division_entiere` est `int`", "type_division_entiere is int", "type_division_entiere"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 1.2
  "m1-l2": [
    {
      id: "ex1",
      title: "Calculs du quotidien",
      tiers: {
        core: {
          title: "Convertir des minutes en heures",
          prompt: md`
            Une vidéo de cours dure \`total_minutes = 135\` minutes. À l'aide de \`//\` et \`%\`, calculez :

            - \`heures\` : le nombre d'heures entières ;
            - \`minutes\` : les minutes restantes.

            Le programme doit afficher : \`135 minutes = 2 h 15 min\`.
          `,
          hint: md`Il y a 60 minutes dans une heure : \`135 // 60\` donne le quotient, \`135 % 60\` le reste.`,
          starter: py`
            total_minutes = 135

            heures = ...
            minutes = ...

            print(total_minutes, "minutes =", heures, "h", minutes, "min")
          `,
          solution: py`
            total_minutes = 135

            heures = total_minutes // 60
            minutes = total_minutes % 60

            print(total_minutes, "minutes =", heures, "h", minutes, "min")
          `,
          tests: [
            test("`heures` vaut 2", "heures == 2", "heures"),
            test("`minutes` vaut 15", "minutes == 15", "minutes"),
            test("Affiche `135 minutes = 2 h 15 min`", "'135 minutes = 2 h 15 min' in OUTPUT"),
            test(
              "Fonctionne aussi avec 200 minutes (3 h 20 min)",
              "pick(run_with(total_minutes=200), 'heures', 'minutes') == (3, 20)",
            ),
          ],
        },
        extra: {
          title: "Hands-on 11 : convertisseur de durée complet",
          prompt: md`
            Convertissez \`secondes = 100000\` en jours, heures, minutes et secondes restantes.
            Créez les variables \`j\`, \`h\`, \`m\` et \`s\`, puis affichez :

            \`\`\`text
            100000 s = 1 j 3 h 46 min 40 s
            \`\`\`
          `,
          hint: md`
            Un jour = 86 400 s, une heure = 3 600 s. Calculez le nombre de jours avec \`//\`,
            gardez le **reste** avec \`%\`, puis recommencez avec les heures, etc.
          `,
          starter: py`
            secondes = 100000

            j = ...
            h = ...
            m = ...
            s = ...

            print(secondes, "s =", j, "j", h, "h", m, "min", s, "s")
          `,
          solution: py`
            secondes = 100000

            j = secondes // 86400
            reste = secondes % 86400
            h = reste // 3600
            reste = reste % 3600
            m = reste // 60
            s = reste % 60

            print(secondes, "s =", j, "j", h, "h", m, "min", s, "s")
          `,
          explanation: md`
            Variante compacte avec la fonction \`divmod(a, b)\` qui renvoie \`(a // b, a % b)\` :
            \`j, reste = divmod(secondes, 86400)\`.
          `,
          tests: [
            test("1 j 3 h 46 min 40 s", "(j, h, m, s) == (1, 3, 46, 40)", "(j, h, m, s)"),
            test("Affichage au bon format", "'100000 s = 1 j 3 h 46 min 40 s' in OUTPUT"),
            test(
              "90061 s → 1 j 1 h 1 min 1 s",
              "pick(run_with(secondes=90061), 'j', 'h', 'm', 's') == (1, 1, 1, 1)",
            ),
            test("59 s → 0 j 0 h 0 min 59 s", "pick(run_with(secondes=59), 'j', 'h', 'm', 's') == (0, 0, 0, 59)"),
          ],
        },
        stretch: {
          title: "Hands-on 7 : année bissextile en une seule expression",
          prompt: md`
            Une année est bissextile si elle est divisible par 4 **mais pas** par 100,
            **ou** si elle est divisible par 400.

            Écrivez **une seule expression booléenne** (sans \`if\`) et rangez-la dans \`bissextile\`.

            | Année | 2024 | 1900 | 2000 | 2023 |
            |---|---|---|---|---|
            | Bissextile ? | \`True\` | \`False\` | \`True\` | \`False\` |
          `,
          hint: md`« \`n\` est divisible par \`d\` » s'écrit \`n % d == 0\`. Combinez avec \`and\`, \`or\` et des parenthèses.`,
          starter: py`
            annee = 1900

            bissextile = ...

            print(annee, "bissextile ?", bissextile)
          `,
          solution: py`
            annee = 1900

            bissextile = (annee % 4 == 0 and annee % 100 != 0) or annee % 400 == 0

            print(annee, "bissextile ?", bissextile)
          `,
          tests: [
            test("1900 n'est pas bissextile", "bissextile is False", "bissextile"),
            test("2024 est bissextile", "run_with(annee=2024)['bissextile'] is True"),
            test("2000 est bissextile", "run_with(annee=2000)['bissextile'] is True"),
            test("2023 n'est pas bissextile", "run_with(annee=2023)['bissextile'] is False"),
            test("Aucune instruction `if` n'est utilisée", "not uses('If')"),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Températures, intérêts et nombres complexes",
      tiers: {
        core: {
          title: "Hands-on 2 : Fahrenheit et Celsius",
          prompt: md`
            Convertissez la température \`fahrenheit\` en degrés Celsius : C = (F − 32) × 5 / 9.

            1. \`celsius\` : la température convertie, **arrondie à 1 décimale** ;
            2. \`back\` : la conversion inverse de \`celsius\` (F = C × 9 / 5 + 32), arrondie à 1 décimale ;
            3. affichez \`98.6 °F = 37.0 °C\`.
          `,
          starter: py`
            fahrenheit = 98.6

            celsius = ...
            back = ...

            print(fahrenheit, "°F =", celsius, "°C")
          `,
          solution: py`
            fahrenheit = 98.6

            celsius = round((fahrenheit - 32) * 5 / 9, 1)
            back = round(celsius * 9 / 5 + 32, 1)

            print(fahrenheit, "°F =", celsius, "°C")
          `,
          tests: [
            test("`celsius` vaut 37.0", "celsius == 37.0", "celsius"),
            test("`back` revient à 98.6", "back == 98.6", "back"),
            test("Affiche `98.6 °F = 37.0 °C`", "'98.6 °F = 37.0 °C' in OUTPUT"),
            test("212 °F → 100 °C et -40 °F → -40 °C", "run_with(fahrenheit=212)['celsius'] == 100.0 and run_with(fahrenheit=-40)['celsius'] == -40.0"),
          ],
        },
        extra: {
          title: "Hands-on 5 : intérêts composés",
          prompt: md`
            Calculez le montant d'un compte bancaire après plusieurs années d'intérêts composés.

            1. Lisez avec \`input()\` le montant initial \`amount\` (\`float\`), le nombre d'années \`years\` (\`int\`) et le
               taux annuel \`rate\` en pourcentage (\`float\`).
            2. \`final\` = montant × (1 + taux / 100) ^ années, **arrondi à 2 décimales**.
            3. Affichez \`After 10 years: 1628.89\`.
          `,
          hint: md`La puissance s'écrit \`**\`. Les entrées par défaut sont 1000, 10 et 5.`,
          stdin: "1000\n10\n5",
          starter: py`
            amount = input("Initial amount? ")
            years = input("Number of years? ")
            rate = input("Interest rate (%)? ")

          `,
          solution: py`
            amount = float(input("Initial amount? "))
            years = int(input("Number of years? "))
            rate = float(input("Interest rate (%)? "))

            final = round(amount * (1 + rate / 100) ** years, 2)
            print(f"After {years} years: {final}")
          `,
          tests: [
            test("Les saisies sont converties", "type(amount) is float and type(years) is int and type(rate) is float"),
            test("`final` vaut 1628.89", "final == 1628.89", "final"),
            test("Affiche `After 10 years: 1628.89`", "'After 10 years: 1628.89' in OUTPUT"),
            test("500 € à 2 % pendant 3 ans → 530.6", "run_with(stdin='500\\n3\\n2\\n')['final'] == 530.6"),
          ],
        },
        stretch: {
          title: "Nombres complexes et court-circuit",
          prompt: md`
            1. Avec \`z = complex(3, 4)\` : \`modulus\` (son module, avec \`abs\`), \`conj\` (son conjugué) et \`product\`
               (\`z\` multiplié par son conjugué).
            2. \`q, r = divmod(17, 5)\`.
            3. Les racines de x² + 2x + 5 = 0 : avec le discriminant Δ = b² − 4ac (négatif ici !), calculez
               \`root1\` = (−b + √Δ) / 2a et \`root2\` = (−b − √Δ) / 2a, en écrivant √Δ comme \`delta ** 0.5\`.
            4. \`display\` : la valeur de \`name\` si elle n'est pas vide, sinon \`"anonymous"\`, **en une seule expression
               avec \`or\`** (sans \`if\`).
          `,
          starter: py`
            z = complex(3, 4)
            modulus = ...
            conj = ...
            product = ...

            q, r = ...

            a, b, c = 1, 2, 5
            delta = ...
            root1 = ...
            root2 = ...

            name = ""
            display = ...

            print(modulus, conj, product, q, r, root1, root2, display)
          `,
          solution: py`
            z = complex(3, 4)
            modulus = abs(z)
            conj = z.conjugate()
            product = z * conj

            q, r = divmod(17, 5)

            a, b, c = 1, 2, 5
            delta = b ** 2 - 4 * a * c
            root1 = (-b + delta ** 0.5) / (2 * a)
            root2 = (-b - delta ** 0.5) / (2 * a)

            name = ""
            display = name or "anonymous"

            print(modulus, conj, product, q, r, root1, root2, display)
          `,
          tests: [
            test("`modulus` vaut 5.0, `conj` vaut 3-4j", "modulus == 5.0 and conj == 3 - 4j", "(modulus, conj)"),
            test("`product` vaut 25", "product == 25", "product"),
            test("`divmod(17, 5)` → `q = 3`, `r = 2`", "(q, r) == (3, 2) and calls('divmod')"),
            test("Les racines complexes -1 ± 2j", "abs(root1 - (-1 + 2j)) < 1e-9 and abs(root2 - (-1 - 2j)) < 1e-9", "(root1, root2)"),
            test("`display` utilise `or`", "display == 'anonymous' and run_with(name='Ada')['display'] == 'Ada' and not uses('If') and not uses('IfExp')"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 1.3
  "m1-l3": [
    {
      id: "ex1",
      title: "Atelier texte",
      tiers: {
        core: {
          title: "Nettoyer et découper une phrase",
          prompt: md`
            À partir de \`phrase = "   Python pour la Data Science   "\`, créez :

            - \`propre\` : la phrase sans les espaces au début et à la fin ;
            - \`majuscules\` : \`propre\` entièrement en majuscules ;
            - \`nb_caracteres\` : la longueur de \`propre\` ;
            - \`premier_mot\` : les 6 premiers caractères de \`propre\` (slicing) ;
            - \`dernier_mot\` : les 7 derniers caractères de \`propre\` (indices négatifs).
          `,
          hint: md`Méthodes utiles : \`strip()\`, \`upper()\`. Slicing : \`s[:6]\` et \`s[-7:]\`.`,
          starter: py`
            phrase = "   Python pour la Data Science   "

            propre = ...
            majuscules = ...
            nb_caracteres = ...
            premier_mot = ...
            dernier_mot = ...

            print(propre)
            print(majuscules)
            print(nb_caracteres, premier_mot, dernier_mot)
          `,
          solution: py`
            phrase = "   Python pour la Data Science   "

            propre = phrase.strip()
            majuscules = propre.upper()
            nb_caracteres = len(propre)
            premier_mot = propre[:6]
            dernier_mot = propre[-7:]

            print(propre)
            print(majuscules)
            print(nb_caracteres, premier_mot, dernier_mot)
          `,
          tests: [
            test("`propre` n'a plus d'espaces superflus", "propre == 'Python pour la Data Science'", "propre"),
            test("`majuscules` est correct", "majuscules == 'PYTHON POUR LA DATA SCIENCE'", "majuscules"),
            test("`nb_caracteres` vaut 27", "nb_caracteres == 27", "nb_caracteres"),
            test("`premier_mot` vaut `'Python'`", "premier_mot == 'Python'", "premier_mot"),
            test("`dernier_mot` vaut `'Science'`", "dernier_mot == 'Science'", "dernier_mot"),
          ],
        },
        extra: {
          title: "Ticket de caisse avec une f-string",
          prompt: md`
            On vend un \`produit\` au prix \`prix_ht\` (hors taxes) avec une TVA de 20 %.

            1. Calculez \`prix_ttc = prix_ht * (1 + tva)\`.
            2. Construisez avec **une f-string** la chaîne \`ligne\`, exactement au format :

            \`\`\`text
            Clavier : 49.90 € HT -> 59.88 € TTC
            \`\`\`

            Les prix sont affichés avec **2 décimales**.
          `,
          hint: md`Dans une f-string, \`{x:.2f}\` affiche \`x\` avec 2 chiffres après la virgule.`,
          starter: py`
            produit = "Clavier"
            prix_ht = 49.9
            tva = 0.2

            prix_ttc = ...
            ligne = ...

            print(ligne)
          `,
          solution: py`
            produit = "Clavier"
            prix_ht = 49.9
            tva = 0.2

            prix_ttc = prix_ht * (1 + tva)
            ligne = f"{produit} : {prix_ht:.2f} € HT -> {prix_ttc:.2f} € TTC"

            print(ligne)
          `,
          tests: [
            test("`prix_ttc` est correct", "approx(prix_ttc, 59.88)", "prix_ttc"),
            test("`ligne` a exactement le bon format", "ligne == 'Clavier : 49.90 € HT -> 59.88 € TTC'", "ligne"),
            test("Une f-string est utilisée", "uses('JoinedStr')"),
            test(
              "Fonctionne pour une souris à 20 € HT",
              "run_with(produit='Souris', prix_ht=20)['ligne'] == 'Souris : 20.00 € HT -> 24.00 € TTC'",
            ),
          ],
        },
        stretch: {
          title: "Initiales et palindrome",
          prompt: md`
            1. À partir de \`nom_complet = "ada lovelace"\`, construisez \`initiales\` = \`"A.L."\`.
               Repérez l'espace avec la méthode \`find()\` : l'initiale du nom est juste après.
            2. Une phrase est un **palindrome** si elle se lit pareil dans les deux sens, en ignorant
               espaces et majuscules. Créez le booléen \`est_palindrome\` pour
               \`phrase = "Esope reste ici et se repose"\`.

            Votre code doit fonctionner avec n'importe quel prénom/nom et n'importe quelle phrase.
          `,
          hint: md`
            \`s[::-1]\` renverse une chaîne. Pour ignorer les espaces : \`replace(" ", "")\` ;
            pour la casse : \`lower()\`.
          `,
          starter: py`
            nom_complet = "ada lovelace"
            phrase = "Esope reste ici et se repose"

            # 1. Initiales
            initiales = ...

            # 2. Palindrome
            est_palindrome = ...

            print(initiales, est_palindrome)
          `,
          solution: py`
            nom_complet = "ada lovelace"
            phrase = "Esope reste ici et se repose"

            # 1. Initiales
            espace = nom_complet.find(" ")
            initiales = nom_complet[0].upper() + "." + nom_complet[espace + 1].upper() + "."

            # 2. Palindrome
            lettres = phrase.replace(" ", "").lower()
            est_palindrome = lettres == lettres[::-1]

            print(initiales, est_palindrome)
          `,
          tests: [
            test("`initiales` vaut `'A.L.'`", "initiales == 'A.L.'", "initiales"),
            test("Fonctionne pour `'grace hopper'` → `'G.H.'`", "run_with(nom_complet='grace hopper')['initiales'] == 'G.H.'"),
            test("La phrase d'exemple est un palindrome", "est_palindrome is True", "est_palindrome"),
            test(
              "`'Engage le jeu que je le gagne'` est un palindrome",
              "run_with(phrase='Engage le jeu que je le gagne')['est_palindrome'] is True",
            ),
            test("`'Python pour tous'` n'en est pas un", "run_with(phrase='Python pour tous')['est_palindrome'] is False"),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Mise en forme du texte",
      tiers: {
        core: {
          title: "Hands-on : hashtag",
          prompt: md`
            Écrivez \`make_hashtag(sentence)\` qui transforme une phrase en hashtag : chaque mot commence par une
            majuscule (et le reste du mot passe en minuscules), les espaces disparaissent, et le tout est précédé de \`#\`.

            \`make_hashtag("the quick brown fox")\` → \`"#TheQuickBrownFox"\`.
          `,
          hint: md`\`split()\` (sans argument : ignore les espaces multiples), \`capitalize()\` et \`"".join(...)\`.`,
          starter: py`
            def make_hashtag(sentence):
                ...


            print(make_hashtag("the quick brown fox"))
            print(make_hashtag("  python   FOR data science "))
          `,
          solution: py`
            def make_hashtag(sentence):
                return "#" + "".join(word.capitalize() for word in sentence.split())


            print(make_hashtag("the quick brown fox"))
            print(make_hashtag("  python   FOR data science "))
          `,
          tests: [
            test("`the quick brown fox` → `#TheQuickBrownFox`", "make_hashtag('the quick brown fox') == '#TheQuickBrownFox'", "make_hashtag('the quick brown fox')"),
            test("Espaces multiples et majuscules gérés", "make_hashtag('  python   FOR data science ') == '#PythonForDataScience'", "make_hashtag('  python   FOR data science ')"),
            test("Un seul mot", "make_hashtag('hello') == '#Hello'"),
          ],
        },
        extra: {
          title: "Majuscules, minuscules et tableaux alignés",
          prompt: md`
            1. *Hands-on « Pangrams », 1re partie* : comptez les majuscules et les minuscules d'une chaîne **de deux
               façons** : \`count_case_loop(s)\` avec une boucle \`for\` et deux compteurs, \`count_case_sum(s)\` avec
               \`sum(...)\` sur une expression génératrice. Les deux renvoient le tuple \`(majuscules, minuscules)\`.
            2. \`table_row(name, qty, price)\` renvoie une ligne de tableau : le nom **aligné à gauche** sur 12 caractères,
               la quantité **centrée** sur 5, le prix avec 2 décimales **aligné à droite** sur 8, le tout encadré de \`|\` :
               \`table_row("Clavier", 2, 49.9)\` → \`"|Clavier     |  2  |   49.90|"\`. Utilisez \`ljust\`, \`center\` et \`rjust\`.
          `,
          starter: py`
            def count_case_loop(s):
                ...


            def count_case_sum(s):
                ...


            def table_row(name, qty, price):
                ...


            print(count_case_loop("Hello World PYTHON"), count_case_sum("Hello World PYTHON"))
            print(table_row("Clavier", 2, 49.9))
            print(table_row("Souris", 10, 19.5))
          `,
          solution: py`
            def count_case_loop(s):
                upper = 0
                lower = 0
                for c in s:
                    if c.isupper():
                        upper += 1
                    elif c.islower():
                        lower += 1
                return upper, lower


            def count_case_sum(s):
                return sum(c.isupper() for c in s), sum(c.islower() for c in s)


            def table_row(name, qty, price):
                return "|" + name.ljust(12) + "|" + str(qty).center(5) + "|" + f"{price:.2f}".rjust(8) + "|"


            print(count_case_loop("Hello World PYTHON"), count_case_sum("Hello World PYTHON"))
            print(table_row("Clavier", 2, 49.9))
            print(table_row("Souris", 10, 19.5))
          `,
          tests: [
            test("`count_case_loop`", "count_case_loop('Hello World PYTHON') == (8, 8) and count_case_loop('123 !') == (0, 0)"),
            test("`count_case_sum` donne les mêmes résultats", "all(count_case_sum(s) == count_case_loop(s) for s in ('Hello World PYTHON', 'abcDEF', '', 'Éléphant'))"),
            test("Deux façons différentes : une boucle, puis `sum`", "'for c' in __import__('inspect').getsource(count_case_loop) and 'sum(' in __import__('inspect').getsource(count_case_sum)"),
            test("`table_row('Clavier', 2, 49.9)`", "table_row('Clavier', 2, 49.9) == '|Clavier     |  2  |   49.90|'", "table_row('Clavier', 2, 49.9)"),
            test("`ljust`, `center` et `rjust` sont utilisés", "calls('ljust') and calls('center') and calls('rjust')"),
          ],
        },
        stretch: {
          title: "Hands-on : valider une adresse e-mail",
          prompt: md`
            Une adresse e-mail est valide si elle :

            - contient au plus 256 caractères ;
            - commence par une lettre ou un chiffre ;
            - contient **exactement un** symbole \`@\` ;
            - a au moins un caractère après le \`@\` **et avant** le dernier point ;
            - a au moins un caractère après le dernier point.

            1. \`is_valid_email(address)\` vérifie ces règles avec des **méthodes de chaînes** (\`count\`, \`split\`,
               \`rfind\`, \`isalnum\`…).
            2. *Extension avancée* : \`is_valid_email_re(address)\` fait la même chose avec une **expression régulière**
               (module \`re\`, fonction \`re.fullmatch\`).
          `,
          hint: md`
            Après avoir séparé \`local, domain = address.split("@")\`, cherchez le dernier point du domaine avec
            \`domain.rfind(".")\` : il doit être d'indice ≥ 1 et ne pas être le dernier caractère. Pour l'expression
            régulière : \`[A-Za-z0-9][^@]*@[^@]+\\.[^@.]+\`.
          `,
          starter: py`
            import re


            def is_valid_email(address):
                ...


            def is_valid_email_re(address):
                ...


            for a in ["ada@example.com", "ada.example.com", "@example.com", "ada@.com"]:
                print(a, is_valid_email(a), is_valid_email_re(a))
          `,
          solution: py`
            import re


            def is_valid_email(address):
                if len(address) > 256 or not address or not address[0].isalnum():
                    return False
                if address.count("@") != 1:
                    return False
                local, domain = address.split("@")
                dot = domain.rfind(".")
                return dot >= 1 and dot < len(domain) - 1


            def is_valid_email_re(address):
                return len(address) <= 256 and re.fullmatch(r"[A-Za-z0-9][^@]*@[^@]+\.[^@.]+", address) is not None


            for a in ["ada@example.com", "ada.example.com", "@example.com", "ada@.com"]:
                print(a, is_valid_email(a), is_valid_email_re(a))
          `,
          tests: [
            test(
              "Adresses valides acceptées",
              "all(is_valid_email(a) for a in ['ada@example.com', 'a1.b@mail.co.uk', 'x@y.z', '7up@drinks.fr'])",
            ),
            test(
              "Adresses invalides refusées",
              "not any(is_valid_email(a) for a in ['@example.com', '.ada@example.com', 'ada.example.com', 'ada@.com', 'ada@example.', 'ada@@example.com', 'ada@example', 'a@b@c.com', 'a' * 250 + '@example.com'])",
              "[a for a in ['@example.com', '.ada@example.com', 'ada.example.com', 'ada@.com', 'ada@example.', 'ada@@example.com', 'ada@example', 'a@b@c.com'] if is_valid_email(a)]",
            ),
            test(
              "La version `re` donne les mêmes réponses",
              "all(bool(is_valid_email_re(a)) == is_valid_email(a) for a in ['ada@example.com', 'a1.b@mail.co.uk', 'x@y.z', '@example.com', '.ada@example.com', 'ada.example.com', 'ada@.com', 'ada@example.', 'ada@@example.com', 'ada@example', 'a' * 250 + '@example.com'])",
            ),
            test("`re.fullmatch` est utilisé", "calls('fullmatch')"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 1.4
  "m1-l4": [
    {
      id: "ex1",
      title: "Jongler entre les types",
      tiers: {
        core: {
          title: "Additionner du texte ?",
          prompt: md`
            Les variables \`a = "12"\` et \`b = "30"\` sont des **chaînes**. Créez :

            - \`concatenation\` : le résultat de \`a + b\` (observez !) ;
            - \`somme\` : la vraie somme numérique, de type \`int\` ;
            - \`moyenne\` : la moyenne des deux nombres ;
            - \`message\` : la chaîne \`"La somme vaut 42"\`, construite avec \`+\` à partir de \`somme\`.
          `,
          hint: md`Convertissez avec \`int()\` pour calculer, puis avec \`str()\` pour concaténer à du texte.`,
          starter: py`
            a = "12"
            b = "30"

            concatenation = ...
            somme = ...
            moyenne = ...
            message = ...

            print(concatenation, somme, moyenne)
            print(message)
          `,
          solution: py`
            a = "12"
            b = "30"

            concatenation = a + b                    # "1230"
            somme = int(a) + int(b)                  # 42
            moyenne = somme / 2                      # 21.0
            message = "La somme vaut " + str(somme)

            print(concatenation, somme, moyenne)
            print(message)
          `,
          tests: [
            test("`concatenation` vaut `'1230'`", "concatenation == '1230'", "concatenation"),
            test("`somme` vaut 42 (un `int`)", "somme == 42 and type(somme) is int", "somme"),
            test("`moyenne` vaut 21.0", "moyenne == 21.0", "moyenne"),
            test("`message` vaut `'La somme vaut 42'`", "message == 'La somme vaut 42'", "message"),
            test(
              "Fonctionne avec `a = '5'` et `b = '7'`",
              "pick(run_with(a='5', b='7'), 'concatenation', 'somme', 'moyenne') == ('57', 12, 6.0)",
            ),
          ],
        },
        extra: {
          title: "Saisie utilisateur",
          prompt: md`
            Demandez l'âge puis la taille (en mètres) avec \`input()\`, et rangez-les, **convertis**,
            dans \`age\` (\`int\`) et \`taille\` (\`float\`). Le programme affiche ensuite :

            \`\`\`text
            Dans 10 ans, vous aurez 35 ans.
            Votre taille en cm : 175
            \`\`\`

            La taille en cm est **arrondie** à l'entier le plus proche.
            Les valeurs saisies sont dans la zone **Entrées** sous l'éditeur : modifiez-les pour tester.
          `,
          hint: md`
            Attention : \`1.68 * 100\` vaut \`167.99999999999997\` ! \`int()\` tronquerait à 167 :
            utilisez \`round()\`.
          `,
          stdin: "25\n1.75",
          starter: py`
            age = input("Quel âge avez-vous ? ")
            taille = input("Votre taille (m) ? ")

            # Convertissez puis affichez les deux phrases

          `,
          solution: py`
            age = int(input("Quel âge avez-vous ? "))
            taille = float(input("Votre taille (m) ? "))

            print(f"Dans 10 ans, vous aurez {age + 10} ans.")
            print("Votre taille en cm :", round(taille * 100))
          `,
          tests: [
            test("`age` est converti en `int`", "type(age) is int", "age"),
            test("`taille` est convertie en `float`", "type(taille) is float", "taille"),
            test("Affiche `Dans 10 ans, vous aurez 35 ans.`", "'Dans 10 ans, vous aurez 35 ans.' in OUTPUT"),
            test("Affiche `Votre taille en cm : 175`", "'Votre taille en cm : 175' in OUTPUT"),
            test(
              "Avec 40 ans et 1.68 m : 50 ans et 168 cm",
              "(lambda out: '50 ans' in out and ': 168' in out)(run_with(stdin='40\\n1.68')['OUTPUT'])",
            ),
          ],
        },
        stretch: {
          title: "Nettoyer un montant saisi",
          prompt: md`
            Un formulaire renvoie le montant \`saisie = " 1 234,56 € "\` : espaces, virgule décimale
            et symbole monétaire. Situation très courante lors du nettoyage de données !

            1. Transformez \`saisie\` en un \`float\` nommé \`montant\` (\`1234.56\`).
            2. \`montant_entier\` : la partie entière (\`1234\`).
            3. \`arrondi\` : le montant arrondi à l'unité (\`1235\`).
          `,
          hint: md`
            Enchaînez les méthodes : \`saisie.replace("€", "").replace(" ", "").replace(",", ".")\`, puis \`float()\`.
          `,
          starter: py`
            saisie = " 1 234,56 € "

            montant = ...
            montant_entier = ...
            arrondi = ...

            print(montant, montant_entier, arrondi)
          `,
          solution: py`
            saisie = " 1 234,56 € "

            texte = saisie.replace("€", "").replace(" ", "").replace(",", ".")
            montant = float(texte)
            montant_entier = int(montant)
            arrondi = round(montant)

            print(montant, montant_entier, arrondi)
          `,
          tests: [
            test("`montant` vaut `1234.56` (un `float`)", "montant == 1234.56 and type(montant) is float", "montant"),
            test("`montant_entier` vaut 1234", "montant_entier == 1234", "montant_entier"),
            test("`arrondi` vaut 1235", "arrondi == 1235", "arrondi"),
            test("`'  99,90 €'` → 99.9", "run_with(saisie='  99,90 €')['montant'] == 99.9"),
            test("`' 12 000,5 € '` → 12000.5", "run_with(saisie=' 12 000,5 € ')['montant'] == 12000.5"),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Codes et bases",
      tiers: {
        core: {
          title: "Codes des caractères et bases numériques",
          prompt: md`
            1. \`codes\` : la liste des codes (\`ord\`) des lettres de \`"Python"\` ;
            2. \`word\` : le mot reconstruit à partir de \`codes\` (\`chr\` et \`"".join\`) ;
            3. \`hex_value\` : la valeur de \`"abc"\` lu en **base 16** ;
            4. \`binary\` : l'écriture en base 2 de 42 (\`bin\`), et \`back\` : la relecture de \`binary\` en entier (\`int(…, 2)\`) ;
            5. \`text\` : le résultat de \`str(("a", "b"))\`, et \`length\` : sa longueur. Surprise ?
          `,
          starter: py`
            codes = ...
            word = ...
            hex_value = ...
            binary = ...
            back = ...
            text = ...
            length = ...

            print(codes, word, hex_value, binary, back, text, length)
          `,
          solution: py`
            codes = [ord(c) for c in "Python"]
            word = "".join(chr(i) for i in codes)
            hex_value = int("abc", 16)
            binary = bin(42)
            back = int(binary, 2)
            text = str(("a", "b"))
            length = len(text)

            print(codes, word, hex_value, binary, back, text, length)
          `,
          explanation: md`
            \`str(("a", "b"))\` vaut \`"('a', 'b')"\` : 10 caractères, parenthèses, guillemets et virgule compris.
            Pour recoller les éléments, il faut \`"".join(...)\`.
          `,
          tests: [
            test("`codes` vaut [80, 121, 116, 104, 111, 110]", "codes == [80, 121, 116, 104, 111, 110]", "codes"),
            test("`word` vaut `'Python'` (avec `chr`)", "word == 'Python' and calls('chr')", "word"),
            test("`hex_value` vaut 2748", "hex_value == 2748", "hex_value"),
            test("`binary` vaut `'0b101010'` et `back` 42", "binary == '0b101010' and back == 42", "(binary, back)"),
            test("`text` et `length`", "text == \"('a', 'b')\" and length == 10", "(text, length)"),
          ],
        },
        extra: {
          title: "Le chiffre de César",
          prompt: md`
            Le **chiffre de César** décale chaque lettre de l'alphabet d'un nombre fixe de positions, en « bouclant »
            après \`z\` : avec un décalage de 3, \`a\` → \`d\`, \`x\` → \`a\`.

            Écrivez \`caesar(text, shift)\` : les minuscules et les majuscules sont décalées (en conservant la casse),
            les autres caractères (espaces, ponctuation, accents) sont inchangés. Un décalage négatif déchiffre.
          `,
          hint: md`
            Pour une minuscule : \`chr((ord(c) - ord("a") + shift) % 26 + ord("a"))\`. Le modulo \`% 26\` fait boucler
            l'alphabet, même pour un décalage négatif.
          `,
          starter: py`
            def caesar(text, shift):
                ...


            secret = caesar("Hello, World!", 3)
            print(secret, "→", caesar(secret, -3))
          `,
          solution: py`
            def caesar(text, shift):
                result = ""
                for c in text:
                    if "a" <= c <= "z":
                        result += chr((ord(c) - ord("a") + shift) % 26 + ord("a"))
                    elif "A" <= c <= "Z":
                        result += chr((ord(c) - ord("A") + shift) % 26 + ord("A"))
                    else:
                        result += c
                return result


            secret = caesar("Hello, World!", 3)
            print(secret, "→", caesar(secret, -3))
          `,
          tests: [
            test("`caesar('Hello, World!', 3)` → `'Khoor, Zruog!'`", "caesar('Hello, World!', 3) == 'Khoor, Zruog!'", "caesar('Hello, World!', 3)"),
            test("Fin de l'alphabet : `xyz` → `abc`", "caesar('xyz XYZ', 3) == 'abc ABC'"),
            test("Un décalage négatif déchiffre", "caesar(caesar('Python 3.14 !', 11), -11) == 'Python 3.14 !'"),
            test("Les autres caractères sont inchangés", "caesar('été 2024', 1) == 'éué 2024'"),
            test("`ord` et `chr` sont utilisés", "calls('ord') and calls('chr')"),
          ],
        },
        stretch: {
          title: "Changer de base à la main",
          prompt: md`
            Sans utiliser \`bin\`, \`oct\`, \`hex\`, \`format\` ni \`int(texte, base)\` :

            1. \`to_base(n, base)\` écrit l'entier positif \`n\` dans une base de 2 à 16 (chiffres \`"0123456789ABCDEF"\`),
               par divisions successives (\`divmod\`) : \`to_base(255, 16)\` → \`"FF"\`, \`to_base(0, 2)\` → \`"0"\` ;
            2. \`from_base(text, base)\` fait l'inverse (majuscules ou minuscules acceptées) : \`from_base("ff", 16)\` → 255.
          `,
          hint: md`
            Pour \`to_base\`, chaque \`divmod(n, base)\` donne le dernier chiffre (le reste) : construisez la chaîne de
            droite à gauche. Pour \`from_base\`, le schéma de Horner : \`value = value * base + chiffre\`.
          `,
          starter: py`
            DIGITS = "0123456789ABCDEF"


            def to_base(n, base):
                ...


            def from_base(text, base):
                ...


            print(to_base(42, 2), to_base(255, 16), from_base("101010", 2), from_base("ff", 16))
          `,
          solution: py`
            DIGITS = "0123456789ABCDEF"


            def to_base(n, base):
                if n == 0:
                    return "0"
                text = ""
                while n > 0:
                    n, digit = divmod(n, base)
                    text = DIGITS[digit] + text
                return text


            def from_base(text, base):
                value = 0
                for c in text.upper():
                    value = value * base + DIGITS.index(c)
                return value


            print(to_base(42, 2), to_base(255, 16), from_base("101010", 2), from_base("ff", 16))
          `,
          tests: [
            test("`to_base` en base 2, 8 et 16", "to_base(42, 2) == '101010' and to_base(64, 8) == '100' and to_base(255, 16) == 'FF' and to_base(0, 2) == '0'"),
            test("`to_base` est cohérent avec `bin` et `hex`", "all(to_base(n, 2) == bin(n)[2:] and to_base(n, 16) == hex(n)[2:].upper() for n in range(1, 300))"),
            test("`from_base`", "from_base('101010', 2) == 42 and from_base('ff', 16) == 255 and from_base('777', 8) == 511"),
            test("Aller-retour sur de nombreux nombres", "all(from_base(to_base(n, b), b) == n for n in (1, 7, 100, 4096, 99999) for b in (2, 3, 7, 10, 16))"),
            test("Sans `bin`, `hex`, `oct` ni `int(…, base)`", "not (calls('bin') or calls('hex') or calls('oct') or calls('int') or calls('format'))"),
          ],
        },
      },
    },
  ],
};
