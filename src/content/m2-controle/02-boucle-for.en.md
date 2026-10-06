### Repeating a known number of times

A `while` loop (next lesson) runs an **indefinite** number of times: we do not know for how long the condition will hold. A `for` loop runs a **definite** number of times: over an interval of integers with `range(a, b, step)`, over a collection of objects, and more generally over any **iterable**.

```python
for i in range(5):
    print("Round", i)
print("Done")

names = ["Alice", "Bob", "Charlie"]
for name in names:
    print("Hello, " + name + "!")
```

| Call | Values produced | Note |
|---|---|---|
| `range(5)` | 0, 1, 2, 3, 4 | starts at 0, **5 excluded** |
| `range(2, 6)` | 2, 3, 4, 5 | start included, stop excluded |
| `range(0, 20, 5)` | 0, 5, 10, 15 | step of 5 |
| `range(10, 0, -3)` | 10, 7, 4, 1 | negative step: countdown |

> 💡 `range(1, n + 1)` produces the integers from 1 to `n` included: make it a reflex.

### Looping over a string

`for` works with any sequence: strings, lists, tuples… (module 4).

```python
for letter in "DSBA":
    print(letter, end=" ")   # end=" ": no line break
print()                      # final line break
```

### The three patterns to know by heart

**The accumulator**: initialise *before* the loop, update *inside* the loop.

```python
total = 0
for n in range(1, 6):
    total += n
print("1 + 2 + 3 + 4 + 5 =", total)
```

**The counter**: count the elements that satisfy a condition.

```python
nb_even = 0
for n in range(1, 21):
    if n % 2 == 0:
        nb_even += 1
print(nb_even, "even numbers between 1 and 20")
```

**The running maximum**: keep the best element seen so far.

```python
word = "algorithm"
largest = word[0]
for letter in word:
    if letter > largest:          # alphabetical order
        largest = letter
print("Last letter in the alphabet:", largest)
```

### Numbering with `enumerate()`

```python
for position, letter in enumerate("Py"):
    print(position, letter)
```

### Nested loops

A loop inside a loop: the inner loop runs **completely** at each round of the outer loop.

```python
for row in range(1, 4):
    for column in range(1, 4):
        print(row * column, end="\t")
    print()   # end of the row
```

A star pattern (*Hands-on 10*) is built the same way: the outer loop chooses the line, the inner one draws its stars.

```python
n = 4
for i in range(1, n + 1):
    for j in range(i):
        print("* ", end="")
    print("")
```

> ⚠️ Do not forget to **initialise the accumulator before the loop**. Placed inside, `total = 0` would be reset at each round!

> 🎯 **Key points**: `for x in iterable:` runs a definite number of times; `range(start, stop, step)` excludes `stop`; accumulator, counter and running maximum are the three basic patterns; `enumerate` numbers.
