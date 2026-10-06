import { md, py, test } from "../helpers.js";

const TEMPERATURES = py`
  temperatures = np.array([
      29.3, 42.1, 18.8, 16.1, 38.0, 12.5,
      12.6, 49.9, 38.6, 31.3, 9.2, 22.2,
  ])
`;

const TABLE = py`
  table = np.array([
      [5, 3, 7, 1],
      [2, 6, 7, 9],
      [1, 1, 1, 1],
      [4, 3, 2, 0],
  ])
`;

const ORDERS = py`
  prices = np.array([2.95, 4.95, 1.95, 12.95])
  quantities = np.array([3, 1, 0, 2])
  orders = np.array([
      [3, 0, 0, 2],
      [10, 3, 4, 8],
      [19, 0, 1, 1],
  ])
`;

const WEEK = py`
  cities = ["Paris", "Lyon", "Marseille", "Lille"]
  temps = np.array([
      [24, 27, 31, 33, 29, 25, 22],
      [26, 30, 32, 34, 31, 28, 27],
      [29, 31, 33, 35, 34, 32, 30],
      [19, 21, 23, 26, 22, 20, 18],
  ])
  next_week = np.array([
      [21, 23, 25, 28, 30, 31, 27],
      [25, 27, 29, 31, 30, 26, 24],
      [28, 30, 31, 33, 32, 31, 29],
      [17, 18, 20, 22, 21, 19, 17],
  ])
`;

const HEROES = py`
  heroes = np.array([
      ("joe", 32, 6),
      ("mary", 15, 20),
      ("felipe", 80, 100),
      ("beyonce", 38, 9001),
      ("ada", 36, 9500),
      ("alan", 41, 7000),
  ], dtype=[("name", "U10"), ("age", int), ("power", int)])
`;

