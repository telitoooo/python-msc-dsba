import { md } from "../helpers.js";

export default {
  "m3-l1": {
    ex1: {
      title: "First functions",
      core: {
        title: "Three computing functions",
        prompt: md`
          Write the following functions. Each one **returns** its result with \`return\` (no \`print\` inside):

          - \`carre(x)\`: returns \`x²\` (the square);
          - \`est_pair(n)\`: returns \`True\` if \`n\` is even, \`False\` otherwise;
          - \`aire_rectangle(longueur, largeur)\`: returns the area of the rectangle.
        `,
        hint: md`\`est_pair\` can fit in one line: \`return n % 2 == 0\` (the comparison already is a boolean).`,
        tests: [
          "`carre(3)` returns 9 and `carre(-4)` returns 16",
          "`est_pair(4)` returns `True`",
          "`est_pair(7)` returns `False`",
          "`aire_rectangle(3, 4)` returns 12",
          "The functions print nothing (they return)",
        ],
      },
      extra: {
        title: "Conversions and honours",
        prompt: md`
          1. \`celsius_vers_fahrenheit(c)\` returns \`c × 9/5 + 32\`.
          2. \`fahrenheit_vers_celsius(f)\` does the inverse conversion.
          3. \`mention(note)\` returns the baccalaureate honours (see lesson 2.1) using **early \`return\`s** rather than an
             intermediate variable.
        `,
        hint: md`
          In \`mention\`, each \`if\` ends with a \`return\`: no need to write \`elif\` or \`else\`, since the function stops at
          the first \`return\` executed.
        `,
        tests: [
          "0 °C → 32 °F and 100 °C → 212 °F",
          "-40 °C → -40 °F",
          "98.6 °F → 37 °C",
          "Round trip: `f→c(c→f(25)) == 25`",
          "`mention` handles all the bounds",
        ],
      },
      stretch: {
        title: "GCD, LCM and fractions",
        prompt: md`
          1. \`pgcd(a, b)\`: the greatest common divisor (GCD), with **Euclid's algorithm**: as long as \`b\` is not zero,
             replace \`(a, b)\` by \`(b, a % b)\`; the result is \`a\`.
          2. \`ppcm(a, b)\`: the least common multiple (LCM), knowing that \`pgcd(a, b) × ppcm(a, b) = a × b\`. Reuse \`pgcd\`!
          3. \`simplifier(num, den)\`: returns the simplified fraction as a **string**: \`simplifier(6, 8)\` → \`"3/4"\`, and
             \`simplifier(10, 5)\` → \`"2"\` (denominator 1).
        `,
        hint: md`
          \`a, b = b, a % b\` performs the simultaneous update. For \`simplifier\`, divide numerator and denominator by their
          GCD (with \`//\` to keep integers).
        `,
        tests: [
          "`pgcd(48, 18)` = 6 and `pgcd(17, 5)` = 1",
          "`pgcd(0, 7)` = 7",
          "`ppcm(4, 6)` = 12 and `ppcm(21, 6)` = 42",
          "`simplifier(6, 8)` = `'3/4'`",
          "`simplifier(12, 36)` = `'1/3'`",
          "`simplifier(10, 5)` = `'2'`",
          "`pgcd` uses a `while` loop",
        ],
      },
    },
    ex2: {
      title: "Compound interest, dichotomy and Collatz",
      core: {
        title: "Hands-on 5, steps 2 to 4: functions, docstring and main",
        prompt: md`
          Take the compound interest computation again and structure it:

          1. **functions**: \`compound(amount, years, rate)\` **returns** (without printing anything) the final amount
             rounded to 2 decimals;
          2. **docstring**: document \`compound\`;
          3. **main**: \`main()\` reads the amount, the number of years and the rate (\`input\`), then prints
             \`After 10 years: 1628.89\`; it is only called under \`if __name__ == "__main__":\`.
        `,
        tests: [
          "`compound(1000, 10, 5)` returns 1628.89",
          "`compound` returns without printing",
          "`compound` has a docstring",
          "`main()` is called under `if __name__ == \"__main__\":`",
        ],
      },
      extra: {
        title: "Zero of a function by dichotomy",
        prompt: md`
          Write the function \`f(x) = x³ + x + 1\`, then \`dichotomy(a, b, eps)\`, which looks for its zero in the interval
          [a, b]: if \`f(a)\` and \`f(b)\` have the same sign, it returns \`None\`; otherwise, as long as \`|a − b| > eps\`,
          take the middle \`h\` and keep the half where \`f\` changes sign. It returns the final middle.

          The expression x³ + x + 1 must appear **only once** in your code: this is the whole point of \`f\`!
        `,
        tests: [
          "`f(1)` is 3",
          "Zero found in [-2, 2] (≈ -0.6823)",
          "Same sign at the bounds → `None`",
          "The precision `eps` is respected",
          "The expression is written only once",
        ],
      },
      stretch: {
        title: "Hands-on 12 with functions",
        prompt: md`
          Split the Collatz conjecture into small functions:

          1. \`next_value(n)\`: n / 2 if n is even, 3n + 1 otherwise;
          2. \`sequence(n)\`: the **list** of the values from n down to 1 (included);
          3. \`steps(n)\` and \`highest(n)\`: the number of steps and the highest value reached (reuse \`sequence\`);
          4. \`longest_below(limit)\`: the tuple \`(n, steps(n))\` of the n < limit that needs the most steps;
          5. finally, copy the course program in which three functions \`f\`, \`g\` and \`h\` call each other: \`f(x)\` prints
             \`x\` (followed by a space, \`end=" "\`), returns 1 if \`x == 1\`, otherwise \`g(x)\` if x is even (\`g\` calls
             \`f(x // 2)\`) or \`h(x)\` if it is odd (\`h\` calls \`f(3 * x + 1)\`).
        `,
        tests: [
          "`next_value`",
          "`sequence(6)`",
          "`steps(27)` = 111 and `highest(27)` = 9232",
          "`longest_below(100)` = (97, 118)",
          "`f`, `g`, `h` call each other",
        ],
      },
    },
  },

  "m3-l2": {
    ex1: {
      title: "Flexible parameters",
      core: {
        title: "Default values",
        prompt: md`
          1. \`saluer(nom, salutation="Bonjour")\` (greet) returns for instance \`"Bonjour, Ada !"\`.
          2. \`prix_ttc(prix_ht, tva=0.2)\` returns the price including tax **rounded to 2 decimals**.

          Test positional **and** named calls.
        `,
        hint: md`Careful with the exact format: comma after the greeting, space before the exclamation mark.`,
        tests: [
          "`saluer('Ada')` → `'Bonjour, Ada !'`",
          "`saluer('Alan', 'Salut')` → `'Salut, Alan !'`",
          "Named arguments out of order",
          "`prix_ttc(100)` → 120.0",
          "`prix_ttc(19.99, tva=0.055)` → 21.09",
        ],
      },
      extra: {
        title: "Variable number of arguments",
        prompt: md`
          1. \`moyenne(*notes)\` returns the mean of the arguments, or \`None\` if there are none.
          2. \`maximum(*nombres)\` returns the largest argument (or \`None\`) **without using \`max()\`**.

          Examples: \`moyenne(12, 15, 18)\` → \`15.0\`; \`maximum(3, 9, 2)\` → \`9\`.
        `,
        hint: md`
          \`notes\` is a tuple: \`len(notes)\` and a \`for\` loop work. For the maximum, start from the first element
          \`nombres[0]\` (“running maximum” pattern).
        `,
        tests: [
          "`moyenne(12, 15, 18)` → 15.0",
          "`moyenne(10)` → 10.0",
          "`moyenne()` → `None`",
          "`maximum(3, 9, 2)` → 9",
          "`maximum(-5, -2, -9)` → -2",
          "`maximum()` → `None`",
          "`max()` is not used",
        ],
      },
      stretch: {
        title: "Formatting a price",
        prompt: md`
          Write \`formater_prix(montant, devise="€", decimales=2, separateur=" ")\` (format a price), which returns the amount:

          - with \`decimales\` digits after the decimal point;
          - with \`separateur\` between thousands;
          - followed by a space and the \`devise\` (currency).

          | Call | Result |
          |---|---|
          | \`formater_prix(1234567.891)\` | \`"1 234 567.89 €"\` |
          | \`formater_prix(1234.4, devise="$", decimales=0)\` | \`"1 234 $"\` |
          | \`formater_prix(5000, devise="CHF", separateur="'")\` | \`"5'000.00 CHF"\` |
        `,
        hint: md`
          The \`{x:,.2f}\` format uses the comma as thousands separator: \`f"{1234.5:,.2f}"\` → \`"1,234.50"\`. The number of
          decimals can itself come from a variable: \`f"{x:,.{decimales}f}"\`. Then replace the commas with the separator.
        `,
        tests: [
          "`formater_prix(1234567.891)`",
          "Dollars without decimals",
          "Swiss francs with an apostrophe",
          "Small amount: `formater_prix(9.5)` → `'9.50 €'`",
        ],
      },
    },
    ex2: {
      title: "Functions as parameters",
      core: {
        title: "A generic dichotomy",
        prompt: md`
          Write \`dichotomy(func, a=-10, b=10, eps=0.000001)\`: the studied function is now a **parameter**, and the interval
          and the precision have **default values**. It returns the zero found, or \`None\` if \`func(a)\` and \`func(b)\`
          have the same sign.

          Call it in different ways: \`dichotomy(f)\`, \`dichotomy(f, -2, 2)\`, \`dichotomy(f, eps=0.001, b=2)\`, and with an
          anonymous function to find √2: \`dichotomy(lambda x: x * x - 2, 0, 2)\`.
        `,
        tests: [
          "With the default values",
          "√2 with a lambda",
          "Named arguments",
          "Same sign → `None`",
          "The default values are -10, 10 and 0.000001",
        ],
      },
      extra: {
        title: "Printing the code and counting calls",
        prompt: md`
          The \`dichotomy(func, a, b, eps)\` function is provided.

          1. \`source_of(func)\` returns the **source code** of \`func\` (\`inspect.getsource\`), without leading and trailing spaces.
          2. \`report(func, a, b)\` returns for instance \`"zero of f in [-2, 2]: -0.6823"\` (function name with
             \`func.__name__\`, zero computed with \`eps=1e-6\` and displayed with 4 decimals).
          3. As in the course, count the evaluations of the function with a **global** variable: \`f_count(x)\` adds 1 to
             \`count\` (\`global\` keyword) then returns x³ + x + 1. \`evaluations(eps)\` resets \`count\` to 0, runs
             \`dichotomy(f_count, -2, 2, eps)\` and returns the number of calls.
        `,
        tests: [
          "`source_of(f)` returns the code of `f`",
          "`report(f, -2, 2)`",
          "`report` uses the function's name",
          "`evaluations`: more precision = more calls",
          "The `global` keyword is used",
        ],
      },
      stretch: {
        title: "Newton versus dichotomy",
        prompt: md`
          **Newton's method** also finds a zero, by following the tangent: x ← x − f(x) / f'(x).

          1. \`newton(func, dfunc, x0, eps=1e-12, max_iter=100)\` starts from \`x0\` and iterates until \`|func(x)| < eps\`; it
             returns the tuple \`(x, number of iterations)\`. If the derivative is zero, it raises \`ValueError\`; if
             \`max_iter\` iterations are not enough, it raises \`ValueError\` too.
          2. \`bisection(func, a, b, eps=1e-12)\`: the dichotomy, which also returns \`(x, number of iterations)\`.
          3. Compare on x³ + x + 1 (derivative 3x² + 1): store in \`newton_iterations\` and \`bisection_iterations\` the numbers
             of iterations obtained with \`newton(f, df, 0)\` and \`bisection(f, -2, 2)\`.
        `,
        explanation: md`
          Dichotomy divides the error by 2 at each step (**linear** convergence); Newton roughly **doubles** the number of
          exact digits at each iteration (**quadratic** convergence)… but it needs the derivative and a good starting point.
        `,
        tests: [
          "Newton finds the zero of x³ + x + 1",
          "√2 by Newton",
          "Zero derivative → `ValueError`",
          "`bisection` returns the zero and the number of iterations",
          "Newton is much faster",
        ],
      },
    },
  },

  "m3-l3": {
    ex1: {
      title: "Mastering scope",
      core: {
        title: "Fixing a counter",
        prompt: md`
          Run the starter code: it crashes with an \`UnboundLocalError\`. Why?

          Fix it **without using \`global\`**: the function \`incrementer\` must receive the value as a parameter and **return**
          the value increased by 1. The main program calls it three times, then prints \`compteur = 3\`.
        `,
        hint: md`Expected signature: \`def incrementer(valeur):\`. At the call site: \`compteur = incrementer(compteur)\`.`,
        explanation: md`
          In the original version, the assignment \`compteur = ...\` makes \`compteur\` **local** to the whole function: Python
          therefore tries to read a local variable that has no value yet. The fixed version is a **pure function**: same
          input, same output, no side effect.
        `,
        tests: [
          "Prints `compteur = 3`",
          "`incrementer(10)` returns 11",
          "The `global` keyword is not used",
        ],
      },
      extra: {
        title: "Predict before running",
        prompt: md`
          Read the code carefully **without running it**. Replace each \`...\` with your **prediction** (a number), then run to
          check: the program prints the real values at the end.

          Do not cheat: it is the ideal exercise to check that you understood the LEGB rule.
        `,
        hint: md`
          An assignment in a function creates a **local** variable. A parameter is local. Only a function declaring
          \`global x\` can modify the global \`x\`.
        `,
        tests: [
          "p1: value returned by `f()`",
          "p2: `x` after `f()`",
          "p3: value returned by `g()`",
          "p4: value returned by `h(7)`",
          "p5: `x` after `h(x)`",
          "p6: `x` after `k()`",
        ],
      },
      stretch: {
        title: "A counter with a closure",
        prompt: md`
          Write \`creer_compteur(depart=0, pas=1)\` (create a counter, with a start and a step), which **returns a function**.
          Each call of this function increases an internal counter by \`pas\` and returns the new value:

          \`\`\`python
          c = creer_compteur()
          c(), c(), c()            # 1, 2, 3
          d = creer_compteur(10, 5)
          d(), d()                 # 15, 20 (independent of c)
          \`\`\`

          Using \`global\` is forbidden: each counter must have its own state.
        `,
        hint: md`
          Define a function \`suivant()\` (next) **inside** \`creer_compteur\`, declare \`nonlocal valeur\` to be able to modify
          the enclosing variable, then \`return suivant\` (without parentheses).
        `,
        explanation: md`
          \`suivant\` “captures” the variable \`valeur\` of \`creer_compteur\`: it is a **closure**. Each call to
          \`creer_compteur\` creates a new \`valeur\` variable, hence independent counters.
        `,
        tests: [
          "`creer_compteur()` returns a function",
          "Successive calls: 1, 2, 3",
          "Two counters are independent",
          "`creer_compteur(10, 5)`: 15 then 20",
          "`nonlocal` is used, not `global`",
        ],
      },
    },
  },
};
