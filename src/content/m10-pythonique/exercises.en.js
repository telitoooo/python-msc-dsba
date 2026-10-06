import { md } from "../helpers.js";

export default {
  "m10-l1": {
    ex1: {
      title: "Generators and iterators",
      core: {
        title: "myrange and generator expressions",
        prompt: md`
          1. \`myrange(a, b, step=1)\`: a **generator function** (with \`yield\`) that produces \`a\`, \`a + step\`, … as long
             as the value is strictly less than \`b\` (assume \`step > 0\`).
          2. \`even_squares\`: a **generator expression** of the squares of the even numbers from 0 to 19.
          3. \`total\`: the sum of the squares from 1 to 1000, computed **without building a list** (a generator
             expression passed to \`sum\`).
        `,
        tests: [
          "`myrange` is a generator function (`yield`)",
          "`list(myrange(3, 7))` is [3, 4, 5, 6]",
          "The step works: `myrange(0, 10, 3)`",
          "`even_squares` is a generator",
          "`total` is 333,833,500, with no intermediate list",
        ],
      },
      extra: {
        title: "The iterator protocol",
        prompt: md`
          1. Write the course's \`PowTwo(max)\` class: \`__iter__\` resets the counter and returns \`self\`, \`__next__\`
             returns 2⁰, 2¹, …, 2^max then raises \`StopIteration\`.
          2. Write the \`Countdown(start)\` class, which can be iterated **several times**: \`for n in Countdown(3)\` gives
             3, 2, 1. Here \`__iter__\` is a **generator function** (it contains \`yield\`): each call creates a new iterator.
        `,
        hint: md`
          For \`Countdown\`, no \`__next__\` is needed: \`def __iter__(self): n = self.start; while n > 0: yield n; n -= 1\`.
        `,
        tests: [
          "`list(PowTwo(3))` is [1, 2, 4, 8]",
          "`PowTwo` defines `__iter__` and `__next__`",
          "`next` raises `StopIteration` at the end",
          "`Countdown(3)` gives 3, 2, 1",
          "`Countdown` can be iterated several times",
        ],
      },
      stretch: {
        title: "Lazy pipelines",
        prompt: md`
          All the functions below are **generators** (except \`take\` and \`count_errors\`):

          1. \`fibonacci()\`: the infinite sequence 1, 1, 2, 3, 5, 8…;
          2. \`primes()\`: the infinite sequence of prime numbers;
          3. \`take(n, iterable)\`: the **list** of the first \`n\` elements (with \`itertools.islice\`);
          4. \`read_lines(path)\`: produces the **non-empty** lines of the file, without the trailing \`\\n\`;
          5. \`parse(lines)\`: for each line \`"LEVEL: message"\`, produces the tuple \`(level, message)\`;
          6. \`errors(records)\`: only lets through the records of level \`"ERROR"\`;
          7. \`count_errors(path)\`: the number of errors in the file, by chaining the three generators.

          Thanks to generators, a huge file can be processed without ever loading it fully into memory.
        `,
        hint: md`
          \`line.split(": ", 1)\` splits at the first \`": "\` only. \`sum(1 for _ in errors(…))\` counts without a list.
        `,
        tests: [
          "`take(10, fibonacci())`",
          "`take(8, primes())`",
          "`read_lines`, `parse` and `errors` are generators",
          "`parse` splits level and message",
          "`count_errors('server.log')` is 3",
          "The pipeline is lazy (it works on an infinite stream)",
        ],
      },
    },
  },

  "m10-l2": {
    ex1: {
      title: "Functional programming",
      core: {
        title: "map, filter, lambda and friends",
        prompt: md`
          Redo the course examples, **without any \`for\` loop or comprehension**:

          1. \`l_squared\`: the **list** of the squares of \`l\` (\`map\` + \`lambda\`);
          2. \`l_even\`: the **list** of the even elements of \`l\` (\`filter\` + \`lambda\`);
          3. \`all_positive\` / \`any_negative\`: are all elements positive? is one of them negative?
          4. sort \`pairs\` **in place** by name (2nd element);
          5. \`by_length\`: the words of \`words\` sorted by increasing length (\`sorted\` + \`key\`);
          6. \`index_of\`: a dictionary word → position in \`words\`, with \`enumerate\` and \`dict\`… without a loop.
        `,
        hint: md`
          \`dict(map(lambda pair: (pair[1], pair[0]), enumerate(words)))\` builds the dictionary without an explicit loop.
        `,
        tests: [
          "`l_squared` and `l_even` are lists",
          "`all_positive` is true, `any_negative` is false",
          "`pairs` is sorted by name",
          "`by_length` sorted by length",
          "`index_of` maps each word to its position",
          "`map`, `filter` and `lambda`, without loops or comprehensions",
        ],
      },
      extra: {
        title: "Analysing a web log",
        prompt: md`
          \`access.log\` is the log of a web server. Each line looks like:
          \`10.0.0.7 - - [12/Sep/2022:11:10:00] "GET /admin HTTP/1.1" 404 1520\`
          (IP address, date, request, **status code**, size).

          1. \`ip_and_code(line)\` returns the tuple \`(ip, code)\`: the first word and the second-to-last one (a string).
          2. \`lines\`: the list of the lines of the file.
          3. \`status_counts\`: a \`collections.Counter\` of the number of requests per code.
          4. \`top_404\`: the tuple \`(count, ip)\` of the IP that received the most 404 errors, in **a single expression**
             as in the course (\`max\` of a comprehension over a \`Counter\`).
        `,
        tests: [
          "`ip_and_code` extracts the IP and the code",
          "`lines` contains the 80 lines",
          "`status_counts` counts the codes",
          "`top_404`: the IP most affected by 404s",
        ],
      },
      stretch: {
        title: "Writing your own decorators",
        prompt: md`
          1. \`count_calls(func)\`: returns a function that calls \`func\` and counts its calls in its \`calls\`
             attribute (0 at first).
          2. \`memoize(func)\`: returns a function that stores its results in a \`cache\` dictionary (attribute of the
             returned function) and never calls \`func\` twice with the same argument.
          3. \`timed(func)\`: returns a function that appends the duration of each call to the \`durations\` list
             (attribute of the returned function).
          4. All three use \`functools.wraps\`, to keep the name and docstring of \`func\`.
          5. Decorate \`square\` with \`@count_calls\` and \`fib\` (naive recursive) with \`@memoize\`.
        `,
        hint: md`
          A function is an object: you can add attributes to it (\`wrapper.calls = 0\`). Inside \`wrapper\`, write
          \`wrapper.calls += 1\`.
        `,
        tests: [
          "`count_calls` counts the calls",
          "`square` is decorated and keeps its name and docstring",
          "`memoize` never calls the function twice with the same argument",
          "`fib(80)` is instantaneous thanks to `@memoize`",
          "`timed` records one duration per call",
          "`functools.wraps` is used",
        ],
      },
    },
  },

  "m10-l3": {
    ex1: {
      title: "Reliable code",
      core: {
        title: "Assertions and a context manager",
        prompt: md`
          1. \`isqrt(n)\`: the smallest integer \`i\` such that \`i * i >= n\` (the course's function). An assertion first
             checks that \`n >= 0\`, with the message \`"n must be non-negative"\`.
          2. \`mean(values)\`: the mean of a list, with an assertion forbidding an empty list (message \`"empty list"\`).
          3. \`Timer\`: a context manager (\`__enter__\` / \`__exit__\`). \`__enter__\` starts the stopwatch and returns the
             object; \`__exit__\` stores the duration (\`time.perf_counter\`) in \`self.elapsed\` and returns \`False\`.
          4. Use \`with Timer() as t:\` to time \`mean\` on one million values.
        `,
        tests: [
          "`isqrt` is correct",
          "`isqrt(-25)` raises `AssertionError: n must be non-negative`",
          "`mean([])` raises `AssertionError`",
          "`Timer` is a context manager that measures a duration",
          "The program uses `with Timer() as …`",
        ],
      },
      extra: {
        title: "Writing unit tests",
        prompt: md`
          The \`distance\` function is provided (and correct). Write the \`EuclideanTestCase\` class
          (\`unittest.TestCase\`) with **at least 3 tests**:

          - the distance from a point to itself is zero (\`assertEqual\`);
          - the distance is **symmetric** and strictly positive for two distinct points (\`assertGreater\`);
          - a known value: from (0, 0) to (3, 4), the distance is 5 (\`assertAlmostEqual\`).

          Then run them. Your tests will be tested themselves: they must **pass** with the right function and **fail**
          with wrong versions of \`distance\`.
        `,
        hint: md`
          To run the tests and see the result:
          \`unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(EuclideanTestCase))\`
          or simply \`unittest.main(exit=False)\`.
        `,
        tests: [
          "`EuclideanTestCase` inherits from `unittest.TestCase`",
          "At least 3 tests, which pass with the right function",
          "They detect a function that always returns 0",
          "They detect the Manhattan distance",
          "They detect a non-symmetric function",
        ],
      },
      stretch: {
        title: "Logging the operations of an account",
        prompt: md`
          Replace the \`print\`s of the bank account with **logging**:

          1. configure \`logging.basicConfig\` to write to the file \`bank.log\`, at level **INFO**, with the format
             \`"%(levelname)s:%(message)s"\` (and \`force=True\`);
          2. \`deposit\` logs at INFO: \`"Ada deposits 50.00"\`;
          3. \`withdraw\` logs at INFO \`"Ada withdraws 20.00"\`, or at **WARNING** \`"Ada withdraws a large amount: 1500.00"\`
             above 1000; if the balance is insufficient, it logs at **ERROR** \`"Ada: insufficient funds for 10000.00"\`
             then raises \`ValueError\`;
          4. \`dump\` logs the state at **DEBUG** (\`"state: …"\`): this message must **not** appear in the file.
        `,
        hint: md`Amounts are formatted with \`{amount:.2f}\`. \`logging.debug(…)\`, \`logging.info(…)\`, \`logging.warning(…)\`, \`logging.error(…)\`.`,
        tests: [
          "`bank.log` was created",
          "The 4 expected messages, in order",
          "The DEBUG message does not appear",
          "No more `print`: everything goes through logging",
          "The final balance is correct",
        ],
      },
    },
  },

  "m10-l4": {
    ex1: {
      title: "Command line and good practices",
      core: {
        title: "Arguments with argparse",
        prompt: md`
          1. \`build_parser()\` returns an \`argparse.ArgumentParser\` with: an **optional** positional argument \`name\`
             (\`nargs="?"\`, \`"World"\` by default), the option \`--num_iter\` (integer, 10 by default) and the flag
             \`--verbose\` (\`action="store_true"\`).
          2. \`main(argv=None)\` parses \`argv\` (\`parser.parse_args(argv)\`: with \`None\`, argparse reads the real
             command line) and **returns** \`"Hello <name>: <num_iter> iterations"\`, followed by \`" (verbose)"\` if
             the flag is present.
          3. At the end of the file, protected by \`if __name__ == "__main__":\`, the program prints \`main()\`.

          Here the “command line” is simulated: the tests run your program like \`python main.py Zoe --num_iter=3\`.
        `,
        tests: [
          "`build_parser()` returns an `ArgumentParser`",
          "`main(['Ada'])` and `main([])` use the default values",
          "Options and flag",
          "Run from the command line, the program reads `sys.argv`",
          "An invalid integer stops argparse (code 2)",
        ],
      },
      extra: {
        title: "Back to PEP 8 style",
        prompt: md`
          This code works but follows no convention at all. Rewrite it:

          - the function becomes \`compute_distance(x, y)\` (snake_case, lower-case parameters), with **type hints**
            (\`tuple[float, float]\` for the points, \`-> float\` for the result) and a Google-style **docstring** with
            the \`Args:\` and \`Returns:\` sections;
          - the class becomes \`VendingMachine\` (CapWords), whose attribute is called \`max_products\`;
          - the constant becomes \`MAX_PRODUCTS\`;
          - **4-space** indentation, spaces around operators and after commas, two blank lines between definitions.
        `,
        tests: [
          "The old names are gone",
          "`compute_distance` works",
          "Type hints on the parameters and the return value",
          "Docstring with `Args:` and `Returns:`",
          "`VendingMachine(3).max_products == 3` and `MAX_PRODUCTS == 5`",
          "Indentation in multiples of 4 spaces",
        ],
      },
      stretch: {
        title: "A command interpreter with match",
        prompt: md`
          Write \`execute(command, account)\`, where \`account\` is a dictionary \`{"balance": …, "history": […]}\`. Use
          **\`match\` / \`case\`** on \`command.split()\`:

          - \`"deposit 50"\`: adds the amount, records it in the history (\`("deposit", 50.0)\`), returns \`"balance: 150.00"\`;
          - \`"withdraw 30"\`: same if the balance is sufficient (\`if\` guard); otherwise returns \`"insufficient funds"\`;
          - \`"balance"\` or \`"solde"\`: returns \`"balance: …"\`;
          - \`"undo"\`: cancels the last operation (\`"nothing to undo"\` if the history is empty) and returns the balance;
          - any other command: \`"unknown command: <command>"\`.
        `,
        tests: [
          "`match` / `case` is used",
          "Deposit and withdrawal update the balance and the history",
          "Insufficient balance",
          "`balance` and `solde` show the balance",
          "`undo` cancels the last operation",
          "Unknown command",
        ],
      },
    },
  },

  "m10-l5": {
    ex1: {
      title: "Program efficiency",
      core: {
        title: "Say goodbye to loops",
        prompt: md`
          The loop versions \`sum_of_squares_loop\` and \`dot_loop\` are provided. Write their **vectorised** versions,
          without any loop:

          1. \`sum_of_squares_np(n)\`: the sum of the squares from 0 to n−1 (careful: use \`dtype=np.int64\` to avoid
             overflows);
          2. \`dot_np(a, b)\`: the dot product of two arrays, with \`np.dot\`.
          3. Measure with \`time.perf_counter()\` the duration of \`sum_of_squares_loop(300_000)\` and of
             \`sum_of_squares_np(300_000)\`, and store the ratio of both durations in \`speedup\`.
        `,
        tests: [
          "`sum_of_squares_np` gives the same result",
          "`dot_np` gives the same result",
          "No loop in the vectorised versions",
          "`speedup` measures a real gain (> 1)",
        ],
      },
      extra: {
        title: "Pandas without iterrows",
        prompt: md`
          \`df\` contains 2,000 rows and four integer columns \`a\`, \`b\`, \`c\`, \`d\` (from 0 to 49, \`c\` ≥ 1). Write,
          **without loops or \`iterrows\`**:

          1. \`add_ratio(df)\`: adds the column \`ratio\` = 100 × d / c and returns \`df\`;
          2. \`add_e(df)\`: adds the column \`e\` (the course's rule) and returns \`df\`:
             - \`e = d\` if \`a == 0\`;
             - \`e = b - c\` if \`0 < a <= 25\`;
             - \`e = b + c\` otherwise.
        `,
        hint: md`
          Start with the general case \`df["e"] = df["b"] + df["c"]\`, then fix it with \`df.loc[df["a"] <= 25, "e"] = …\`
          and finally \`df.loc[df["a"] == 0, "e"] = …\`: the order matters!
        `,
        tests: [
          "`ratio` = 100 × d / c",
          "`e` follows the course's rule",
          "The three cases occur in the data",
          "Neither `iterrows` nor loops",
        ],
      },
      stretch: {
        title: "The right algorithm",
        prompt: md`
          1. \`has_duplicates_fast(values)\`: same result as \`has_duplicates_slow\` (provided, O(n²)), but in linear time
             thanks to a set.
          2. \`common_elements(a, b)\`: the **sorted** list of the elements common to two lists, with a set intersection.
          3. \`count_naive_calls(n)\`: the **number of calls** made by the naive recursive version of Fibonacci
             (\`fib(n) = fib(n-1) + fib(n-2)\`, \`fib(0) = 0\`, \`fib(1) = 1\`) to compute \`fib(n)\`. Use an inner function
             and a \`nonlocal\` counter.
          4. \`fib_fast(n)\`: recursive Fibonacci, but **memoised** with \`@functools.lru_cache\`; \`fib_fast(300)\` must be
             instantaneous.
        `,
        explanation: md`
          The number of calls of the naive version is 2·F(n+1) − 1: it grows like Fibonacci itself (≈ 1.6ⁿ). With
          memoisation, each value is computed **once**: only n + 1 useful calls.
        `,
        tests: [
          "`has_duplicates_fast` gives the same results",
          "`has_duplicates_fast` is fast on 200,000 values",
          "`common_elements`",
          "`count_naive_calls(20)` is 21,891",
          "`fib_fast` is memoised",
        ],
      },
    },
  },
};
