### Organising an application: the 3-tier architecture

As soon as an application grows, it is split into **independent layers**:

| Layer (*tier*) | Role | Example: vending machine |
|---|---|---|
| **Presentation** | the interface: translates user actions and displays results | tkinter window, web page |
| **Logic** (business) | the rules: computations, decisions, coordination | `Machine` class: buy, refill, profit |
| **Data** | storing and retrieving information | JSON file, database |

Benefits: each layer evolves **independently** (you can replace the tkinter interface with a website without touching `Machine`), the application **scales** better and becomes more **reliable** (layers can be distributed over several computers).

### The MVC pattern: Model, View, Controller

For graphical interfaces, the **MVC** pattern is often used:

- **Model**: the data and their logic (knows nothing about display);
- **View**: presents the data to the user and captures their actions;
- **Controller**: the link between them, it turns a view action into operations on the model.

The cycle: ① the user interacts with the view → ② the view alerts the controller → ③ the controller updates the model → ④ the model signals that it has changed → ⑤ the view reads the model and updates itself (this last direct view → model arrow is not allowed by every MVC variant).

```python
class CounterModel:                       # Model: data + logic
    def __init__(self):
        self.value = 0
        self.observers = []               # whom to notify on change?

    def increment(self):
        self.value += 1
        for notify in self.observers:     # ④ the model signals the change
            notify()


class CounterView:                        # View: display (here, text)
    def __init__(self, model):
        self.model = model
        self.text = ""

    def refresh(self):                    # ⑤ the view reads the model
        self.text = f"Counter: {self.model.value}"
        print(self.text)


class CounterController:                  # Controller: translates actions
    def __init__(self, model):
        self.model = model

    def on_click(self):                   # ② ③ called on click
        self.model.increment()


model = CounterModel()
view = CounterView(model)
model.observers.append(view.refresh)
controller = CounterController(model)
controller.on_click()                     # ① simulate two clicks
controller.on_click()
```

### Graphical interfaces in Python

GUI = *Graphical User Interface*. There are many libraries: **tkinter** (shipped with Python), PyQt, Pyjamas, Pyglet, **Pygame** (games)… All rely on **event-driven programming**: the program builds the window then enters an **event loop** (`mainloop()`) that waits for user actions and calls the associated functions, the **callbacks**.

tkinter widgets: `Frame`, `LabelFrame`, `Toplevel`, `PanedWindow` (containers); `Button`, `Radiobutton`, `Checkbutton`, `Menubutton` (buttons); `Label`, `Message`, `Text` (text); `Scale`, `Scrollbar`, `Listbox`, `Spinbox`, `Entry` (single-line input), `OptionMenu` and `Canvas` (vector and pixel graphics).

```python norun
import tkinter as tk

root = tk.Tk()                                  # the main window
root.title("Hello")
label = tk.Label(root, text="Your name:")
entry = tk.Entry(root)
greeting = tk.Label(root, text="")

def say_hello():                                # the button callback
    greeting.config(text=f"Hello {entry.get()}!")

button = tk.Button(root, text="Greet", command=say_hello)
for widget in (label, entry, button, greeting):
    widget.pack()                               # place the widget in the window
root.mainloop()                                 # event loop: waits for clicks
```

> ⚠️ The browser cannot open windows: the tkinter code of this lesson is **for reading**. To practise, the exercises provide `minitk.py`, a tiny imitation of tkinter (same names: `Tk`, `Button`, `Label`, `Entry`, `Canvas`…) where a click is simulated with `button.invoke()`. Then run your code with the real tkinter on your computer.

### Defining callbacks: 4 methods

`command=` expects a **function with no argument**. How do you pass data to it?

```python norun
# 1. Simple function, no argument: pass its NAME (no parentheses!)
tk.Button(root, text="Quit", command=simple_callback)

# 2. lambda with lexical capture: the most common for simple cases
tk.Button(root, text="Ada", command=lambda: callback_with_args("Ada", 36))

# 3. Nested function (closure): a "factory" returns the callback
def make_callback(name, age):
    def callback():
        print(f"{name} is {age}")           # name and age are captured
    return callback
tk.Button(root, text="Alan", command=make_callback("Alan", 41))

# 4. Callable class (__call__): ideal when the callback must keep a state
class CallableCallback:
    def __init__(self, name, age):
        self.name, self.age, self.clicks = name, age, 0
    def __call__(self):
        self.clicks += 1
        print(f"{self.name} ({self.age}): {self.clicks} click(s)")
tk.Button(root, text="Grace", command=CallableCallback("Grace", 85))
```

These four methods can be tried without a window: a button merely **stores** `command` and calls it on click.

```python
class Button:                                  # a "button" reduced to the essentials
    def __init__(self, text, command):
        self.text, self.command = text, command

    def invoke(self):                          # simulates a click
        return self.command()


def make_callback(name):
    return lambda: print("click on", name)

buttons = [Button(n, make_callback(n)) for n in ["A", "B", "C"]]
for b in buttons:
    b.invoke()
```

> ⚠️ **Loop trap**: `[Button(n, lambda: print(n)) for n in "ABC"]` prints `C` three times: the lambda reads `n` at **click** time, not when it is created (late binding, module 6). Solutions: a factory (method 3) or a default argument `lambda n=n: print(n)`.

### Drawing on a `Canvas`

```python norun
def draw_map(cities, w=800, h=600):
    root = tk.Tk()
    canvas = tk.Canvas(root, width=w, height=h, bg="white")
    canvas.pack()
    for name, (x, y) in cities.items():
        canvas.create_oval(x - 4, y - 4, x + 4, y + 4, fill="red")   # a city
        canvas.create_text(x, y - 12, text=name)                      # its name
    canvas.create_line(356, 638, 484, 563)                            # a road
    root.mainloop()
```

> 🎯 **Key points**: separate presentation, logic and data (3 tiers, MVC); a GUI is driven by an event loop that calls callbacks; `command=` receives a function (name, lambda, closure or callable object); a tkinter interface is made of objects: OOP and GUI go hand in hand.
