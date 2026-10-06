import { md, py, test } from "../helpers.js";

const SERVER_LOG = `INFO: server started
INFO: user ada logged in
WARNING: slow response on /machines (2.3 s)
ERROR: machine3 is not responding
INFO: user alan logged in
ERROR: disk almost full
INFO: user ada bought chocolate
WARNING: retrying payment
INFO: user grace logged in
ERROR: payment refused for user grace
INFO: server stopped
`;

/** Journal d'un serveur web (format proche de celui d'Apache), généré de façon déterministe. */
function accessLog() {
  const ips = ["192.168.1.10", "10.0.0.7", "172.16.4.2", "192.168.1.22", "10.0.0.9", "8.8.4.4"];
  const paths = ["/", "/index.html", "/machines", "/buy/candy", "/admin", "/favicon.ico"];
  let state = 7;
  const random = () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
  const lines = [];
  for (let i = 0; i < 80; i += 1) {
    const ip = ips[Math.floor(random() * ips.length)];
    const path = paths[Math.floor(random() * paths.length)];
    let code = random() < 0.65 ? "200" : random() < 0.6 ? "404" : random() < 0.5 ? "301" : "500";
    if (ip === "10.0.0.7" && (path === "/admin" || path === "/favicon.ico" || i % 3 === 0)) code = "404";
    const minute = String(10 + Math.floor(i / 2)).padStart(2, "0");
    const second = String((i * 7) % 60).padStart(2, "0");
    const size = 200 + Math.floor(random() * 5000);
    lines.push(`${ip} - - [12/Sep/2022:11:${minute}:${second}] "GET ${path} HTTP/1.1" ${code} ${size}`);
  }
  return lines.join("\n") + "\n";
}

const DISTANCE = py`
  import math
  import unittest


  def distance(x, y):
      """Euclidean distance between two points (tuples of two floats)."""
      return math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)
`;

const UGLY = py`
  import math
  def ComputeDistance(X,Y):
   return math.sqrt((X[0]-Y[0])**2+(X[1]-Y[1])**2)
  class vending_machine:
       def __init__(self,Max):
           self.Max=Max
  maxProducts=5
  print(ComputeDistance((0,0),(3,4)),vending_machine(maxProducts).Max)
`;

const LOOPS = py`
  import time
  import numpy as np


  def sum_of_squares_loop(n):
      total = 0
      for i in range(n):
          total += i * i
      return total


  def dot_loop(a, b):
      total = 0.0
      for x, y in zip(a, b):
          total += x * y
      return total
`;

