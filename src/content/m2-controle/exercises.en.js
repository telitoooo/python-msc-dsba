import { md } from "../helpers.js";

export default {
  "m2-l1": {
    ex1: {
      title: "Making decisions",
      core: {
        title: "Baccalaureate honours",
        prompt: md`
          From \`note\` (a grade out of 20), store in \`mention\` the matching honours string, then print it.

          | Grade | Honours |
          |---|---|
          | ≥ 16 | \`"Très bien"\` |
          | ≥ 14 | \`"Bien"\` |
          | ≥ 12 | \`"Assez bien"\` |
          | ≥ 10 | \`"Passable"\` |
          | < 10 | \`"Ajourné"\` |

          Keep the line \`note = ...\` at the top of the program: the tests replace it with other values.
        `,
        hint: md`An \`if\` / \`elif\` / \`else\` chain, starting with the most demanding condition (\`note >= 16\`).`,
        tests: [
          "13.5 → `Assez bien`",
          "18 → `Très bien`",
          "9.5 → `Ajourné`",
          "Exact bounds: 16, 14, 12 and 10",
          "The honours are printed",
        ],
      },
      extra: {
        title: "The cinema fare",
        prompt: md`
          Compute the \`prix\` (price) of a cinema ticket according to \`age\`, \`etudiant\` (student, a boolean) and \`jour\` (day):

          - under 12: **6 €**;
          - otherwise, student **or** 65 and over: **8.5 €**;
          - otherwise: **12 €**;
          - on **Wednesday** (\`"mercredi"\`), all fares are reduced by **2 €**.

          Print \`Prix : 6.5 €\` (for the starting values).
        `,
        hint: md`
          First compute the base fare with \`if\` / \`elif\` / \`else\`, **then** apply the reduction with a second, independent \`if\`.
        `,
        tests: [
          "22-year-old student on a Wednesday: 6.5 €",
          "10-year-old child on a Monday: 6 €",
          "10-year-old **student** child: still 6 €",
          "70-year-old senior on a Saturday: 8.5 €",
          "30-year-old adult on a Monday: 12 €",
          "30-year-old adult on a Wednesday: 10 €",
        ],
      },
      stretch: {
        title: "Quadratic equation",
        prompt: md`
          Solve \`a·x² + b·x + c = 0\`. Compute the discriminant \`delta = b² - 4ac\`, store in \`nb_solutions\` the number of
          real solutions (0, 1 or 2) and print them:

          - \`delta > 0\`: two solutions \`(-b - √delta) / 2a\` and \`(-b + √delta) / 2a\`;
          - \`delta == 0\`: one solution \`-b / 2a\`;
          - \`delta < 0\`: no real solution.

          **Special case**: if \`a == 0\`, the equation \`b·x + c = 0\` has one solution \`-c / b\` (assume \`b ≠ 0\`). The square
          root is obtained with \`** 0.5\`.
        `,
        hint: md`
          Handle \`a == 0\` **first** (otherwise division by zero), then distinguish the three cases according to \`delta\`
          with an \`if\` / \`elif\` / \`else\` nested in the \`else\`.
        `,
        tests: [
          "x² - 3x + 2 = 0: two solutions",
          "The solutions 1.0 and 2.0 are printed",
          "x² + 2x + 1 = 0: one solution (-1.0)",
          "x² + 1 = 0: no solution",
          "2x - 4 = 0 (a = 0): one solution (2.0)",
        ],
      },
    },
    ex2: {
      title: "Ages, laws and calendar",
      core: {
        title: "Hands-on 3: how old?",
        prompt: md`
          Write \`category(age)\`, which returns the age category:

          | Age | Category |
          |---|---|
          | 0 to 12 | \`"Kid"\` |
          | 13 to 19 | \`"Teenager"\` |
          | 20 to 30 | \`"Young Adult"\` |
          | 31 to 64 | \`"Adult"\` |
          | 65 or above | \`"Senior"\` |

          The program then reads an age with \`input()\` and prints its category.
        `,
        tests: [
          "25 years → `Young Adult`",
          "Bounds: 12, 13, 19, 20, 30, 31, 64, 65",
          "0 and 100 years",
        ],
      },
      extra: {
        title: "Hands-on 6: legal age",
        prompt: md`
          Depending on the country (\`"us"\`, \`"uk"\` or \`"de"\`), you can vote at 18 everywhere, but drink alcohol at 21 in
          the United States, 18 in the United Kingdom and 16 in Germany (beer and wine).

          1. \`rights(age, country)\` returns the tuple \`(can_vote, can_drink)\` of two booleans; for an unknown country it
             raises \`ValueError\`.
          2. The program reads the age then the nationality, and prints \`Vote: yes\` / \`Vote: no\` then \`Alcohol: yes\` /
             \`Alcohol: no\`.
        `,
        hint: md`An \`if\` / \`elif\` on the country sets the legal drinking age; \`raise ValueError("unknown country")\` otherwise.`,
        tests: [
          "17 in Germany: no vote, alcohol allowed",
          "20 in the United States: vote yes, alcohol no",
          "18 in the United Kingdom: both",
          "Unknown country → `ValueError`",
          "The program reads the inputs (`US` in capitals accepted)",
        ],
      },
      stretch: {
        title: "Hands-on 7 bis: the date of Easter",
        prompt: md`
          *“More difficult: compute the Easter date for a given year.”* Write \`easter(year)\`, which returns the tuple
          \`(month, day)\` of Easter Sunday (Gregorian calendar), with the **Meeus / Jones / Butcher algorithm** (only floor
          divisions \`//\` and remainders \`%\`):

          \`\`\`text
          a = year % 19           b = year // 100         c = year % 100
          d = b // 4              e = b % 4               f = (b + 8) // 25
          g = (b - f + 1) // 3    h = (19a + b - d - g + 15) % 30
          i = c // 4              k = c % 4               l = (32 + 2e + 2i - h - k) % 7
          m = (a + 11h + 22l) // 451
          month = (h + l - 7m + 114) // 31
          day = (h + l - 7m + 114) % 31 + 1
          \`\`\`

          Also write \`is_leap(year)\` (leap year rule of Hands-on 7) and print the Easter dates from 2024 to 2030 in the format
          \`2024: 31/3 (leap year)\`.
        `,
        tests: [
          "Easter 2024: March 31st",
          "2025: April 20th, 2019: April 21st",
          "2000, 1961 and 2038",
          "`is_leap`",
          "The 2024 → 2030 list is printed",
        ],
      },
    },
  },

  "m2-l2": {
    ex1: {
      title: "Repeating computations",
      core: {
        title: "Accumulators and counters",
        prompt: md`
          With **a \`for\` loop** over the integers from 1 to 100 (without using \`sum()\`), compute:

          - \`total\`: the sum 1 + 2 + … + 100;
          - \`somme_pairs\`: the sum of the even numbers;
          - \`nb_multiples_7\`: the number of multiples of 7.
        `,
        hint: md`
          \`range(1, 101)\` goes from 1 to 100. In the loop: \`total += n\`; then an \`if n % 2 == 0\` for the even numbers and
          an \`if n % 7 == 0\` to count.
        `,
        tests: [
          "`total` is 5050",
          "`somme_pairs` is 2550",
          "`nb_multiples_7` is 14",
          "A `for` loop is used, without `sum()`",
        ],
      },
      extra: {
        title: "Hands-on 4: multiplication table and vowels",
        prompt: md`
          1. Print the multiplication table of \`n\`, from 1 to 10, in the format:

          \`\`\`text
          7 x 1 = 7
          7 x 2 = 14
          ...
          7 x 10 = 70
          \`\`\`

          2. Count in \`nb_voyelles\` the vowels (a, e, i, o, u, y) of the word \`mot\`.
        `,
        hint: md`
          For the table: \`print(f"{n} x {i} = {n * i}")\` in a loop. For the vowels: go through the word letter by letter
          and test \`lettre in "aeiouy"\`.
        `,
        tests: [
          "The table prints `7 x 1 = 7` … `7 x 10 = 70`",
          "Exactly 10 table lines",
          "Table of 3: `3 x 4 = 12`",
          "`nb_voyelles` is 10",
          "`'python'` contains 2 vowels (y, o)",
        ],
      },
      stretch: {
        title: "Prime numbers",
        prompt: md`
          A number is **prime** if it is greater than or equal to 2 and only divisible by 1 and itself.

          Print on one line all the prime numbers strictly below \`limite\`, and count them in \`nb_premiers\` (there are 15
          below 50).

          Use two nested loops: for each candidate, look for a divisor.
        `,
        hint: md`
          For each \`n\`, a variable \`premier = True\`; in a loop on \`d\` from 2 to \`n - 1\`, if \`n % d == 0\` then
          \`premier = False\` (and \`break\` to save time). Bonus: testing divisors up to \`√n\` is enough.
        `,
        explanation: md`
          If \`n = a × b\` with \`a ≤ b\`, then \`a ≤ √n\`: testing divisors up to \`√n\` is enough. For very large limits, use
          the **sieve of Eratosthenes**.
        `,
        tests: [
          "`nb_premiers` is 15 below 50",
          "47 and 2 are printed, not 49",
          "25 prime numbers below 100",
          "4 prime numbers below 10",
        ],
      },
    },
    ex2: {
      title: "Patterns, training and prime factors",
      core: {
        title: "Hands-on 10: a star pattern",
        prompt: md`
          With two nested \`for\` loops, print this pattern for \`n = 5\` (each star is followed by a space):

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
          First half: \`for i in range(1, n + 1)\` then an inner loop printing \`"* "\` i times with \`end=""\`. Second half:
          \`range(n - 1, 0, -1)\`.
        `,
        explanation: md`
          One-line version seen in module 4: \`l = ['* ' * i for i in range(n + 1)]\` then
          \`print('\\n'.join(l[1:]) + '\\n' + '\\n'.join(reversed(l[1:-1])))\`.
        `,
        tests: [
          "9 lines for n = 5",
          "The top has 5 stars",
          "Works for n = 3",
          "Nested loops are used",
        ],
      },
      extra: {
        title: "Hands-on 4: the maths trainer",
        prompt: md`
          Turn the multiplication table into a **trainer**: for each question \`(a, b)\` of the list \`questions\`, ask
          \`a x b = \` with \`input()\`.

          - right answer: print \`Correct!\` and add 1 to \`score\`;
          - wrong answer (or input that is not a number): print \`Wrong: 7 x 8 = 56\`;
          - at the end: \`Score: 2/4\`.
        `,
        tests: [
          "`score` is 2",
          "The corrections are printed",
          "The final score is printed",
          "All right → 4/4",
        ],
      },
      stretch: {
        title: "Hands-on 13: prime numbers and factorisation",
        prompt: md`
          **Without lists or dictionaries** (only loops and variables):

          1. \`is_prime(n)\` returns \`True\` if \`n\` is prime;
          2. \`factorize(n)\` returns the prime factorisation of \`n\` as a **string**: \`factorize(360)\` →
             \`"360 = 2^3 x 3^2 x 5"\` (exponent omitted when it is 1), \`factorize(13)\` → \`"13 = 13"\`,
             \`factorize(1)\` → \`"1 = 1"\`.
        `,
        hint: md`
          For each divisor \`d\` starting at 2: as long as \`n % d == 0\`, divide \`n\` by \`d\` and count the exponent; add the
          factor to the string if it occurs. Stop when \`d * d > n\`: what remains (if > 1) is prime.
        `,
        tests: [
          "`is_prime`",
          "`factorize(360)`",
          "Prime number and 1",
          "Other numbers",
          "Neither list nor dictionary",
        ],
      },
    },
  },

  "m2-l3": {
    ex1: {
      title: "Conditional loops",
      core: {
        title: "Doubling your capital",
        prompt: md`
          A capital invested at \`taux\` = 5% per year (the rate) is multiplied every year by \`1 + taux\`.

          With a \`while\` loop, compute the number of \`annees\` (years) needed for the \`capital\` to reach (at least) the
          \`objectif\` (goal), i.e. twice the starting capital.
        `,
        hint: md`
          \`while capital < objectif:\` then, in the loop, \`capital *= 1 + taux\` and \`annees += 1\`.
        `,
        explanation: md`
          Rule of 72: an investment at \`t\`% doubles in about \`72 / t\` years (here 72 / 5 ≈ 14.4 → 15 years).
        `,
        tests: [
          "It takes 15 years at 5%",
          "A `while` loop is used",
          "At 10%: 8 years",
          "500 € at 7%: 11 years",
        ],
      },
      extra: {
        title: "Hands-on 12: the Collatz sequence",
        prompt: md`
          Starting from an integer \`n\`, repeat: if \`n\` is even, divide it by 2; otherwise replace it with \`3n + 1\`. The
          Collatz conjecture (unproven to this day) states that you always end up reaching 1.

          Compute:
          - \`etapes\`: the number of steps needed to reach 1;
          - \`maximum\`: the highest value reached (starting value included).

          For \`n = 27\`, you get 111 steps and a maximum of 9232!
        `,
        hint: md`
          Initialise \`maximum = n\` before the \`while n != 1:\` loop. Use \`//\` to stay with integers.
        `,
        tests: [
          "`etapes` is 111 for n = 27",
          "`maximum` is 9232 for n = 27",
          "n = 6: 8 steps, maximum 16",
          "n = 1: 0 step",
        ],
      },
      stretch: {
        title: "Hands-on 8: guess the number",
        prompt: md`
          Program the “guess the number” game: the player types guesses with \`input()\` until they find \`secret\`.

          - if the input is not a number (\`isdigit()\`): print \`Entrée invalide\` (invalid input) and go to the next round
            **without counting the attempt** (\`continue\`);
          - otherwise, print \`Trop petit\` (too small) or \`Trop grand\` (too big);
          - once found: print \`Bravo ! Trouvé en 6 essais.\` (found in 6 attempts) and leave the loop (\`break\`).

          The number of valid attempts is stored in \`essais\`. The guesses are in the **Inputs** box.
        `,
        hint: md`
          Structure: \`while True:\` → \`input\` → test \`isdigit()\` + \`continue\` → \`essais += 1\` → comparison with
          \`secret\` → \`break\` when won.
        `,
        tests: [
          "`essais` is 6 (the input `abc` is not counted)",
          "Prints `Bravo ! Trouvé en 6 essais.`",
          "Prints `Entrée invalide` for `abc`",
          "2 × `Trop grand` and 3 × `Trop petit`",
          "Found at the first attempt → 1 attempt",
          "`while`, `break` and `continue` are used",
        ],
      },
    },
    ex2: {
      title: "Interactive loops and GCD",
      core: {
        title: "Hands-on 2 bis: converting until “end”",
        prompt: md`
          Modify the Fahrenheit → Celsius converter so that it **repeats** the conversion until the user types \`end\`:

          - at each round, read an input with \`input()\`;
          - if it is \`end\`, leave the loop (\`break\`);
          - otherwise, print for instance \`212.0 °F = 100.0 °C\` (1 decimal) and add 1 to \`count\`.

          At the end, print \`3 conversions\`.
        `,
        tests: [
          "3 conversions",
          "The results are printed",
          "`end` straight away → 0 conversion",
          "`while` and `break`",
        ],
      },
      extra: {
        title: "Hands-on 10: the GCD in three ways",
        prompt: md`
          The **GCD** (greatest common divisor) of two positive integers can be computed in several ways:

          1. \`gcd_sub(a, b)\` — **subtractions** (\`while\` loop): if a > b, gcd(a, b) = gcd(a − b, b); if b > a,
             gcd(a, b) = gcd(a, b − a); and gcd(a, a) = a;
          2. \`gcd_mod(a, b)\` — **Euclid's algorithm** (\`while\` loop), much faster: gcd(a, b) = gcd(b, a mod b), and
             gcd(a, 0) = a;
          3. \`gcd_for(a, b)\` — with a **\`for\` loop**: try the divisors from the largest possible to the smallest.
        `,
        tests: [
          "`gcd_sub(84, 36)` is 12",
          "`gcd_mod` is correct",
          "`gcd_for` is correct",
          "`gcd_sub` is correct",
          "Two `while`s and one `for`",
        ],
      },
      stretch: {
        title: "The else of loops and do … while",
        prompt: md`
          1. \`first_divisor(n)\` returns the smallest divisor of \`n\` greater than 1, with a \`for … else\` loop: the \`else\`
             (no \`break\`) means that \`n\` is prime, and the function then returns \`n\`.
          2. \`read_positive()\` emulates a **\`do … while\`**: it asks for a strictly positive integer with \`input()\`, prints
             \`Invalid\` and asks again as long as the input is not valid, then returns the integer. The program calls it
             and stores the result in \`value\`.
          3. \`count_digits(n)\` counts the digits of a positive integer **without converting it to a string**: divide by 10
             in a loop that runs **at least once** (so \`count_digits(0)\` is 1).
        `,
        tests: [
          "`first_divisor`",
          "A `for … else` loop is used",
          "`read_positive` asks again as long as it is invalid",
          "`count_digits`",
          "No string conversion in `count_digits`",
        ],
      },
    },
  },
};
