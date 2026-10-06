### Changing the flow of the program

Without control structures, a program runs **line after line**, in order. **Control structures** change this flow: run code **only under some condition** (`if … else …`) or **repeatedly** (`while` loops, `for … in …`, `for … in range()`, next lessons). Exceptions (`try … except …`) will come in module 5.

### Running code under a condition

The `if` keyword runs a **block** of code only if a condition is true. `elif` (“else if”) and `else` handle the other cases: conditions are tested **in sequence**, and only the block of the **first** true condition runs.

```python
temperature = 28

if temperature > 30:
    print("Heatwave! Stay cool.")
elif temperature > 20:
    print("Nice weather.")
elif temperature > 10:
    print("Take a jacket.")
else:
    print("It is cold!")

print("End of the weather report")   # outside the if: always run
```

The course example, with several conditions tested in sequence:

```python
age = 30
age_seconds = age * 365 * 24 * 60 * 60
if age_seconds < 100_000_000:
    print("You are less than 100 million seconds old")
elif age_seconds < 1_000_000_000:
    print("You are less than 1 billion seconds old")
elif age_seconds < 2_000_000_000:
    print("You are less than 2 billion seconds old")
else:
    print("You are older than 2 billion seconds")
```

### Code blocks

A **block** is a group of lines that belong together, for example the code run when the condition of an `if` is true. In Python:

- the line before the block ends with a **colon `:`**;
- the block is **indented** (shifted), usually by **4 spaces**: indentation, not braces, delimits the block;
- you can have as many `elif`s as needed; `else` is optional and always last.

> ⚠️ **Python tests conditions in order and stops at the first true one.** If you write `if grade >= 10:` before `elif grade >= 16:`, a grade of 18 gets the first branch's mention! Order your conditions from the most restrictive case to the most general.

A program is made of **blocks**, themselves made of **statements** (`if`, `for`, an assignment, a `print(…)`…). An **expression** is something that produces a value (possibly `None`): anything that can be on the right-hand side of an `=`. A block cannot be empty: for a block that does “nothing” (for now), write the `pass` statement.

```python
import os

my_path = "data.csv"
if not os.path.exists(my_path):
    pass                      # nothing to do for now (to be completed later)
else:
    print("The file exists")
print("rest of the program")
```

### Compound conditions

```python
age = 20
student = True
city = "Paris"

if age >= 18 and student:
    print("Adult and student")

if age < 12 or age >= 65:
    print("Reduced fare")
else:
    print("Full fare")

if not student:
    print("Not a student")

if 18 <= age <= 25:                          # chained comparison
    print("Youth card valid")

if city in ("Paris", "Lyon", "Marseille"):   # membership
    print("Big city")
```

### “Implicit” conditions

`if x:` evaluates `x` as a boolean: `0`, `0.0`, `""`, `[]`, `None`… are considered false, everything else true.

```python
name = ""
if name:
    print("Hello", name)
else:
    print("Missing name!")
```

### The conditional expression (ternary)

To assign to a variable a value that depends on a single condition, the **ternary operator** is a concise one-line alternative: `value_if_true if condition else value_if_false`.

```python
x = 12
# Long version
y = "big"
if x < 100:
    y = "small"
# Ternary version
y = "small" if x < 100 else "big"
print(y)
```

### Nested conditions

An `if` can contain another `if`. Often, an `and` makes the code more readable.

```python
logged_in = True
admin = False

if logged_in:
    if admin:
        print("Administration panel")
    else:
        print("User area")
else:
    print("Please log in")
```

> ⚠️ **Two frequent mistakes**: writing `if x = 3:` (assignment) instead of `if x == 3:` (comparison) → `SyntaxError`, and forgetting to indent the block → `IndentationError`.

> 🎯 **Key points**: `if` / `elif` / `else` + `:` + indented block; the first true condition wins; combine with `and`, `or`, `not`; `pass` for an empty block; `x if cond else y` to choose a value.
