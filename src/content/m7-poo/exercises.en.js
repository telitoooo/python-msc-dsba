import { md } from "../helpers.js";

export default {
  "m7-l1": {
    ex1: {
      title: "First classes",
      core: {
        title: "The dog and its methods",
        prompt: md`
          Complete the \`Dog\` class:

          1. \`__init__(self, name, age=0)\` stores \`name\` and \`age\` in the object, and creates an empty
             list \`self.tricks\` (the tricks the dog knows);
          2. \`bark(self)\` **prints** \`<name> says woof!\`;
          3. \`birthday(self)\` adds 1 to the age **and returns** the new age;
          4. \`learn(self, trick)\` appends \`trick\` to the list of tricks.

          The program then creates \`d1 = Dog("Fido")\` and \`d2 = Dog("Rex", 3)\`: check that the two dogs
          are really independent.
        `,
        hint: md`
          Every method receives the object as its first parameter: \`self\`. To store a value in the object,
          write \`self.name = name\` (not \`name = name\`, which creates a local variable).
        `,
        explanation: md`
          \`self.tricks = []\` runs **each time** an object is created: every dog has its own list.
          \`d1.bark()\` is shorthand for \`Dog.bark(d1)\`.
        `,
        tests: [
          "`Dog` is a class",
          "`d1` and `d2` have the right attributes",
          "`bark()` prints `<name> says woof!`",
          "`birthday()` increments the age and returns it",
          "Each dog has its own list of tricks",
        ],
      },
      extra: {
        title: "A point in the plane",
        prompt: md`
          *Hands-on “Geometry 2D”, part one.* Write the \`Point2D\` class:

          - \`__init__(self, x, y)\`;
          - \`translate(self, dx, dy)\`: moves the point **in place**;
          - \`scale(self, factor)\`: multiplies both coordinates by \`factor\` (scaling centred on the origin);
          - \`rotate(self, angle)\`: rotates the point around the origin by an angle θ in **radians**:
            x' = x·cos θ − y·sin θ and y' = x·sin θ + y·cos θ;
          - \`distance(self, other)\`: returns the Euclidean distance to the point \`other\`;
          - \`to_tuple(self)\`: returns \`(x, y)\`.

          The first three methods modify the object and return nothing.
        `,
        hint: md`
          Careful in \`rotate\`: compute the new \`x\` and the new \`y\` **from the old values** (multiple
          assignment \`self.x, self.y = …, …\`). Use \`math.cos\`, \`math.sin\` and \`math.hypot\`.
        `,
        explanation: md`
          **Method or function for the distance?** A method \`p.distance(q)\` is natural when the computation
          “belongs” to the point. A function \`distance(p, q)\` (or a \`@staticmethod\`) highlights the symmetry
          between both points. Both are fine: what matters is being consistent.
        `,
        tests: [
          "`Point2D(2, 5)` stores `x` and `y`",
          "`translate` moves the point in place",
          "`scale` multiplies the coordinates",
          "`rotate(pi/2)` sends (1, 0) to (0, 1)",
          "`rotate(pi)` sends (2, 3) to (-2, -3)",
          "`distance` is Euclidean",
        ],
      },
      stretch: {
        title: "The bank account, object version",
        prompt: md`
          *Hands-on “Bank Account”: rewrite the bank account with classes, handle several accounts and a login.*

          **\`BankAccount(owner, balance=0)\`**
          - \`deposit(amount)\` and \`withdraw(amount)\`: raise \`ValueError\` if the amount is not strictly
            positive, or (withdrawal) if it exceeds the balance;
          - each successful operation is appended to \`self.history\` as \`("deposit", 50)\` or \`("withdraw", 20)\`.

          **\`Bank()\`** manages several password-protected accounts:
          - \`open_account(owner, password, initial=0)\` creates and returns the account (\`ValueError\` if this
            owner already has an account);
          - \`login(owner, password)\` stores the account in \`self.current\` and returns it; unknown owner or
            wrong password → \`PermissionError\`;
          - \`logout()\` resets \`self.current\` to \`None\`;
          - \`transfer(to_owner, amount)\` moves \`amount\` from the logged-in account to \`to_owner\`'s one
            (\`PermissionError\` if nobody is logged in, \`ValueError\` if the recipient does not exist).

          Accounts are stored in \`self.accounts\`, a dictionary \`owner → (password, account)\`.
        `,
        hint: md`
          \`transfer\` can reuse \`withdraw\` then \`deposit\`: amount errors are then handled by \`BankAccount\`.
        `,
        tests: [
          "Deposits and withdrawals update the balance and the history",
          "Negative amount or overdraft → `ValueError`",
          "`open_account` creates distinct accounts, without duplicates",
          "`login` checks the password (`PermissionError` otherwise)",
          "`transfer` requires being logged in and moves the money",
          "`logout` logs out",
        ],
      },
    },
  },

  "m7-l2": {
    ex1: {
      title: "Special methods",
      core: {
        title: "Points you can print, compare and add",
        prompt: md`
          Add special methods to \`Point2D\`:

          1. \`__str__\`: \`str(Point2D(1, 2))\` is \`"Point2D(1, 2)"\`;
          2. \`__repr__\`: returns the same text (useful to display a list of points);
          3. \`__eq__\`: two points are equal if they have the same coordinates (and \`p == "abc"\` is \`False\`);
          4. \`__add__\`: \`p + q\` returns a **new** point, the sum of the coordinates;
          5. \`__mul__\`: \`p * k\` returns a new point whose coordinates are multiplied by the number \`k\`.
        `,
        hint: md`
          In \`__eq__\`, start with \`if not isinstance(other, Point2D): return False\`. Operators return
          \`Point2D(…)\` without modifying \`self\`.
        `,
        tests: [
          "`str(Point2D(1, 2))` is `\"Point2D(1, 2)\"`",
          "A list of points displays nicely (`__repr__`)",
          "`==` compares coordinates, but `is` stays false",
          "`p + q` returns a new point without modifying `p`",
          "`p * 3` multiplies the coordinates",
        ],
      },
      extra: {
        title: "A building and an obedient dog",
        prompt: md`
          1. **\`Building(floors)\`**: a building with \`floors\` floors, all empty (\`None\`) at first.
             - \`building[i] = "ABC Corp"\` installs a tenant (\`__setitem__\`), \`building[i]\` reads it (\`__getitem__\`);
             - \`len(building)\` gives the number of floors;
             - \`"ABC Corp" in building\` tests whether a floor is occupied by this tenant (\`__contains__\`);
             - \`occupied(self)\` returns the number of occupied floors.
          2. **\`Dog(name)\`**: a dog you call like a function (\`__call__\`).
             \`d("Fido")\` returns \`"Fido says woof!"\` if it is its name, otherwise \`"Fido ignores it"\`.
        `,
        tests: [
          "Square brackets read and write floors",
          "`len()` gives the number of floors",
          "`in` tests the presence of a tenant",
          "`occupied()` counts the occupied floors",
          "The dog is callable and answers to its name",
        ],
      },
      stretch: {
        title: "Callable polynomials",
        prompt: md`
          Write the \`Polynomial\` class. \`Polynomial([1, 1, 0, 1])\` represents 1 + x + x³: coefficients are
          given **from degree 0 up to the highest degree**.

          - \`degree()\`: the degree (ignoring leading zeros: \`Polynomial([2, 0, 0])\` has degree 0);
          - \`__call__(x)\`: the value of the polynomial at \`x\` → the object can be used as a function;
          - \`__add__\` and \`__mul__\` between two polynomials (return a new \`Polynomial\`);
          - \`__eq__\`: same coefficients, leading zeros ignored;
          - \`__str__\`: from the highest degree to the lowest, without zero terms, coefficient 1 omitted:
            \`"x^3 + x + 1"\`, \`"2x^2 - 3"\`, \`"-x"\`, and \`"0"\` for the zero polynomial.

          Finally, use the provided \`dichotomy\` function (session 2) to find the zero of x³ + x + 1 in
          [-2, 2] and store it in \`zero\`: a callable object replaces a function!
        `,
        hint: md`
          Start by normalising the coefficients in \`__init__\` (remove trailing zeros of the list, keep at least
          \`[0]\`). For \`__call__\`, use Horner's scheme: starting from the highest degree,
          \`result = result * x + c\`. For \`__mul__\`, the coefficient of degree \`i + j\` receives \`a[i] * b[j]\`.
        `,
        tests: [
          "`degree()` ignores leading zeros",
          "The polynomial is callable: `p(2) == 11`",
          "`+` and `*` return new polynomials",
          "`==` ignores leading zeros",
          "`str()`: `\"x^3 + x + 1\"`, `\"2x^2 - 3\"`, `\"-x\"`, `\"0\"`",
          "`zero` is the zero of x³ + x + 1 (≈ -0.6823)",
        ],
      },
    },
  },

  "m7-l3": {
    ex1: {
      title: "Inheritance and polymorphism",
      core: {
        title: "The animal concert",
        prompt: md`
          1. \`Animal(name)\`: \`speak()\` returns \`"<name> says something"\` and \`__str__\` returns
             \`"<Class>(name=<name>)"\` using \`type(self).__name__\` (so child classes display their own name
             **without redefining** \`__str__\`).
          2. \`Dog\` and \`Cat\` inherit from \`Animal\` and only redefine \`speak()\`:
             \`"<name> says woof!"\` / \`"<name> says meow!"\`.
          3. \`Puppy\` inherits from \`Dog\`: \`Puppy(name, owner)\` calls the parent constructor with
             \`super()\`, stores \`owner\`, and \`speak()\` returns the dog's sentence followed by
             \`" (puppy of <owner>)"\`, by calling \`super().speak()\`.
          4. \`concert(animals)\` returns the list of what each animal says (polymorphism: no \`if\` on the type!).
        `,
        tests: [
          "The hierarchy is correct",
          "`Dog` and `Cat` redefine neither `__init__` nor `__str__`",
          "`str()` displays the name of the actual class",
          "Each animal speaks in its own way",
          "`Puppy` uses `super()` and adds its owner",
          "`concert` is polymorphic (no `isinstance` nor `type`)",
        ],
      },
      extra: {
        title: "Geometric shapes",
        prompt: md`
          *Hands-on “Geometry 2D”.* \`Shape2D\` is a common blueprint for all shapes:

          - \`area()\` and \`perimeter()\` raise \`NotImplementedError\`;
          - \`__str__\` returns \`"<Class>(area=<area with 2 decimals>)"\`, for instance \`"Square2D(area=4.00)"\`;
          - \`__lt__\` compares **areas**, which makes it possible to sort shapes with \`sorted\`.

          Child classes: \`Rectangle2D(width, height)\`, \`Square2D(side)\` (a square **is** a rectangle: it
          inherits from \`Rectangle2D\` and calls \`super().__init__\`), \`Circle2D(radius)\` and
          \`Triangle2D(a, b, c)\` (sides; area with Heron's formula √(s(s−a)(s−b)(s−c)) where s is half the
          perimeter; \`ValueError\` if the sides do not form a triangle).

          Finally, \`sort_by_area(shapes)\` returns a **new** list sorted by increasing area.
        `,
        explanation: md`
          Thanks to \`__lt__\`, \`sorted(shapes)\` knows how to compare two shapes. Another solution:
          \`sorted(shapes, key=lambda s: s.area())\`. The \`Rectangle2D\` constructor could also take **two
          corners** (\`p1\`, \`p2\`): a \`@classmethod\` such as \`Rectangle2D.from_corners(p1, p2)\` lets you offer both.
        `,
        tests: [
          "`Shape2D().area()` raises `NotImplementedError`",
          "Rectangle and square: area and perimeter",
          "`Square2D` inherits from `Rectangle2D` through `super()`",
          "Circle and triangle (Heron)",
          "Impossible triangle → `ValueError`",
          "`str()` displays the class and the area",
          "`sort_by_area` returns a new sorted list",
        ],
      },
      stretch: {
        title: "Lines and intersections",
        prompt: md`
          *Hands-on “Geometry 2D”, continued.* The \`Point2D\` class is provided. Write \`Line2D(p1, p2)\`, the
          line through two points:

          - \`__str__\`: \`"Line2D((0, 0) -> (3, 4))"\`;
          - \`length()\`: the length of the segment \`p1p2\`;
          - \`translate(dx, dy)\`, \`scale(factor)\` and \`rotate(angle)\`: apply the transformation to **both**
            points (by **reusing** the methods of \`Point2D\`);
          - \`intersect(other)\`: returns the \`Point2D\` where both (infinite) lines meet, or \`None\` if they are parallel.

          For two lines through (x1, y1), (x2, y2) and (x3, y3), (x4, y4):

          - d = (x1 − x2)(y3 − y4) − (y1 − y2)(x3 − x4); the lines are parallel if d = 0;
          - t = ((x1 − x3)(y3 − y4) − (y1 − y3)(x3 − x4)) / d;
          - the intersection is the point (x1 + t·(x2 − x1), y1 + t·(y2 − y1)).
        `,
        hint: md`
          \`Line2D\` is an example of **composition**: it contains two \`Point2D\` objects and delegates the
          transformations to them. Compare \`d\` to zero with a tolerance: \`abs(d) < 1e-12\`.
        `,
        tests: [
          "`str()` describes the line",
          "`length()` is 5 for (0, 0)–(3, 4)",
          "`translate` and `scale` move both points",
          "`rotate(pi)` makes a half-turn",
          "The diagonals of a square meet at (1, 1)",
          "Parallel lines → `None`",
          "Transformations reuse those of `Point2D`",
        ],
      },
    },
  },

  "m7-l4": {
    ex1: {
      title: "The vending machine",
      core: {
        title: "Products and class attributes",
        prompt: md`
          *Hands-on “Vending Machine”, step 1: the \`Product\` class.*

          1. Two **class attributes**: \`MAX_QUANTITY = 10\` and \`created = 0\` (number of products created
             since the program started: \`__init__\` increments it with \`Product.created += 1\`).
          2. Instance attributes: \`name\`, \`price\`, and \`quantity\` (0 by default).
          3. \`quantity\` is a **property** (\`@property\` + \`@quantity.setter\`): any value outside
             \`0 … MAX_QUANTITY\` raises \`ValueError\`, including in the constructor.
          4. \`__str__\` returns for instance \`"candy: 0.50 x 8"\` (price with 2 decimals).
        `,
        hint: md`
          The setter stores the value in an internal attribute, \`self._quantity\`. Writing
          \`self.quantity = quantity\` in \`__init__\` already goes through the setter: validation for free.
        `,
        tests: [
          "`MAX_QUANTITY` is a **class** attribute equal to 10",
          "`created` counts the created products",
          "`quantity` is a property",
          "A quantity outside 0…10 raises `ValueError` (constructor and assignment)",
          "`str()`: `\"candy: 0.50 x 8\"`",
          "Decreasing the quantity works",
        ],
      },
      extra: {
        title: "The machine",
        prompt: md`
          *Step 2: the \`Machine\` class, which **contains** products (composition).* A machine holds at most
          \`MAX_PRODUCTS = 5\` different products, stored in \`self.products\` (dictionary name → \`Product\`).
          It keeps \`self.profit\` (total collected) and \`self.sales\` (dictionary name → number of sales).

          - \`add_product(product)\`: \`ValueError\` if the machine is full or if the name already exists;
          - \`buy(name)\`: \`KeyError\` if the product does not exist, \`ValueError\` if it is sold out;
            otherwise decreases the quantity, updates \`profit\` and \`sales\`, and **returns the price**;
          - \`to_order()\`: dictionary name → quantity to order to fill each product (only those that miss something);
          - \`refill(name)\`: sets this product back to \`MAX_QUANTITY\`.
        `,
        tests: [
          "`buy` returns the price and updates quantity, profit and sales",
          "Sold-out product → `ValueError`, unknown → `KeyError`",
          "At most 5 products, without duplicates",
          "`to_order` lists the missing quantities",
          "`refill` fills the product",
        ],
      },
      stretch: {
        title: "Saving and simulating",
        prompt: md`
          *Step 3.* Complete the machine so that it survives a restart, and simulate a day:

          1. \`to_dict()\` returns \`{"name": …, "profit": …, "products": [[name, price, quantity], …]}\`;
          2. \`@classmethod from_dict(cls, data)\` rebuilds a machine from this dictionary;
          3. \`save(path)\` writes \`to_dict()\` as JSON; \`@classmethod load(cls, path)\` reads it back;
          4. \`simulate(machines, operations)\`: \`machines\` is a dictionary name → \`Machine\`, \`operations\`
             a list of tuples \`(machine_name, action, product)\` where \`action\` is \`"buy"\` or \`"refill"\`.
             An impossible operation (unknown or sold-out product) is **counted as a failure** without stopping
             the simulation. Returns \`(total profit rounded to 2 decimals, number of failures)\`.
        `,
        hint: md`
          In \`simulate\`, wrap each operation in a \`try\` / \`except (KeyError, ValueError)\`. In \`from_dict\`,
          do not forget to restore \`profit\`.
        `,
        tests: [
          "`to_dict()` describes the machine",
          "`from_dict` rebuilds an equivalent machine",
          "`save` wrote a valid JSON file",
          "`load` reads the saved machine back",
          "`simulate` counts profit and failures",
          "Several machines, unknown product = failure",
        ],
      },
    },
  },

  "m7-l5": {
    ex1: {
      title: "Callbacks, MVC and a simulated GUI",
      core: {
        title: "Four ways to write a callback",
        prompt: md`
          The file \`minitk.py\` (see “Working folder”) imitates tkinter: \`Button(master, text=…, command=…)\`
          stores its callback, and \`button.invoke()\` simulates a click. Each callback writes into the list \`log\`.

          1. \`b1\`: **simple** callback — the function \`hello\` (which appends \`"hello"\`) passed by its name;
          2. \`b2\`: a **lambda** calling \`greet("Ada", 36)\`;
          3. \`b3\`: a **closure** — write \`make_callback(name, age)\`, which returns a function without
             arguments calling \`greet(name, age)\`, and use it for \`greet("Alan", 41)\`;
          4. \`b4\`: a **callable class** — \`ClickCounter\` counts its clicks in \`self.clicks\` and appends
             \`"click 1"\`, \`"click 2"\`… to \`log\`;
          5. \`letters\`: three buttons created **in a loop** for \`"A"\`, \`"B"\`, \`"C"\`; each appends **its own**
             letter to \`log\` (beware of the late-binding trap!).
        `,
        hint: md`
          For the loop: \`Button(root, text=c, command=lambda c=c: log.append(c))\` freezes the value of \`c\` at
          creation time. \`make_callback(c)\` works too.
        `,
        tests: [
          "`b1` calls `hello` directly",
          "`b2` uses a lambda calling `greet(\"Ada\", 36)`",
          "`make_callback` returns a closure",
          "`ClickCounter` keeps its state between two clicks",
          "The three buttons of the loop each append their own letter",
        ],
      },
      extra: {
        title: "An MVC counter",
        prompt: md`
          Build a counter with the **MVC** pattern and the \`minitk\` widgets:

          - **Model** \`CounterModel\`: \`value\` (0 at first), \`increment()\`, \`reset()\`, and a list of observers
            (\`add_observer(function)\`) called after **every** change. The model knows **no** widget.
          - **View** \`CounterView(master, model)\`: creates a \`Label\` (attribute \`self.label\`) and subscribes
            to the model; its \`refresh()\` method displays \`"Count: <value>"\` in the label (\`label.config(text=…)\`).
          - **Controller** \`CounterController(model)\`: methods \`on_plus()\` and \`on_reset()\`.

          The program creates the window, the view, the controller and two buttons \`plus\` and \`reset\` wired to
          the controller.
        `,
        tests: [
          "The model notifies its observers on every change",
          "The model knows no widget",
          "The view displays `Count: 0` at first",
          "Two clicks on `+` display `Count: 2`, then `Reset` → `Count: 0`",
          "The program's buttons are wired to the controller",
        ],
      },
      stretch: {
        title: "The graphical vending machine",
        prompt: md`
          *Hands-on “Vending Machine”, graphical interface.* The \`Product\` and \`Machine\` classes are provided.
          Write \`TkVendingMachine(master, machine)\`, which **composes** a \`Machine\` and a \`Frame\` (rather than
          using multiple inheritance):

          - \`self.frame\`: a \`Frame\` placed in \`master\`;
          - \`self.buttons\`: dictionary product name → \`Button\` (in the frame), with text \`"candy (0.50)"\`,
            whose click buys this product;
          - \`self.status\`: a \`Label\` that displays \`"Profit: 0.00"\` then the profit after each purchase, or
            \`"Sold out: candy"\` if the product is sold out (the exception must not propagate).
        `,
        hint: md`
          Create the buttons in a loop with \`command=lambda name=name: self.buy(name)\` (or a closure), and write a
          \`buy(name)\` method that calls \`self.machine.buy\` inside a \`try\`.
        `,
        tests: [
          "`TkVendingMachine` composes a `Frame` (no inheritance)",
          "One button per product, with the price",
          "The buttons are in the frame",
          "A click buys the product and updates the profit",
          "Sold-out product → `Sold out: candy`",
        ],
      },
    },
  },
};
