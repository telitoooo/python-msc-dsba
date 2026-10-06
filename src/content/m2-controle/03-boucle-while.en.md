### Repeating as long as a condition holds

An `if` clause runs a block **once** if a criterion holds; a `while` clause runs it **as long as** the criterion holds. Use it when you do not know in advance how many rounds will be needed.

```python
a = 1
while a < 2000:
    print(a)
    a = a * 2            # essential: otherwise the loop never stops
```

| Situation | Recommended loop |
|---|---|
| known number of rounds (go through a sequence, repeat `n` times) | `for` |
| stop when a condition changes (goal reached, valid input…) | `while` |

```python
# How many years for a population of 1000 to exceed 1500 with +4%/year?
population = 1000
years = 0
while population <= 1500:
    population *= 1.04
    years += 1
print(years, "years →", round(population), "inhabitants")
```

> ⚠️ **Infinite loop**: if the condition never becomes false, the program runs forever. On this site, execution is automatically stopped after 10 seconds (or with the **Stop** button). Always check that the tested variable **changes** in the loop.

### Interrupting a loop: `break`, `continue`, `else`

- `break` **exits** the loop immediately;
- `continue` **stops the current round** and jumps directly to the next one;
- `else`: a **final** clause, run after the last round of the loop… **unless** the loop was exited with `break`.

They work with `while` as well as with `for`.

```python
i = 0
while True:              # deliberately "infinite" loop…
    if i > 5:
        break            # …that is exited explicitly
    print(i, end=" ")
    i = i + 1
print()

for i in range(0, 6):
    if i % 2:
        continue         # skip odd numbers
    print(i, end=" ")
else:
    print(f"\nelse block in loop after {i}")
```

The `else` of a loop is ideal for a **search**: it runs if nothing was found (no `break`).

```python
n = 91
for d in range(2, n):
    if n % d == 0:
        print(n, "is divisible by", d)
        break
else:
    print(n, "is prime")
```

### Equivalence between loop structures

Any `for` loop over an interval can be written with `while`. Python has no `repeat … until` nor `do … while` loop (where the body runs **at least once**): you **emulate** them.

```python
# for i in range(a, b): …    is equivalent to:
a, b = 2, 5
i = a
while i < b:
    print("round", i)
    i += 1

# "do … while condition": the body runs at least once
counter = 10
while True:
    print("run at least once, counter =", counter)
    counter += 1
    if not counter < 5:      # the condition is tested AT THE END
        break
```

> 💡 Write `while condition:` and `if condition:`, never `while condition == True:`: the condition already is a boolean.

### The “validated input” pattern

`while True` + `break` is ideal to ask again for a value as long as it is wrong:

```python stdin=abc|-3|42
while True:
    answer = input("Enter a positive number: ")
    if answer.isdigit():
        break
    print("This is not a positive number, try again.")

number = int(answer)
print("Thanks, you entered", number)
```

> 💡 `isdigit()` returns `True` if the string only contains digits: handy to check an input **before** calling `int()`, which would raise a `ValueError`.

> 🎯 **Key points**: `while condition:` repeats as long as it is true; make the condition change; `break` exits, `continue` jumps to the next round, `else` runs if the loop was not interrupted; `while True` + `break` emulates `do … while`.
