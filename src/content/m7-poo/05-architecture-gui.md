### Organiser une application : l'architecture 3 tiers

Dès qu'une application grossit, on la découpe en **couches indépendantes** :

| Couche (*tier*) | Rôle | Exemple : distributeur automatique |
|---|---|---|
| **Présentation** | l'interface : traduit les actions de l'utilisateur et affiche les résultats | fenêtre tkinter, page web |
| **Logique** (métier) | les règles : calculs, décisions, coordination | classe `Machine` : acheter, recharger, bénéfice |
| **Données** | stockage et lecture des informations | fichier JSON, base de données |

Avantages : chaque couche évolue **indépendamment** (on remplace l'interface tkinter par un site web sans toucher à `Machine`), l'application passe mieux à l'échelle (*scalability*) et devient plus **fiable** (les couches peuvent être réparties sur plusieurs machines).

### Le patron MVC : Modèle, Vue, Contrôleur

Pour les interfaces graphiques, on utilise souvent le patron **MVC** :

- **Modèle** : les données et leur logique (ne sait rien de l'affichage) ;
- **Vue** : présente les données à l'utilisateur et capte ses actions ;
- **Contrôleur** : fait le lien, il traduit une action de la vue en opérations sur le modèle.

Le cycle : ① l'utilisateur agit sur la vue → ② la vue prévient le contrôleur → ③ le contrôleur met à jour le modèle → ④ le modèle signale qu'il a changé → ⑤ la vue relit le modèle et se met à jour (cette dernière flèche, vue → modèle directe, n'est pas autorisée par toutes les variantes de MVC).

```python
class CounterModel:                       # Modèle : données + logique
    def __init__(self):
        self.value = 0
        self.observers = []               # qui prévenir en cas de changement ?

    def increment(self):
        self.value += 1
        for notify in self.observers:     # ④ le modèle signale le changement
            notify()


class CounterView:                        # Vue : affichage (ici, du texte)
    def __init__(self, model):
        self.model = model
        self.text = ""

    def refresh(self):                    # ⑤ la vue relit le modèle
        self.text = f"Compteur : {self.model.value}"
        print(self.text)


class CounterController:                  # Contrôleur : traduit les actions
    def __init__(self, model):
        self.model = model

    def on_click(self):                   # ② ③ appelé quand on clique
        self.model.increment()


model = CounterModel()
view = CounterView(model)
model.observers.append(view.refresh)
controller = CounterController(model)
controller.on_click()                     # ① simulation de deux clics
controller.on_click()
```

### Les interfaces graphiques en Python

GUI = *Graphical User Interface*. Il existe beaucoup de bibliothèques : **tkinter** (fournie avec Python), PyQt, Pyjamas, Pyglet, **Pygame** (jeux)… Toutes reposent sur la **programmation événementielle** : le programme construit la fenêtre puis entre dans une **boucle d'événements** (`mainloop()`) qui attend les actions de l'utilisateur et appelle les fonctions associées, les **callbacks**.

Les widgets de tkinter : `Frame`, `LabelFrame`, `Toplevel`, `PanedWindow` (conteneurs) ; `Button`, `Radiobutton`, `Checkbutton`, `Menubutton` (boutons) ; `Label`, `Message`, `Text` (texte) ; `Scale`, `Scrollbar`, `Listbox`, `Spinbox`, `Entry` (saisie sur une ligne), `OptionMenu` et `Canvas` (dessin vectoriel et pixels).

```python norun
import tkinter as tk

root = tk.Tk()                                  # la fenêtre principale
root.title("Bonjour")
label = tk.Label(root, text="Votre nom :")
entry = tk.Entry(root)
greeting = tk.Label(root, text="")

def say_hello():                                # le callback du bouton
    greeting.config(text=f"Bonjour {entry.get()} !")

button = tk.Button(root, text="Saluer", command=say_hello)
for widget in (label, entry, button, greeting):
    widget.pack()                               # place le widget dans la fenêtre
root.mainloop()                                 # boucle d'événements : attend les clics
```

> ⚠️ Le navigateur ne peut pas ouvrir de fenêtre : le code tkinter de cette leçon est **à lire**. Pour pratiquer, les exercices fournissent `minitk.py`, une imitation minuscule de tkinter (mêmes noms : `Tk`, `Button`, `Label`, `Entry`, `Canvas`…) où l'on simule un clic avec `bouton.invoke()`. Lancez ensuite votre code avec le vrai tkinter sur votre ordinateur.

### Définir des callbacks : 4 méthodes

`command=` attend une **fonction sans argument**. Comment lui transmettre des données ?

```python norun
# 1. Fonction simple, sans argument : on passe son NOM (sans parenthèses !)
tk.Button(root, text="Quitter", command=simple_callback)

# 2. lambda avec capture lexicale : la plus courante pour les cas simples
tk.Button(root, text="Ada", command=lambda: callback_with_args("Ada", 36))

# 3. Fonction imbriquée (fermeture) : une « usine » renvoie le callback
def make_callback(name, age):
    def callback():
        print(f"{name} a {age} ans")      # name et age sont capturés
    return callback
tk.Button(root, text="Alan", command=make_callback("Alan", 41))

# 4. Classe appelable (__call__) : idéale quand le callback doit garder un état
class CallableCallback:
    def __init__(self, name, age):
        self.name, self.age, self.clicks = name, age, 0
    def __call__(self):
        self.clicks += 1
        print(f"{self.name} ({self.age} ans) : {self.clicks} clic(s)")
tk.Button(root, text="Grace", command=CallableCallback("Grace", 85))
```

Ces quatre méthodes s'essaient sans fenêtre : un bouton se contente de **mémoriser** `command` et de l'appeler au clic.

```python
class Button:                                  # un « bouton » réduit à l'essentiel
    def __init__(self, text, command):
        self.text, self.command = text, command

    def invoke(self):                          # simule un clic
        return self.command()


def make_callback(name):
    return lambda: print("clic sur", name)

buttons = [Button(n, make_callback(n)) for n in ["A", "B", "C"]]
for b in buttons:
    b.invoke()
```

> ⚠️ **Piège de la boucle** : `[Button(n, lambda: print(n)) for n in "ABC"]` affiche trois fois `C` : la lambda lit `n` au moment du **clic**, pas à sa création (liaison tardive, module 6). Solutions : une usine (méthode 3) ou un argument par défaut `lambda n=n: print(n)`.

### Dessiner sur un `Canvas`

```python norun
def draw_map(cities, w=800, h=600):
    root = tk.Tk()
    canvas = tk.Canvas(root, width=w, height=h, bg="white")
    canvas.pack()
    for name, (x, y) in cities.items():
        canvas.create_oval(x - 4, y - 4, x + 4, y + 4, fill="red")   # une ville
        canvas.create_text(x, y - 12, text=name)                      # son nom
    canvas.create_line(356, 638, 484, 563)                            # une route
    root.mainloop()
```

> 🎯 **À retenir** : séparez présentation, logique et données (3 tiers, MVC) ; une interface graphique est pilotée par une boucle d'événements qui appelle des callbacks ; `command=` reçoit une fonction (nom, lambda, fermeture ou objet appelable) ; une interface tkinter se compose d'objets : POO et GUI vont de pair.