export default {
  // ---------------------------------------------------------------- 10.1
  "m10-l1": [
    {
      id: "ex1",
      title: "Générateurs et itérateurs",
      tiers: {
        core: {
          title: "myrange et expressions génératrices",
          prompt: md`
            1. \`myrange(a, b, step=1)\` : une **fonction génératrice** (avec \`yield\`) qui produit \`a\`, \`a + step\`, …
               tant que la valeur est strictement inférieure à \`b\` (on suppose \`step > 0\`).
            2. \`even_squares\` : une **expression génératrice** des carrés des nombres pairs de 0 à 19.
            3. \`total\` : la somme des carrés de 1 à 1000, calculée **sans construire de liste**
               (une expression génératrice passée à \`sum\`).
          `,
          starter: py`
            def myrange(a, b, step=1):
                ...


            even_squares = ...
            total = ...

            print(list(myrange(3, 7)), list(myrange(0, 10, 3)))
            print(total)
          `,
          solution: py`
            def myrange(a, b, step=1):
                i = a
                while i < b:
                    yield i
                    i += step


            even_squares = (x * x for x in range(20) if x % 2 == 0)
            total = sum(x * x for x in range(1, 1001))

            print(list(myrange(3, 7)), list(myrange(0, 10, 3)))
            print(total)
          `,
          tests: [
            test("`myrange` est une fonction génératrice (`yield`)", "__import__('inspect').isgeneratorfunction(myrange) and uses('Yield')"),
            test("`list(myrange(3, 7))` vaut [3, 4, 5, 6]", "list(myrange(3, 7)) == [3, 4, 5, 6] and list(myrange(5, 5)) == []", "list(myrange(3, 7))"),
            test("Le pas fonctionne : `myrange(0, 10, 3)`", "list(myrange(0, 10, 3)) == [0, 3, 6, 9]", "list(myrange(0, 10, 3))"),
            test("`even_squares` est un générateur", "type(even_squares).__name__ == 'generator'", "type(even_squares)"),
            test("`total` vaut 333 833 500, sans liste intermédiaire", "total == 333833500 and uses('GeneratorExp') and not uses('ListComp')", "total"),
          ],
        },
        extra: {
          title: "Le protocole itérateur",
          prompt: md`
            1. Écrivez la classe \`PowTwo(max)\` du cours : \`__iter__\` remet le compteur à zéro et renvoie \`self\`,
               \`__next__\` renvoie 2⁰, 2¹, …, 2^max puis lève \`StopIteration\`.
            2. Écrivez la classe \`Countdown(start)\`, parcourable **plusieurs fois** : \`for n in Countdown(3)\` donne
               3, 2, 1. Ici, \`__iter__\` est une **fonction génératrice** (elle contient \`yield\`) : chaque appel
               crée un nouvel itérateur.
          `,
          hint: md`
            Pour \`Countdown\`, pas besoin de \`__next__\` : \`def __iter__(self): n = self.start; while n > 0: yield n; n -= 1\`.
          `,
          starter: py`
            class PowTwo:
                ...


            class Countdown:
                ...


            numbers = PowTwo(3)
            i = iter(numbers)
            print(next(i), next(i))
            print(list(PowTwo(5)))
            c = Countdown(3)
            print(list(c), list(c))
          `,
          solution: py`
            class PowTwo:
                """Class to implement an iterator of powers of two."""

                def __init__(self, max=0):
                    self.max = max

                def __iter__(self):
                    self.n = 0
                    return self

                def __next__(self):
                    if self.n <= self.max:
                        result = 2 ** self.n
                        self.n += 1
                        return result
                    raise StopIteration


            class Countdown:
                def __init__(self, start):
                    self.start = start

                def __iter__(self):
                    n = self.start
                    while n > 0:
                        yield n
                        n -= 1


            numbers = PowTwo(3)
            i = iter(numbers)
            print(next(i), next(i))
            print(list(PowTwo(5)))
            c = Countdown(3)
            print(list(c), list(c))
          `,
          tests: [
            test("`list(PowTwo(3))` vaut [1, 2, 4, 8]", "list(PowTwo(3)) == [1, 2, 4, 8] and list(PowTwo(0)) == [1]", "list(PowTwo(3))"),
            test("`PowTwo` définit `__iter__` et `__next__`", "'__iter__' in PowTwo.__dict__ and '__next__' in PowTwo.__dict__"),
            test("`next` lève `StopIteration` à la fin", "(lambda it: (next(it), next(it), raises(StopIteration, next, it))[2])(iter(PowTwo(1)))"),
            test("`Countdown(3)` donne 3, 2, 1", "[n for n in Countdown(3)] == [3, 2, 1] and list(Countdown(0)) == []"),
            test("`Countdown` se parcourt plusieurs fois", "(lambda c: (list(c), list(c)))(Countdown(2)) == ([2, 1], [2, 1])"),
          ],
        },
        stretch: {
          title: "Des pipelines paresseux",
          prompt: md`
            Toutes les fonctions ci-dessous sont des **générateurs** (sauf \`take\` et \`count_errors\`) :

            1. \`fibonacci()\` : la suite infinie 1, 1, 2, 3, 5, 8… ;
            2. \`primes()\` : la suite infinie des nombres premiers ;
            3. \`take(n, iterable)\` : la **liste** des \`n\` premiers éléments (avec \`itertools.islice\`) ;
            4. \`read_lines(path)\` : produit les lignes **non vides** du fichier, sans le \`\\n\` final ;
            5. \`parse(lines)\` : pour chaque ligne \`"LEVEL: message"\`, produit le tuple \`(level, message)\` ;
            6. \`errors(records)\` : ne laisse passer que les enregistrements de niveau \`"ERROR"\` ;
            7. \`count_errors(path)\` : le nombre d'erreurs du fichier, en enchaînant les trois générateurs.

            Grâce aux générateurs, on peut traiter un fichier énorme sans jamais le charger entièrement en mémoire.
          `,
          hint: md`
            \`line.split(": ", 1)\` coupe au premier \`": "\` seulement. \`sum(1 for _ in errors(…))\` compte sans liste.
          `,
          files: { "server.log": SERVER_LOG },
          starter: py`
            from itertools import islice


            def fibonacci():
                ...


            def primes():
                ...


            def take(n, iterable):
                ...


            def read_lines(path):
                ...


            def parse(lines):
                ...


            def errors(records):
                ...


            def count_errors(path):
                ...


            print(take(10, fibonacci()), take(8, primes()))
            for level, message in errors(parse(read_lines("server.log"))):
                print(level, "→", message)
            print(count_errors("server.log"), "errors")
          `,
          solution: py`
            from itertools import islice


            def fibonacci():
                a, b = 1, 1
                while True:
                    yield a
                    a, b = b, a + b


            def primes():
                n = 2
                while True:
                    if all(n % d != 0 for d in range(2, int(n ** 0.5) + 1)):
                        yield n
                    n += 1


            def take(n, iterable):
                return list(islice(iterable, n))


            def read_lines(path):
                with open(path, encoding="utf-8") as f:
                    for line in f:
                        line = line.rstrip("\n")
                        if line.strip():
                            yield line


            def parse(lines):
                for line in lines:
                    level, message = line.split(": ", 1)
                    yield level, message


            def errors(records):
                for level, message in records:
                    if level == "ERROR":
                        yield level, message


            def count_errors(path):
                return sum(1 for _ in errors(parse(read_lines(path))))


            print(take(10, fibonacci()), take(8, primes()))
            for level, message in errors(parse(read_lines("server.log"))):
                print(level, "→", message)
            print(count_errors("server.log"), "errors")
          `,
          tests: [
            test("`take(10, fibonacci())`", "take(10, fibonacci()) == [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]", "take(10, fibonacci())"),
            test("`take(8, primes())`", "take(8, primes()) == [2, 3, 5, 7, 11, 13, 17, 19]", "take(8, primes())"),
            test(
              "`read_lines`, `parse` et `errors` sont des générateurs",
              "all(__import__('inspect').isgeneratorfunction(f) for f in (fibonacci, primes, read_lines, parse, errors))",
            ),
            test("`parse` découpe niveau et message", "list(parse(['INFO: a: b'])) == [('INFO', 'a: b')]"),
            test("`count_errors('server.log')` vaut 3", "count_errors('server.log') == 3", "count_errors('server.log')"),
            test(
              "Le pipeline est paresseux (il fonctionne sur un flux infini)",
              "next(errors(parse(__import__('itertools').cycle(['INFO: ok', 'ERROR: boom'])))) == ('ERROR', 'boom')",
            ),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 10.2
  "m10-l2": [
    {
      id: "ex1",
      title: "Programmation fonctionnelle",
      tiers: {
        core: {
          title: "map, filter, lambda et compagnie",
          prompt: md`
            Reprenez les exemples du cours, **sans boucle \`for\` ni compréhension** :

            1. \`l_squared\` : la **liste** des carrés de \`l\` (\`map\` + \`lambda\`) ;
            2. \`l_even\` : la **liste** des éléments pairs de \`l\` (\`filter\` + \`lambda\`) ;
            3. \`all_positive\` / \`any_negative\` : tous les éléments sont-ils positifs ? l'un d'eux est-il négatif ?
            4. triez \`pairs\` **sur place** selon le nom (2e élément) ;
            5. \`by_length\` : les mots de \`words\` triés par longueur croissante (\`sorted\` + \`key\`) ;
            6. \`index_of\` : un dictionnaire mot → position dans \`words\`, avec \`enumerate\` et \`dict\`… sans boucle.
          `,
          hint: md`
            \`dict(map(lambda pair: (pair[1], pair[0]), enumerate(words)))\` construit le dictionnaire sans boucle explicite.
          `,
          starter: py`
            l = [1, 2, 3, 4, 5]
            pairs = [(1, "one"), (2, "two"), (3, "three"), (4, "four")]
            words = ["pythonic", "is", "a", "state", "of", "mind"]

            l_squared = ...
            l_even = ...
            all_positive = ...
            any_negative = ...
            by_length = ...
            index_of = ...

            print(l_squared, l_even, all_positive, any_negative, pairs, by_length, index_of, sep="\n")
          `,
          solution: py`
            l = [1, 2, 3, 4, 5]
            pairs = [(1, "one"), (2, "two"), (3, "three"), (4, "four")]
            words = ["pythonic", "is", "a", "state", "of", "mind"]

            l_squared = list(map(lambda x: x**2, l))
            l_even = list(filter(lambda x: x % 2 == 0, l))
            all_positive = all(map(lambda x: x > 0, l))
            any_negative = any(map(lambda x: x < 0, l))
            pairs.sort(key=lambda pair: pair[1])
            by_length = sorted(words, key=len)
            index_of = dict(map(lambda pair: (pair[1], pair[0]), enumerate(words)))

            print(l_squared, l_even, all_positive, any_negative, pairs, by_length, index_of, sep="\n")
          `,
          tests: [
            test("`l_squared` et `l_even` sont des listes", "l_squared == [1, 4, 9, 16, 25] and l_even == [2, 4]", "(l_squared, l_even)"),
            test("`all_positive` est vrai, `any_negative` est faux", "all_positive is True and any_negative is False"),
            test("`pairs` est trié par nom", "pairs == [(4, 'four'), (1, 'one'), (3, 'three'), (2, 'two')]", "pairs"),
            test("`by_length` trié par longueur", "by_length == ['a', 'is', 'of', 'mind', 'state', 'pythonic']", "by_length"),
            test("`index_of` associe chaque mot à sa position", "index_of == {'pythonic': 0, 'is': 1, 'a': 2, 'state': 3, 'of': 4, 'mind': 5}", "index_of"),
            test("`map`, `filter` et `lambda`, sans boucle ni compréhension", "calls('map') and calls('filter') and uses('Lambda') and not uses('For') and not uses('ListComp')"),
          ],
        },
        extra: {
          title: "Analyser un journal web",
          prompt: md`
            \`access.log\` est le journal d'un serveur web. Chaque ligne ressemble à :
            \`10.0.0.7 - - [12/Sep/2022:11:10:00] "GET /admin HTTP/1.1" 404 1520\`
            (adresse IP, date, requête, **code de statut**, taille).

            1. \`ip_and_code(line)\` renvoie le tuple \`(ip, code)\` : le premier mot et l'avant-dernier (une chaîne).
            2. \`lines\` : la liste des lignes du fichier.
            3. \`status_counts\` : un \`collections.Counter\` du nombre de requêtes par code.
            4. \`top_404\` : le tuple \`(nombre, ip)\` de l'IP qui a reçu le plus d'erreurs 404, en **une seule
               expression** comme dans le cours (\`max\` d'une compréhension sur un \`Counter\`).
          `,
          files: { "access.log": accessLog() },
          starter: py`
            import collections


            def ip_and_code(line):
                ...


            lines = ...
            status_counts = ...
            top_404 = ...

            print(status_counts)
            print(top_404)
          `,
          solution: py`
            import collections


            def ip_and_code(line):
                parts = line.split()
                return parts[0], parts[-2]


            with open("access.log", encoding="utf-8") as f:
                lines = f.read().splitlines()

            status_counts = collections.Counter(ip_and_code(x)[1] for x in lines)
            top_404 = max(
                [(count, ip) for ip, count in
                    collections.Counter([
                        ip for ip, code in [ip_and_code(x) for x in lines]
                        if code == "404"
                    ]).items()]
            )

            print(status_counts)
            print(top_404)
          `,
          tests: [
            test("`ip_and_code` extrait l'IP et le code", "ip_and_code('1.2.3.4 - - [x] \"GET / HTTP/1.1\" 404 12') == ('1.2.3.4', '404')"),
            test("`lines` contient les 80 lignes", "len(lines) == 80", "len(lines)"),
            test(
              "`status_counts` compte les codes",
              "isinstance(status_counts, __import__('collections').Counter) and sum(status_counts.values()) == 80 and status_counts['404'] == sum(1 for x in lines if x.split()[-2] == '404')",
              "status_counts",
            ),
            test(
              "`top_404` : l'IP la plus touchée par les 404",
              "top_404 == max((c, ip) for ip, c in __import__('collections').Counter(x.split()[0] for x in lines if x.split()[-2] == '404').items()) and top_404[1] == '10.0.0.7'",
              "top_404",
            ),
          ],
        },
        stretch: {
          title: "Écrire ses propres décorateurs",
          prompt: md`
            1. \`count_calls(func)\` : renvoie une fonction qui appelle \`func\` et compte ses appels dans son
               attribut \`calls\` (0 au départ).
            2. \`memoize(func)\` : renvoie une fonction qui mémorise ses résultats dans un dictionnaire \`cache\`
               (attribut de la fonction renvoyée) et ne rappelle jamais \`func\` deux fois avec le même argument.
            3. \`timed(func)\` : renvoie une fonction qui ajoute la durée de chaque appel à la liste \`durations\`
               (attribut de la fonction renvoyée).
            4. Les trois utilisent \`functools.wraps\`, pour conserver le nom et la docstring de \`func\`.
            5. Décorez \`square\` avec \`@count_calls\` et \`fib\` (récursive naïve) avec \`@memoize\`.
          `,
          hint: md`
            Une fonction est un objet : on peut lui ajouter des attributs (\`wrapper.calls = 0\`). Dans \`wrapper\`,
            écrivez \`wrapper.calls += 1\`.
          `,
          starter: py`
            import functools
            import time


            def count_calls(func):
                ...


            def memoize(func):
                ...


            def timed(func):
                ...


            def square(x):
                """Square of x."""
                return x * x


            def fib(n):
                return n if n < 2 else fib(n - 1) + fib(n - 2)


            print(square(3), square(4), square.calls)
            print(fib(80))
          `,
          solution: py`
            import functools
            import time


            def count_calls(func):
                @functools.wraps(func)
                def wrapper(*args, **kwargs):
                    wrapper.calls += 1
                    return func(*args, **kwargs)
                wrapper.calls = 0
                return wrapper


            def memoize(func):
                @functools.wraps(func)
                def wrapper(arg):
                    if arg not in wrapper.cache:
                        wrapper.cache[arg] = func(arg)
                    return wrapper.cache[arg]
                wrapper.cache = {}
                return wrapper


            def timed(func):
                @functools.wraps(func)
                def wrapper(*args, **kwargs):
                    start = time.perf_counter()
                    result = func(*args, **kwargs)
                    wrapper.durations.append(time.perf_counter() - start)
                    return result
                wrapper.durations = []
                return wrapper


            @count_calls
            def square(x):
                """Square of x."""
                return x * x


            @memoize
            def fib(n):
                return n if n < 2 else fib(n - 1) + fib(n - 2)


            print(square(3), square(4), square.calls)
            print(fib(80))
          `,
          tests: [
            test("`count_calls` compte les appels", "(lambda f: (f(1), f(2), f(3), f.calls)[3])(count_calls(lambda x: x)) == 3"),
            test("`square` est décoré et garde son nom et sa docstring", "square(5) == 25 and square.calls >= 1 and square.__name__ == 'square' and square.__doc__ == 'Square of x.'"),
            test(
              "`memoize` n'appelle jamais deux fois la fonction avec le même argument",
              "(lambda inner: (lambda g: (g(5), g(5), g(6), g(5), inner.calls, g.cache)[4:])(memoize(inner)))(count_calls(lambda x: x * 2)) == (2, {5: 10, 6: 12})",
            ),
            test("`fib(80)` est instantané grâce à `@memoize`", "fib(80) == 23416728348467685 and len(fib.cache) >= 81"),
            test("`timed` enregistre une durée par appel", "(lambda t: (t(), t(), len(t.durations), all(d >= 0 for d in t.durations))[2:])(timed(lambda: sum(range(1000)))) == (2, True)"),
            test("`functools.wraps` est utilisé", "SOURCE.count('wraps') >= 3"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 10.3
  "m10-l3": [
    {
      id: "ex1",
      title: "Du code fiable",
      tiers: {
        core: {
          title: "Assertions et gestionnaire de contexte",
          prompt: md`
            1. \`isqrt(n)\` : le plus petit entier \`i\` tel que \`i * i >= n\` (fonction du cours). Une assertion
               vérifie d'abord que \`n >= 0\`, avec le message \`"n must be non-negative"\`.
            2. \`mean(values)\` : la moyenne d'une liste, avec une assertion qui interdit une liste vide
               (message \`"empty list"\`).
            3. \`Timer\` : un gestionnaire de contexte (\`__enter__\` / \`__exit__\`). \`__enter__\` démarre le chronomètre
               et renvoie l'objet ; \`__exit__\` range la durée (\`time.perf_counter\`) dans \`self.elapsed\` et renvoie
               \`False\`.
            4. Utilisez \`with Timer() as t:\` pour chronométrer \`mean\` sur un million de valeurs.
          `,
          starter: py`
            import time


            def isqrt(n):
                ...


            def mean(values):
                ...


            class Timer:
                ...


            print(isqrt(144), isqrt(10))
            # chronométrez mean(list(range(1_000_000))) avec Timer
          `,
          solution: py`
            import time


            def isqrt(n):
                assert n >= 0, "n must be non-negative"
                i = 0
                while i * i < n:
                    i += 1
                return i


            def mean(values):
                assert len(values) > 0, "empty list"
                return sum(values) / len(values)


            class Timer:
                def __enter__(self):
                    self.start = time.perf_counter()
                    return self

                def __exit__(self, exc_type, exc_value, traceback):
                    self.elapsed = time.perf_counter() - self.start
                    return False


            print(isqrt(144), isqrt(10))
            with Timer() as t:
                result = mean(list(range(1_000_000)))
            print(result, f"{t.elapsed:.4f} s")
          `,
          tests: [
            test("`isqrt` est correcte", "isqrt(144) == 12 and isqrt(10) == 4 and isqrt(0) == 0"),
            test("`isqrt(-25)` lève `AssertionError: n must be non-negative`", "raises(AssertionError, isqrt, -25) and error_message(isqrt, -25) == 'n must be non-negative'"),
            test("`mean([])` lève `AssertionError`", "mean([2, 4]) == 3 and raises(AssertionError, mean, []) and error_message(mean, []) == 'empty list'"),
            test(
              "`Timer` est un gestionnaire de contexte qui mesure une durée",
              "(lambda t: (t.__enter__() is t, t.__exit__(None, None, None), t.elapsed >= 0))(Timer()) == (True, False, True)",
            ),
            test("Le programme utilise `with Timer() as …`", "uses('With') and 'Timer()' in SOURCE"),
          ],
        },
        extra: {
          title: "Écrire des tests unitaires",
          prompt: md`
            La fonction \`distance\` est fournie (et correcte). Écrivez la classe \`EuclideanTestCase\`
            (\`unittest.TestCase\`) avec **au moins 3 tests** :

            - la distance d'un point à lui-même est nulle (\`assertEqual\`) ;
            - la distance est **symétrique** et strictement positive pour deux points distincts (\`assertGreater\`) ;
            - une valeur connue : de (0, 0) à (3, 4), la distance vaut 5 (\`assertAlmostEqual\`).

            Puis exécutez-les. Vos tests seront eux-mêmes testés : ils doivent **réussir** avec la bonne fonction
            et **échouer** avec des versions fausses de \`distance\`.
          `,
          hint: md`
            Pour lancer les tests et voir le résultat :
            \`unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(EuclideanTestCase))\`
            ou simplement \`unittest.main(exit=False)\`.
          `,
          starter: py`
            ${DISTANCE}


            class EuclideanTestCase(unittest.TestCase):
                ...


            unittest.main(exit=False)
          `,
          solution: py`
            ${DISTANCE}


            class EuclideanTestCase(unittest.TestCase):
                """Tests for the distance function."""

                def test_same_point(self):
                    x = (0.0, 0.0)
                    self.assertEqual(distance(x, x), 0.0)

                def test_symmetric_and_positive(self):
                    x, y = (0.0, 0.0), (1.0, 1.0)
                    self.assertGreater(distance(x, y), 1.0)
                    self.assertEqual(distance(x, y), distance(y, x))

                def test_known_value(self):
                    self.assertAlmostEqual(distance((0, 0), (3, 4)), 5.0)
                    self.assertAlmostEqual(distance((-1, -1), (2, 3)), 5.0)


            unittest.main(exit=False)
          `,
          tests: [
            test("`EuclideanTestCase` hérite de `unittest.TestCase`", "issubclass(EuclideanTestCase, unittest.TestCase)"),
            test("Au moins 3 tests, qui réussissent avec la bonne fonction", "run_testcase(EuclideanTestCase)['ok'] and run_testcase(EuclideanTestCase)['run'] >= 3", "run_testcase(EuclideanTestCase)"),
            test("Ils détectent une fonction qui renvoie toujours 0", "not run_testcase(EuclideanTestCase, distance=lambda x, y: 0.0)['ok']"),
            test("Ils détectent la distance de Manhattan", "not run_testcase(EuclideanTestCase, distance=lambda x, y: abs(x[0] - y[0]) + abs(x[1] - y[1]))['ok']"),
            test("Ils détectent une fonction non symétrique", "not run_testcase(EuclideanTestCase, distance=lambda x, y: math.hypot(x[0] - y[0], x[1] - y[1]) + (0.5 if x < y else 0))['ok']"),
          ],
        },
        stretch: {
          title: "Journaliser les opérations d'un compte",
          prompt: md`
            Remplacez les \`print\` du compte bancaire par du **logging** :

            1. configurez \`logging.basicConfig\` pour écrire dans le fichier \`bank.log\`, au niveau **INFO**, avec le
               format \`"%(levelname)s:%(message)s"\` (et \`force=True\`) ;
            2. \`deposit\` journalise en INFO : \`"Ada deposits 50.00"\` ;
            3. \`withdraw\` journalise en INFO \`"Ada withdraws 20.00"\`, ou en **WARNING**
               \`"Ada withdraws a large amount: 1500.00"\` au-delà de 1000 ; si le solde est insuffisant, il journalise
               en **ERROR** \`"Ada: insufficient funds for 10000.00"\` puis lève \`ValueError\` ;
            4. \`dump\` journalise l'état en **DEBUG** (\`"state: …"\`) : ce message ne doit **pas** apparaître dans le fichier.
          `,
          hint: md`Les montants sont formatés avec \`{amount:.2f}\`. \`logging.debug(…)\`, \`logging.info(…)\`, \`logging.warning(…)\`, \`logging.error(…)\`.`,
          starter: py`
            import logging

            # 1. configure logging here


            class Account:
                def __init__(self, owner, balance=0):
                    self.owner = owner
                    self.balance = balance

                def deposit(self, amount):
                    self.balance += amount
                    print(f"{self.owner} deposits {amount:.2f}")

                def withdraw(self, amount):
                    if amount > self.balance:
                        print(f"{self.owner}: insufficient funds for {amount:.2f}")
                        raise ValueError("insufficient funds")
                    self.balance -= amount
                    print(f"{self.owner} withdraws {amount:.2f}")

                def dump(self):
                    print(f"state: {self.__dict__}")


            account = Account("Ada", 2000)
            account.deposit(50)
            account.withdraw(20)
            account.withdraw(1500)
            try:
                account.withdraw(10_000)
            except ValueError:
                pass
            account.dump()
          `,
          solution: py`
            import logging

            logging.basicConfig(filename="bank.log", level=logging.INFO, format="%(levelname)s:%(message)s", force=True)


            class Account:
                def __init__(self, owner, balance=0):
                    self.owner = owner
                    self.balance = balance

                def deposit(self, amount):
                    self.balance += amount
                    logging.info(f"{self.owner} deposits {amount:.2f}")

                def withdraw(self, amount):
                    if amount > self.balance:
                        logging.error(f"{self.owner}: insufficient funds for {amount:.2f}")
                        raise ValueError("insufficient funds")
                    self.balance -= amount
                    if amount > 1000:
                        logging.warning(f"{self.owner} withdraws a large amount: {amount:.2f}")
                    else:
                        logging.info(f"{self.owner} withdraws {amount:.2f}")

                def dump(self):
                    logging.debug(f"state: {self.__dict__}")


            account = Account("Ada", 2000)
            account.deposit(50)
            account.withdraw(20)
            account.withdraw(1500)
            try:
                account.withdraw(10_000)
            except ValueError:
                pass
            account.dump()
          `,
          tests: [
            test("`bank.log` a été créé", "file_exists('bank.log')"),
            test(
              "Les 4 messages attendus, dans l'ordre",
              "read_file('bank.log').splitlines() == ['INFO:Ada deposits 50.00', 'INFO:Ada withdraws 20.00', 'WARNING:Ada withdraws a large amount: 1500.00', 'ERROR:Ada: insufficient funds for 10000.00']",
              "read_file('bank.log').splitlines()",
            ),
            test("Le message DEBUG n'apparaît pas", "'state' not in read_file('bank.log')"),
            test("Plus aucun `print` : tout passe par logging", "not calls('print') and calls('basicConfig')"),
            test("Le solde final est correct", "account.balance == 530", "account.balance"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 10.4
  "m10-l4": [
    {
      id: "ex1",
      title: "Ligne de commande et bonnes pratiques",
      tiers: {
        core: {
          title: "Des arguments avec argparse",
          prompt: md`
            1. \`build_parser()\` renvoie un \`argparse.ArgumentParser\` avec : un argument positionnel
               **facultatif** \`name\` (\`nargs="?"\`, \`"World"\` par défaut), l'option \`--num_iter\` (entier, 10 par défaut) et le drapeau \`--verbose\` (\`action="store_true"\`).
            2. \`main(argv=None)\` analyse \`argv\` (\`parser.parse_args(argv)\` : avec \`None\`, argparse lit la vraie
               ligne de commande) et **renvoie** \`"Hello <name>: <num_iter> iterations"\`, suivi de \`" (verbose)"\`
               si le drapeau est présent.
            3. En fin de fichier, protégé par \`if __name__ == "__main__":\`, le programme affiche \`main()\`.

            Ici, la « ligne de commande » est simulée : les tests lancent votre programme comme
            \`python main.py Zoe --num_iter=3\`.
          `,
          starter: py`
            import argparse


            def build_parser():
                ...


            def main(argv=None):
                ...


            print(main(["Ada"]))
            print(main(["Bob", "--num_iter=34", "--verbose"]))
          `,
          solution: py`
            import argparse


            def build_parser():
                parser = argparse.ArgumentParser(description="Greets someone several times.")
                parser.add_argument("name", nargs="?", default="World", help="who to greet")
                parser.add_argument("--num_iter", type=int, default=10, help="number of iterations")
                parser.add_argument("--verbose", action="store_true", help="verbose mode")
                return parser


            def main(argv=None):
                args = build_parser().parse_args(argv)
                message = f"Hello {args.name}: {args.num_iter} iterations"
                if args.verbose:
                    message += " (verbose)"
                return message


            print(main(["Ada"]))
            print(main(["Bob", "--num_iter=34", "--verbose"]))

            if __name__ == "__main__":
                print(main())
          `,
          tests: [
            test("`build_parser()` renvoie un `ArgumentParser`", "isinstance(build_parser(), __import__('argparse').ArgumentParser)"),
            test("`main(['Ada'])` et `main([])` utilisent les valeurs par défaut", "main(['Ada']) == 'Hello Ada: 10 iterations' and main([]) == 'Hello World: 10 iterations'", "main(['Ada'])"),
            test("Options et drapeau", "main(['Bob', '--num_iter=34', '--verbose']) == 'Hello Bob: 34 iterations (verbose)' and main(['Eve', '--num_iter', '2']) == 'Hello Eve: 2 iterations'"),
            test("Lancé en ligne de commande, le programme lit `sys.argv`", "'Hello Zoe: 3 iterations' in run_with(argv=['Zoe', '--num_iter=3'])['OUTPUT']"),
            test("Un entier invalide arrête argparse (code 2)", "run_with(argv=['X', '--num_iter=abc']).get('EXIT_CODE') == 2"),
          ],
        },
        extra: {
          title: "Remettre au style PEP 8",
          prompt: md`
            Ce code fonctionne mais ne respecte aucune convention. Réécrivez-le :

            - la fonction devient \`compute_distance(x, y)\` (snake_case, paramètres en minuscules), avec des
              **annotations de type** (\`tuple[float, float]\` pour les points, \`-> float\` pour le résultat) et une
              **docstring** au format Google, avec les sections \`Args:\` et \`Returns:\` ;
            - la classe devient \`VendingMachine\` (CapWords), dont l'attribut s'appelle \`max_products\` ;
            - la constante devient \`MAX_PRODUCTS\` ;
            - indentation de **4 espaces**, espaces autour des opérateurs et après les virgules, deux lignes vides
              entre les définitions.
          `,
          starter: UGLY,
          solution: py`
            import math


            def compute_distance(x: tuple[float, float], y: tuple[float, float]) -> float:
                """Computes the Euclidean distance between two points.

                Args:
                    x: the first point's coordinates.
                    y: the second point's coordinates.

                Returns:
                    The distance, a non-negative float.
                """
                return math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)


            class VendingMachine:
                """A vending machine holding a limited number of products."""

                def __init__(self, max_products: int):
                    self.max_products = max_products


            MAX_PRODUCTS = 5
            print(compute_distance((0, 0), (3, 4)), VendingMachine(MAX_PRODUCTS).max_products)
          `,
          tests: [
            test("Les anciens noms ont disparu", "not any(name in globals() for name in ('ComputeDistance', 'vending_machine', 'maxProducts'))"),
            test("`compute_distance` fonctionne", "compute_distance((0, 0), (3, 4)) == 5.0"),
            test(
              "Annotations de type sur les paramètres et le retour",
              "set(compute_distance.__annotations__) == {'x', 'y', 'return'} and compute_distance.__annotations__['return'] is float",
              "compute_distance.__annotations__",
            ),
            test("Docstring avec `Args:` et `Returns:`", "compute_distance.__doc__ is not None and 'Args:' in compute_distance.__doc__ and 'Returns:' in compute_distance.__doc__"),
            test("`VendingMachine(3).max_products == 3` et `MAX_PRODUCTS == 5`", "VendingMachine(3).max_products == 3 and MAX_PRODUCTS == 5"),
            test("Indentation par multiples de 4 espaces", "all((len(l) - len(l.lstrip(' '))) % 4 == 0 for l in SOURCE.splitlines() if l.strip()) and '\\t' not in SOURCE"),
          ],
        },
        stretch: {
          title: "Un interpréteur de commandes avec match",
          prompt: md`
            Écrivez \`execute(command, account)\`, où \`account\` est un dictionnaire
            \`{"balance": …, "history": […]}\`. Utilisez **\`match\` / \`case\`** sur \`command.split()\` :

            - \`"deposit 50"\` : ajoute le montant, l'enregistre dans l'historique (\`("deposit", 50.0)\`),
              renvoie \`"balance: 150.00"\` ;
            - \`"withdraw 30"\` : idem si le solde suffit (garde \`if\`) ; sinon renvoie \`"insufficient funds"\` ;
            - \`"balance"\` ou \`"solde"\` : renvoie \`"balance: …"\` ;
            - \`"undo"\` : annule la dernière opération (\`"nothing to undo"\` si l'historique est vide) et renvoie le solde ;
            - toute autre commande : \`"unknown command: <commande>"\`.
          `,
          starter: py`
            def execute(command, account):
                ...


            account = {"balance": 100.0, "history": []}
            for c in ["deposit 50", "withdraw 30", "withdraw 500", "undo", "solde", "dance"]:
                print(f"{c!r:16} → {execute(c, account)}")
          `,
          solution: py`
            def execute(command, account):
                match command.split():
                    case ["deposit", amount]:
                        account["balance"] += float(amount)
                        account["history"].append(("deposit", float(amount)))
                    case ["withdraw", amount] if float(amount) <= account["balance"]:
                        account["balance"] -= float(amount)
                        account["history"].append(("withdraw", float(amount)))
                    case ["withdraw", _]:
                        return "insufficient funds"
                    case ["balance"] | ["solde"]:
                        pass
                    case ["undo"]:
                        if not account["history"]:
                            return "nothing to undo"
                        kind, amount = account["history"].pop()
                        account["balance"] += -amount if kind == "deposit" else amount
                    case _:
                        return f"unknown command: {command}"
                return f"balance: {account['balance']:.2f}"


            account = {"balance": 100.0, "history": []}
            for c in ["deposit 50", "withdraw 30", "withdraw 500", "undo", "solde", "dance"]:
                print(f"{c!r:16} → {execute(c, account)}")
          `,
          tests: [
            test("`match` / `case` est utilisé", "uses('Match')"),
            test(
              "Dépôt et retrait mettent à jour le solde et l'historique",
              "(lambda a: (execute('deposit 50', a), execute('withdraw 30', a), a['history']))({'balance': 100.0, 'history': []}) == ('balance: 150.00', 'balance: 120.00', [('deposit', 50.0), ('withdraw', 30.0)])",
            ),
            test("Solde insuffisant", "execute('withdraw 500', {'balance': 10.0, 'history': []}) == 'insufficient funds'"),
            test("`balance` et `solde` affichent le solde", "execute('balance', {'balance': 7.0, 'history': []}) == execute('solde', {'balance': 7.0, 'history': []}) == 'balance: 7.00'"),
            test(
              "`undo` annule la dernière opération",
              "(lambda a: (execute('undo', a), execute('deposit 10', a), execute('undo', a)))({'balance': 5.0, 'history': []}) == ('nothing to undo', 'balance: 15.00', 'balance: 5.00')",
            ),
            test("Commande inconnue", "execute('dance now', {'balance': 0.0, 'history': []}) == 'unknown command: dance now'"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 10.5
  "m10-l5": [
    {
      id: "ex1",
      title: "Efficacité des programmes",
      tiers: {
        core: {
          title: "Dire adieu aux boucles",
          prompt: md`
            Les versions avec boucles \`sum_of_squares_loop\` et \`dot_loop\` sont fournies. Écrivez leurs versions
            **vectorisées**, sans aucune boucle :

            1. \`sum_of_squares_np(n)\` : la somme des carrés de 0 à n−1 (attention : utilisez \`dtype=np.int64\`
               pour éviter les dépassements) ;
            2. \`dot_np(a, b)\` : le produit scalaire de deux tableaux, avec \`np.dot\`.
            3. Mesurez avec \`time.perf_counter()\` la durée de \`sum_of_squares_loop(300_000)\` et de
               \`sum_of_squares_np(300_000)\`, et rangez le rapport des deux durées dans \`speedup\`.
          `,
          starter: py`
            ${LOOPS}


            def sum_of_squares_np(n):
                ...


            def dot_np(a, b):
                ...


            speedup = ...
            print(f"NumPy est {speedup:.0f} fois plus rapide")
          `,
          solution: py`
            ${LOOPS}


            def sum_of_squares_np(n):
                values = np.arange(n, dtype=np.int64)
                return int((values * values).sum())


            def dot_np(a, b):
                return float(np.dot(a, b))


            start = time.perf_counter()
            sum_of_squares_loop(300_000)
            loop_time = time.perf_counter() - start

            start = time.perf_counter()
            sum_of_squares_np(300_000)
            numpy_time = time.perf_counter() - start

            speedup = loop_time / numpy_time
            print(f"NumPy est {speedup:.0f} fois plus rapide")
          `,
          tests: [
            test("`sum_of_squares_np` donne le même résultat", "all(sum_of_squares_np(n) == sum_of_squares_loop(n) for n in (0, 1, 10, 100_000))"),
            test("`dot_np` donne le même résultat", "(lambda a, b: approx(dot_np(a, b), dot_loop(a, b), 1e-6))(np.arange(50.0), np.linspace(0, 1, 50))"),
            test("Aucune boucle dans les versions vectorisées", "not has_loop(sum_of_squares_np) and not has_loop(dot_np) and 'np.dot' in __import__('inspect').getsource(dot_np)"),
            test("`speedup` mesure un vrai gain (> 1)", "isinstance(speedup, float) and speedup > 1", "speedup"),
          ],
        },
        extra: {
          title: "Pandas sans iterrows",
          prompt: md`
            \`df\` contient 2 000 lignes et quatre colonnes d'entiers \`a\`, \`b\`, \`c\`, \`d\` (de 0 à 49, \`c\` ≥ 1).
            Écrivez, **sans boucle ni \`iterrows\`** :

            1. \`add_ratio(df)\` : ajoute la colonne \`ratio\` = 100 × d / c et renvoie \`df\` ;
            2. \`add_e(df)\` : ajoute la colonne \`e\` (règle du cours) et renvoie \`df\` :
               - \`e = d\` si \`a == 0\` ;
               - \`e = b - c\` si \`0 < a <= 25\` ;
               - \`e = b + c\` sinon.
          `,
          hint: md`
            Commencez par le cas général \`df["e"] = df["b"] + df["c"]\`, puis corrigez avec
            \`df.loc[df["a"] <= 25, "e"] = …\` et enfin \`df.loc[df["a"] == 0, "e"] = …\` : l'ordre compte !
          `,
          starter: py`
            import numpy as np
            import pandas as pd

            rng = np.random.default_rng(0)
            df = pd.DataFrame(rng.integers(0, 50, size=(2000, 4)), columns=["a", "b", "c", "d"])
            df["c"] = df["c"] + 1


            def add_ratio(df):
                ...


            def add_e(df):
                ...


            print(add_e(add_ratio(df)).head())
          `,
          solution: py`
            import numpy as np
            import pandas as pd

            rng = np.random.default_rng(0)
            df = pd.DataFrame(rng.integers(0, 50, size=(2000, 4)), columns=["a", "b", "c", "d"])
            df["c"] = df["c"] + 1


            def add_ratio(df):
                df["ratio"] = 100 * (df["d"] / df["c"])
                return df


            def add_e(df):
                df["e"] = df["b"] + df["c"]
                df.loc[df["a"] <= 25, "e"] = df["b"] - df["c"]
                df.loc[df["a"] == 0, "e"] = df["d"]
                return df


            print(add_e(add_ratio(df)).head())
          `,
          tests: [
            test("`ratio` = 100 × d / c", "(lambda r: np.allclose(r['ratio'], 100 * r['d'] / r['c']))(add_ratio(df.copy()))"),
            test(
              "`e` suit la règle du cours",
              "(lambda r: np.array_equal(r['e'].to_numpy(), np.where(r['a'] == 0, r['d'], np.where(r['a'] <= 25, r['b'] - r['c'], r['b'] + r['c']))))(add_e(df.copy()))",
            ),
            test("Les trois cas sont présents dans les données", "(df['a'] == 0).any() and ((df['a'] > 0) & (df['a'] <= 25)).any() and (df['a'] > 25).any()"),
            test("Ni `iterrows` ni boucle", "'iterrows' not in SOURCE and not has_loop(add_ratio) and not has_loop(add_e)"),
          ],
        },
        stretch: {
          title: "Le bon algorithme",
          prompt: md`
            1. \`has_duplicates_fast(values)\` : même résultat que \`has_duplicates_slow\` (fournie, en O(n²)), mais en
               temps linéaire grâce à un ensemble.
            2. \`common_elements(a, b)\` : la liste **triée** des éléments communs à deux listes, avec une intersection d'ensembles.
            3. \`count_naive_calls(n)\` : le **nombre d'appels** effectués par la version récursive naïve de Fibonacci
               (\`fib(n) = fib(n-1) + fib(n-2)\`, \`fib(0) = 0\`, \`fib(1) = 1\`) pour calculer \`fib(n)\`. Utilisez une
               fonction interne et un compteur \`nonlocal\`.
            4. \`fib_fast(n)\` : Fibonacci récursive mais **mémoïsée** avec \`@functools.lru_cache\` ; \`fib_fast(300)\`
               doit être instantané.
          `,
          starter: py`
            import functools


            def has_duplicates_slow(values):
                for i in range(len(values)):
                    for j in range(i + 1, len(values)):
                        if values[i] == values[j]:
                            return True
                return False


            def has_duplicates_fast(values):
                ...


            def common_elements(a, b):
                ...


            def count_naive_calls(n):
                ...


            def fib_fast(n):
                ...


            print(has_duplicates_fast([3, 1, 4, 1, 5]), common_elements([1, 2, 3, 4], [3, 4, 5]))
            print(count_naive_calls(20), fib_fast(300))
          `,
          solution: py`
            import functools


            def has_duplicates_slow(values):
                for i in range(len(values)):
                    for j in range(i + 1, len(values)):
                        if values[i] == values[j]:
                            return True
                return False


            def has_duplicates_fast(values):
                return len(set(values)) != len(values)


            def common_elements(a, b):
                return sorted(set(a) & set(b))


            def count_naive_calls(n):
                calls = 0

                def fib(k):
                    nonlocal calls
                    calls += 1
                    return k if k < 2 else fib(k - 1) + fib(k - 2)

                fib(n)
                return calls


            @functools.lru_cache(maxsize=None)
            def fib_fast(n):
                return n if n < 2 else fib_fast(n - 1) + fib_fast(n - 2)


            print(has_duplicates_fast([3, 1, 4, 1, 5]), common_elements([1, 2, 3, 4], [3, 4, 5]))
            print(count_naive_calls(20), fib_fast(300))
          `,
          explanation: md`
            Le nombre d'appels de la version naïve vaut 2·F(n+1) − 1 : il croît comme Fibonacci lui-même (≈ 1,6ⁿ).
            Avec la mémoïsation, chaque valeur n'est calculée qu'**une fois** : n + 1 appels utiles seulement.
          `,
          tests: [
            test(
              "`has_duplicates_fast` donne les mêmes résultats",
              "all(has_duplicates_fast(v) == has_duplicates_slow(v) for v in ([], [1], [1, 2, 3], [1, 2, 1], ['a', 'b', 'a']))",
            ),
            test("`has_duplicates_fast` est rapide sur 200 000 valeurs", "has_duplicates_fast(list(range(200_000))) is False and not has_loop(has_duplicates_fast)"),
            test("`common_elements`", "common_elements([5, 1, 2, 3, 4], [3, 4, 5, 9]) == [3, 4, 5] and common_elements([], [1]) == []"),
            test("`count_naive_calls(20)` vaut 21 891", "count_naive_calls(20) == 21891 and count_naive_calls(1) == 1 and count_naive_calls(2) == 3", "count_naive_calls(20)"),
            test("`fib_fast` est mémoïsée", "fib_fast(300) == 222232244629420445529739893461909967206666939096499764990979600 and hasattr(fib_fast, 'cache_info')"),
          ],
        },
      },
    },
  ],
};
