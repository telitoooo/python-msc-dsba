import { md, py, test } from "../helpers.js";

/** Imitation minuscule de tkinter, fournie dans le dossier de travail (pas de fenêtre dans le navigateur). */
export const MINITK = py`
  """
  minitk: a tiny imitation of tkinter to practise in the browser, where no window
  can be opened. It keeps the names and parameters of tkinter used in the course.
  A click is simulated with button.invoke().
  On your computer, the same code runs with: import tkinter as tk
  """

  END = "end"


  class Widget:
      def __init__(self, master=None, **options):
          self.master = master
          self.options = dict(options)
          self.children = []
          self.packed = False
          if master is not None:
              master.children.append(self)

      def pack(self, **options):
          self.packed = True

      def grid(self, **options):
          self.packed = True

      def config(self, **options):
          self.options.update(options)

      configure = config

      def cget(self, key):
          return self.options.get(key)

      def __getitem__(self, key):
          return self.cget(key)

      def __setitem__(self, key, value):
          self.options[key] = value

      def winfo_children(self):
          return list(self.children)

      def destroy(self):
          if self.master is not None and self in self.master.children:
              self.master.children.remove(self)


  class Tk(Widget):
      def __init__(self):
          super().__init__(None)
          self._title = "tk"

      def title(self, text=None):
          if text is None:
              return self._title
          self._title = text

      def mainloop(self):
          """No real event loop here: simulate clicks with button.invoke()."""


  class Frame(Widget):
      pass


  class Label(Widget):
      pass


  class Button(Widget):
      def invoke(self):
          """Simulates a click: calls the command callback."""
          command = self.options.get("command")
          return command() if command is not None else None


  class Entry(Widget):
      def __init__(self, master=None, **options):
          super().__init__(master, **options)
          self._text = ""

      def get(self):
          return self._text

      def insert(self, index, text):
          self._text = text + self._text if index in (0, "0") else self._text + text

      def delete(self, first, last=None):
          self._text = ""


  class Canvas(Widget):
      def __init__(self, master=None, **options):
          super().__init__(master, **options)
          self.items = {}
          self._next_id = 1

      def _create(self, kind, coords, options):
          item_id = self._next_id
          self._next_id += 1
          self.items[item_id] = {"type": kind, "coords": list(coords), **options}
          return item_id

      def create_line(self, *coords, **options):
          return self._create("line", coords, options)

      def create_oval(self, *coords, **options):
          return self._create("oval", coords, options)

      def create_rectangle(self, *coords, **options):
          return self._create("rectangle", coords, options)

      def create_text(self, *coords, **options):
          return self._create("text", coords, options)

      def find_all(self):
          return tuple(self.items)

      def type(self, item_id):
          return self.items[item_id]["type"]

      def coords(self, item_id):
          return self.items[item_id]["coords"]

      def itemcget(self, item_id, option):
          return self.items[item_id].get(option)

      def delete(self, item_id):
          if item_id == "all":
              self.items.clear()
          else:
              self.items.pop(item_id, None)
`;

const PRODUCT = py`
  class Product:
      MAX_QUANTITY = 10

      def __init__(self, name, price, quantity=0):
          self.name = name
          self.price = price
          self.quantity = quantity
`;

