### Building a program

The basic building blocks of a program are:

- **expressions**, which compute values;
- **variables**, which **memorise values** (bind a name to a value);
- **functions**, which **memorise computations** (bind a name to a computation).

You define your own building blocks, then assemble them. More than a Lego set, it is a **Meccano** kit: blocks must interact, data flow from one to another, and the whole thing must **run** smoothly.

### Why functions?

A **function** is a named, reusable block of code. It lets you:

- **not repeat yourself** (*DRY principle: Don't Repeat Yourself*);
- **split** a complex problem into small steps;
- **test** each piece separately.

Example from the course: find by **dichotomy** the zero of x³ + x + 1 in the interval [−2, 2] (cut the interval in two and keep the half where the function changes sign). Without a function, the expression is written **four times**:

```python
a = -2
b = 2
if (a**3 + a + 1) * (b**3 + b + 1) < 0:
    while abs(a - b) > 0.00001:
        h = (a + b) / 2
        if (a**3 + a + 1) * (h**3 + h + 1) < 0:
            b = h
        else:
            a = h
    print(f"zero of x^3+x+1 between {a} and {b} at:", (a + b) / 2)
else:
    print(f"x^3 + x + 1 has the same sign in {a} and {b}")
```

Pretty ugly, and error-prone: changing the function means editing four lines. **Solution: define a function.**

### Defining and calling a function

```python
def f(x):
    return x**3 + x + 1          # name: f, parameter: x, return value: the expression of the return

a, b = -2, 2
if f(a) * f(b) < 0:
    while abs(a - b) > 0.00001:
        h = (a + b) / 2
        if f(a) * f(h) < 0:
            b = h
        else:
            a = h
    print(f"zero of x^3+x+1 between {a} and {b} at:", (a + b) / 2)
```

- `def` + name + parentheses with the **parameters** + **`:`** (do not forget it!);
- the body is indented;
- `return` **returns** a value to the caller… and ends the function immediately;
- a triple-quoted string right below the `def` is the **docstring**: it documents the function (`help(f)`).

```python
def circle_area(radius):
    """Returns the area of a circle of the given radius."""
    return 3.14159 * radius ** 2

print(circle_area(1))
total_area = circle_area(1) + circle_area(2)   # the result is used as a value
print(round(total_area, 2))
```

> 💡 **Parameter or argument?** The *parameter* is the variable in the definition (`radius`); the *argument* is the value passed when calling (`2.5`).

### `return` is not `print`!

This is **the** number one confusion for beginners. `print` displays on screen; `return` passes a value to the rest of the program.

```python
def double_print(x):
    print(x * 2)

def double_return(x):
    return x * 2

a = double_print(5)    # prints 10... but a is None!
b = double_return(5)   # prints nothing, b is 10
print("a =", a, "| b =", b)
print(double_return(5) + 1)    # OK: 11
```

A function without `return` returns `None`. Golden rule: **a computing function returns its result**; it is up to the main program to decide whether to print it.

### Several `return`s: early exit

```python
def sign(n):
    if n > 0:
        return "positive"
    if n < 0:
        return "negative"
    return "zero"           # reached only if n == 0

print(sign(5), sign(-2), sign(0))
```

### Functions are values

Like a variable, a function name can be **rebound**: a function is an object like any other.

```python
def square(x):
    return x * x

power = square             # a second name for the same function
print(power(7))
square = abs               # we rebind the name square (avoid it in a real program!)
print(square(-3), power(-3))
```

### Program flow and the call stack

The text of a program reads from top to bottom, but its **execution** jumps from function to function. To do so, the computer must **pass the arguments** and **remember where to return** at the end of each call: it uses a **stack**, a “last in, first out” (*LIFO*) structure.

```python
# Program flow: f calls g or h, which call f again…
def f(x):
    print(x, end=" ")
    if x == 1:
        return 1
    elif x % 2 == 0:
        return g(x)
    else:
        return h(x)

def g(x):
    return f(x // 2)

def h(x):
    return f(3 * x + 1)

f(6)          # 6 3 10 5 16 8 4 2 1: 17 calls stacked before they all end
print()
```

> 💡 Visualise the call stack with **Python Tutor** (pythontutor.com): each call appears there as a stacked frame.

> ⚠️ A function must be **defined before it is called** (higher up in the file), and defining a function does not run its code: you must call it with parentheses `my_function()`.

> 🎯 **Key points**: variables = memorised values, functions = memorised computations; `def name(params):` + indented block; `return` returns a value and leaves the function (otherwise `None`); calls pile up on the call stack.
