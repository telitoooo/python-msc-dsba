### Arithmetic operators

| Operator | Operation | Example | Result |
|---|---|---|---|
| `+` `-` `*` | addition, subtraction, multiplication | `7 * 3` | `21` |
| `/` | division (always a `float`) | `7 / 2` | `3.5` |
| `//` | floor division (quotient rounded down) | `7 // 2` | `3` |
| `%` | modulo (remainder of the division) | `7 % 2` | `1` |
| `**` | power | `2 ** 10` | `1024` |
| `-x`, `+x` | negation, unchanged | `-(3 - 5)` | `2` |

```python
a, b = 17, 5
print("a + b  =", a + b)
print("a - b  =", a - b)
print("a * b  =", a * b)
print("a / b  =", a / b)    # "true" division: always a float
print("a // b =", a // b)   # quotient of the floor division
print("a % b  =", a % b)    # remainder (modulo)
print("a ** b =", a ** b)   # power
print(2 / 3, 2 // 3)        # 0.666… and 0
```

> 💡 **`//` and `%` go together**: 17 = 5 × **3** + **2**, so `17 // 5 == 3` and `17 % 5 == 2`. Classic uses: `n % 2 == 0` tests whether `n` is even, `n % 10` gives the last digit, and the `//` / `%` pair converts units (seconds → minutes…).

### Built-in numeric functions

| Function | Result |
|---|---|
| `abs(x)` | absolute value (or magnitude of a complex number) |
| `divmod(x, y)` | the pair `(x // y, x % y)` |
| `pow(x, y)` | `x` to the power `y` (like `x ** y`) |
| `round(x, n)` | `x` rounded to `n` decimals |
| `int(x)`, `float(x)` | conversion to integer / to float |
| `complex(re, im)` | complex number with real part `re` and imaginary part `im` (`im` defaults to 0) |
| `c.conjugate()`, `c.real`, `c.imag` | conjugate, real and imaginary parts of a complex number |

```python
print(abs(-7), abs(3 + 4j))          # 7 and 5.0 (magnitude of 3 + 4i)
print(divmod(17, 5))                 # (3, 2)
print(pow(2, 10), round(3.14159, 2))
z = complex(3, 4)
print(z, z.real, z.imag, z.conjugate(), z * z.conjugate())
print((-1) ** 0.5)                   # the root of a negative gives a complex number
```

### Combining types

Python automatically **promotes** a type to a more general one when combining them: `int` + `float` → `float`, `float` + `complex` → `complex`. But it refuses to guess between text and numbers:

```python
print(3 + 2.5, 1 + 2j + 0.5)
try:
    print(3 + "4")                   # can you add 3 to '4'?
except TypeError as e:
    print("TypeError:", e)
print("4" * 3)                       # repeating a string: '444'
```

### Operator precedence

As in maths: `**` first, then `*` `/` `//` `%`, then `+` `-`. With equal precedence, computation goes left to right. **When in doubt, use parentheses.**

```python
print(2 + 3 * 4)      # 14
print((2 + 3) * 4)    # 20
print(10 - 4 - 3)     # 3: left to right
print(-2 ** 2)        # -4: the power comes before the minus sign!
print(2 ** 3 ** 2)    # 512: exception, ** is computed right to left
```

### Augmented assignment

`x += 1` is shorthand for `x = x + 1`. Same for `-=`, `*=`, `/=`, `//=`, `%=` and `**=`.

```python
score = 10
score += 5     # 15
score *= 2     # 30
score -= 1     # 29
print(score)
```

### Comparisons: the result is a boolean

| `<` | `<=` | `>` | `>=` | `==` | `!=` | `is` | `is not` |
|---|---|---|---|---|---|---|---|
| strictly less than | less than or equal | strictly greater than | greater than or equal | equal | not equal | same object | different objects |

```python
grade = 14
print(grade >= 10)        # True
print(grade == 20)        # False
print(0 <= grade <= 20)   # chained comparison, very readable
is_adult = grade >= 18    # the result of a test can be stored in a variable
print(is_adult)
```

> 💡 **Equality or identity?** `==` compares **values** (the content), `is` compares **identities** (the same object in memory). This distinction will be crucial with lists, dictionaries and objects.

### Logical operators: `and`, `or`, `not`

- `A and B` is true if **both** are true;
- `A or B` is true if **at least one** is true;
- `not A` inverts the value (its priority is lower than `==`'s: `not a == b` means `not (a == b)`).

```python
age = 20
country = "de"
temperature = 35
may_drink_alcohol = age >= 18 and country == "de"
extreme_temp = temperature < -10 or temperature > 30
value_lower_10 = not age > 10
print(may_drink_alcohol, extreme_temp, value_lower_10)
```

**Short circuit**: Python stops as soon as the result is known, and returns **one of the two operands** (not necessarily a boolean):

| Operation | Result |
|---|---|
| `x or y` | if `x` is false, then `y`, else `x` |
| `x and y` | if `x` is false, then `x`, else `y` |
| `not x` | if `x` is false, then `True`, else `False` |

```python
print(0 or 5, 3 or 5, "" or "default")  # 5 3 default
print(0 and 5, 3 and 5)                 # 0 5
name = ""
print(name or "anonymous")              # a very handy default value
print(False and 1 / 0)                  # 1 / 0 is never computed: no error
```

> ⚠️ **Floating-point trap**: `0.1 + 0.2 == 0.3` is `False`! Floats are stored in binary with tiny rounding errors. To compare two `float`s, test instead that their difference is tiny: `abs(a - b) < 1e-9`.

> 🎯 **Key points**: `/` returns a `float`, `//` the quotient, `%` the remainder; `abs`, `divmod`, `pow`, `round`, `complex`; comparisons (including `is`) produce `bool`s that are combined with `and`, `or` and `not`, evaluated with short circuit.
