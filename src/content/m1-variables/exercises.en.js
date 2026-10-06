import { md } from "../helpers.js";

export default {
  "m1-l0": {
    ex1: {
      title: "First programs",
      core: {
        title: "Hands-on 1: greetings!",
        prompt: md`
          Write a program that **reads your first name** with \`input()\` and greets you:

          \`\`\`text
          Hello, Ada!
          Your name has 3 letters.
          \`\`\`

          Store the name (without extra spaces, \`strip()\`) in the variable \`name\`. The typed name is in the **Inputs**
          box below the editor: change it to test.
        `,
        hint: md`\`name = input("What is your name? ").strip()\`, then two \`print\`s with f-strings.`,
        tests: [
          "The name is read with `input()` into `name`",
          "Prints `Hello, Ada!`",
          "Prints the number of letters",
          "Works with `  Grace  `",
        ],
      },
      extra: {
        title: "Documenting and structuring a program",
        prompt: md`
          Take the course example:

          1. \`area(radius)\` returns the area of a disc (\`pi = 3.1415926535\`, then \`pi * radius * radius\`) and has a
             **docstring** explaining what it computes;
          2. \`main()\` reads the radius (\`float(input(…))\`) and prints, on **a single output line** but with a statement
             written over **two lines** (inside parentheses): \`The area of a circle with radius 2.0 is 12.566370614.\`;
          3. \`main()\` is only called if the file is run directly: \`if __name__ == "__main__":\`.

          Also display the documentation of \`area\` with \`help(area)\`.
        `,
        tests: [
          "`area(1)` is 3.1415926535",
          "`area` has a docstring",
          "The program prints the area for a radius of 2",
          "A `main` function is protected by `if __name__ == \"__main__\":`",
          "`help(area)` is called",
        ],
      },
      stretch: {
        title: "Reading a requirements.txt file",
        prompt: md`
          A project lists its dependencies in \`requirements.txt\` (one per line, \`name==version\`, with possible \`#\`
          comments and blank lines).

          1. \`parse_requirements(text)\` returns a dictionary \`name → version\`: the name in **lower case**, the version
             (a string) if it is pinned with \`==\`, otherwise \`None\` (for instance \`requests\` or \`flask>=2.0\`, whose name
             \`flask\` is kept). Comments (including at the end of a line) and blank lines are ignored.
          2. \`format_requirements(deps)\` does the opposite: one line per dependency, **sorted by name**, as
             \`name==version\` or just \`name\`, each line ending with \`"\\n"\`.
        `,
        hint: md`
          For each line: \`line.split("#")[0].strip()\`, skip it if empty. For \`>=\`, \`<=\`…: cut at the first character that
          is neither a letter, a digit, \`-\`, \`_\` nor \`.\`.
        `,
        tests: [
          "Pinned versions are read",
          "Names are in lower case",
          "Unpinned version → `None`",
          "Comments and blank lines ignored",
          "`format_requirements` sorts and formats",
        ],
      },
    },
  },

  "m1-l1": {
    ex1: {
      title: "Identity card",
      core: {
        title: "Creating and inspecting variables",
        prompt: md`
          Create four variables describing a student:

          - \`prenom\`: a string (the first name);
          - \`age\`: an integer;
          - \`taille\`: a floating-point number (the height, in metres);
          - \`etudiant\`: a boolean (is it a student?).

          Then print each variable **followed by its type**, one per line. For instance: \`print(prenom, type(prenom))\`.
        `,
        hint: md`
          Booleans are written \`True\` or \`False\` (with a capital letter, no quotes). A height of 1 m 68 is written \`1.68\`.
        `,
        tests: [
          "`prenom` is a string (`str`)",
          "`age` is an integer (`int`)",
          "`taille` is a floating-point number (`float`)",
          "`etudiant` is a boolean (`bool`)",
          "The four types are printed",
        ],
      },
      extra: {
        title: "Rotating three variables",
        prompt: md`
          The starter code defines three variables \`x\`, \`y\` and \`z\`.

          1. **In a single line**, “rotate” their values: \`x\` takes the value of \`y\`, \`y\` that of \`z\`, and \`z\` that of \`x\`.
          2. The final \`print\` must then display \`2 3 1\`.

          Writing \`x = 2\` directly is forbidden: your line must work whatever the starting values.
        `,
        hint: md`
          The multiple assignment \`a, b = b, a\` evaluates the whole right-hand side **first**, then assigns. Generalise to
          three variables.
        `,
        explanation: md`
          Python first computes the right-hand tuple \`(y, z, x)\` = \`(2, 3, 1)\` with the **old** values, then distributes it
          into \`x\`, \`y\`, \`z\`. Without multiple assignment, a temporary variable would be needed.
        `,
        tests: [
          "`x`, `y`, `z` are 2, 3 and 1",
          "The output displays `2 3 1`",
          "The rotation works with other values (`'a'`, `'b'`, `'c'`)",
        ],
      },
      stretch: {
        title: "The floating-point trap",
        prompt: md`
          Computers store \`float\`s in binary, which creates tiny rounding errors.

          1. Compute \`resultat = 0.1 + 0.2\` and print it. Surprised?
          2. Create \`egal_naif\`: the boolean resulting from the comparison \`resultat == 0.3\`.
          3. Create \`egal_robuste\`: a **tolerant** comparison checking that the absolute difference between \`resultat\`
             and \`0.3\` (function \`abs()\`) is less than \`1e-9\`.
          4. Create \`type_division\` = the type of \`10 / 2\`, and \`type_division_entiere\` = the type of \`10 // 2\`. Why
             are they different? (The \`/\` and \`//\` operators are detailed in the next lesson.)
        `,
        hint: md`
          A comparison is an expression like any other: \`egal_naif = resultat == 0.3\` stores \`True\` or \`False\` in the variable.
        `,
        explanation: md`
          \`/\` **always** returns a \`float\` (\`10 / 2\` is \`5.0\`), whereas \`//\` between two integers returns an \`int\`. In
          data science, floats are compared with a tolerance (this is what \`math.isclose\` or \`numpy.isclose\` do).
        `,
        tests: [
          "`resultat` is `0.1 + 0.2`",
          "`egal_naif` is `False`",
          "`egal_robuste` is `True` and uses `abs()`",
          "`type_division` is `float`",
          "`type_division_entiere` is `int`",
        ],
      },
    },
  },

  "m1-l2": {
    ex1: {
      title: "Everyday computations",
      core: {
        title: "Converting minutes into hours",
        prompt: md`
          A lecture video lasts \`total_minutes = 135\` minutes. Using \`//\` and \`%\`, compute:

          - \`heures\`: the number of whole hours;
          - \`minutes\`: the remaining minutes.

          The program must print: \`135 minutes = 2 h 15 min\`.
        `,
        hint: md`There are 60 minutes in an hour: \`135 // 60\` gives the quotient, \`135 % 60\` the remainder.`,
        tests: [
          "`heures` is 2",
          "`minutes` is 15",
          "Prints `135 minutes = 2 h 15 min`",
          "Also works with 200 minutes (3 h 20 min)",
        ],
      },
      extra: {
        title: "Hands-on 11: a complete duration converter",
        prompt: md`
          Convert \`secondes = 100000\` into days, hours, minutes and remaining seconds. Create the variables \`j\` (days),
          \`h\`, \`m\` and \`s\`, then print:

          \`\`\`text
          100000 s = 1 j 3 h 46 min 40 s
          \`\`\`
        `,
        hint: md`
          A day = 86,400 s, an hour = 3,600 s. Compute the number of days with \`//\`, keep the **remainder** with \`%\`, then
          start again with the hours, etc.
        `,
        explanation: md`
          A compact variant with the \`divmod(a, b)\` function, which returns \`(a // b, a % b)\`:
          \`j, reste = divmod(secondes, 86400)\`.
        `,
        tests: [
          "1 d 3 h 46 min 40 s",
          "Output in the right format",
          "90061 s → 1 d 1 h 1 min 1 s",
          "59 s → 0 d 0 h 0 min 59 s",
        ],
      },
      stretch: {
        title: "Hands-on 7: leap year in a single expression",
        prompt: md`
          A year is a leap year if it is divisible by 4 **but not** by 100, **or** if it is divisible by 400.

          Write **a single boolean expression** (no \`if\`) and store it in \`bissextile\` (“leap year” in French).

          | Year | 2024 | 1900 | 2000 | 2023 |
          |---|---|---|---|---|
          | Leap year? | \`True\` | \`False\` | \`True\` | \`False\` |
        `,
        hint: md`“\`n\` is divisible by \`d\`” is written \`n % d == 0\`. Combine with \`and\`, \`or\` and parentheses.`,
        tests: [
          "1900 is not a leap year",
          "2024 is a leap year",
          "2000 is a leap year",
          "2023 is not a leap year",
          "No `if` statement is used",
        ],
      },
    },
    ex2: {
      title: "Temperatures, interests and complex numbers",
      core: {
        title: "Hands-on 2: Fahrenheit and Celsius",
        prompt: md`
          Convert the temperature \`fahrenheit\` into degrees Celsius: C = (F − 32) × 5 / 9.

          1. \`celsius\`: the converted temperature, **rounded to 1 decimal**;
          2. \`back\`: the inverse conversion of \`celsius\` (F = C × 9 / 5 + 32), rounded to 1 decimal;
          3. print \`98.6 °F = 37.0 °C\`.
        `,
        tests: [
          "`celsius` is 37.0",
          "`back` goes back to 98.6",
          "Prints `98.6 °F = 37.0 °C`",
          "212 °F → 100 °C and -40 °F → -40 °C",
        ],
      },
      extra: {
        title: "Hands-on 5: compound interest",
        prompt: md`
          Compute the amount of money in a bank account after several years of compound interest.

          1. Read with \`input()\` the initial amount \`amount\` (\`float\`), the number of years \`years\` (\`int\`) and the
             yearly rate \`rate\` as a percentage (\`float\`).
          2. \`final\` = amount × (1 + rate / 100) ^ years, **rounded to 2 decimals**.
          3. Print \`After 10 years: 1628.89\`.
        `,
        hint: md`The power is written \`**\`. The default inputs are 1000, 10 and 5.`,
        tests: [
          "The inputs are converted",
          "`final` is 1628.89",
          "Prints `After 10 years: 1628.89`",
          "500 at 2% for 3 years → 530.6",
        ],
      },
      stretch: {
        title: "Complex numbers and short circuit",
        prompt: md`
          1. With \`z = complex(3, 4)\`: \`modulus\` (its magnitude, with \`abs\`), \`conj\` (its conjugate) and \`product\`
             (\`z\` multiplied by its conjugate).
          2. \`q, r = divmod(17, 5)\`.
          3. The roots of x² + 2x + 5 = 0: with the discriminant Δ = b² − 4ac (negative here!), compute
             \`root1\` = (−b + √Δ) / 2a and \`root2\` = (−b − √Δ) / 2a, writing √Δ as \`delta ** 0.5\`.
          4. \`display\`: the value of \`name\` if it is not empty, otherwise \`"anonymous"\`, **in a single expression with
             \`or\`** (no \`if\`).
        `,
        tests: [
          "`modulus` is 5.0, `conj` is 3-4j",
          "`product` is 25",
          "`divmod(17, 5)` → `q = 3`, `r = 2`",
          "The complex roots -1 ± 2j",
          "`display` uses `or`",
        ],
      },
    },
  },

  "m1-l3": {
    ex1: {
      title: "Text workshop",
      core: {
        title: "Cleaning and slicing a sentence",
        prompt: md`
          From \`phrase = "   Python pour la Data Science   "\`, create:

          - \`propre\`: the sentence without the spaces at the beginning and at the end;
          - \`majuscules\`: \`propre\` entirely in upper case;
          - \`nb_caracteres\`: the length of \`propre\`;
          - \`premier_mot\`: the first 6 characters of \`propre\` (slicing);
          - \`dernier_mot\`: the last 7 characters of \`propre\` (negative indices).
        `,
        hint: md`Useful methods: \`strip()\`, \`upper()\`. Slicing: \`s[:6]\` and \`s[-7:]\`.`,
        tests: [
          "`propre` has no extra spaces",
          "`majuscules` is correct",
          "`nb_caracteres` is 27",
          "`premier_mot` is `'Python'`",
          "`dernier_mot` is `'Science'`",
        ],
      },
      extra: {
        title: "A receipt with an f-string",
        prompt: md`
          A \`produit\` is sold at the price \`prix_ht\` (before tax) with a 20% VAT (\`tva\`).

          1. Compute \`prix_ttc = prix_ht * (1 + tva)\` (price including tax).
          2. Build with **an f-string** the string \`ligne\`, exactly in the format:

          \`\`\`text
          Clavier : 49.90 € HT -> 59.88 € TTC
          \`\`\`

          Prices are displayed with **2 decimals**.
        `,
        hint: md`In an f-string, \`{x:.2f}\` displays \`x\` with 2 digits after the decimal point.`,
        tests: [
          "`prix_ttc` is correct",
          "`ligne` has exactly the right format",
          "An f-string is used",
          "Works for a mouse at 20 € before tax",
        ],
      },
      stretch: {
        title: "Initials and palindromes",
        prompt: md`
          1. From \`nom_complet = "ada lovelace"\`, build \`initiales\` = \`"A.L."\`. Find the space with the \`find()\` method:
             the initial of the last name is right after it.
          2. A sentence is a **palindrome** if it reads the same both ways, ignoring spaces and case (*Hands-on 4*). Create
             the boolean \`est_palindrome\` for \`phrase = "Esope reste ici et se repose"\`.

          Your code must work with any first/last name and any sentence.
        `,
        hint: md`
          \`s[::-1]\` reverses a string. To ignore spaces: \`replace(" ", "")\`; for the case: \`lower()\`.
        `,
        tests: [
          "`initiales` is `'A.L.'`",
          "Works for `'grace hopper'` → `'G.H.'`",
          "The example sentence is a palindrome",
          "`'Engage le jeu que je le gagne'` is a palindrome",
          "`'Python pour tous'` is not",
        ],
      },
    },
    ex2: {
      title: "Formatting text",
      core: {
        title: "Hands-on: hashtag",
        prompt: md`
          Write \`make_hashtag(sentence)\`, which turns a sentence into a hashtag: each word starts with a capital letter (and
          the rest of the word goes to lower case), spaces disappear, and the whole thing is preceded by \`#\`.

          \`make_hashtag("the quick brown fox")\` → \`"#TheQuickBrownFox"\`.
        `,
        hint: md`\`split()\` (without argument: ignores multiple spaces), \`capitalize()\` and \`"".join(...)\`.`,
        tests: [
          "`the quick brown fox` → `#TheQuickBrownFox`",
          "Multiple spaces and capitals handled",
          "A single word",
        ],
      },
      extra: {
        title: "Upper case, lower case and aligned tables",
        prompt: md`
          1. *Hands-on “Pangrams”, part 1*: count the upper-case and lower-case letters of a string **in two ways**:
             \`count_case_loop(s)\` with a \`for\` loop and two counters, \`count_case_sum(s)\` with \`sum(...)\` over a generator
             expression. Both return the tuple \`(upper, lower)\`.
          2. \`table_row(name, qty, price)\` returns a table row: the name **left-aligned** on 12 characters, the quantity
             **centred** on 5, the price with 2 decimals **right-aligned** on 8, all framed by \`|\`:
             \`table_row("Clavier", 2, 49.9)\` → \`"|Clavier     |  2  |   49.90|"\`. Use \`ljust\`, \`center\` and \`rjust\`.
        `,
        tests: [
          "`count_case_loop`",
          "`count_case_sum` gives the same results",
          "Two different ways: a loop, then `sum`",
          "`table_row('Clavier', 2, 49.9)`",
          "`ljust`, `center` and `rjust` are used",
        ],
      },
      stretch: {
        title: "Hands-on: validating an email address",
        prompt: md`
          An email address is valid if it:

          - contains at most 256 characters;
          - starts with a letter or a digit;
          - contains **exactly one** \`@\` symbol;
          - has at least one character after the \`@\` **and before** the last period;
          - has at least one character after the last period.

          1. \`is_valid_email(address)\` checks these rules with **string methods** (\`count\`, \`split\`, \`rfind\`, \`isalnum\`…).
          2. *Advanced extension*: \`is_valid_email_re(address)\` does the same with a **regular expression** (module \`re\`,
             function \`re.fullmatch\`).
        `,
        hint: md`
          After splitting \`local, domain = address.split("@")\`, look for the last period of the domain with
          \`domain.rfind(".")\`: its index must be ≥ 1 and it must not be the last character. For the regular expression:
          \`[A-Za-z0-9][^@]*@[^@]+\\.[^@.]+\`.
        `,
        tests: [
          "Valid addresses accepted",
          "Invalid addresses rejected",
          "The `re` version gives the same answers",
          "`re.fullmatch` is used",
        ],
      },
    },
  },

  "m1-l4": {
    ex1: {
      title: "Juggling with types",
      core: {
        title: "Adding text?",
        prompt: md`
          The variables \`a = "12"\` and \`b = "30"\` are **strings**. Create:

          - \`concatenation\`: the result of \`a + b\` (look!);
          - \`somme\`: the real numerical sum, of type \`int\`;
          - \`moyenne\`: the mean of both numbers;
          - \`message\`: the string \`"La somme vaut 42"\` (“the sum is 42”), built with \`+\` from \`somme\`.
        `,
        hint: md`Convert with \`int()\` to compute, then with \`str()\` to concatenate with text.`,
        tests: [
          "`concatenation` is `'1230'`",
          "`somme` is 42 (an `int`)",
          "`moyenne` is 21.0",
          "`message` is `'La somme vaut 42'`",
          "Works with `a = '5'` and `b = '7'`",
        ],
      },
      extra: {
        title: "User input",
        prompt: md`
          Ask for the age then the height (in metres) with \`input()\`, and store them, **converted**, in \`age\` (\`int\`) and
          \`taille\` (\`float\`). The program then prints (in French, as in the starter code):

          \`\`\`text
          Dans 10 ans, vous aurez 35 ans.
          Votre taille en cm : 175
          \`\`\`

          (“In 10 years, you will be 35.” / “Your height in cm: 175”). The height in cm is **rounded** to the nearest integer.
          The typed values are in the **Inputs** box below the editor: change them to test.
        `,
        hint: md`
          Careful: \`1.68 * 100\` is \`167.99999999999997\`! \`int()\` would truncate to 167: use \`round()\`.
        `,
        tests: [
          "`age` is converted to `int`",
          "`taille` is converted to `float`",
          "Prints `Dans 10 ans, vous aurez 35 ans.`",
          "Prints `Votre taille en cm : 175`",
          "With 40 years and 1.68 m: 50 years and 168 cm",
        ],
      },
      stretch: {
        title: "Cleaning a typed amount",
        prompt: md`
          A form returns the amount \`saisie = " 1 234,56 € "\`: spaces, decimal comma and currency symbol. A very common
          situation when cleaning data!

          1. Turn \`saisie\` into a \`float\` named \`montant\` (\`1234.56\`).
          2. \`montant_entier\`: the integer part (\`1234\`).
          3. \`arrondi\`: the amount rounded to the unit (\`1235\`).
        `,
        hint: md`
          Chain the methods: \`saisie.replace("€", "").replace(" ", "").replace(",", ".")\`, then \`float()\`.
        `,
        tests: [
          "`montant` is `1234.56` (a `float`)",
          "`montant_entier` is 1234",
          "`arrondi` is 1235",
          "`'  99,90 €'` → 99.9",
          "`' 12 000,5 € '` → 12000.5",
        ],
      },
    },
    ex2: {
      title: "Codes and bases",
      core: {
        title: "Character codes and number bases",
        prompt: md`
          1. \`codes\`: the list of the codes (\`ord\`) of the letters of \`"Python"\`;
          2. \`word\`: the word rebuilt from \`codes\` (\`chr\` and \`"".join\`);
          3. \`hex_value\`: the value of \`"abc"\` read in **base 16**;
          4. \`binary\`: 42 written in base 2 (\`bin\`), and \`back\`: \`binary\` read back as an integer (\`int(…, 2)\`);
          5. \`text\`: the result of \`str(("a", "b"))\`, and \`length\`: its length. Surprised?
        `,
        explanation: md`
          \`str(("a", "b"))\` is \`"('a', 'b')"\`: 10 characters, parentheses, quotes and comma included. To glue the elements
          together, you need \`"".join(...)\`.
        `,
        tests: [
          "`codes` is [80, 121, 116, 104, 111, 110]",
          "`word` is `'Python'` (with `chr`)",
          "`hex_value` is 2748",
          "`binary` is `'0b101010'` and `back` 42",
          "`text` and `length`",
        ],
      },
      extra: {
        title: "The Caesar cipher",
        prompt: md`
          The **Caesar cipher** shifts each letter of the alphabet by a fixed number of positions, “wrapping around” after
          \`z\`: with a shift of 3, \`a\` → \`d\`, \`x\` → \`a\`.

          Write \`caesar(text, shift)\`: lower-case and upper-case letters are shifted (keeping their case), other characters
          (spaces, punctuation, accents) are unchanged. A negative shift deciphers.
        `,
        hint: md`
          For a lower-case letter: \`chr((ord(c) - ord("a") + shift) % 26 + ord("a"))\`. The modulo \`% 26\` wraps the alphabet
          around, even for a negative shift.
        `,
        tests: [
          "`caesar('Hello, World!', 3)` → `'Khoor, Zruog!'`",
          "End of the alphabet: `xyz` → `abc`",
          "A negative shift deciphers",
          "Other characters are unchanged",
          "`ord` and `chr` are used",
        ],
      },
      stretch: {
        title: "Changing base by hand",
        prompt: md`
          Without using \`bin\`, \`oct\`, \`hex\`, \`format\` or \`int(text, base)\`:

          1. \`to_base(n, base)\` writes the positive integer \`n\` in a base from 2 to 16 (digits \`"0123456789ABCDEF"\`), by
             successive divisions (\`divmod\`): \`to_base(255, 16)\` → \`"FF"\`, \`to_base(0, 2)\` → \`"0"\`;
          2. \`from_base(text, base)\` does the opposite (upper or lower case accepted): \`from_base("ff", 16)\` → 255.
        `,
        hint: md`
          For \`to_base\`, each \`divmod(n, base)\` gives the last digit (the remainder): build the string from right to left.
          For \`from_base\`, use Horner's scheme: \`value = value * base + digit\`.
        `,
        tests: [
          "`to_base` in base 2, 8 and 16",
          "`to_base` is consistent with `bin` and `hex`",
          "`from_base`",
          "Round trip on many numbers",
          "Without `bin`, `hex`, `oct` or `int(…, base)`",
        ],
      },
    },
  },
};
