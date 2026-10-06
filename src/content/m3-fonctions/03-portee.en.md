### Local variables

A function definition creates a new **scope**: an area where variables are valid. A variable created **inside** a function (including its parameters) is **local**: it only exists during the call and disappears afterwards.

```python raises=NameError
def compute():
    result = 42        # local variable
    return result

print(compute())
print(result)          # NameError: result does not exist here (expected error!)
```

Example from the course: two variables named `m` coexist, one **global**, the other **local** to the function.

```python
m = "Hello, world"

def average(a, b):
    m = (a + b) / 2         # another m, local to average
    return m

x = average(1, 2)
print(m)                    # prints "Hello, world"
```

> 💡 Unlike other languages, `if`, `while` and `for` blocks do **not** create a new scope: a variable created in a loop still exists after the loop.

### Reading a global variable: allowed

A variable defined at the main level of the program is **global**. A function can **read** it.

```python
VAT_RATE = 0.2          # global constant (convention: CAPITALS)

def price_with_tax(price):
    return price * (1 + VAT_RATE)   # reading a global: OK

print(price_with_tax(100))
```

### Modifying a global: the trap

As soon as a function **assigns** a variable (`x = ...`, `x += ...`), Python considers it **local in the whole function**. Reading its value before the assignment then raises an `UnboundLocalError`.

```python raises=UnboundLocalError
counter = 0

def increment():
    counter = counter + 1      # counter is local... but not defined yet!

increment()                    # UnboundLocalError (expected error)
```

**Recommended solution**: pass the value as a parameter and **return** the result. You get a *pure function*, predictable and easy to test.

```python
def increment(value):
    return value + 1

counter = 0
counter = increment(counter)
counter = increment(counter)
print(counter)
```

> ⚠️ The `global counter` keyword lets you modify the global from the function, but **avoid it**: the code becomes hard to follow and debug, because any function can change the state of the program.

### The LEGB rule

To find the value of a name, Python looks in this order:

| Letter | Scope | Example |
|---|---|---|
| **L** | Local: the current function | parameters, variables created in the function |
| **E** | Enclosing: function containing the function | nested functions |
| **G** | Global: the module | variables defined outside any function |
| **B** | Built-in: Python's predefined names | `print`, `len`, `sum`… |

```python
x = "global"

def outer():
    x = "enclosing"
    def inner():
        return x               # no local x → go up: E
    return inner()

print(outer())                 # enclosing
print(x)                       # global: never modified
```

> ⚠️ Never name a variable `list`, `sum`, `max` or `print`: you would hide the matching built-in function (LEGB rule!).

### Parameters and variables with the same name

A parameter is a **local** variable, even if it has the same name as a global:

```python
x = 10

def double(x):
    x = x * 2          # modifies the local x only
    return x

print(double(x), x)    # 20 10
```

### Going further: closures

An inner function can “remember” the variables of the function that created it. The `nonlocal` keyword lets you **modify** an enclosing variable.

```python
def make_multiplier(factor):
    def multiply(x):
        return x * factor       # factor comes from the enclosing scope
    return multiply             # return the function itself

triple = make_multiplier(3)
print(triple(5), triple(10))
```

> 🎯 **Key points**: a function's variables are local; you can read a global but not assign it without `global`; prefer parameters + `return`; Python resolves names following LEGB.
