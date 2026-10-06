### Reminder: a function creates a scope

Each function call creates a **local scope**. A variable assigned in the function is **local**, even if a global variable has the same name:

```python
m = "Hello, world"

def average(a, b):
    m = (a + b) / 2        # local m: the global one is not touched
    return m

x = average(1, 2)
print(m)                   # Hello, world
```

> ⚠️ Unlike other languages, **`if`, `for` and `while` do not create a scope** in Python: a variable created in a loop still exists afterwards.

### `global`: modifying a global variable

The course shows a typical use: counting how many times a function is called by an algorithm.

```python
count = 0

def f(x):
    global count            # "count" designates the global variable
    count += 1
    return x ** 3 + x + 1

def dichotomy(function, a, b, eps=0.001):
    """Looks for a zero of function between a and b (opposite signs)."""
    while b - a > eps:
        middle = (a + b) / 2
        if function(a) * function(middle) <= 0:
            b = middle
        else:
            a = middle
    return (a + b) / 2

print(round(dichotomy(f, -2, 2), 3), "in", count, "calls of f")
```

> 💡 `global` is handy for a small script, but makes the code fragile (any function can modify the state). A **closure** (below) provides the same service without a global variable.

### `nonlocal`: modifying the variable of an enclosing function

`global` targets the module's scope; `nonlocal` targets the **nearest enclosing function**.

```python
x = "global"

def outer():
    x = "outer"
    def inner():
        nonlocal x          # x of "outer", not the global one
        x = "modified by inner"
    inner()
    print("outer :", x)

outer()
print("module:", x)
```

Name lookup order (**LEGB** rule): **L**ocal → **E**nclosing functions → **G**lobal → **B**uilt-in.

### Closures

A function defined inside another one **captures** the variables of the enclosing function, and remembers them even after the call has ended. This is the principle of **function factories**:

```python
def test(a):
    def add(b):
        nonlocal a
        a += 1
        return a + b
    return add                # we return the function itself

func = test(4)
print(func(4))                # 9  (a is 5)
print(func(4))                # 10 (a is 6: the state is kept)

def power(n):
    return lambda x: x ** n

square, cube = power(2), power(3)
print(square(5), cube(2))
```

### The late binding trap

A closure captures the **variable**, not its **value** at that moment. The value is read when the function is **called**:

```python
functions = [lambda x: x * k for k in range(3)]
print([f(10) for f in functions])    # [20, 20, 20] and not [0, 10, 20]!
```

The three `lambda`s share the same `k`, which is 2 at the end of the loop. To freeze the value, pass it as a **default parameter** (evaluated only once, at creation):

```python
functions = [lambda x, k=k: x * k for k in range(3)]
print([f(10) for f in functions])    # [0, 10, 20]
```

> 🎯 **Key points**: `global` targets the module, `nonlocal` the enclosing function; a closure captures the variables of its enclosing scope; beware of late binding in loops (`k=k`).
