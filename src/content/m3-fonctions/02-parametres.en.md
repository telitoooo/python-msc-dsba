### Positional and named arguments

By default, arguments are matched to parameters **in order** (positional). You can also **name** them: the order no longer matters and the call becomes more readable.

```python
def introduce(name, age, city):
    return f"{name}, {age}, lives in {city}."

print(introduce("Ada", 36, "London"))                 # positional
print(introduce(city="Paris", name="Marie", age=30))  # named
print(introduce("Alan", city="Manchester", age=41))   # mix: positional first
```

### Functions as parameters

Back to the dichotomy of the previous lesson. One step further: make the **dichotomy itself a function**, with the interval and the precision as parameters… But the studied function `f` would still be “hard-wired” in it. Solution: **a function can be passed as an argument too!**

```python
def f(x):
    return x**3 + x + 1

def dichotomy(a, b, func, eps):
    if func(a) * func(b) < 0:
        while abs(a - b) > eps:
            h = (a + b) / 2
            if func(a) * func(h) < 0:
                b = h
            else:
                a = h
        print(f"zero of {func.__name__} between {a:.6f} and {b:.6f} at:", (a + b) / 2)
    else:
        print(f"{func.__name__} has the same sign in {a} and {b}")

dichotomy(-2, 2, f, 0.00001)
dichotomy(0, 2, lambda x: x * x - 2, 1e-9)   # √2: an anonymous function (module 6)
```

Drawback: we can no longer print the code of the studied function… except with the `inspect` module:

```python
import inspect

def f(x):
    return x**3 + x + 1

print(inspect.getsource(f))      # the source text of the function
```

### Default values

A parameter can have a **default value**, used when the argument is omitted. Parameters with default values must come **after** the required parameters.

```python
def f(x):
    return x**3 + x + 1

def dichotomy(func, a=-10, b=10, eps=0.000001):
    if func(a) * func(b) >= 0:
        return None
    while abs(a - b) > eps:
        h = (a + b) / 2
        if func(a) * func(h) < 0:
            b = h
        else:
            a = h
    return (a + b) / 2

# Positional arguments
print(dichotomy(f))
print(dichotomy(f, -2))
print(dichotomy(f, -2, 2))
print(dichotomy(f, -2, 2, 0.001))
# Named arguments: in any order, skipping the ones you do not change
print(dichotomy(f, eps=0.001, b=2))
```

> 💡 This is exactly how `print(..., sep=" ", end="\n")` or `round(x, ndigits=None)` work: optional parameters with default values.

### Variable number of arguments: `*args`

A parameter preceded by `*` collects all the extra positional arguments into a **tuple**.

```python
def total(*numbers):
    print("numbers =", numbers)
    result = 0
    for n in numbers:
        result += n
    return result

print(total(1, 2, 3))
print(total(10))
print(total())
```

### Free named arguments: `**kwargs`

Symmetrically, `**` collects the extra **named** arguments into a **dictionary** (module 4).

```python
def card(name, **info):
    print("Card of", name)
    for key in info:
        print(" -", key, ":", info[key])

card("Ada", language="Python", program="DSBA")
```

### Returning several values

A function can return several values separated by commas: Python groups them into a **tuple**, which is “unpacked” at the call site.

```python
def euclidean_division(a, b):
    return a // b, a % b

quotient, remainder = euclidean_division(17, 5)
print(quotient, remainder)
```

> ⚠️ **Trap: mutable default value.** Never write `def add(x, items=[])`: the same list is reused from one call to the next! Use `items=None`, then `if items is None: items = []` in the body.

> 🎯 **Key points**: positional then named arguments; a function can be passed as an argument; `param=default` makes an argument optional (after the required ones); `*args` collects a tuple, `**kwargs` a dictionary; `return a, b` returns a tuple; `inspect.getsource(f)` gives the code of `f`.