export default {
  // ---------------------------------------------------------------- 7.1
  "m7-l1": [
    {
      id: "ex1",
      title: "Premières classes",
      tiers: {
        core: {
          title: "Le chien et ses méthodes",
          prompt: md`
            Complétez la classe \`Dog\` :

            1. \`__init__(self, name, age=0)\` range \`name\` et \`age\` dans l'objet, et crée une liste
               vide \`self.tricks\` (les tours que le chien connaît) ;
            2. \`bark(self)\` **affiche** \`<nom> says woof!\` ;
            3. \`birthday(self)\` ajoute 1 à l'âge **et renvoie** le nouvel âge ;
            4. \`learn(self, trick)\` ajoute \`trick\` à la liste des tours.

            Le programme crée ensuite \`d1 = Dog("Fido")\` et \`d2 = Dog("Rex", 3)\` : vérifiez que les
            deux chiens sont bien indépendants.
          `,
          hint: md`
            Chaque méthode reçoit l'objet en premier paramètre : \`self\`. Pour ranger une valeur dans
            l'objet, écrivez \`self.name = name\` (et non \`name = name\`, qui crée une variable locale).
          `,
          starter: py`
            class Dog:
                def __init__(self, name, age=0):
                    ...

                def bark(self):
                    ...

                def birthday(self):
                    ...

                def learn(self, trick):
                    ...


            d1 = Dog("Fido")
            d2 = Dog("Rex", 3)
            d1.bark()
            d1.learn("sit")
            print(d1.name, d1.age, d1.tricks)
            print(d2.name, d2.age, d2.tricks)
          `,
          solution: py`
            class Dog:
                def __init__(self, name, age=0):
                    self.name = name
                    self.age = age
                    self.tricks = []

                def bark(self):
                    print(f"{self.name} says woof!")

                def birthday(self):
                    self.age += 1
                    return self.age

                def learn(self, trick):
                    self.tricks.append(trick)


            d1 = Dog("Fido")
            d2 = Dog("Rex", 3)
            d1.bark()
            d1.learn("sit")
            print(d1.name, d1.age, d1.tricks)
            print(d2.name, d2.age, d2.tricks)
          `,
          explanation: md`
            \`self.tricks = []\` est exécuté **à chaque** création d'objet : chaque chien a sa propre liste.
            \`d1.bark()\` est une écriture abrégée de \`Dog.bark(d1)\`.
          `,
          tests: [
            test("`Dog` est une classe", "isinstance(Dog, type)"),
            test("`d1` et `d2` ont les bons attributs", "(d1.name, d1.age, d2.name, d2.age) == ('Fido', 0, 'Rex', 3)", "(d1.name, d1.age, d2.name, d2.age)"),
            test("`bark()` affiche `<nom> says woof!`", "capture(Dog('Ada').bark) == 'Ada says woof!\\n'", "capture(Dog('Ada').bark)"),
            test("`birthday()` incrémente l'âge et le renvoie", "(lambda d: (d.birthday(), d.birthday(), d.age))(Dog('X', 5)) == (6, 7, 7)"),
            test("Chaque chien a sa propre liste de tours", "(lambda a, b: (a.learn('sit'), a.learn('roll'), a.tricks, b.tricks)[2:])(Dog('A'), Dog('B')) == (['sit', 'roll'], [])"),
          ],
        },
        extra: {
          title: "Un point du plan",
          prompt: md`
            *Hands-on « Geometry 2D », première partie.* Écrivez la classe \`Point2D\` :

            - \`__init__(self, x, y)\` ;
            - \`translate(self, dx, dy)\` : déplace le point **sur place** ;
            - \`scale(self, factor)\` : multiplie les deux coordonnées par \`factor\` (homothétie de centre l'origine) ;
            - \`rotate(self, angle)\` : tourne le point autour de l'origine d'un angle θ en **radians** :
              x' = x·cos θ − y·sin θ et y' = x·sin θ + y·cos θ ;
            - \`distance(self, other)\` : renvoie la distance euclidienne jusqu'au point \`other\` ;
            - \`to_tuple(self)\` : renvoie \`(x, y)\`.

            Les trois premières méthodes modifient l'objet et ne renvoient rien.
          `,
          hint: md`
            Attention dans \`rotate\` : calculez le nouveau \`x\` et le nouveau \`y\` **à partir des anciennes valeurs**
            (affectation multiple \`self.x, self.y = …, …\`). Utilisez \`math.cos\`, \`math.sin\` et \`math.hypot\`.
          `,
          starter: py`
            import math


            class Point2D:
                def __init__(self, x, y):
                    ...

                def translate(self, dx, dy):
                    ...

                def scale(self, factor):
                    ...

                def rotate(self, angle):
                    ...

                def distance(self, other):
                    ...

                def to_tuple(self):
                    ...


            p = Point2D(1, 0)
            p.rotate(math.pi / 2)
            print(p.to_tuple())
            print(Point2D(0, 0).distance(Point2D(3, 4)))
          `,
          solution: py`
            import math


            class Point2D:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def translate(self, dx, dy):
                    self.x += dx
                    self.y += dy

                def scale(self, factor):
                    self.x *= factor
                    self.y *= factor

                def rotate(self, angle):
                    c, s = math.cos(angle), math.sin(angle)
                    self.x, self.y = self.x * c - self.y * s, self.x * s + self.y * c

                def distance(self, other):
                    return math.hypot(self.x - other.x, self.y - other.y)

                def to_tuple(self):
                    return (self.x, self.y)


            p = Point2D(1, 0)
            p.rotate(math.pi / 2)
            print(p.to_tuple())
            print(Point2D(0, 0).distance(Point2D(3, 4)))
          `,
          explanation: md`
            **Méthode ou fonction pour la distance ?** Une méthode \`p.distance(q)\` est naturelle quand le
            calcul « appartient » au point. Une fonction \`distance(p, q)\` (ou une \`@staticmethod\`) souligne
            la symétrie entre les deux points. Les deux sont défendables : l'important est d'être cohérent.
          `,
          tests: [
            test("`Point2D(2, 5)` range `x` et `y`", "(Point2D(2, 5).x, Point2D(2, 5).y) == (2, 5)"),
            test("`translate` déplace le point sur place", "(lambda p: (p.translate(1, -2), p.to_tuple())[1])(Point2D(2, 5)) == (3, 3)"),
            test("`scale` multiplie les coordonnées", "(lambda p: (p.scale(3), p.to_tuple())[1])(Point2D(2, -1)) == (6, -3)"),
            test(
              "`rotate(pi/2)` envoie (1, 0) sur (0, 1)",
              "(lambda p: (p.rotate(math.pi / 2), approx(p.x, 0) and approx(p.y, 1))[1])(Point2D(1, 0))",
            ),
            test("`rotate(pi)` envoie (2, 3) sur (-2, -3)", "(lambda p: (p.rotate(math.pi), approx(p.x, -2) and approx(p.y, -3))[1])(Point2D(2, 3))"),
            test("`distance` est euclidienne", "approx(Point2D(0, 0).distance(Point2D(3, 4)), 5) and approx(Point2D(1, 1).distance(Point2D(1, 1)), 0)"),
          ],
        },
        stretch: {
          title: "Le compte bancaire, version objet",
          prompt: md`
            *Hands-on « Bank Account » : réécrire le compte bancaire avec des classes, gérer plusieurs comptes et un login.*

            **\`BankAccount(owner, balance=0)\`**
            - \`deposit(amount)\` et \`withdraw(amount)\` : lèvent \`ValueError\` si le montant n'est pas
              strictement positif, ou (retrait) s'il dépasse le solde ;
            - chaque opération réussie est ajoutée à \`self.history\` sous la forme \`("deposit", 50)\` ou \`("withdraw", 20)\`.

            **\`Bank()\`** gère plusieurs comptes protégés par un mot de passe :
            - \`open_account(owner, password, initial=0)\` crée et renvoie le compte (\`ValueError\` si ce
              titulaire a déjà un compte) ;
            - \`login(owner, password)\` mémorise le compte dans \`self.current\` et le renvoie ;
              titulaire inconnu ou mauvais mot de passe → \`PermissionError\` ;
            - \`logout()\` remet \`self.current\` à \`None\` ;
            - \`transfer(to_owner, amount)\` vire \`amount\` du compte connecté vers celui de \`to_owner\`
              (\`PermissionError\` si personne n'est connecté, \`ValueError\` si le destinataire n'existe pas).

            Les comptes sont rangés dans \`self.accounts\`, un dictionnaire \`titulaire → (mot_de_passe, compte)\`.
          `,
          hint: md`
            \`transfer\` peut réutiliser \`withdraw\` puis \`deposit\` : les erreurs de montant sont alors gérées
            par \`BankAccount\`.
          `,
          starter: py`
            class BankAccount:
                def __init__(self, owner, balance=0):
                    ...

                def deposit(self, amount):
                    ...

                def withdraw(self, amount):
                    ...


            class Bank:
                def __init__(self):
                    self.accounts = {}
                    self.current = None

                def open_account(self, owner, password, initial=0):
                    ...

                def login(self, owner, password):
                    ...

                def logout(self):
                    ...

                def transfer(self, to_owner, amount):
                    ...


            bank = Bank()
            bank.open_account("Alice", "1234", 100)
            bank.open_account("Bob", "pwd")
            bank.login("Alice", "1234")
            bank.transfer("Bob", 30)
            bank.logout()
            print(bank.accounts["Alice"][1].balance, bank.accounts["Bob"][1].balance)
          `,
          solution: py`
            class BankAccount:
                def __init__(self, owner, balance=0):
                    self.owner = owner
                    self.balance = balance
                    self.history = []

                def deposit(self, amount):
                    if amount <= 0:
                        raise ValueError("amount must be positive")
                    self.balance += amount
                    self.history.append(("deposit", amount))

                def withdraw(self, amount):
                    if amount <= 0:
                        raise ValueError("amount must be positive")
                    if amount > self.balance:
                        raise ValueError("insufficient funds")
                    self.balance -= amount
                    self.history.append(("withdraw", amount))


            class Bank:
                def __init__(self):
                    self.accounts = {}
                    self.current = None

                def open_account(self, owner, password, initial=0):
                    if owner in self.accounts:
                        raise ValueError(f"{owner} already has an account")
                    account = BankAccount(owner, initial)
                    self.accounts[owner] = (password, account)
                    return account

                def login(self, owner, password):
                    if owner not in self.accounts or self.accounts[owner][0] != password:
                        raise PermissionError("wrong user name or password")
                    self.current = self.accounts[owner][1]
                    return self.current

                def logout(self):
                    self.current = None

                def transfer(self, to_owner, amount):
                    if self.current is None:
                        raise PermissionError("please log in first")
                    if to_owner not in self.accounts:
                        raise ValueError(f"unknown account: {to_owner}")
                    self.current.withdraw(amount)
                    self.accounts[to_owner][1].deposit(amount)


            bank = Bank()
            bank.open_account("Alice", "1234", 100)
            bank.open_account("Bob", "pwd")
            bank.login("Alice", "1234")
            bank.transfer("Bob", 30)
            bank.logout()
            print(bank.accounts["Alice"][1].balance, bank.accounts["Bob"][1].balance)
          `,
          tests: [
            test(
              "Dépôts et retraits mettent à jour le solde et l'historique",
              "(lambda a: (a.deposit(50), a.withdraw(20), a.balance, a.history)[2:])(BankAccount('Ann', 10)) == (40, [('deposit', 50), ('withdraw', 20)])",
            ),
            test(
              "Montant négatif ou découvert → `ValueError`",
              "raises(ValueError, BankAccount('A', 10).deposit, -5) and raises(ValueError, BankAccount('A', 10).withdraw, 0) and raises(ValueError, BankAccount('A', 10).withdraw, 11)",
            ),
            test(
              "`open_account` crée des comptes distincts, sans doublon",
              "(lambda b: (b.open_account('A', 'x', 5), b.open_account('B', 'y'), raises(ValueError, b.open_account, 'A', 'z'), b.accounts['A'][1].balance, b.accounts['B'][1].balance)[2:])(Bank()) == (True, 5, 0)",
            ),
            test(
              "`login` vérifie le mot de passe (`PermissionError` sinon)",
              "(lambda b: (b.open_account('A', 'x'), raises(PermissionError, b.login, 'A', 'bad'), raises(PermissionError, b.login, 'Z', 'x'), b.login('A', 'x') is b.current)[1:])(Bank()) == (True, True, True)",
            ),
            test(
              "`transfer` exige d'être connecté et déplace l'argent",
              "(lambda b: (b.open_account('A', 'x', 100), b.open_account('B', 'y'), raises(PermissionError, b.transfer, 'B', 10), b.login('A', 'x'), b.transfer('B', 30), raises(ValueError, b.transfer, 'Z', 1), b.accounts['A'][1].balance, b.accounts['B'][1].balance)[-2:])(Bank()) == (70, 30)",
            ),
            test("`logout` déconnecte", "(lambda b: (b.open_account('A', 'x'), b.login('A', 'x'), b.logout(), b.current)[-1])(Bank()) is None"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 7.2
  "m7-l2": [
    {
      id: "ex1",
      title: "Méthodes spéciales",
      tiers: {
        core: {
          title: "Des points qu'on affiche, compare et additionne",
          prompt: md`
            Ajoutez des méthodes spéciales à \`Point2D\` :

            1. \`__str__\` : \`str(Point2D(1, 2))\` vaut \`"Point2D(1, 2)"\` ;
            2. \`__repr__\` : renvoie le même texte (utile pour afficher une liste de points) ;
            3. \`__eq__\` : deux points sont égaux s'ils ont les mêmes coordonnées (et \`p == "abc"\` vaut \`False\`) ;
            4. \`__add__\` : \`p + q\` renvoie un **nouveau** point, somme des coordonnées ;
            5. \`__mul__\` : \`p * k\` renvoie un nouveau point dont les coordonnées sont multipliées par le nombre \`k\`.
          `,
          hint: md`
            Dans \`__eq__\`, commencez par \`if not isinstance(other, Point2D): return False\`. Les opérateurs
            renvoient \`Point2D(…)\` sans modifier \`self\`.
          `,
          starter: py`
            class Point2D:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                # Ajoutez __str__, __repr__, __eq__, __add__ et __mul__


            p = Point2D(1, 2)
            q = Point2D(1, 2)
            print(p, p == q, p is q)
            print(p + Point2D(10, 20), p * 3)
            print([p, q])
          `,
          solution: py`
            class Point2D:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return f"Point2D({self.x}, {self.y})"

                def __repr__(self):
                    return str(self)

                def __eq__(self, other):
                    if not isinstance(other, Point2D):
                        return False
                    return (self.x, self.y) == (other.x, other.y)

                def __add__(self, other):
                    return Point2D(self.x + other.x, self.y + other.y)

                def __mul__(self, k):
                    return Point2D(self.x * k, self.y * k)


            p = Point2D(1, 2)
            q = Point2D(1, 2)
            print(p, p == q, p is q)
            print(p + Point2D(10, 20), p * 3)
            print([p, q])
          `,
          tests: [
            test("`str(Point2D(1, 2))` vaut `\"Point2D(1, 2)\"`", "str(Point2D(1, 2)) == 'Point2D(1, 2)'", "str(Point2D(1, 2))"),
            test("Une liste de points s'affiche lisiblement (`__repr__`)", "repr([Point2D(0, 1)]) == '[Point2D(0, 1)]'", "repr([Point2D(0, 1)])"),
            test(
              "`==` compare les coordonnées, mais `is` reste faux",
              "Point2D(1, 2) == Point2D(1, 2) and not (Point2D(1, 2) == Point2D(2, 1)) and Point2D(1, 2) is not Point2D(1, 2) and not (Point2D(0, 0) == 'abc')",
            ),
            test(
              "`p + q` renvoie un nouveau point sans modifier `p`",
              "(lambda p: (p + Point2D(10, 20) == Point2D(11, 22), p == Point2D(1, 2)))(Point2D(1, 2)) == (True, True)",
            ),
            test("`p * 3` multiplie les coordonnées", "Point2D(1, -2) * 3 == Point2D(3, -6)"),
          ],
        },
        extra: {
          title: "Un immeuble et un chien obéissant",
          prompt: md`
            1. **\`Building(floors)\`** : un immeuble de \`floors\` étages, tous vides (\`None\`) au départ.
               - \`building[i] = "ABC Corp"\` installe un occupant (\`__setitem__\`), \`building[i]\` le lit (\`__getitem__\`) ;
               - \`len(building)\` donne le nombre d'étages ;
               - \`"ABC Corp" in building\` teste si un étage est occupé par cet occupant (\`__contains__\`) ;
               - \`occupied(self)\` renvoie le nombre d'étages occupés.
            2. **\`Dog(name)\`** : un chien qu'on appelle comme une fonction (\`__call__\`).
               \`d("Fido")\` renvoie \`"Fido says woof!"\` si c'est son nom, sinon \`"Fido ignores it"\`.
          `,
          starter: py`
            class Building:
                def __init__(self, floors):
                    self._floors = [None] * floors

                ...


            class Dog:
                def __init__(self, name):
                    self.name = name

                ...


            building = Building(4)
            building[0] = "Reception"
            building[2] = "DEF Inc"
            print(building[2], len(building), "DEF Inc" in building, building.occupied())

            d = Dog("Fido")
            print(d("Fido"), "|", d("Rex"))
          `,
          solution: py`
            class Building:
                def __init__(self, floors):
                    self._floors = [None] * floors

                def __setitem__(self, floor_number, data):
                    self._floors[floor_number] = data

                def __getitem__(self, floor_number):
                    return self._floors[floor_number]

                def __len__(self):
                    return len(self._floors)

                def __contains__(self, tenant):
                    return tenant in self._floors

                def occupied(self):
                    return sum(1 for floor in self._floors if floor is not None)


            class Dog:
                def __init__(self, name):
                    self.name = name

                def __call__(self, name):
                    if name == self.name:
                        return f"{self.name} says woof!"
                    return f"{self.name} ignores it"


            building = Building(4)
            building[0] = "Reception"
            building[2] = "DEF Inc"
            print(building[2], len(building), "DEF Inc" in building, building.occupied())

            d = Dog("Fido")
            print(d("Fido"), "|", d("Rex"))
          `,
          tests: [
            test("Les crochets lisent et écrivent les étages", "(lambda b: (b.__setitem__(1, 'ABC'), b[1], b[0])[1:])(Building(3)) == ('ABC', None)"),
            test("`len()` donne le nombre d'étages", "len(Building(7)) == 7"),
            test("`in` teste la présence d'un occupant", "(lambda b: (b.__setitem__(2, 'X'), 'X' in b, 'Y' in b)[1:])(Building(3)) == (True, False)"),
            test("`occupied()` compte les étages occupés", "building.occupied() == 2 and Building(5).occupied() == 0"),
            test("Le chien est appelable et répond à son nom", "callable(Dog('Rex')) and Dog('Rex')('Rex') == 'Rex says woof!' and Dog('Rex')('Fido') == 'Rex ignores it'"),
          ],
        },
        stretch: {
          title: "Des polynômes appelables",
          prompt: md`
            Écrivez la classe \`Polynomial\`. \`Polynomial([1, 1, 0, 1])\` représente 1 + x + x³ : les
            coefficients sont donnés **du degré 0 au degré le plus haut**.

            - \`degree()\` : le degré (en ignorant les zéros de tête : \`Polynomial([2, 0, 0])\` est de degré 0) ;
            - \`__call__(x)\` : la valeur du polynôme en \`x\` → l'objet s'utilise comme une fonction ;
            - \`__add__\` et \`__mul__\` entre deux polynômes (renvoient un nouveau \`Polynomial\`) ;
            - \`__eq__\` : mêmes coefficients, zéros de tête ignorés ;
            - \`__str__\` : du plus haut degré au plus bas, sans les termes nuls, coefficient 1 omis :
              \`"x^3 + x + 1"\`, \`"2x^2 - 3"\`, \`"-x"\`, et \`"0"\` pour le polynôme nul.

            Enfin, utilisez la fonction \`dichotomy\` fournie (séance 2) pour trouver le zéro de x³ + x + 1
            dans [-2, 2] et rangez-le dans \`zero\` : un objet appelable remplace une fonction !
          `,
          hint: md`
            Commencez par normaliser les coefficients dans \`__init__\` (retirer les zéros de fin de liste,
            garder au moins \`[0]\`). Pour \`__call__\`, le schéma de Horner : en partant du plus haut degré,
            \`result = result * x + c\`. Pour \`__mul__\`, le coefficient de degré \`i + j\` reçoit \`a[i] * b[j]\`.
          `,
          starter: py`
            def dichotomy(func, a, b, eps=1e-9):
                """Zero of func in [a, b] (func(a) and func(b) of opposite signs)."""
                while b - a > eps:
                    h = (a + b) / 2
                    if func(a) * func(h) <= 0:
                        b = h
                    else:
                        a = h
                return (a + b) / 2


            class Polynomial:
                def __init__(self, coefs):
                    ...


            p = Polynomial([1, 1, 0, 1])
            print(p, "| degree", p.degree(), "| p(2) =", p(2))
            zero = ...
            print("zero:", zero)
          `,
          solution: py`
            def dichotomy(func, a, b, eps=1e-9):
                """Zero of func in [a, b] (func(a) and func(b) of opposite signs)."""
                while b - a > eps:
                    h = (a + b) / 2
                    if func(a) * func(h) <= 0:
                        b = h
                    else:
                        a = h
                return (a + b) / 2


            class Polynomial:
                def __init__(self, coefs):
                    coefs = list(coefs) or [0]
                    while len(coefs) > 1 and coefs[-1] == 0:
                        coefs.pop()
                    self.coefs = coefs

                def degree(self):
                    return len(self.coefs) - 1

                def __call__(self, x):
                    result = 0
                    for c in reversed(self.coefs):
                        result = result * x + c
                    return result

                def __add__(self, other):
                    n = max(len(self.coefs), len(other.coefs))
                    a = self.coefs + [0] * (n - len(self.coefs))
                    b = other.coefs + [0] * (n - len(other.coefs))
                    return Polynomial([x + y for x, y in zip(a, b)])

                def __mul__(self, other):
                    result = [0] * (len(self.coefs) + len(other.coefs) - 1)
                    for i, a in enumerate(self.coefs):
                        for j, b in enumerate(other.coefs):
                            result[i + j] += a * b
                    return Polynomial(result)

                def __eq__(self, other):
                    return isinstance(other, Polynomial) and self.coefs == other.coefs

                def __str__(self):
                    terms = []
                    for degree in range(len(self.coefs) - 1, -1, -1):
                        c = self.coefs[degree]
                        if c == 0:
                            continue
                        sign = "-" if c < 0 else "+"
                        size = abs(c)
                        if degree == 0:
                            body = f"{size}"
                        else:
                            power = "x" if degree == 1 else f"x^{degree}"
                            body = power if size == 1 else f"{size}{power}"
                        terms.append((sign, body))
                    if not terms:
                        return "0"
                    first_sign, first_body = terms[0]
                    text = ("-" if first_sign == "-" else "") + first_body
                    for sign, body in terms[1:]:
                        text += f" {sign} {body}"
                    return text


            p = Polynomial([1, 1, 0, 1])
            print(p, "| degree", p.degree(), "| p(2) =", p(2))
            zero = dichotomy(p, -2, 2)
            print("zero:", zero)
          `,
          tests: [
            test("`degree()` ignore les zéros de tête", "Polynomial([1, 1, 0, 1]).degree() == 3 and Polynomial([2, 0, 0]).degree() == 0"),
            test("Le polynôme est appelable : `p(2) == 11`", "callable(Polynomial([1])) and Polynomial([1, 1, 0, 1])(2) == 11 and Polynomial([5])(100) == 5"),
            test(
              "`+` et `*` renvoient de nouveaux polynômes",
              "Polynomial([1, 2]) + Polynomial([0, 0, 3]) == Polynomial([1, 2, 3]) and Polynomial([1, 1]) * Polynomial([-1, 1]) == Polynomial([-1, 0, 1])",
            ),
            test("`==` ignore les zéros de tête", "Polynomial([1, 2, 0]) == Polynomial([1, 2]) and not (Polynomial([1]) == Polynomial([2]))"),
            test(
              "`str()` : `\"x^3 + x + 1\"`, `\"2x^2 - 3\"`, `\"-x\"`, `\"0\"`",
              "[str(Polynomial(c)) for c in ([1, 1, 0, 1], [-3, 0, 2], [0, -1], [0])] == ['x^3 + x + 1', '2x^2 - 3', '-x', '0']",
              "[str(Polynomial(c)) for c in ([1, 1, 0, 1], [-3, 0, 2], [0, -1], [0])]",
            ),
            test("`zero` est le zéro de x³ + x + 1 (≈ -0.6823)", "abs(zero + 0.6823278) < 1e-5", "zero"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 7.3
  "m7-l3": [
    {
      id: "ex1",
      title: "Héritage et polymorphisme",
      tiers: {
        core: {
          title: "Le concert des animaux",
          prompt: md`
            1. \`Animal(name)\` : \`speak()\` renvoie \`"<nom> says something"\` et \`__str__\` renvoie
               \`"<Classe>(name=<nom>)"\` en utilisant \`type(self).__name__\` (ainsi les classes filles
               affichent leur propre nom **sans redéfinir** \`__str__\`).
            2. \`Dog\` et \`Cat\` héritent d'\`Animal\` et redéfinissent seulement \`speak()\` :
               \`"<nom> says woof!"\` / \`"<nom> says meow!"\`.
            3. \`Puppy\` hérite de \`Dog\` : \`Puppy(name, owner)\` appelle le constructeur parent avec
               \`super()\`, mémorise \`owner\`, et \`speak()\` renvoie la phrase du chien suivie de
               \`" (puppy of <owner>)"\`, en appelant \`super().speak()\`.
            4. \`concert(animals)\` renvoie la liste de ce que dit chaque animal (polymorphisme : pas de \`if\` sur le type !).
          `,
          starter: py`
            class Animal:
                def __init__(self, name):
                    self.name = name

                ...


            class Dog(Animal):
                ...


            class Cat(Animal):
                ...


            class Puppy(Dog):
                ...


            def concert(animals):
                ...


            band = [Animal("Generic"), Dog("Fido"), Cat("Garfield"), Puppy("Rex", "Ada")]
            for animal in band:
                print(animal)
            print(concert(band))
          `,
          solution: py`
            class Animal:
                def __init__(self, name):
                    self.name = name

                def __str__(self):
                    return f"{type(self).__name__}(name={self.name})"

                def speak(self):
                    return f"{self.name} says something"


            class Dog(Animal):
                def speak(self):
                    return f"{self.name} says woof!"


            class Cat(Animal):
                def speak(self):
                    return f"{self.name} says meow!"


            class Puppy(Dog):
                def __init__(self, name, owner):
                    super().__init__(name)
                    self.owner = owner

                def speak(self):
                    return super().speak() + f" (puppy of {self.owner})"


            def concert(animals):
                return [animal.speak() for animal in animals]


            band = [Animal("Generic"), Dog("Fido"), Cat("Garfield"), Puppy("Rex", "Ada")]
            for animal in band:
                print(animal)
            print(concert(band))
          `,
          tests: [
            test("La hiérarchie est correcte", "issubclass(Dog, Animal) and issubclass(Cat, Animal) and issubclass(Puppy, Dog)"),
            test("`Dog` et `Cat` ne redéfinissent ni `__init__` ni `__str__`", "all(m not in C.__dict__ for C in (Dog, Cat) for m in ('__init__', '__str__'))"),
            test("`str()` affiche le nom de la classe réelle", "str(Dog('Fido')) == 'Dog(name=Fido)' and str(Puppy('Rex', 'Ada')) == 'Puppy(name=Rex)'", "str(Dog('Fido'))"),
            test(
              "Chaque animal parle à sa façon",
              "[a.speak() for a in (Animal('A'), Dog('B'), Cat('C'))] == ['A says something', 'B says woof!', 'C says meow!']",
            ),
            test("`Puppy` utilise `super()` et ajoute son maître", "Puppy('Rex', 'Ada').speak() == 'Rex says woof! (puppy of Ada)' and 'super()' in SOURCE and Puppy('Rex', 'Ada').owner == 'Ada'"),
            test("`concert` est polymorphe (sans `isinstance` ni `type`)", "concert([Cat('Tom'), Dog('Rex')]) == ['Tom says meow!', 'Rex says woof!'] and not calls('isinstance')"),
          ],
        },
        extra: {
          title: "Formes géométriques",
          prompt: md`
            *Hands-on « Geometry 2D ».* \`Shape2D\` est un plan commun à toutes les formes :

            - \`area()\` et \`perimeter()\` lèvent \`NotImplementedError\` ;
            - \`__str__\` renvoie \`"<Classe>(area=<aire avec 2 décimales>)"\`, par exemple \`"Square2D(area=4.00)"\` ;
            - \`__lt__\` compare les **aires**, ce qui permet de trier des formes avec \`sorted\`.

            Classes filles : \`Rectangle2D(width, height)\`, \`Square2D(side)\` (un carré **est** un rectangle :
            elle hérite de \`Rectangle2D\` et appelle \`super().__init__\`), \`Circle2D(radius)\` et
            \`Triangle2D(a, b, c)\` (côtés ; aire par la formule de Héron √(s(s−a)(s−b)(s−c)) avec
            s le demi-périmètre ; \`ValueError\` si les côtés ne forment pas un triangle).

            Enfin, \`sort_by_area(shapes)\` renvoie une **nouvelle** liste triée par aire croissante.
          `,
          starter: py`
            import math


            class Shape2D:
                def area(self):
                    raise NotImplementedError

                def perimeter(self):
                    raise NotImplementedError

                ...


            class Rectangle2D(Shape2D):
                ...


            class Square2D(Rectangle2D):
                ...


            class Circle2D(Shape2D):
                ...


            class Triangle2D(Shape2D):
                ...


            def sort_by_area(shapes):
                ...


            shapes = [Circle2D(1), Square2D(2), Rectangle2D(1, 3), Triangle2D(3, 4, 5)]
            for shape in sort_by_area(shapes):
                print(shape, round(shape.perimeter(), 2))
          `,
          solution: py`
            import math


            class Shape2D:
                def area(self):
                    raise NotImplementedError

                def perimeter(self):
                    raise NotImplementedError

                def __str__(self):
                    return f"{type(self).__name__}(area={self.area():.2f})"

                def __lt__(self, other):
                    return self.area() < other.area()


            class Rectangle2D(Shape2D):
                def __init__(self, width, height):
                    self.width = width
                    self.height = height

                def area(self):
                    return self.width * self.height

                def perimeter(self):
                    return 2 * (self.width + self.height)


            class Square2D(Rectangle2D):
                def __init__(self, side):
                    super().__init__(side, side)


            class Circle2D(Shape2D):
                def __init__(self, radius):
                    self.radius = radius

                def area(self):
                    return math.pi * self.radius ** 2

                def perimeter(self):
                    return 2 * math.pi * self.radius


            class Triangle2D(Shape2D):
                def __init__(self, a, b, c):
                    x, y, z = sorted((a, b, c))
                    if x <= 0 or x + y <= z:
                        raise ValueError("these sides do not form a triangle")
                    self.a, self.b, self.c = a, b, c

                def perimeter(self):
                    return self.a + self.b + self.c

                def area(self):
                    s = self.perimeter() / 2
                    return math.sqrt(s * (s - self.a) * (s - self.b) * (s - self.c))


            def sort_by_area(shapes):
                return sorted(shapes)


            shapes = [Circle2D(1), Square2D(2), Rectangle2D(1, 3), Triangle2D(3, 4, 5)]
            for shape in sort_by_area(shapes):
                print(shape, round(shape.perimeter(), 2))
          `,
          explanation: md`
            Grâce à \`__lt__\`, \`sorted(shapes)\` sait comparer deux formes. Autre solution :
            \`sorted(shapes, key=lambda s: s.area())\`. Le constructeur de \`Rectangle2D\` aurait aussi pu prendre
            **deux coins** (\`p1\`, \`p2\`) : une \`@classmethod\` comme \`Rectangle2D.from_corners(p1, p2)\` permet
            d'offrir les deux.
          `,
          tests: [
            test("`Shape2D().area()` lève `NotImplementedError`", "raises(NotImplementedError, Shape2D().area)"),
            test("Rectangle et carré : aire et périmètre", "Rectangle2D(2, 3).area() == 6 and Rectangle2D(2, 3).perimeter() == 10 and Square2D(3).area() == 9"),
            test("`Square2D` hérite de `Rectangle2D` via `super()`", "issubclass(Square2D, Rectangle2D) and Square2D(4).width == 4 == Square2D(4).height and 'super()' in SOURCE"),
            test("Cercle et triangle (Héron)", "approx(Circle2D(1).area(), math.pi) and approx(Triangle2D(3, 4, 5).area(), 6) and Triangle2D(3, 4, 5).perimeter() == 12"),
            test("Triangle impossible → `ValueError`", "raises(ValueError, Triangle2D, 1, 2, 10)"),
            test("`str()` affiche la classe et l'aire", "str(Square2D(2)) == 'Square2D(area=4.00)' and str(Circle2D(1)) == 'Circle2D(area=3.14)'", "str(Square2D(2))"),
            test(
              "`sort_by_area` renvoie une nouvelle liste triée",
              "(lambda s: ([type(x).__name__ for x in sort_by_area(s)], type(s[0]).__name__))([Square2D(3), Circle2D(1), Rectangle2D(1, 1)]) == (['Rectangle2D', 'Circle2D', 'Square2D'], 'Square2D')",
            ),
          ],
        },
        stretch: {
          title: "Segments et intersections",
          prompt: md`
            *Hands-on « Geometry 2D », suite.* La classe \`Point2D\` est fournie. Écrivez \`Line2D(p1, p2)\`,
            la droite passant par deux points :

            - \`__str__\` : \`"Line2D((0, 0) -> (3, 4))"\` ;
            - \`length()\` : la longueur du segment \`p1p2\` ;
            - \`translate(dx, dy)\`, \`scale(factor)\` et \`rotate(angle)\` : appliquent la transformation aux
              **deux** points (en **réutilisant** les méthodes de \`Point2D\`) ;
            - \`intersect(other)\` : renvoie le \`Point2D\` d'intersection des deux droites (infinies), ou \`None\`
              si elles sont parallèles.

            Pour deux droites passant par (x1, y1), (x2, y2) et (x3, y3), (x4, y4) :

            - d = (x1 − x2)(y3 − y4) − (y1 − y2)(x3 − x4) ; les droites sont parallèles si d = 0 ;
            - t = ((x1 − x3)(y3 − y4) − (y1 − y3)(x3 − x4)) / d ;
            - l'intersection est le point (x1 + t·(x2 − x1), y1 + t·(y2 − y1)).
          `,
          hint: md`
            \`Line2D\` est un exemple de **composition** : elle contient deux \`Point2D\` et leur délègue les
            transformations. Comparez \`d\` à zéro avec une tolérance : \`abs(d) < 1e-12\`.
          `,
          starter: py`
            import math


            class Point2D:
                def __init__(self, x, y):
                    self.x, self.y = x, y

                def __str__(self):
                    return f"({self.x:g}, {self.y:g})"

                def translate(self, dx, dy):
                    self.x, self.y = self.x + dx, self.y + dy

                def scale(self, factor):
                    self.x, self.y = self.x * factor, self.y * factor

                def rotate(self, angle):
                    c, s = math.cos(angle), math.sin(angle)
                    self.x, self.y = self.x * c - self.y * s, self.x * s + self.y * c

                def distance(self, other):
                    return math.hypot(self.x - other.x, self.y - other.y)


            class Line2D:
                ...


            a = Line2D(Point2D(0, 0), Point2D(2, 2))
            b = Line2D(Point2D(0, 2), Point2D(2, 0))
            print(a, a.length())
            print(a.intersect(b))
          `,
          solution: py`
            import math


            class Point2D:
                def __init__(self, x, y):
                    self.x, self.y = x, y

                def __str__(self):
                    return f"({self.x:g}, {self.y:g})"

                def translate(self, dx, dy):
                    self.x, self.y = self.x + dx, self.y + dy

                def scale(self, factor):
                    self.x, self.y = self.x * factor, self.y * factor

                def rotate(self, angle):
                    c, s = math.cos(angle), math.sin(angle)
                    self.x, self.y = self.x * c - self.y * s, self.x * s + self.y * c

                def distance(self, other):
                    return math.hypot(self.x - other.x, self.y - other.y)


            class Line2D:
                def __init__(self, p1, p2):
                    self.p1 = p1
                    self.p2 = p2

                def __str__(self):
                    return f"Line2D({self.p1} -> {self.p2})"

                def length(self):
                    return self.p1.distance(self.p2)

                def translate(self, dx, dy):
                    self.p1.translate(dx, dy)
                    self.p2.translate(dx, dy)

                def scale(self, factor):
                    self.p1.scale(factor)
                    self.p2.scale(factor)

                def rotate(self, angle):
                    self.p1.rotate(angle)
                    self.p2.rotate(angle)

                def intersect(self, other):
                    x1, y1, x2, y2 = self.p1.x, self.p1.y, self.p2.x, self.p2.y
                    x3, y3, x4, y4 = other.p1.x, other.p1.y, other.p2.x, other.p2.y
                    d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
                    if abs(d) < 1e-12:
                        return None
                    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d
                    return Point2D(x1 + t * (x2 - x1), y1 + t * (y2 - y1))


            a = Line2D(Point2D(0, 0), Point2D(2, 2))
            b = Line2D(Point2D(0, 2), Point2D(2, 0))
            print(a, a.length())
            print(a.intersect(b))
          `,
          tests: [
            test("`str()` décrit la droite", "str(Line2D(Point2D(0, 0), Point2D(3, 4))) == 'Line2D((0, 0) -> (3, 4))'", "str(Line2D(Point2D(0, 0), Point2D(3, 4)))"),
            test("`length()` vaut 5 pour (0, 0)–(3, 4)", "approx(Line2D(Point2D(0, 0), Point2D(3, 4)).length(), 5)"),
            test(
              "`translate` et `scale` déplacent les deux points",
              "(lambda l: (l.translate(1, 1), l.scale(2), (l.p1.x, l.p1.y, l.p2.x, l.p2.y))[2])(Line2D(Point2D(0, 0), Point2D(1, 2))) == (2, 2, 4, 6)",
            ),
            test(
              "`rotate(pi)` fait un demi-tour",
              "(lambda l: (l.rotate(math.pi), approx(l.p2.x, -1) and approx(l.p2.y, -2))[1])(Line2D(Point2D(0, 0), Point2D(1, 2)))",
            ),
            test(
              "Les diagonales d'un carré se coupent en (1, 1)",
              "(lambda p: approx(p.x, 1) and approx(p.y, 1))(Line2D(Point2D(0, 0), Point2D(2, 2)).intersect(Line2D(Point2D(0, 2), Point2D(2, 0))))",
            ),
            test("Droites parallèles → `None`", "Line2D(Point2D(0, 0), Point2D(1, 1)).intersect(Line2D(Point2D(0, 1), Point2D(1, 2))) is None"),
            test("Les transformations réutilisent celles de `Point2D`", "calls('translate') and calls('rotate') and SOURCE.count('math.cos') == 1"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 7.4
  "m7-l4": [
    {
      id: "ex1",
      title: "Le distributeur automatique",
      tiers: {
        core: {
          title: "Produits et attributs de classe",
          prompt: md`
            *Hands-on « Vending Machine », étape 1 : la classe \`Product\`.*

            1. Deux **attributs de classe** : \`MAX_QUANTITY = 10\` et \`created = 0\` (nombre de produits
               créés depuis le lancement du programme : \`__init__\` l'incrémente avec \`Product.created += 1\`).
            2. Attributs d'instance : \`name\`, \`price\`, et \`quantity\` (0 par défaut).
            3. \`quantity\` est une **propriété** (\`@property\` + \`@quantity.setter\`) : toute valeur hors de
               \`0 … MAX_QUANTITY\` lève \`ValueError\`, y compris dans le constructeur.
            4. \`__str__\` renvoie par exemple \`"candy: 0.50 x 8"\` (prix avec 2 décimales).
          `,
          hint: md`
            Le setter stocke la valeur dans un attribut interne, \`self._quantity\`. Écrire \`self.quantity = quantity\`
            dans \`__init__\` passe déjà par le setter : la validation est gratuite.
          `,
          starter: py`
            class Product:
                ...


            candy = Product("candy", 0.5, 8)
            gums = Product("gums", 0.8)
            print(candy, "|", gums, "|", Product.created, "products")
            candy.quantity -= 3
            print(candy.quantity)
          `,
          solution: py`
            class Product:
                MAX_QUANTITY = 10
                created = 0

                def __init__(self, name, price, quantity=0):
                    self.name = name
                    self.price = price
                    self.quantity = quantity
                    Product.created += 1

                @property
                def quantity(self):
                    return self._quantity

                @quantity.setter
                def quantity(self, value):
                    if not 0 <= value <= Product.MAX_QUANTITY:
                        raise ValueError(f"invalid quantity: {value}")
                    self._quantity = value

                def __str__(self):
                    return f"{self.name}: {self.price:.2f} x {self.quantity}"


            candy = Product("candy", 0.5, 8)
            gums = Product("gums", 0.8)
            print(candy, "|", gums, "|", Product.created, "products")
            candy.quantity -= 3
            print(candy.quantity)
          `,
          tests: [
            test("`MAX_QUANTITY` est un attribut **de classe** valant 10", "Product.__dict__.get('MAX_QUANTITY') == 10 and 'MAX_QUANTITY' not in vars(Product('x', 1))"),
            test(
              "`created` compte les produits créés",
              "(lambda before: (Product('a', 1), Product('b', 2), Product.created - before)[2])(Product.created) == 2",
            ),
            test("`quantity` est une propriété", "isinstance(Product.__dict__.get('quantity'), property)"),
            test(
              "Une quantité hors de 0…10 lève `ValueError` (constructeur et affectation)",
              "raises(ValueError, Product, 'x', 1, 11) and raises(ValueError, setattr, Product('y', 1, 5), 'quantity', -1)",
            ),
            test("`str()` : `\"candy: 0.50 x 8\"`", "str(Product('candy', 0.5, 8)) == 'candy: 0.50 x 8'", "str(Product('candy', 0.5, 8))"),
            test("Diminuer la quantité fonctionne", "candy.quantity == 5", "candy.quantity"),
          ],
        },
        extra: {
          title: "La machine",
          prompt: md`
            *Étape 2 : la classe \`Machine\`, qui **contient** des produits (composition).* Une machine
            contient au plus \`MAX_PRODUCTS = 5\` produits différents, rangés dans \`self.products\`
            (dictionnaire nom → \`Product\`). Elle mémorise \`self.profit\` (total encaissé) et
            \`self.sales\` (dictionnaire nom → nombre de ventes).

            - \`add_product(product)\` : \`ValueError\` si la machine est pleine ou si le nom existe déjà ;
            - \`buy(name)\` : \`KeyError\` si le produit n'existe pas, \`ValueError\` s'il est épuisé ;
              sinon diminue la quantité, met à jour \`profit\` et \`sales\`, et **renvoie le prix** ;
            - \`to_order()\` : dictionnaire nom → quantité à commander pour remplir chaque produit (seulement
              ceux auxquels il manque quelque chose) ;
            - \`refill(name)\` : remet ce produit à \`MAX_QUANTITY\`.
          `,
          starter: py`
            ${PRODUCT}


            class Machine:
                MAX_PRODUCTS = 5

                def __init__(self, name):
                    self.name = name
                    self.products = {}
                    self.profit = 0.0
                    self.sales = {}

                ...


            m = Machine("hall")
            m.add_product(Product("candy", 0.5, 3))
            m.add_product(Product("gums", 0.8, 10))
            m.buy("candy")
            m.buy("gums")
            print(m.profit, m.sales, m.to_order())
          `,
          solution: py`
            ${PRODUCT}


            class Machine:
                MAX_PRODUCTS = 5

                def __init__(self, name):
                    self.name = name
                    self.products = {}
                    self.profit = 0.0
                    self.sales = {}

                def add_product(self, product):
                    if len(self.products) >= Machine.MAX_PRODUCTS:
                        raise ValueError("the machine is full")
                    if product.name in self.products:
                        raise ValueError(f"{product.name} is already in the machine")
                    self.products[product.name] = product

                def buy(self, name):
                    product = self.products[name]          # KeyError if unknown
                    if product.quantity == 0:
                        raise ValueError(f"{name} is sold out")
                    product.quantity -= 1
                    self.profit += product.price
                    self.sales[name] = self.sales.get(name, 0) + 1
                    return product.price

                def to_order(self):
                    return {
                        name: Product.MAX_QUANTITY - p.quantity
                        for name, p in self.products.items()
                        if p.quantity < Product.MAX_QUANTITY
                    }

                def refill(self, name):
                    self.products[name].quantity = Product.MAX_QUANTITY


            m = Machine("hall")
            m.add_product(Product("candy", 0.5, 3))
            m.add_product(Product("gums", 0.8, 10))
            m.buy("candy")
            m.buy("gums")
            print(m.profit, m.sales, m.to_order())
          `,
          tests: [
            test(
              "`buy` renvoie le prix et met à jour quantité, bénéfice et ventes",
              "(lambda m: (m.add_product(Product('a', 1.5, 2)), m.buy('a'), m.buy('a'), m.products['a'].quantity, m.profit, m.sales)[1:])(Machine('t')) == (1.5, 1.5, 0, 3.0, {'a': 2})",
            ),
            test(
              "Produit épuisé → `ValueError`, inconnu → `KeyError`",
              "(lambda m: (m.add_product(Product('a', 1, 0)), raises(ValueError, m.buy, 'a'), raises(KeyError, m.buy, 'zzz'))[1:])(Machine('t')) == (True, True)",
            ),
            test(
              "Au plus 5 produits, sans doublon",
              "(lambda m: ([m.add_product(Product(str(i), 1)) for i in range(5)], raises(ValueError, m.add_product, Product('6', 1)), len(m.products))[1:])(Machine('t')) == (True, 5) and (lambda m: (m.add_product(Product('a', 1)), raises(ValueError, m.add_product, Product('a', 2)))[1])(Machine('t'))",
            ),
            test("`to_order` liste les quantités manquantes", "m.to_order() == {'candy': 8, 'gums': 1}", "m.to_order()"),
            test(
              "`refill` remplit le produit",
              "(lambda m: (m.add_product(Product('a', 1, 4)), m.refill('a'), m.products['a'].quantity, m.to_order())[2:])(Machine('t')) == (10, {})",
            ),
          ],
        },
        stretch: {
          title: "Sauvegarder et simuler",
          prompt: md`
            *Étape 3.* Complétez la machine pour qu'elle survive à un redémarrage et simulez une journée :

            1. \`to_dict()\` renvoie \`{"name": …, "profit": …, "products": [[nom, prix, quantité], …]}\` ;
            2. \`@classmethod from_dict(cls, data)\` reconstruit une machine à partir de ce dictionnaire ;
            3. \`save(path)\` écrit \`to_dict()\` en JSON ; \`@classmethod load(cls, path)\` la relit ;
            4. \`simulate(machines, operations)\` : \`machines\` est un dictionnaire nom → \`Machine\`,
               \`operations\` une liste de tuples \`(nom_machine, action, produit)\` avec \`action\` valant
               \`"buy"\` ou \`"refill"\`. Une opération impossible (produit inconnu ou épuisé) est **comptée
               comme un échec** sans arrêter la simulation. Renvoie \`(bénéfice total arrondi à 2 décimales, nombre d'échecs)\`.
          `,
          hint: md`
            Dans \`simulate\`, entourez chaque opération d'un \`try\` / \`except (KeyError, ValueError)\`.
            Dans \`from_dict\`, n'oubliez pas de restaurer \`profit\`.
          `,
          starter: py`
            import json

            ${PRODUCT}


            class Machine:
                def __init__(self, name):
                    self.name = name
                    self.products = {}
                    self.profit = 0.0

                def add_product(self, product):
                    self.products[product.name] = product

                def buy(self, name):
                    product = self.products[name]
                    if product.quantity == 0:
                        raise ValueError(f"{name} is sold out")
                    product.quantity -= 1
                    self.profit += product.price

                def refill(self, name):
                    self.products[name].quantity = Product.MAX_QUANTITY

                def to_dict(self):
                    ...

                @classmethod
                def from_dict(cls, data):
                    ...

                def save(self, path):
                    ...

                @classmethod
                def load(cls, path):
                    ...


            def simulate(machines, operations):
                ...


            hall = Machine("hall")
            hall.add_product(Product("candy", 0.5, 1))
            hall.add_product(Product("cookie", 1.0, 2))
            hall.save("hall.json")
            print(Machine.load("hall.json").to_dict())
            ops = [("hall", "buy", "candy"), ("hall", "buy", "candy"), ("hall", "refill", "candy"), ("hall", "buy", "candy")]
            print(simulate({"hall": hall}, ops))
          `,
          solution: py`
            import json

            ${PRODUCT}


            class Machine:
                def __init__(self, name):
                    self.name = name
                    self.products = {}
                    self.profit = 0.0

                def add_product(self, product):
                    self.products[product.name] = product

                def buy(self, name):
                    product = self.products[name]
                    if product.quantity == 0:
                        raise ValueError(f"{name} is sold out")
                    product.quantity -= 1
                    self.profit += product.price

                def refill(self, name):
                    self.products[name].quantity = Product.MAX_QUANTITY

                def to_dict(self):
                    return {
                        "name": self.name,
                        "profit": self.profit,
                        "products": [[p.name, p.price, p.quantity] for p in self.products.values()],
                    }

                @classmethod
                def from_dict(cls, data):
                    machine = cls(data["name"])
                    machine.profit = data["profit"]
                    for name, price, quantity in data["products"]:
                        machine.add_product(Product(name, price, quantity))
                    return machine

                def save(self, path):
                    with open(path, "w", encoding="utf-8") as f:
                        json.dump(self.to_dict(), f, indent=2)

                @classmethod
                def load(cls, path):
                    with open(path, encoding="utf-8") as f:
                        return cls.from_dict(json.load(f))


            def simulate(machines, operations):
                failures = 0
                for machine_name, action, product in operations:
                    machine = machines[machine_name]
                    try:
                        if action == "buy":
                            machine.buy(product)
                        else:
                            machine.refill(product)
                    except (KeyError, ValueError):
                        failures += 1
                total = sum(m.profit for m in machines.values())
                return round(total, 2), failures


            hall = Machine("hall")
            hall.add_product(Product("candy", 0.5, 1))
            hall.add_product(Product("cookie", 1.0, 2))
            hall.save("hall.json")
            print(Machine.load("hall.json").to_dict())
            ops = [("hall", "buy", "candy"), ("hall", "buy", "candy"), ("hall", "refill", "candy"), ("hall", "buy", "candy")]
            print(simulate({"hall": hall}, ops))
          `,
          tests: [
            test(
              "`to_dict()` décrit la machine",
              "(lambda m: (m.add_product(Product('a', 1.5, 3)), m.to_dict())[1])(Machine('x')) == {'name': 'x', 'profit': 0.0, 'products': [['a', 1.5, 3]]}",
            ),
            test(
              "`from_dict` reconstruit une machine équivalente",
              "(lambda d: (d.name, d.profit, d.products['a'].quantity, type(d) is Machine))(Machine.from_dict({'name': 'y', 'profit': 2.5, 'products': [['a', 1.0, 4]]})) == ('y', 2.5, 4, True)",
            ),
            test("`save` a écrit un fichier JSON valide", "file_exists('hall.json') and json.loads(read_file('hall.json'))['name'] == 'hall'"),
            test(
              "`load` relit la machine sauvegardée",
              "Machine.load('hall.json').to_dict() == {'name': 'hall', 'profit': 0.0, 'products': [['candy', 0.5, 1], ['cookie', 1.0, 2]]}",
            ),
            test("`simulate` compte bénéfice et échecs", "simulate({'hall': Machine.load('hall.json')}, ops) == (1.0, 1)", "simulate({'hall': Machine.load('hall.json')}, ops)"),
            test(
              "Plusieurs machines, produit inconnu = échec",
              "(lambda a, b: (a.add_product(Product('x', 2, 1)), b.add_product(Product('y', 1, 5)), simulate({'a': a, 'b': b}, [('a', 'buy', 'x'), ('b', 'buy', 'y'), ('b', 'buy', 'nope'), ('a', 'buy', 'x')]))[2])(Machine('a'), Machine('b')) == (3, 2)",
            ),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 7.5
  "m7-l5": [
    {
      id: "ex1",
      title: "Callbacks, MVC et interface simulée",
      tiers: {
        core: {
          title: "Quatre façons d'écrire un callback",
          prompt: md`
            Le fichier \`minitk.py\` (voir « Dossier de travail ») imite tkinter : \`Button(master, text=…, command=…)\`
            mémorise son callback, et \`bouton.invoke()\` simule un clic. Chaque callback écrit dans la liste \`log\`.

            1. \`b1\` : callback **simple** — la fonction \`hello\` (qui ajoute \`"hello"\`) passée par son nom ;
            2. \`b2\` : **lambda** qui appelle \`greet("Ada", 36)\` ;
            3. \`b3\` : **fermeture** — écrivez \`make_callback(name, age)\` qui renvoie une fonction sans
               argument appelant \`greet(name, age)\`, et utilisez-la pour \`greet("Alan", 41)\` ;
            4. \`b4\` : **classe appelable** — \`ClickCounter\` compte ses clics dans \`self.clicks\` et ajoute
               \`"click 1"\`, \`"click 2"\`… à \`log\` ;
            5. \`letters\` : trois boutons créés **dans une boucle** pour \`"A"\`, \`"B"\`, \`"C"\` ; chacun ajoute
               **sa** lettre à \`log\` (attention au piège de la liaison tardive !).
          `,
          hint: md`
            Pour la boucle : \`Button(root, text=c, command=lambda c=c: log.append(c))\` fige la valeur de \`c\`
            au moment de la création. \`make_callback(c)\` fonctionne aussi.
          `,
          files: { "minitk.py": MINITK },
          starter: py`
            from minitk import Tk, Button

            root = Tk()
            log = []


            def hello():
                log.append("hello")


            def greet(name, age):
                log.append(f"{name} ({age})")


            def make_callback(name, age):
                ...


            class ClickCounter:
                ...


            b1 = Button(root, text="Hello", command=...)
            b2 = Button(root, text="Ada", command=...)
            b3 = Button(root, text="Alan", command=...)
            b4 = Button(root, text="Count", command=...)
            letters = []

            for button in [b1, b2, b3, b4, b4] + letters:
                button.invoke()
            print(log)
          `,
          solution: py`
            from minitk import Tk, Button

            root = Tk()
            log = []


            def hello():
                log.append("hello")


            def greet(name, age):
                log.append(f"{name} ({age})")


            def make_callback(name, age):
                def callback():
                    greet(name, age)
                return callback


            class ClickCounter:
                def __init__(self):
                    self.clicks = 0

                def __call__(self):
                    self.clicks += 1
                    log.append(f"click {self.clicks}")


            b1 = Button(root, text="Hello", command=hello)
            b2 = Button(root, text="Ada", command=lambda: greet("Ada", 36))
            b3 = Button(root, text="Alan", command=make_callback("Alan", 41))
            b4 = Button(root, text="Count", command=ClickCounter())
            letters = [Button(root, text=c, command=lambda c=c: log.append(c)) for c in "ABC"]

            for button in [b1, b2, b3, b4, b4] + letters:
                button.invoke()
            print(log)
          `,
          tests: [
            test("`b1` appelle directement `hello`", "b1['command'] is hello"),
            test("`b2` utilise une lambda vers `greet(\"Ada\", 36)`", "b2['command'].__name__ == '<lambda>' and (lambda n: (b2.invoke(), log[n:])[1])(len(log)) == ['Ada (36)']"),
            test(
              "`make_callback` renvoie une fermeture",
              "callable(make_callback('X', 1)) and (lambda n: (make_callback('X', 1)(), log[n:])[1])(len(log)) == ['X (1)'] and (lambda n: (b3.invoke(), log[n:])[1])(len(log)) == ['Alan (41)']",
            ),
            test(
              "`ClickCounter` garde son état entre deux clics",
              "(lambda c, n: (c(), c(), c.clicks, log[n:])[2:])(ClickCounter(), len(log)) == (2, ['click 1', 'click 2'])",
            ),
            test("Les trois boutons de la boucle ajoutent chacun leur lettre", "[b.cget('text') for b in letters] == ['A', 'B', 'C'] and (lambda n: ([b.invoke() for b in letters], log[n:])[1])(len(log)) == ['A', 'B', 'C']"),
          ],
        },
        extra: {
          title: "Un compteur en MVC",
          prompt: md`
            Construisez un compteur avec le patron **MVC** et les widgets de \`minitk\` :

            - **Modèle** \`CounterModel\` : \`value\` (0 au départ), \`increment()\`, \`reset()\`, et une liste
              d'observateurs (\`add_observer(fonction)\`) appelés après **chaque** changement. Le modèle ne
              connaît **aucun** widget.
            - **Vue** \`CounterView(master, model)\` : crée un \`Label\` (attribut \`self.label\`) et s'abonne au
              modèle ; sa méthode \`refresh()\` affiche \`"Count: <valeur>"\` dans le label (\`label.config(text=…)\`).
            - **Contrôleur** \`CounterController(model)\` : méthodes \`on_plus()\` et \`on_reset()\`.

            Le programme crée la fenêtre, la vue, le contrôleur et deux boutons \`plus\` et \`reset\` reliés au
            contrôleur.
          `,
          files: { "minitk.py": MINITK },
          starter: py`
            from minitk import Tk, Label, Button


            class CounterModel:
                ...


            class CounterView:
                ...


            class CounterController:
                ...


            root = Tk()
            model = CounterModel()
            view = CounterView(root, model)
            controller = CounterController(model)
            plus = Button(root, text="+", command=...)
            reset = Button(root, text="Reset", command=...)

            plus.invoke()
            plus.invoke()
            print(view.label.cget("text"))
            reset.invoke()
            print(view.label.cget("text"))
          `,
          solution: py`
            from minitk import Tk, Label, Button


            class CounterModel:
                def __init__(self):
                    self.value = 0
                    self.observers = []

                def add_observer(self, callback):
                    self.observers.append(callback)

                def _notify(self):
                    for callback in self.observers:
                        callback()

                def increment(self):
                    self.value += 1
                    self._notify()

                def reset(self):
                    self.value = 0
                    self._notify()


            class CounterView:
                def __init__(self, master, model):
                    self.model = model
                    self.label = Label(master, text="")
                    self.label.pack()
                    model.add_observer(self.refresh)
                    self.refresh()

                def refresh(self):
                    self.label.config(text=f"Count: {self.model.value}")


            class CounterController:
                def __init__(self, model):
                    self.model = model

                def on_plus(self):
                    self.model.increment()

                def on_reset(self):
                    self.model.reset()


            root = Tk()
            model = CounterModel()
            view = CounterView(root, model)
            controller = CounterController(model)
            plus = Button(root, text="+", command=controller.on_plus)
            reset = Button(root, text="Reset", command=controller.on_reset)

            plus.invoke()
            plus.invoke()
            print(view.label.cget("text"))
            reset.invoke()
            print(view.label.cget("text"))
          `,
          tests: [
            test(
              "Le modèle notifie ses observateurs à chaque changement",
              "(lambda m, seen: (m.add_observer(lambda: seen.append(m.value)), m.increment(), m.increment(), m.reset(), seen)[-1])(CounterModel(), []) == [1, 2, 0]",
            ),
            test("Le modèle ne connaît aucun widget", "all(w not in __import__('inspect').getsource(CounterModel) for w in ('Label', 'Button', 'minitk'))"),
            test("La vue affiche `Count: 0` au départ", "CounterView(Tk(), CounterModel()).label.cget('text') == 'Count: 0'"),
            test(
              "Deux clics sur `+` affichent `Count: 2`, puis `Reset` → `Count: 0`",
              "(lambda m: (lambda v, c: (Button(None, command=c.on_plus).invoke(), Button(None, command=c.on_plus).invoke(), v.label.cget('text'), c.on_reset(), v.label.cget('text')))(CounterView(Tk(), m), CounterController(m)))(CounterModel())[2::2] == ('Count: 2', 'Count: 0')",
            ),
            test("Les boutons du programme sont reliés au contrôleur", "plus['command'] == controller.on_plus and reset['command'] == controller.on_reset"),
          ],
        },
        stretch: {
          title: "Le distributeur graphique",
          prompt: md`
            *Hands-on « Vending Machine », interface graphique.* Les classes \`Product\` et \`Machine\` sont fournies.
            Écrivez \`TkVendingMachine(master, machine)\` qui **compose** une \`Machine\` et un \`Frame\` (plutôt
            que d'utiliser l'héritage multiple) :

            - \`self.frame\` : un \`Frame\` placé dans \`master\` ;
            - \`self.buttons\` : dictionnaire nom du produit → \`Button\` (dans le frame), de texte
              \`"candy (0.50)"\`, dont le clic achète ce produit ;
            - \`self.status\` : un \`Label\` qui affiche \`"Profit: 0.00"\` puis le bénéfice après chaque achat,
              ou \`"Sold out: candy"\` si le produit est épuisé (l'exception ne doit pas remonter).
          `,
          hint: md`
            Créez les boutons dans une boucle avec \`command=lambda name=name: self.buy(name)\` (ou une fermeture),
            et écrivez une méthode \`buy(name)\` qui appelle \`self.machine.buy\` dans un \`try\`.
          `,
          files: { "minitk.py": MINITK },
          starter: py`
            from minitk import Tk, Frame, Label, Button


            class Product:
                def __init__(self, name, price, quantity):
                    self.name, self.price, self.quantity = name, price, quantity


            class Machine:
                def __init__(self):
                    self.products = {}
                    self.profit = 0.0

                def add_product(self, product):
                    self.products[product.name] = product

                def buy(self, name):
                    product = self.products[name]
                    if product.quantity == 0:
                        raise ValueError(f"{name} is sold out")
                    product.quantity -= 1
                    self.profit += product.price


            class TkVendingMachine:
                ...


            machine = Machine()
            machine.add_product(Product("candy", 0.5, 1))
            machine.add_product(Product("cookie", 1.0, 5))
            root = Tk()
            app = TkVendingMachine(root, machine)
            app.buttons["candy"].invoke()
            app.buttons["cookie"].invoke()
            print(app.status.cget("text"))
            app.buttons["candy"].invoke()
            print(app.status.cget("text"))
          `,
          solution: py`
            from minitk import Tk, Frame, Label, Button


            class Product:
                def __init__(self, name, price, quantity):
                    self.name, self.price, self.quantity = name, price, quantity


            class Machine:
                def __init__(self):
                    self.products = {}
                    self.profit = 0.0

                def add_product(self, product):
                    self.products[product.name] = product

                def buy(self, name):
                    product = self.products[name]
                    if product.quantity == 0:
                        raise ValueError(f"{name} is sold out")
                    product.quantity -= 1
                    self.profit += product.price


            class TkVendingMachine:
                def __init__(self, master, machine):
                    self.machine = machine
                    self.frame = Frame(master)
                    self.frame.pack()
                    self.buttons = {}
                    for name, product in machine.products.items():
                        button = Button(
                            self.frame,
                            text=f"{name} ({product.price:.2f})",
                            command=lambda name=name: self.buy(name),
                        )
                        button.pack()
                        self.buttons[name] = button
                    self.status = Label(self.frame, text="Profit: 0.00")
                    self.status.pack()

                def buy(self, name):
                    try:
                        self.machine.buy(name)
                    except ValueError:
                        self.status.config(text=f"Sold out: {name}")
                    else:
                        self.status.config(text=f"Profit: {self.machine.profit:.2f}")


            machine = Machine()
            machine.add_product(Product("candy", 0.5, 1))
            machine.add_product(Product("cookie", 1.0, 5))
            root = Tk()
            app = TkVendingMachine(root, machine)
            app.buttons["candy"].invoke()
            app.buttons["cookie"].invoke()
            print(app.status.cget("text"))
            app.buttons["candy"].invoke()
            print(app.status.cget("text"))
          `,
          tests: [
            test("`TkVendingMachine` compose un `Frame` (pas d'héritage)", "TkVendingMachine.__bases__ == (object,) and app.frame in root.children"),
            test("Un bouton par produit, avec le prix", "{n: b.cget('text') for n, b in app.buttons.items()} == {'candy': 'candy (0.50)', 'cookie': 'cookie (1.00)'}"),
            test("Les boutons sont dans le frame", "all(b in app.frame.children for b in app.buttons.values())"),
            test(
              "Un clic achète le produit et met à jour le bénéfice",
              "(lambda m: (m.add_product(Product('tea', 2.0, 3)), (lambda a: (a.buttons['tea'].invoke(), a.buttons['tea'].invoke(), a.status.cget('text'), m.products['tea'].quantity)[2:])(TkVendingMachine(Tk(), m)))[1])(Machine()) == ('Profit: 4.00', 1)",
            ),
            test("Produit épuisé → `Sold out: candy`", "app.status.cget('text') == 'Sold out: candy'", "app.status.cget('text')"),
          ],
        },
      },
    },
  ],
};
