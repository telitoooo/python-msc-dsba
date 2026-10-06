import { md, py, test } from "../helpers.js";

export default {
  // ---------------------------------------------------------------- 3.1
  "m3-l1": [
    {
      id: "ex1",
      title: "Premières fonctions",
      tiers: {
        core: {
          title: "Trois fonctions de calcul",
          prompt: md`
            Écrivez les fonctions suivantes. Chacune **renvoie** son résultat avec \`return\` (pas de \`print\` dedans) :

            - \`carre(x)\` : renvoie \`x²\` ;
            - \`est_pair(n)\` : renvoie \`True\` si \`n\` est pair, \`False\` sinon ;
            - \`aire_rectangle(longueur, largeur)\` : renvoie l'aire du rectangle.
          `,
          hint: md`
            \`est_pair\` peut tenir en une ligne : \`return n % 2 == 0\` (la comparaison est déjà un booléen).
          `,
          starter: py`
            def carre(x):
                ...


            def est_pair(n):
                ...


            def aire_rectangle(longueur, largeur):
                ...


            # Testez vos fonctions :
            print(carre(4), est_pair(7), aire_rectangle(3, 5))
          `,
          solution: py`
            def carre(x):
                return x ** 2


            def est_pair(n):
                return n % 2 == 0


            def aire_rectangle(longueur, largeur):
                return longueur * largeur


            print(carre(4), est_pair(7), aire_rectangle(3, 5))
          `,
          tests: [
            test("`carre(3)` renvoie 9 et `carre(-4)` renvoie 16", "carre(3) == 9 and carre(-4) == 16", "carre(3)"),
            test("`est_pair(4)` renvoie `True`", "est_pair(4) is True", "est_pair(4)"),
            test("`est_pair(7)` renvoie `False`", "est_pair(7) is False", "est_pair(7)"),
            test("`aire_rectangle(3, 4)` renvoie 12", "aire_rectangle(3, 4) == 12", "aire_rectangle(3, 4)"),
            test("Les fonctions n'affichent rien (elles renvoient)", "capture(carre, 2) == '' and capture(est_pair, 2) == ''"),
          ],
        },
        extra: {
          title: "Conversions et mention",
          prompt: md`
            1. \`celsius_vers_fahrenheit(c)\` renvoie \`c × 9/5 + 32\`.
            2. \`fahrenheit_vers_celsius(f)\` fait la conversion inverse.
            3. \`mention(note)\` renvoie la mention du bac (voir leçon 2.1) en utilisant des **\`return\` anticipés**
               plutôt qu'une variable intermédiaire.
          `,
          hint: md`
            Dans \`mention\`, chaque \`if\` se termine par un \`return\` : inutile d'écrire \`elif\` ou \`else\`,
            car la fonction s'arrête dès le premier \`return\` exécuté.
          `,
          starter: py`
            def celsius_vers_fahrenheit(c):
                ...


            def fahrenheit_vers_celsius(f):
                ...


            def mention(note):
                ...


            print(celsius_vers_fahrenheit(100), fahrenheit_vers_celsius(32), mention(15))
          `,
          solution: py`
            def celsius_vers_fahrenheit(c):
                return c * 9 / 5 + 32


            def fahrenheit_vers_celsius(f):
                return (f - 32) * 5 / 9


            def mention(note):
                if note >= 16:
                    return "Très bien"
                if note >= 14:
                    return "Bien"
                if note >= 12:
                    return "Assez bien"
                if note >= 10:
                    return "Passable"
                return "Ajourné"


            print(celsius_vers_fahrenheit(100), fahrenheit_vers_celsius(32), mention(15))
          `,
          tests: [
            test("0 °C → 32 °F et 100 °C → 212 °F", "celsius_vers_fahrenheit(0) == 32 and celsius_vers_fahrenheit(100) == 212"),
            test("-40 °C → -40 °F", "celsius_vers_fahrenheit(-40) == -40", "celsius_vers_fahrenheit(-40)"),
            test("98.6 °F → 37 °C", "approx(fahrenheit_vers_celsius(98.6), 37)", "fahrenheit_vers_celsius(98.6)"),
            test("Aller-retour : `f→c(c→f(25)) == 25`", "approx(fahrenheit_vers_celsius(celsius_vers_fahrenheit(25)), 25)"),
            test(
              "`mention` gère toutes les bornes",
              "[mention(n) for n in (18, 16, 15, 12, 10, 9.5)] == ['Très bien', 'Très bien', 'Bien', 'Assez bien', 'Passable', 'Ajourné']",
              "[mention(n) for n in (18, 16, 15, 12, 10, 9.5)]",
            ),
          ],
        },
        stretch: {
          title: "PGCD, PPCM et fractions",
          prompt: md`
            1. \`pgcd(a, b)\` : le plus grand commun diviseur, par l'**algorithme d'Euclide** :
               tant que \`b\` n'est pas nul, remplacer \`(a, b)\` par \`(b, a % b)\` ; le résultat est \`a\`.
            2. \`ppcm(a, b)\` : le plus petit commun multiple, sachant que \`pgcd(a, b) × ppcm(a, b) = a × b\`.
               Réutilisez \`pgcd\` !
            3. \`simplifier(num, den)\` : renvoie la fraction simplifiée sous forme de **chaîne** :
               \`simplifier(6, 8)\` → \`"3/4"\`, et \`simplifier(10, 5)\` → \`"2"\` (dénominateur 1).
          `,
          hint: md`
            \`a, b = b, a % b\` fait la mise à jour simultanée. Pour \`simplifier\`, divisez numérateur et
            dénominateur par leur PGCD (avec \`//\` pour garder des entiers).
          `,
          starter: py`
            def pgcd(a, b):
                ...


            def ppcm(a, b):
                ...


            def simplifier(num, den):
                ...


            print(pgcd(48, 18), ppcm(4, 6), simplifier(6, 8))
          `,
          solution: py`
            def pgcd(a, b):
                while b != 0:
                    a, b = b, a % b
                return a


            def ppcm(a, b):
                return a * b // pgcd(a, b)


            def simplifier(num, den):
                d = pgcd(num, den)
                num, den = num // d, den // d
                if den == 1:
                    return str(num)
                return f"{num}/{den}"


            print(pgcd(48, 18), ppcm(4, 6), simplifier(6, 8))
          `,
          tests: [
            test("`pgcd(48, 18)` = 6 et `pgcd(17, 5)` = 1", "pgcd(48, 18) == 6 and pgcd(17, 5) == 1", "pgcd(48, 18)"),
            test("`pgcd(0, 7)` = 7", "pgcd(0, 7) == 7", "pgcd(0, 7)"),
            test("`ppcm(4, 6)` = 12 et `ppcm(21, 6)` = 42", "ppcm(4, 6) == 12 and ppcm(21, 6) == 42", "ppcm(4, 6)"),
            test("`simplifier(6, 8)` = `'3/4'`", "simplifier(6, 8) == '3/4'", "simplifier(6, 8)"),
            test("`simplifier(12, 36)` = `'1/3'`", "simplifier(12, 36) == '1/3'", "simplifier(12, 36)"),
            test("`simplifier(10, 5)` = `'2'`", "simplifier(10, 5) == '2'", "simplifier(10, 5)"),
            test("`pgcd` utilise une boucle `while`", "uses('While')"),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Intérêts composés, dichotomie et Collatz",
      tiers: {
        core: {
          title: "Hands-on 5, étapes 2 à 4 : fonctions, docstring et main",
          prompt: md`
            Reprenez le calcul des intérêts composés en le structurant :

            1. **fonctions** : \`compound(amount, years, rate)\` **renvoie** (sans rien afficher) le montant final
               arrondi à 2 décimales ;
            2. **docstring** : documentez \`compound\` ;
            3. **main** : \`main()\` lit le montant, le nombre d'années et le taux (\`input\`), puis affiche
               \`After 10 years: 1628.89\` ; elle n'est appelée que sous \`if __name__ == "__main__":\`.
          `,
          stdin: "1000\n10\n5",
          starter: py`
            amount = float(input("Initial amount? "))
            years = int(input("Number of years? "))
            rate = float(input("Interest rate (%)? "))
            print("After", years, "years:", round(amount * (1 + rate / 100) ** years, 2))
          `,
          solution: py`
            def compound(amount, years, rate):
                """Return the amount after years of compound interest at rate % per year."""
                return round(amount * (1 + rate / 100) ** years, 2)


            def main():
                amount = float(input("Initial amount? "))
                years = int(input("Number of years? "))
                rate = float(input("Interest rate (%)? "))
                print(f"After {years} years: {compound(amount, years, rate)}")


            if __name__ == "__main__":
                main()
          `,
          tests: [
            test("`compound(1000, 10, 5)` renvoie 1628.89", "compound(1000, 10, 5) == 1628.89 and compound(500, 3, 2) == 530.6"),
            test("`compound` renvoie sans afficher", "capture(compound, 1, 1, 1) == ''"),
            test("`compound` a une docstring", "bool(compound.__doc__)"),
            test("`main()` est appelée sous `if __name__ == \"__main__\":`", "callable(globals().get('main')) and '__main__' in SOURCE and 'After 10 years: 1628.89' in OUTPUT"),
          ],
        },
        extra: {
          title: "Le zéro d'une fonction par dichotomie",
          prompt: md`
            Écrivez la fonction \`f(x) = x³ + x + 1\`, puis \`dichotomy(a, b, eps)\` qui cherche son zéro dans
            l'intervalle [a, b] : si \`f(a)\` et \`f(b)\` sont de même signe, elle renvoie \`None\` ; sinon, tant que
            \`|a − b| > eps\`, on prend le milieu \`h\` et on garde la moitié où \`f\` change de signe. Elle renvoie
            le milieu final.

            L'expression x³ + x + 1 ne doit apparaître **qu'une seule fois** dans votre code : c'est tout l'intérêt de \`f\` !
          `,
          starter: py`
            def f(x):
                ...


            def dichotomy(a, b, eps):
                ...


            print(dichotomy(-2, 2, 0.00001))
            print(dichotomy(0, 2, 0.00001))
          `,
          solution: py`
            def f(x):
                return x**3 + x + 1


            def dichotomy(a, b, eps):
                if f(a) * f(b) >= 0:
                    return None
                while abs(a - b) > eps:
                    h = (a + b) / 2
                    if f(a) * f(h) < 0:
                        b = h
                    else:
                        a = h
                return (a + b) / 2


            print(dichotomy(-2, 2, 0.00001))
            print(dichotomy(0, 2, 0.00001))
          `,
          tests: [
            test("`f(1)` vaut 3", "f(1) == 3 and f(0) == 1"),
            test("Zéro trouvé dans [-2, 2] (≈ -0.6823)", "abs(dichotomy(-2, 2, 1e-7) + 0.6823278) < 1e-5", "dichotomy(-2, 2, 1e-7)"),
            test("Même signe aux bornes → `None`", "dichotomy(0, 2, 0.001) is None"),
            test("La précision `eps` est respectée", "abs(dichotomy(-2, 2, 0.1) + 0.6823278) < 0.1"),
            test("L'expression n'est écrite qu'une fois", "SOURCE.replace(' ', '').count('**3') == 1"),
          ],
        },
        stretch: {
          title: "Hands-on 12 avec des fonctions",
          prompt: md`
            Découpez la conjecture de Collatz en petites fonctions :

            1. \`next_value(n)\` : n / 2 si n est pair, 3n + 1 sinon ;
            2. \`sequence(n)\` : la **liste** des valeurs de n jusqu'à 1 (inclus) ;
            3. \`steps(n)\` et \`highest(n)\` : le nombre d'étapes et la plus grande valeur atteinte (réutilisez \`sequence\`) ;
            4. \`longest_below(limit)\` : le tuple \`(n, steps(n))\` du n < limit qui demande le plus d'étapes ;
            5. enfin, recopiez le programme du cours où trois fonctions \`f\`, \`g\` et \`h\` s'appellent mutuellement :
               \`f(x)\` affiche \`x\` (suivi d'une espace, \`end=" "\`), renvoie 1 si \`x == 1\`, sinon \`g(x)\` si x est pair
               (\`g\` appelle \`f(x // 2)\`) ou \`h(x)\` s'il est impair (\`h\` appelle \`f(3 * x + 1)\`).
          `,
          starter: py`
            def next_value(n):
                ...


            def sequence(n):
                ...


            def steps(n):
                ...


            def highest(n):
                ...


            def longest_below(limit):
                ...


            print(sequence(6), steps(27), highest(27), longest_below(100))
          `,
          solution: py`
            def next_value(n):
                return n // 2 if n % 2 == 0 else 3 * n + 1


            def sequence(n):
                values = [n]
                while n != 1:
                    n = next_value(n)
                    values.append(n)
                return values


            def steps(n):
                return len(sequence(n)) - 1


            def highest(n):
                return max(sequence(n))


            def longest_below(limit):
                best = 1
                for n in range(1, limit):
                    if steps(n) > steps(best):
                        best = n
                return best, steps(best)


            def f(x):
                print(x, end=" ")
                if x == 1:
                    return 1
                elif x % 2 == 0:
                    return g(x)
                else:
                    return h(x)


            def g(x):
                return f(x // 2)


            def h(x):
                return f(3 * x + 1)


            print(sequence(6), steps(27), highest(27), longest_below(100))
            f(6)
          `,
          tests: [
            test("`next_value`", "next_value(6) == 3 and next_value(3) == 10 and type(next_value(6)) is int"),
            test("`sequence(6)`", "sequence(6) == [6, 3, 10, 5, 16, 8, 4, 2, 1] and sequence(1) == [1]", "sequence(6)"),
            test("`steps(27)` = 111 et `highest(27)` = 9232", "steps(27) == 111 and highest(27) == 9232"),
            test("`longest_below(100)` = (97, 118)", "longest_below(100) == (97, 118)", "longest_below(100)"),
            test("`f`, `g`, `h` s'appellent mutuellement", "capture(f, 6) == '6 3 10 5 16 8 4 2 1 ' and f(5) == 1"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 3.2
  "m3-l2": [
    {
      id: "ex1",
      title: "Paramètres flexibles",
      tiers: {
        core: {
          title: "Valeurs par défaut",
          prompt: md`
            1. \`saluer(nom, salutation="Bonjour")\` renvoie par exemple \`"Bonjour, Ada !"\`.
            2. \`prix_ttc(prix_ht, tva=0.2)\` renvoie le prix TTC **arrondi à 2 décimales**.

            Testez des appels positionnels **et** nommés.
          `,
          hint: md`Attention au format exact : virgule après la salutation, espace avant le point d'exclamation.`,
          starter: py`
            def saluer(nom, salutation="Bonjour"):
                ...


            def prix_ttc(prix_ht, tva=0.2):
                ...


            print(saluer("Ada"))
            print(saluer("Alan", "Salut"))
            print(prix_ttc(100), prix_ttc(100, tva=0.055))
          `,
          solution: py`
            def saluer(nom, salutation="Bonjour"):
                return f"{salutation}, {nom} !"


            def prix_ttc(prix_ht, tva=0.2):
                return round(prix_ht * (1 + tva), 2)


            print(saluer("Ada"))
            print(saluer("Alan", "Salut"))
            print(prix_ttc(100), prix_ttc(100, tva=0.055))
          `,
          tests: [
            test("`saluer('Ada')` → `'Bonjour, Ada !'`", "saluer('Ada') == 'Bonjour, Ada !'", "saluer('Ada')"),
            test("`saluer('Alan', 'Salut')` → `'Salut, Alan !'`", "saluer('Alan', 'Salut') == 'Salut, Alan !'", "saluer('Alan', 'Salut')"),
            test(
              "Arguments nommés dans le désordre",
              "saluer(salutation='Hello', nom='Grace') == 'Hello, Grace !'",
              "saluer(salutation='Hello', nom='Grace')",
            ),
            test("`prix_ttc(100)` → 120.0", "prix_ttc(100) == 120.0", "prix_ttc(100)"),
            test("`prix_ttc(19.99, tva=0.055)` → 21.09", "prix_ttc(19.99, tva=0.055) == 21.09", "prix_ttc(19.99, tva=0.055)"),
          ],
        },
        extra: {
          title: "Nombre variable d'arguments",
          prompt: md`
            1. \`moyenne(*notes)\` renvoie la moyenne des arguments, ou \`None\` s'il n'y en a aucun.
            2. \`maximum(*nombres)\` renvoie le plus grand argument (ou \`None\`) **sans utiliser \`max()\`**.

            Exemples : \`moyenne(12, 15, 18)\` → \`15.0\` ; \`maximum(3, 9, 2)\` → \`9\`.
          `,
          hint: md`
            \`notes\` est un tuple : \`len(notes)\` et une boucle \`for\` fonctionnent.
            Pour le maximum, partez du premier élément \`nombres[0]\` (pattern « maximum courant »).
          `,
          starter: py`
            def moyenne(*notes):
                ...


            def maximum(*nombres):
                ...


            print(moyenne(12, 15, 18), moyenne())
            print(maximum(3, 9, 2), maximum())
          `,
          solution: py`
            def moyenne(*notes):
                if len(notes) == 0:
                    return None
                total = 0
                for note in notes:
                    total += note
                return total / len(notes)


            def maximum(*nombres):
                if not nombres:
                    return None
                plus_grand = nombres[0]
                for n in nombres:
                    if n > plus_grand:
                        plus_grand = n
                return plus_grand


            print(moyenne(12, 15, 18), moyenne())
            print(maximum(3, 9, 2), maximum())
          `,
          tests: [
            test("`moyenne(12, 15, 18)` → 15.0", "moyenne(12, 15, 18) == 15.0", "moyenne(12, 15, 18)"),
            test("`moyenne(10)` → 10.0", "moyenne(10) == 10", "moyenne(10)"),
            test("`moyenne()` → `None`", "moyenne() is None", "moyenne()"),
            test("`maximum(3, 9, 2)` → 9", "maximum(3, 9, 2) == 9", "maximum(3, 9, 2)"),
            test("`maximum(-5, -2, -9)` → -2", "maximum(-5, -2, -9) == -2", "maximum(-5, -2, -9)"),
            test("`maximum()` → `None`", "maximum() is None", "maximum()"),
            test("`max()` n'est pas utilisée", "not calls('max')"),
          ],
        },
        stretch: {
          title: "Formater un prix",
          prompt: md`
            Écrivez \`formater_prix(montant, devise="€", decimales=2, separateur=" ")\` qui renvoie le montant :

            - avec \`decimales\` chiffres après la virgule ;
            - avec \`separateur\` entre les milliers ;
            - suivi d'un espace et de la \`devise\`.

            | Appel | Résultat |
            |---|---|
            | \`formater_prix(1234567.891)\` | \`"1 234 567.89 €"\` |
            | \`formater_prix(1234.4, devise="$", decimales=0)\` | \`"1 234 $"\` |
            | \`formater_prix(5000, devise="CHF", separateur="'")\` | \`"5'000.00 CHF"\` |
          `,
          hint: md`
            Le format \`{x:,.2f}\` utilise la virgule comme séparateur de milliers : \`f"{1234.5:,.2f}"\` → \`"1,234.50"\`.
            Le nombre de décimales peut lui-même venir d'une variable : \`f"{x:,.{decimales}f}"\`.
            Il reste à remplacer les virgules par le séparateur.
          `,
          starter: py`
            def formater_prix(montant, devise="€", decimales=2, separateur=" "):
                ...


            print(formater_prix(1234567.891))
            print(formater_prix(1234.4, devise="$", decimales=0))
          `,
          solution: py`
            def formater_prix(montant, devise="€", decimales=2, separateur=" "):
                texte = f"{montant:,.{decimales}f}"
                texte = texte.replace(",", separateur)
                return f"{texte} {devise}"


            print(formater_prix(1234567.891))
            print(formater_prix(1234.4, devise="$", decimales=0))
          `,
          tests: [
            test("`formater_prix(1234567.891)`", "formater_prix(1234567.891) == '1 234 567.89 €'", "formater_prix(1234567.891)"),
            test(
              "Dollars sans décimales",
              "formater_prix(1234.4, devise='$', decimales=0) == '1 234 $'",
              "formater_prix(1234.4, devise='$', decimales=0)",
            ),
            test(
              "Francs suisses avec apostrophe",
              "formater_prix(5000, devise='CHF', separateur=\"'\") == \"5'000.00 CHF\"",
              "formater_prix(5000, devise='CHF', separateur=\"'\")",
            ),
            test("Petit montant : `formater_prix(9.5)` → `'9.50 €'`", "formater_prix(9.5) == '9.50 €'", "formater_prix(9.5)"),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Des fonctions en paramètres",
      tiers: {
        core: {
          title: "Une dichotomie générique",
          prompt: md`
            Écrivez \`dichotomy(func, a=-10, b=10, eps=0.000001)\` : la fonction étudiée est maintenant un
            **paramètre**, et l'intervalle et la précision ont des **valeurs par défaut**. Elle renvoie le zéro trouvé,
            ou \`None\` si \`func(a)\` et \`func(b)\` sont de même signe.

            Appelez-la de différentes façons : \`dichotomy(f)\`, \`dichotomy(f, -2, 2)\`, \`dichotomy(f, eps=0.001, b=2)\`,
            et avec une fonction anonyme pour trouver √2 : \`dichotomy(lambda x: x * x - 2, 0, 2)\`.
          `,
          starter: py`
            def f(x):
                return x**3 + x + 1


            def dichotomy(func, a=-10, b=10, eps=0.000001):
                ...


            print(dichotomy(f), dichotomy(f, -2, 2), dichotomy(f, eps=0.001, b=2))
            print(dichotomy(lambda x: x * x - 2, 0, 2))
          `,
          solution: py`
            def f(x):
                return x**3 + x + 1


            def dichotomy(func, a=-10, b=10, eps=0.000001):
                if func(a) * func(b) >= 0:
                    return None
                while abs(a - b) > eps:
                    h = (a + b) / 2
                    if func(a) * func(h) < 0:
                        b = h
                    else:
                        a = h
                return (a + b) / 2


            print(dichotomy(f), dichotomy(f, -2, 2), dichotomy(f, eps=0.001, b=2))
            print(dichotomy(lambda x: x * x - 2, 0, 2))
          `,
          tests: [
            test("Avec les valeurs par défaut", "abs(dichotomy(f) + 0.6823278) < 1e-5"),
            test("√2 avec une lambda", "abs(dichotomy(lambda x: x * x - 2, 0, 2) - 2 ** 0.5) < 1e-5"),
            test("Arguments nommés", "abs(dichotomy(f, eps=0.001, b=2) + 0.6823) < 0.002 and abs(dichotomy(lambda x: x - 3) - 3) < 1e-5"),
            test("Même signe → `None`", "dichotomy(lambda x: x * x + 1) is None"),
            test(
              "Les valeurs par défaut sont -10, 10 et 0.000001",
              "[p.default for p in __import__('inspect').signature(dichotomy).parameters.values()][1:] == [-10, 10, 0.000001]",
            ),
          ],
        },
        extra: {
          title: "Afficher le code et compter les appels",
          prompt: md`
            La fonction \`dichotomy(func, a, b, eps)\` est fournie.

            1. \`source_of(func)\` renvoie le **code source** de \`func\` (\`inspect.getsource\`), sans les espaces de début et de fin.
            2. \`report(func, a, b)\` renvoie par exemple \`"zero of f in [-2, 2]: -0.6823"\` (nom de la fonction avec
               \`func.__name__\`, zéro calculé avec \`eps=1e-6\` et affiché avec 4 décimales).
            3. Comme dans le cours, comptez les évaluations de la fonction avec une variable **globale** : \`f_count(x)\`
               ajoute 1 à \`count\` (mot-clé \`global\`) puis renvoie x³ + x + 1. \`evaluations(eps)\` remet \`count\` à 0,
               lance \`dichotomy(f_count, -2, 2, eps)\` et renvoie le nombre d'appels.
          `,
          starter: py`
            import inspect


            def dichotomy(func, a, b, eps):
                while abs(a - b) > eps:
                    h = (a + b) / 2
                    if func(a) * func(h) < 0:
                        b = h
                    else:
                        a = h
                return (a + b) / 2


            def f(x):
                return x**3 + x + 1


            def source_of(func):
                ...


            def report(func, a, b):
                ...


            count = 0


            def f_count(x):
                ...


            def evaluations(eps):
                ...


            print(source_of(f))
            print(report(f, -2, 2))
            print(evaluations(0.001), evaluations(1e-9))
          `,
          solution: py`
            import inspect


            def dichotomy(func, a, b, eps):
                while abs(a - b) > eps:
                    h = (a + b) / 2
                    if func(a) * func(h) < 0:
                        b = h
                    else:
                        a = h
                return (a + b) / 2


            def f(x):
                return x**3 + x + 1


            def source_of(func):
                return inspect.getsource(func).strip()


            def report(func, a, b):
                zero = dichotomy(func, a, b, 1e-6)
                return f"zero of {func.__name__} in [{a}, {b}]: {zero:.4f}"


            count = 0


            def f_count(x):
                global count
                count += 1
                return x**3 + x + 1


            def evaluations(eps):
                global count
                count = 0
                dichotomy(f_count, -2, 2, eps)
                return count


            print(source_of(f))
            print(report(f, -2, 2))
            print(evaluations(0.001), evaluations(1e-9))
          `,
          tests: [
            test("`source_of(f)` renvoie le code de `f`", "source_of(f).startswith('def f(x):') and 'return x**3 + x + 1' in source_of(f)", "source_of(f)"),
            test("`report(f, -2, 2)`", "report(f, -2, 2) == 'zero of f in [-2, 2]: -0.6823'", "report(f, -2, 2)"),
            test("`report` utilise le nom de la fonction", "(lambda carre_moins_deux: report(carre_moins_deux, 0, 2))(lambda x: x * x - 2).startswith('zero of <lambda> in [0, 2]: 1.4142')"),
            test("`evaluations` : plus de précision = plus d'appels", "evaluations(0.001) == 24 and evaluations(1e-9) == 64", "(evaluations(0.001), evaluations(1e-9))"),
            test("Le mot-clé `global` est utilisé", "uses('Global')"),
          ],
        },
        stretch: {
          title: "Newton contre dichotomie",
          prompt: md`
            La **méthode de Newton** trouve aussi un zéro, en suivant la tangente : x ← x − f(x) / f'(x).

            1. \`newton(func, dfunc, x0, eps=1e-12, max_iter=100)\` part de \`x0\` et itère jusqu'à ce que
               \`|func(x)| < eps\` ; elle renvoie le tuple \`(x, nombre d'itérations)\`. Si la dérivée s'annule, elle lève
               \`ValueError\` ; si \`max_iter\` itérations ne suffisent pas, elle lève aussi \`ValueError\`.
            2. \`bisection(func, a, b, eps=1e-12)\` : la dichotomie, qui renvoie elle aussi \`(x, nombre d'itérations)\`.
            3. Comparez sur x³ + x + 1 (dérivée 3x² + 1) : rangez dans \`newton_iterations\` et \`bisection_iterations\`
               les nombres d'itérations obtenus avec \`newton(f, df, 0)\` et \`bisection(f, -2, 2)\`.
          `,
          starter: py`
            def f(x):
                return x**3 + x + 1


            def df(x):
                return 3 * x**2 + 1


            def newton(func, dfunc, x0, eps=1e-12, max_iter=100):
                ...


            def bisection(func, a, b, eps=1e-12):
                ...


            newton_iterations = ...
            bisection_iterations = ...
            print(newton(f, df, 0), bisection(f, -2, 2))
          `,
          solution: py`
            def f(x):
                return x**3 + x + 1


            def df(x):
                return 3 * x**2 + 1


            def newton(func, dfunc, x0, eps=1e-12, max_iter=100):
                x = x0
                for iteration in range(max_iter):
                    if abs(func(x)) < eps:
                        return x, iteration
                    slope = dfunc(x)
                    if slope == 0:
                        raise ValueError("zero derivative")
                    x = x - func(x) / slope
                raise ValueError("no convergence")


            def bisection(func, a, b, eps=1e-12):
                iterations = 0
                while abs(a - b) > eps:
                    h = (a + b) / 2
                    if func(a) * func(h) < 0:
                        b = h
                    else:
                        a = h
                    iterations += 1
                return (a + b) / 2, iterations


            newton_iterations = newton(f, df, 0)[1]
            bisection_iterations = bisection(f, -2, 2)[1]
            print(newton(f, df, 0), bisection(f, -2, 2))
          `,
          explanation: md`
            La dichotomie divise l'erreur par 2 à chaque étape (convergence **linéaire**) ; Newton **double** à peu près
            le nombre de chiffres exacts à chaque itération (convergence **quadratique**)… mais il a besoin de la dérivée
            et d'un bon point de départ.
          `,
          tests: [
            test("Newton trouve le zéro de x³ + x + 1", "abs(newton(f, df, 0)[0] + 0.6823278038) < 1e-9"),
            test("√2 par Newton", "abs(newton(lambda x: x * x - 2, lambda x: 2 * x, 1)[0] - 2 ** 0.5) < 1e-10"),
            test("Dérivée nulle → `ValueError`", "raises(ValueError, newton, lambda x: x * x + 1, lambda x: 2 * x, 0)"),
            test("`bisection` renvoie le zéro et le nombre d'itérations", "abs(bisection(f, -2, 2)[0] + 0.6823278038) < 1e-9 and bisection(f, -2, 2)[1] == 42"),
            test("Newton est beaucoup plus rapide", "newton_iterations <= 8 and bisection_iterations > 30", "(newton_iterations, bisection_iterations)"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 3.3
  "m3-l3": [
    {
      id: "ex1",
      title: "Maîtriser la portée",
      tiers: {
        core: {
          title: "Réparer un compteur",
          prompt: md`
            Exécutez le code de départ : il plante avec une \`UnboundLocalError\`. Pourquoi ?

            Corrigez-le **sans utiliser \`global\`** : la fonction \`incrementer\` doit recevoir la valeur
            en paramètre et **renvoyer** la valeur augmentée de 1. Le programme principal l'appelle trois fois,
            puis affiche \`compteur = 3\`.
          `,
          hint: md`
            Signature attendue : \`def incrementer(valeur):\`. Côté appel : \`compteur = incrementer(compteur)\`.
          `,
          starter: py`
            compteur = 0

            def incrementer():
                compteur = compteur + 1

            incrementer()
            incrementer()
            incrementer()
            print("compteur =", compteur)
          `,
          solution: py`
            compteur = 0

            def incrementer(valeur):
                return valeur + 1

            compteur = incrementer(compteur)
            compteur = incrementer(compteur)
            compteur = incrementer(compteur)
            print("compteur =", compteur)
          `,
          explanation: md`
            Dans la version d'origine, l'affectation \`compteur = ...\` rend \`compteur\` **locale** à toute la fonction :
            Python cherche donc à lire une variable locale qui n'a pas encore de valeur.
            La version corrigée est une **fonction pure** : même entrée, même sortie, sans effet de bord.
          `,
          tests: [
            test("Affiche `compteur = 3`", "'compteur = 3' in OUTPUT and compteur == 3", "compteur"),
            test("`incrementer(10)` renvoie 11", "incrementer(10) == 11", "incrementer(10)"),
            test("Le mot-clé `global` n'est pas utilisé", "not uses('Global')"),
          ],
        },
        extra: {
          title: "Prédire avant d'exécuter",
          prompt: md`
            Lisez attentivement le code **sans l'exécuter**. Remplacez chaque \`...\` par votre **prédiction** (un nombre),
            puis exécutez pour vérifier : le programme affiche les vraies valeurs à la fin.

            Ne trichez pas : c'est l'exercice idéal pour vérifier que vous avez compris la règle LEGB.
          `,
          hint: md`
            Une affectation dans une fonction crée une variable **locale**. Un paramètre est local.
            Seule une fonction qui déclare \`global x\` peut modifier le \`x\` global.
          `,
          starter: py`
            x = 10

            def f():
                x = 5
                return x

            def g():
                return x

            def h(x):
                x = x * 2
                return x

            def k():
                global x
                x = 99

            # Vos prédictions (des nombres) :
            p1 = ...   # valeur renvoyée par f()
            p2 = ...   # valeur de x après l'appel f()
            p3 = ...   # valeur renvoyée par g()
            p4 = ...   # valeur renvoyée par h(7)
            p5 = ...   # valeur de x après l'appel h(x)
            p6 = ...   # valeur de x après l'appel k()

            # Vérification :
            print("p1 :", f())
            print("p2 :", x)
            print("p3 :", g())
            print("p4 :", h(7))
            h(x)
            print("p5 :", x)
            k()
            print("p6 :", x)
          `,
          solution: py`
            x = 10

            def f():
                x = 5
                return x

            def g():
                return x

            def h(x):
                x = x * 2
                return x

            def k():
                global x
                x = 99

            p1 = 5    # x local à f
            p2 = 10   # le x global n'a pas changé
            p3 = 10   # g lit le x global
            p4 = 14   # le paramètre x vaut 7
            p5 = 10   # h modifie son paramètre local, pas la globale
            p6 = 99   # k déclare global x : la globale est modifiée

            print("p1 :", f())
            print("p2 :", x)
            print("p3 :", g())
            print("p4 :", h(7))
            h(x)
            print("p5 :", x)
            k()
            print("p6 :", x)
          `,
          tests: [
            test("p1 : valeur renvoyée par `f()`", "p1 == 5", "p1"),
            test("p2 : `x` après `f()`", "p2 == 10", "p2"),
            test("p3 : valeur renvoyée par `g()`", "p3 == 10", "p3"),
            test("p4 : valeur renvoyée par `h(7)`", "p4 == 14", "p4"),
            test("p5 : `x` après `h(x)`", "p5 == 10", "p5"),
            test("p6 : `x` après `k()`", "p6 == 99", "p6"),
          ],
        },
        stretch: {
          title: "Un compteur avec fermeture",
          prompt: md`
            Écrivez \`creer_compteur(depart=0, pas=1)\` qui **renvoie une fonction**. Chaque appel de cette
            fonction augmente un compteur interne de \`pas\` et renvoie la nouvelle valeur :

            \`\`\`python
            c = creer_compteur()
            c(), c(), c()            # 1, 2, 3
            d = creer_compteur(10, 5)
            d(), d()                 # 15, 20 (indépendant de c)
            \`\`\`

            Interdit d'utiliser \`global\` : chaque compteur doit avoir son propre état.
          `,
          hint: md`
            Définissez une fonction \`suivant()\` **à l'intérieur** de \`creer_compteur\`, déclarez
            \`nonlocal valeur\` pour pouvoir modifier la variable englobante, puis \`return suivant\` (sans parenthèses).
          `,
          starter: py`
            def creer_compteur(depart=0, pas=1):
                ...


            c = creer_compteur()
            print(c(), c(), c())
          `,
          solution: py`
            def creer_compteur(depart=0, pas=1):
                valeur = depart

                def suivant():
                    nonlocal valeur
                    valeur += pas
                    return valeur

                return suivant


            c = creer_compteur()
            print(c(), c(), c())
          `,
          explanation: md`
            \`suivant\` « capture » la variable \`valeur\` de \`creer_compteur\` : c'est une **fermeture** (*closure*).
            Chaque appel à \`creer_compteur\` crée une nouvelle variable \`valeur\`, d'où des compteurs indépendants.
          `,
          tests: [
            test("`creer_compteur()` renvoie une fonction", "callable(creer_compteur())"),
            test("Appels successifs : 1, 2, 3", "(lambda c: [c(), c(), c()])(creer_compteur()) == [1, 2, 3]"),
            test("Deux compteurs sont indépendants", "(lambda a, b: [a(), a(), b()])(creer_compteur(), creer_compteur()) == [1, 2, 1]"),
            test("`creer_compteur(10, 5)` : 15 puis 20", "(lambda d: [d(), d()])(creer_compteur(10, 5)) == [15, 20]"),
            test("`nonlocal` est utilisé, pas `global`", "uses('Nonlocal') and not uses('Global')"),
          ],
        },
      },
    },
  ],
};