export default {
  // ---------------------------------------------------------------- 8.1
  "m8-l1": [
    {
      id: "ex1",
      title: "Créer et façonner des tableaux",
      tiers: {
        core: {
          title: "Premiers tableaux",
          prompt: md`
            Créez avec NumPy :

            1. \`a\` : les entiers de 1 à 8 avec \`np.arange\` ;
            2. \`m\` : \`a\` réorganisé en **2 lignes et 4 colonnes** ;
            3. \`z\` : un tableau de zéros de forme \`(3, 3)\` ;
            4. \`lin\` : 5 valeurs régulièrement espacées de 0 à 1 inclus ;
            5. \`info\` : le tuple \`(m.ndim, m.shape, m.size)\` ;
            6. \`cube\` : le tableau \`temperatures\` (12 valeurs) réorganisé en forme \`(2, 2, 3)\`.
          `,
          hint: md`
            \`np.arange(début, fin)\` exclut la fin, comme \`range\`. \`np.linspace(début, fin, nombre)\` inclut la fin.
          `,
          starter: py`
            import numpy as np

            ${TEMPERATURES}

            a = ...
            m = ...
            z = ...
            lin = ...
            info = ...
            cube = ...

            print(a, m, z, lin, info, cube, sep="\n")
          `,
          solution: py`
            import numpy as np

            ${TEMPERATURES}

            a = np.arange(1, 9)
            m = a.reshape(2, 4)
            z = np.zeros((3, 3))
            lin = np.linspace(0, 1, 5)
            info = (m.ndim, m.shape, m.size)
            cube = temperatures.reshape(2, 2, 3)

            print(a, m, z, lin, info, cube, sep="\n")
          `,
          tests: [
            test("`a` contient 1, 2, …, 8", "isinstance(a, np.ndarray) and a.tolist() == list(range(1, 9))", "a"),
            test("`m` a la forme (2, 4)", "isinstance(m, np.ndarray) and m.shape == (2, 4) and m[1, 0] == 5", "getattr(m, 'shape', m)"),
            test("`z` : zéros de forme (3, 3)", "isinstance(z, np.ndarray) and z.shape == (3, 3) and not z.any()"),
            test("`lin` vaut [0, 0.25, 0.5, 0.75, 1]", "isinstance(lin, np.ndarray) and np.allclose(lin, [0, 0.25, 0.5, 0.75, 1])", "lin"),
            test("`info` vaut `(2, (2, 4), 8)`", "info == (2, (2, 4), 8)", "info"),
            test("`cube` a la forme (2, 2, 3)", "isinstance(cube, np.ndarray) and cube.shape == (2, 2, 3) and cube[1, 0, 1] == 49.9", "getattr(cube, 'shape', cube)"),
          ],
        },
        extra: {
          title: "Liste ou tableau ?",
          prompt: md`
            1. \`doubled_list\` : \`my_list * 2\` ; \`doubled_array\` : \`arr * 2\`. Comparez !
            2. \`squares\` : le carré de chaque élément de \`arr\`, **sans boucle**.
            3. \`mixed_type\` : le \`dtype\` de \`np.array([1, 2.5, 3])\`.
            4. \`swapped_shape\` : la forme de \`np.arange(24).reshape(2, 3, 4)\` après échange des axes 0 et 2
               (\`np.swapaxes\`).
            5. \`flat\` : la **transposée** de \`np.arange(6).reshape(2, 3)\`, remise à plat en une dimension
               (\`.T\` puis \`.flatten()\`).
          `,
          starter: py`
            import numpy as np

            my_list = [1, 2, 3]
            arr = np.array(my_list)

            doubled_list = ...
            doubled_array = ...
            squares = ...
            mixed_type = ...
            swapped_shape = ...
            flat = ...

            print(doubled_list, doubled_array, squares, mixed_type, swapped_shape, flat)
          `,
          solution: py`
            import numpy as np

            my_list = [1, 2, 3]
            arr = np.array(my_list)

            doubled_list = my_list * 2          # répétition de la liste
            doubled_array = arr * 2             # calcul élément par élément
            squares = arr ** 2
            mixed_type = np.array([1, 2.5, 3]).dtype
            swapped_shape = np.swapaxes(np.arange(24).reshape(2, 3, 4), 0, 2).shape
            flat = np.arange(6).reshape(2, 3).T.flatten()

            print(doubled_list, doubled_array, squares, mixed_type, swapped_shape, flat)
          `,
          tests: [
            test("`doubled_list` répète la liste", "doubled_list == [1, 2, 3, 1, 2, 3]", "doubled_list"),
            test("`doubled_array` double chaque élément", "isinstance(doubled_array, np.ndarray) and doubled_array.tolist() == [2, 4, 6]", "doubled_array"),
            test("`squares` vaut [1, 4, 9] sans boucle", "isinstance(squares, np.ndarray) and squares.tolist() == [1, 4, 9] and not uses('For')", "squares"),
            test("`mixed_type` est `float64`", "str(mixed_type) == 'float64'", "mixed_type"),
            test("`swapped_shape` vaut (4, 3, 2)", "swapped_shape == (4, 3, 2)", "swapped_shape"),
            test("`flat` vaut [0, 3, 1, 4, 2, 5]", "isinstance(flat, np.ndarray) and flat.tolist() == [0, 3, 1, 4, 2, 5]", "flat"),
          ],
        },
        stretch: {
          title: "Décrire et remodeler",
          prompt: md`
            1. \`describe(arr)\` renvoie un dictionnaire \`{"ndim": …, "shape": …, "size": …, "dtype": …}\`
               (le dtype sous forme de **chaîne**, par exemple \`"int64"\`).
            2. \`reshape_rows(arr, rows)\` renvoie \`arr\` réorganisé en \`rows\` lignes (le nombre de colonnes
               est calculé grâce à \`-1\`), ou \`None\` si c'est impossible (au lieu de lever une erreur).
            3. \`build()\` renvoie un tuple de trois tableaux : la matrice identité 3 × 3 **d'entiers**, un
               tableau \`(2, 3)\` rempli de 7, et le « cube » \`np.arange(24).reshape(2, 3, 4)\` **transposé** (\`.T\`).
          `,
          hint: md`
            Un remodelage en \`rows\` lignes est possible si \`arr.size\` est divisible par \`rows\`.
            \`np.eye(3, dtype=int)\`, \`np.full((2, 3), 7)\`.
          `,
          starter: py`
            import numpy as np


            def describe(arr):
                ...


            def reshape_rows(arr, rows):
                ...


            def build():
                ...


            print(describe(np.arange(12).reshape(3, 4)))
            print(reshape_rows(np.arange(12), 4))
            print(reshape_rows(np.arange(12), 5))
            eye, sevens, cube_t = build()
            print(eye, sevens, cube_t.shape, sep="\n")
          `,
          solution: py`
            import numpy as np


            def describe(arr):
                return {"ndim": arr.ndim, "shape": arr.shape, "size": arr.size, "dtype": str(arr.dtype)}


            def reshape_rows(arr, rows):
                if rows <= 0 or arr.size % rows != 0:
                    return None
                return arr.reshape(rows, -1)


            def build():
                eye = np.eye(3, dtype=int)
                sevens = np.full((2, 3), 7)
                cube_t = np.arange(24).reshape(2, 3, 4).T
                return eye, sevens, cube_t


            print(describe(np.arange(12).reshape(3, 4)))
            print(reshape_rows(np.arange(12), 4))
            print(reshape_rows(np.arange(12), 5))
            eye, sevens, cube_t = build()
            print(eye, sevens, cube_t.shape, sep="\n")
          `,
          tests: [
            test(
              "`describe` décrit un tableau 2D d'entiers",
              "describe(np.arange(12).reshape(3, 4)) == {'ndim': 2, 'shape': (3, 4), 'size': 12, 'dtype': str(np.arange(1).dtype)}",
              "describe(np.arange(12).reshape(3, 4))",
            ),
            test("`describe` fonctionne avec des flottants", "describe(np.zeros(5))['dtype'] == 'float64' and describe(np.zeros(5))['shape'] == (5,)"),
            test("`reshape_rows(np.arange(12), 4)` a la forme (4, 3)", "reshape_rows(np.arange(12), 4).shape == (4, 3)"),
            test("Remodelage impossible → `None`", "reshape_rows(np.arange(12), 5) is None"),
            test(
              "`build()` renvoie identité entière, tableau de 7 et cube transposé",
              "(lambda e, s, c: e.tolist() == [[1, 0, 0], [0, 1, 0], [0, 0, 1]] and e.dtype.kind == 'i' and s.shape == (2, 3) and (s == 7).all() and c.shape == (4, 3, 2) and c[3, 2, 1] == 23)(*build())",
            ),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 8.2
  "m8-l2": [
    {
      id: "ex1",
      title: "Axes et indexation",
      tiers: {
        core: {
          title: "Le tableau du cours",
          prompt: md`
            À partir de \`table\` (le tableau 4 × 4 de la leçon), calculez **sans boucle** :

            - \`overall_max\` : le maximum de tout le tableau ;
            - \`col_max\` et \`row_max\` : le maximum de chaque colonne / de chaque ligne ;
            - \`row_sums\` : la somme de chaque ligne ;
            - \`second_row\` : la ligne d'indice 1, \`third_col\` : la colonne d'indice 2 ;
            - \`corner\` : le bloc 2 × 2 en bas à droite ;
            - \`value\` : l'élément ligne 1, colonne 3.
          `,
          starter: py`
            import numpy as np

            ${TABLE}

            overall_max = ...
            col_max = ...
            row_max = ...
            row_sums = ...
            second_row = ...
            third_col = ...
            corner = ...
            value = ...

            print(overall_max, col_max, row_max, row_sums, second_row, third_col, corner, value, sep="\n")
          `,
          solution: py`
            import numpy as np

            ${TABLE}

            overall_max = table.max()
            col_max = table.max(axis=0)
            row_max = table.max(axis=1)
            row_sums = table.sum(axis=1)
            second_row = table[1]
            third_col = table[:, 2]
            corner = table[2:, 2:]
            value = table[1, 3]

            print(overall_max, col_max, row_max, row_sums, second_row, third_col, corner, value, sep="\n")
          `,
          tests: [
            test("`overall_max` vaut 9", "overall_max == 9", "overall_max"),
            test("`col_max` vaut [5, 6, 7, 9] et `row_max` [7, 9, 1, 4]", "np.array_equal(col_max, [5, 6, 7, 9]) and np.array_equal(row_max, [7, 9, 1, 4])", "(col_max, row_max)"),
            test("`row_sums` vaut [16, 24, 4, 9]", "np.array_equal(row_sums, [16, 24, 4, 9])", "row_sums"),
            test("`second_row` et `third_col`", "np.array_equal(second_row, [2, 6, 7, 9]) and np.array_equal(third_col, [7, 7, 1, 2])", "(second_row, third_col)"),
            test("`corner` vaut [[1, 1], [2, 0]]", "np.array_equal(corner, [[1, 1], [2, 0]])", "corner"),
            test("`value` vaut 9, et aucune boucle", "value == 9 and not uses('For') and not uses('ListComp')", "value"),
          ],
        },
        extra: {
          title: "Carré magique",
          prompt: md`
            Un carré est **magique** si toutes ses lignes, toutes ses colonnes et ses **deux** diagonales ont la
            même somme. Écrivez \`is_magic(square)\` qui renvoie \`True\` ou \`False\` (un tableau non carré
            n'est pas magique).

            Testez-la sur le carré de Dürer (\`durer\`, somme 34), le carré de Lo Shu (\`lo_shu\`, somme 15)
            et un carré ordinaire.
          `,
          hint: md`
            Les sommes des lignes : \`square.sum(axis=1)\`, des colonnes : \`square.sum(axis=0)\`.
            Diagonales : \`np.trace(square)\` et \`np.trace(np.fliplr(square))\`. Pour vérifier que toutes
            les valeurs d'un tableau valent \`target\` : \`(valeurs == target).all()\`.
          `,
          starter: py`
            import numpy as np

            durer = np.array([
                [16, 3, 2, 13],
                [5, 10, 11, 8],
                [9, 6, 7, 12],
                [4, 15, 14, 1],
            ])
            lo_shu = np.array([[2, 7, 6], [9, 5, 1], [4, 3, 8]])


            def is_magic(square):
                ...


            print(is_magic(durer), is_magic(lo_shu), is_magic(np.arange(9).reshape(3, 3)))
          `,
          solution: py`
            import numpy as np

            durer = np.array([
                [16, 3, 2, 13],
                [5, 10, 11, 8],
                [9, 6, 7, 12],
                [4, 15, 14, 1],
            ])
            lo_shu = np.array([[2, 7, 6], [9, 5, 1], [4, 3, 8]])


            def is_magic(square):
                if square.ndim != 2 or square.shape[0] != square.shape[1]:
                    return False
                target = square[0].sum()
                rows_ok = (square.sum(axis=1) == target).all()
                cols_ok = (square.sum(axis=0) == target).all()
                diags_ok = np.trace(square) == target and np.trace(np.fliplr(square)) == target
                return bool(rows_ok and cols_ok and diags_ok)


            print(is_magic(durer), is_magic(lo_shu), is_magic(np.arange(9).reshape(3, 3)))
          `,
          tests: [
            test("Le carré de Dürer est magique", "is_magic(durer) == True"),
            test("Le carré de Lo Shu est magique", "is_magic(lo_shu) == True"),
            test("Un carré ordinaire ne l'est pas", "is_magic(np.arange(9).reshape(3, 3)) == False and is_magic(np.ones((2, 2))) == True"),
            test(
              "Lignes et colonnes OK mais diagonale fausse → `False`",
              "is_magic(np.array([[1, 2, 3], [2, 3, 1], [3, 1, 2]])) == False",
            ),
            test("Un tableau non carré n'est pas magique", "is_magic(np.ones((2, 3))) == False"),
          ],
        },
        stretch: {
          title: "Vues, copies et classement",
          prompt: md`
            \`grades\` contient les notes (sur 20) de 4 étudiants (lignes) à 3 examens (colonnes).

            1. \`with_bonus(grades, exam, bonus)\` renvoie un **nouveau** tableau où l'examen \`exam\` (une colonne)
               reçoit \`bonus\` points, sans dépasser 20 ; le tableau d'origine ne doit **pas** être modifié.
            2. \`best_student(grades, names)\` renvoie le nom de l'étudiant de meilleure moyenne.
            3. \`hardest_exam(grades)\` renvoie l'indice de l'examen de plus faible moyenne.
            4. \`passed_all(grades, names)\` renvoie la liste des noms des étudiants ayant au moins 10 à **tous** les examens.
          `,
          hint: md`
            Une tranche est une **vue** : faites \`result = grades.copy()\` avant de modifier. \`np.minimum(a, 20)\`
            plafonne à 20. \`argmax\` / \`argmin\` avec \`axis\`, et \`(grades >= 10).all(axis=1)\` pour le point 4.
          `,
          starter: py`
            import numpy as np

            names = ["Ada", "Alan", "Grace", "Linus"]
            grades = np.array([
                [15.0, 12.5, 18.0],
                [9.0, 14.0, 11.5],
                [17.5, 16.0, 13.0],
                [12.0, 8.5, 10.0],
            ])


            def with_bonus(grades, exam, bonus):
                ...


            def best_student(grades, names):
                ...


            def hardest_exam(grades):
                ...


            def passed_all(grades, names):
                ...


            print(with_bonus(grades, 2, 3))
            print(best_student(grades, names), hardest_exam(grades), passed_all(grades, names))
          `,
          solution: py`
            import numpy as np

            names = ["Ada", "Alan", "Grace", "Linus"]
            grades = np.array([
                [15.0, 12.5, 18.0],
                [9.0, 14.0, 11.5],
                [17.5, 16.0, 13.0],
                [12.0, 8.5, 10.0],
            ])


            def with_bonus(grades, exam, bonus):
                result = grades.copy()
                result[:, exam] = np.minimum(result[:, exam] + bonus, 20)
                return result


            def best_student(grades, names):
                return names[grades.mean(axis=1).argmax()]


            def hardest_exam(grades):
                return int(grades.mean(axis=0).argmin())


            def passed_all(grades, names):
                ok = (grades >= 10).all(axis=1)
                return [name for name, passed in zip(names, ok) if passed]


            print(with_bonus(grades, 2, 3))
            print(best_student(grades, names), hardest_exam(grades), passed_all(grades, names))
          `,
          tests: [
            test(
              "`with_bonus` ajoute le bonus à la bonne colonne en plafonnant à 20",
              "np.array_equal(with_bonus(grades, 2, 3)[:, 2], [20, 14.5, 16, 13]) and np.array_equal(with_bonus(grades, 2, 3)[:, 0], grades[:, 0])",
              "with_bonus(grades, 2, 3)",
            ),
            test("`with_bonus` ne modifie pas `grades`", "(lambda g: (with_bonus(g, 0, 5), g[0, 0])[1])(grades.copy()) == 15.0 and grades[0, 2] == 18.0"),
            test("`best_student` → Grace", "best_student(grades, names) == 'Grace'", "best_student(grades, names)"),
            test("`hardest_exam` → 1 (même avec d'autres notes)", "hardest_exam(grades) == 1 and hardest_exam(np.array([[1.0, 5, 5], [2, 6, 6]])) == 0", "hardest_exam(grades)"),
            test("`passed_all` → Ada et Grace", "passed_all(grades, names) == ['Ada', 'Grace']", "passed_all(grades, names)"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 8.3
  "m8-l3": [
    {
      id: "ex1",
      title: "Calcul vectorisé et broadcasting",
      tiers: {
        core: {
          title: "Prix et commandes",
          prompt: md`
            *Hands-on du cours.* À partir de \`prices\`, \`quantities\` et \`orders\` (une ligne par commande de
            la journée, une colonne par produit), calculez **sans aucune boucle** :

            - \`total\` : le prix total de \`quantities\` ;
            - \`sold_per_product\` : la quantité vendue de chaque produit sur la journée ;
            - \`value_per_product\` : le montant vendu de chaque produit ;
            - \`total_per_order\` : le montant de chaque commande.
          `,
          starter: py`
            import numpy as np

            ${ORDERS}

            total = ...
            sold_per_product = ...
            value_per_product = ...
            total_per_order = ...

            print(total, sold_per_product, value_per_product, total_per_order, sep="\n")
          `,
          solution: py`
            import numpy as np

            ${ORDERS}

            total = prices @ quantities
            sold_per_product = orders.sum(axis=0)
            value_per_product = sold_per_product * prices
            total_per_order = orders @ prices

            print(total, sold_per_product, value_per_product, total_per_order, sep="\n")
          `,
          tests: [
            test("`total` vaut 39.70", "approx(float(total), 39.7)", "total"),
            test("`sold_per_product` vaut [32, 3, 5, 11]", "np.array_equal(sold_per_product, [32, 3, 5, 11])", "sold_per_product"),
            test("`value_per_product`", "np.allclose(value_per_product, [94.4, 14.85, 9.75, 142.45])", "value_per_product"),
            test("`total_per_order`", "np.allclose(total_per_order, [34.75, 155.75, 70.95])", "total_per_order"),
            test("Aucune boucle Python", "not uses('For') and not uses('ListComp') and not uses('GeneratorExp')"),
          ],
        },
        extra: {
          title: "Recentrer les notes",
          prompt: md`
            *Hands-on « Curve Centering ».* L'examen était trop difficile : on veut **recentrer** les notes
            (sur 100) autour d'une moyenne cible \`center\` (80 par défaut). On calcule l'écart entre \`center\`
            et la moyenne des notes, puis on l'ajoute à **chaque** note, **sans dépasser 100**.

            Écrivez \`curve(grades, center=80)\` qui renvoie un **nouveau** tableau, sans boucle.
          `,
          hint: md`Le décalage est un simple nombre : le broadcasting l'ajoute à tout le tableau. \`np.minimum(…, 100)\` ou \`np.clip\`.`,
          starter: py`
            import numpy as np

            grades = np.array([72, 35, 64, 88, 51, 90, 74, 55])


            def curve(grades, center=80):
                ...


            curved = curve(grades)
            print(grades.mean(), curved, curved.mean())
          `,
          solution: py`
            import numpy as np

            grades = np.array([72, 35, 64, 88, 51, 90, 74, 55])


            def curve(grades, center=80):
                shift = center - grades.mean()
                return np.minimum(grades + shift, 100)


            curved = curve(grades)
            print(grades.mean(), curved, curved.mean())
          `,
          tests: [
            test("Aucune note ne dépasse 100", "curve(grades).max() <= 100 and curve(grades).max() == 100", "curve(grades)"),
            test("Le décalage est appliqué à chaque note", "np.allclose(curve(grades), np.minimum(grades + (80 - grades.mean()), 100))", "curve(grades)"),
            test("Sans plafond, la moyenne devient `center`", "approx(curve(np.array([40.0, 50, 60]), 70).mean(), 70)"),
            test("Les notes d'origine ne sont pas modifiées", "grades.tolist() == [72, 35, 64, 88, 51, 90, 74, 55]"),
            test("`curve` ne contient aucune boucle", "not has_loop(curve)"),
          ],
        },
        stretch: {
          title: "Le broadcasting en action",
          prompt: md`
            Sans aucune boucle (ni compréhension) dans vos fonctions :

            1. \`mult_table(n)\` : la table de multiplication \`(n, n)\` de 1 à \`n\` (\`table[i, j] = (i+1)(j+1)\`) ;
            2. \`distance_matrix(points)\` : pour un tableau \`(n, 2)\` de points, la matrice \`(n, n)\` des distances
               euclidiennes entre tous les couples ;
            3. \`nearest_neighbor(points)\` : pour chaque point, l'indice du point **le plus proche autre que lui-même**.
          `,
          hint: md`
            \`points[:, np.newaxis, :] - points[np.newaxis, :, :]\` a la forme \`(n, n, 2)\` : toutes les différences
            d'un coup. Ensuite \`np.sqrt((diff ** 2).sum(axis=-1))\`. Pour ignorer la distance d'un point à lui-même,
            ajoutez \`np.diag(np.full(n, np.inf))\` (ou utilisez \`np.fill_diagonal\` sur une copie) avant \`argmin(axis=1)\`.
          `,
          starter: py`
            import numpy as np


            def mult_table(n):
                ...


            def distance_matrix(points):
                ...


            def nearest_neighbor(points):
                ...


            pts = np.array([[0, 0], [3, 4], [1, 0], [10, 10]])
            print(mult_table(4))
            print(distance_matrix(pts).round(2))
            print(nearest_neighbor(pts))
          `,
          solution: py`
            import numpy as np


            def mult_table(n):
                values = np.arange(1, n + 1)
                return values[:, np.newaxis] * values


            def distance_matrix(points):
                diff = points[:, np.newaxis, :] - points[np.newaxis, :, :]
                return np.sqrt((diff ** 2).sum(axis=-1))


            def nearest_neighbor(points):
                distances = distance_matrix(points) + np.diag(np.full(len(points), np.inf))
                return distances.argmin(axis=1)


            pts = np.array([[0, 0], [3, 4], [1, 0], [10, 10]])
            print(mult_table(4))
            print(distance_matrix(pts).round(2))
            print(nearest_neighbor(pts))
          `,
          tests: [
            test("`mult_table(4)`", "np.array_equal(mult_table(4), [[1, 2, 3, 4], [2, 4, 6, 8], [3, 6, 9, 12], [4, 8, 12, 16]])", "mult_table(4)"),
            test("`distance_matrix` : forme et valeurs", "distance_matrix(pts).shape == (4, 4) and approx(distance_matrix(pts)[0, 1], 5) and approx(distance_matrix(pts)[1, 0], 5) and distance_matrix(pts)[2, 2] == 0"),
            test("`nearest_neighbor(pts)` vaut [2, 2, 0, 1]", "nearest_neighbor(pts).tolist() == [2, 2, 0, 1]", "nearest_neighbor(pts)"),
            test("Fonctionne sur 50 points aléatoires", "(lambda p: np.allclose(distance_matrix(p)[7, 3], np.hypot(*(p[7] - p[3]))))(np.random.default_rng(0).random((50, 2)))"),
            test("Aucune boucle dans les trois fonctions", "not any(has_loop(f) for f in (mult_table, distance_matrix, nearest_neighbor))"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 8.4
  "m8-l4": [
    {
      id: "ex1",
      title: "Filtrer, trier, assembler",
      tiers: {
        core: {
          title: "Masques et filtres",
          prompt: md`
            \`numbers\` est le tableau 4 × 6 de la leçon. Créez, **sans boucle** :

            - \`mask\` : le masque des multiples de 4, et \`by_four\` les valeurs correspondantes ;
            - \`n_by_four\` : le nombre de multiples de 4 ;
            - \`between\` : les valeurs strictement comprises entre 20 et 40 ;
            - \`labels\` : un tableau de même forme contenant \`"even"\` ou \`"odd"\` (\`np.where\`) ;
            - \`clipped\` : une **copie** de \`numbers\` où les valeurs supérieures à 40 sont remplacées par 40.
          `,
          starter: py`
            import numpy as np

            numbers = np.linspace(5, 50, 24, dtype=int).reshape(4, -1)

            mask = ...
            by_four = ...
            n_by_four = ...
            between = ...
            labels = ...
            clipped = ...

            print(numbers, by_four, n_by_four, between, labels, clipped, sep="\n")
          `,
          solution: py`
            import numpy as np

            numbers = np.linspace(5, 50, 24, dtype=int).reshape(4, -1)

            mask = numbers % 4 == 0
            by_four = numbers[mask]
            n_by_four = np.count_nonzero(mask)
            between = numbers[(numbers > 20) & (numbers < 40)]
            labels = np.where(numbers % 2 == 0, "even", "odd")
            clipped = numbers.copy()
            clipped[clipped > 40] = 40

            print(numbers, by_four, n_by_four, between, labels, clipped, sep="\n")
          `,
          tests: [
            test("`mask` est un masque booléen (4, 6)", "isinstance(mask, np.ndarray) and mask.dtype == bool and mask.shape == (4, 6)"),
            test("`by_four` : les 11 multiples de 4", "by_four.tolist() == [8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48] and n_by_four == 11", "by_four"),
            test("`between` : valeurs entre 20 et 40 exclus", "between.tolist() == [22, 24, 26, 28, 30, 32, 34, 36, 38]", "between"),
            test("`labels` contient even / odd", "labels.shape == (4, 6) and labels[0, 0] == 'odd' and labels[0, 1] == 'even'", "labels"),
            test("`clipped` plafonne à 40 sans modifier `numbers`", "clipped.max() == 40 and numbers.max() == 50 and clipped[0, 0] == 5"),
            test("Aucune boucle", "not uses('For') and not uses('ListComp')"),
          ],
        },
        extra: {
          title: "Les températures de la semaine",
          prompt: md`
            \`temps\` contient les températures de 4 villes (lignes, noms dans \`cities\`) sur 7 jours, et
            \`next_week\` celles de la semaine suivante.

            - \`hot_days\` : pour chaque ville, le nombre de jours à **plus de 30 °C** ;
            - \`ranking\` : la **liste** des noms de villes triés par température moyenne **décroissante** (\`np.argsort\`) ;
            - \`two_weeks\` : les deux semaines côte à côte, forme \`(4, 14)\` ;
            - \`all_sorted\` : toutes les températures des deux semaines, à plat et triées (\`np.concatenate(…, axis=None)\`).
          `,
          starter: py`
            import numpy as np

            ${WEEK}

            hot_days = ...
            ranking = ...
            two_weeks = ...
            all_sorted = ...

            print(hot_days, ranking, two_weeks.shape, all_sorted[:5], sep="\n")
          `,
          solution: py`
            import numpy as np

            ${WEEK}

            hot_days = (temps > 30).sum(axis=1)
            order = np.argsort(temps.mean(axis=1))[::-1]
            ranking = [cities[i] for i in order]
            two_weeks = np.hstack((temps, next_week))
            all_sorted = np.sort(np.concatenate((temps, next_week), axis=None))

            print(hot_days, ranking, two_weeks.shape, all_sorted[:5], sep="\n")
          `,
          tests: [
            test("`hot_days` vaut [2, 3, 5, 0]", "np.array_equal(hot_days, [2, 3, 5, 0])", "hot_days"),
            test("`ranking` : Marseille, Lyon, Paris, Lille", "list(ranking) == ['Marseille', 'Lyon', 'Paris', 'Lille']", "ranking"),
            test("`two_weeks` a la forme (4, 14)", "two_weeks.shape == (4, 14) and two_weeks[0, 7] == 21", "two_weeks.shape"),
            test("`all_sorted` contient les 56 valeurs triées", "all_sorted.shape == (56,) and all_sorted[0] == 17 and all_sorted[-1] == 35 and (np.diff(all_sorted) >= 0).all()"),
          ],
        },
        stretch: {
          title: "Tableaux structurés",
          prompt: md`
            \`heroes\` est un tableau **structuré** (champs \`name\`, \`age\`, \`power\`).

            - \`strongest\` : les noms des héros de puissance **supérieure à 9000** ;
            - \`by_age\` : les noms triés par âge croissant (\`np.sort(…, order="age")\`) ;
            - \`mean_age\` : l'âge moyen ;
            - \`name_dtype\` : le type du champ \`name\` sous forme de chaîne (\`.dtype.str\`) — que signifie-t-il ?
            - \`young_powerful(data, max_age, min_power)\` : la **liste** des noms des héros d'âge ≤ \`max_age\` et
              de puissance ≥ \`min_power\`.
          `,
          starter: py`
            import numpy as np

            ${HEROES}

            strongest = ...
            by_age = ...
            mean_age = ...
            name_dtype = ...


            def young_powerful(data, max_age, min_power):
                ...


            print(strongest, by_age, mean_age, name_dtype, young_powerful(heroes, 40, 100), sep="\n")
          `,
          solution: py`
            import numpy as np

            ${HEROES}

            strongest = heroes[heroes["power"] > 9000]["name"]
            by_age = np.sort(heroes, order="age")["name"]
            mean_age = heroes["age"].mean()
            name_dtype = heroes["name"].dtype.str     # '<U10' : unicode, 10 caractères max, little-endian


            def young_powerful(data, max_age, min_power):
                selected = data[(data["age"] <= max_age) & (data["power"] >= min_power)]
                return selected["name"].tolist()


            print(strongest, by_age, mean_age, name_dtype, young_powerful(heroes, 40, 100), sep="\n")
          `,
          tests: [
            test("`strongest` : beyonce et ada", "list(strongest) == ['beyonce', 'ada']", "strongest"),
            test("`by_age` : trié par âge", "list(by_age) == ['mary', 'joe', 'ada', 'beyonce', 'alan', 'felipe']", "by_age"),
            test("`mean_age` ≈ 40.33", "approx(float(mean_age), 242 / 6)", "mean_age"),
            test("`name_dtype` vaut `'<U10'`", "name_dtype == '<U10'", "name_dtype"),
            test("`young_powerful(heroes, 40, 100)` → beyonce, ada", "young_powerful(heroes, 40, 100) == ['beyonce', 'ada'] and young_powerful(heroes, 20, 0) == ['mary']", "young_powerful(heroes, 40, 100)"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 8.5
  "m8-l5": [
    {
      id: "ex1",
      title: "Simulations",
      tiers: {
        core: {
          title: "π par Monte-Carlo",
          prompt: md`
            *Hands-on 14.* Estimez π en tirant des points au hasard dans le carré [0, 1] × [0, 1].

            1. \`estimate_pi(n, seed=0)\` : crée un générateur \`np.random.default_rng(seed)\`, tire d'abord les
               \`n\` abscisses \`x\` puis les \`n\` ordonnées \`y\` (\`rng.random(n)\`), et renvoie
               4 × (proportion de points tels que x² + y² ≤ 1). **Sans boucle.**
            2. \`convergence(n, seed=0)\` : avec les **mêmes tirages**, renvoie le tableau des \`n\` estimations
               successives (après 1 point, 2 points, …, n points), grâce à \`np.cumsum\`.
          `,
          hint: md`
            La moyenne d'un masque booléen est la proportion de \`True\`. Pour la convergence :
            \`4 * np.cumsum(inside) / np.arange(1, n + 1)\`.
          `,
          starter: py`
            import numpy as np


            def estimate_pi(n, seed=0):
                ...


            def convergence(n, seed=0):
                ...


            print(estimate_pi(100_000))
            print(convergence(100_000)[[9, 99, 999, 9_999, 99_999]])
          `,
          solution: py`
            import numpy as np


            def estimate_pi(n, seed=0):
                rng = np.random.default_rng(seed)
                x, y = rng.random(n), rng.random(n)
                return 4 * np.mean(x**2 + y**2 <= 1)


            def convergence(n, seed=0):
                rng = np.random.default_rng(seed)
                x, y = rng.random(n), rng.random(n)
                inside = x**2 + y**2 <= 1
                return 4 * np.cumsum(inside) / np.arange(1, n + 1)


            print(estimate_pi(100_000))
            print(convergence(100_000)[[9, 99, 999, 9_999, 99_999]])
          `,
          tests: [
            test("`estimate_pi(200_000)` est proche de π (à 0.02 près)", "abs(estimate_pi(200_000) - np.pi) < 0.02", "estimate_pi(200_000)"),
            test("Même graine → même estimation", "estimate_pi(1000, 7) == estimate_pi(1000, 7) and estimate_pi(1000, 7) != estimate_pi(1000, 8)"),
            test("`estimate_pi` ne contient aucune boucle", "not has_loop(estimate_pi)"),
            test("`convergence` renvoie n estimations", "len(convergence(500)) == 500 and convergence(500)[0] in (0.0, 4.0)"),
            test("La dernière estimation de `convergence` est celle d'`estimate_pi`", "approx(convergence(1000, 3)[-1], estimate_pi(1000, 3))"),
          ],
        },
        extra: {
          title: "Places d'avion",
          prompt: md`
            *Hands-on « flight seats assignment ».* Dans un avion de \`n_seats\` places, les passagers montent
            dans l'ordre 0, 1, …, n−1 ; le passager \`i\` a la place \`i\`. Le passager 0 s'assoit **au hasard** ;
            ensuite, chacun prend sa place si elle est libre, sinon une place libre **au hasard**.

            1. \`last_gets_own_seat(n_seats, rng)\` simule **un** vol et renvoie \`True\` si le dernier passager
               trouve sa place ;
            2. \`probability(n_flights, n_seats, seed=0)\` simule \`n_flights\` vols avec un générateur
               \`np.random.default_rng(seed)\` et renvoie la proportion de succès (un \`float\`).

            Que constatez-vous ? Est-ce que cela dépend du nombre de places ?
          `,
          hint: md`
            Un ensemble \`free = set(range(n_seats))\` des places libres convient. Pour choisir une place libre
            au hasard : \`rng.choice(list(free))\`. Pas besoin de simuler le dernier passager : il reste une seule place.
          `,
          starter: py`
            import numpy as np


            def last_gets_own_seat(n_seats, rng):
                ...


            def probability(n_flights, n_seats, seed=0):
                ...


            print(probability(1000, 100))
          `,
          solution: py`
            import numpy as np


            def last_gets_own_seat(n_seats, rng):
                free = set(range(n_seats))
                free.remove(int(rng.integers(n_seats)))
                for passenger in range(1, n_seats - 1):
                    if passenger in free:
                        free.remove(passenger)
                    else:
                        free.remove(rng.choice(list(free)))
                return (n_seats - 1) in free


            def probability(n_flights, n_seats, seed=0):
                rng = np.random.default_rng(seed)
                return float(np.mean([last_gets_own_seat(n_seats, rng) for _ in range(n_flights)]))


            print(probability(1000, 100))
          `,
          explanation: md`
            La probabilité vaut **1/2**, quel que soit le nombre de places ! Au moment où l'on « déplace » quelqu'un,
            la place du premier passager et celle du dernier jouent des rôles parfaitement symétriques : celle qui sera
            prise en premier décide du sort du dernier passager.
          `,
          tests: [
            test("`last_gets_own_seat` renvoie un booléen", "last_gets_own_seat(10, np.random.default_rng(0)) in (True, False)"),
            test("Avec 2 places, environ une chance sur deux", "0.4 < probability(2000, 2, 5) < 0.6", "probability(2000, 2, 5)"),
            test("Avec 100 places, toujours environ 1/2", "0.42 < probability(1000, 100, 1) < 0.58", "probability(1000, 100, 1)"),
            test("`probability` est reproductible et renvoie un `float`", "probability(300, 30, 4) == probability(300, 30, 4) and type(probability(10, 5)) is float"),
          ],
        },
        stretch: {
          title: "Les séries de π",
          prompt: md`
            *Hands-on « π (much harder) », séance 1.* Trois séries convergent vers π :

            - **Leibniz** : π/4 = arctan(1) ;
            - **Bâle** : π²/6 = Σ 1/k² pour k ≥ 1 ;
            - **Machin** : π/4 = 4·arctan(1/5) − arctan(1/239),

            avec arctan(x) = Σ (−1)ᵏ x²ᵏ⁺¹ / (2k + 1) pour k ≥ 0. Sans boucle dans les fonctions :

            1. \`arctan_series(x, n)\` : la somme des \`n\` premiers termes (k = 0 … n−1) ;
            2. \`pi_leibniz(n)\`, \`pi_basel(n)\` (n termes k = 1 … n) et \`pi_machin(n)\` ;
            3. \`errors\` : un dictionnaire \`{"leibniz": […], "basel": […], "machin": […]}\` des erreurs
               **relatives** |approx − π| / π pour N = 10, 100, 1000, 10000 ;
            4. **convergence exponentielle** : pour Machin, l'erreur décroît comme α·e^(−βN). Calculez \`beta\`
               en ajustant une droite sur log(erreur) pour N = 1 … 8 (\`np.polyfit(N, np.log(err), 1)\` : la pente vaut −β).
               Au-delà, l'erreur atteint un **plateau** : la précision des \`float\` (≈ 1e-16).
          `,
          hint: md`
            \`k = np.arange(n)\`, puis \`((-1.0) ** k * x ** (2 * k + 1) / (2 * k + 1)).sum()\`. Pour Bâle :
            \`k = np.arange(1, n + 1)\` et \`np.sqrt(6 * (1 / k**2).sum())\`.
          `,
          starter: py`
            import math
            import numpy as np


            def arctan_series(x, n):
                ...


            def pi_leibniz(n):
                ...


            def pi_basel(n):
                ...


            def pi_machin(n):
                ...


            errors = ...
            beta = ...

            print(errors)
            print("beta =", beta)
          `,
          solution: py`
            import math
            import numpy as np


            def arctan_series(x, n):
                k = np.arange(n)
                return ((-1.0) ** k * x ** (2 * k + 1) / (2 * k + 1)).sum()


            def pi_leibniz(n):
                return 4 * arctan_series(1, n)


            def pi_basel(n):
                k = np.arange(1, n + 1)
                return np.sqrt(6 * (1 / k**2).sum())


            def pi_machin(n):
                return 4 * (4 * arctan_series(1 / 5, n) - arctan_series(1 / 239, n))


            def relative_error(value):
                return abs(value - math.pi) / math.pi


            Ns = [10, 100, 1000, 10000]
            errors = {
                "leibniz": [relative_error(pi_leibniz(n)) for n in Ns],
                "basel": [relative_error(pi_basel(n)) for n in Ns],
                "machin": [relative_error(pi_machin(n)) for n in Ns],
            }

            small_n = np.arange(1, 9)
            machin_errors = np.array([relative_error(pi_machin(n)) for n in small_n])
            slope, intercept = np.polyfit(small_n, np.log(machin_errors), 1)
            beta = -slope

            print(errors)
            print("beta =", beta)
          `,
          explanation: md`
            Leibniz et Bâle convergent **lentement** (erreur en 1/N) ; la formule de Machin gagne environ
            1,4 chiffre par terme : β ≈ 2·ln 5 ≈ 3,2, car chaque terme est multiplié par (1/5)² = 1/25. Dès N ≈ 10,
            on atteint le plateau d'erreur dû à la précision des nombres flottants. Le module 9 vous fera tracer
            ces erreurs sur un graphique semi-logarithmique.
          `,
          tests: [
            test("`arctan_series(1, 1000)` ≈ π/4", "abs(arctan_series(1, 1000) - math.pi / 4) < 1e-3"),
            test("`arctan_series(0.5, 30)` ≈ arctan(0.5)", "abs(arctan_series(0.5, 30) - math.atan(0.5)) < 1e-12"),
            test("Les trois approximations sont correctes", "abs(pi_leibniz(10_000) - math.pi) < 1e-3 and abs(pi_basel(10_000) - math.pi) < 1e-3 and abs(pi_machin(12) - math.pi) < 1e-14"),
            test(
              "`errors` : 3 séries × 4 erreurs relatives",
              "set(errors) == {'leibniz', 'basel', 'machin'} and all(len(v) == 4 for v in errors.values()) and approx(errors['leibniz'][0], abs(pi_leibniz(10) - math.pi) / math.pi, 1e-12)",
            ),
            test("Machin est la plus rapide (erreur < 1e-14 dès N = 10)", "errors['machin'][0] < 1e-14 and errors['leibniz'][3] > 1e-6"),
            test("`beta` ≈ 2·ln 5 ≈ 3.2", "2.8 < beta < 3.6", "beta"),
            test("Aucune boucle dans les séries", "not any(has_loop(f) for f in (arctan_series, pi_leibniz, pi_basel, pi_machin))"),
          ],
        },
      },
    },
  ],
};
