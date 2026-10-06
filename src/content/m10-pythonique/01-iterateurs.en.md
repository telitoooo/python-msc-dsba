### Iterable, iterator: what `for` really does

An **iterable** is an object you can loop over with `for`: list, string, dictionary, file, `range`… The `for` loop asks it for an **iterator** with `iter()`, then calls `next()` until the iterator raises the `StopIteration` exception.

```python
names = ["Ada", "Alan", "Grace"]
it = iter(names)            # the iterator keeps the current position
print(next(it))
print(next(it))
print(next(it))
try:
    next(it)
except StopIteration:
    print("end: this is how for knows when to stop")
```

### List comprehension or generator expression?

With **square brackets**, a comprehension builds **the whole list** in memory. With **parentheses**, you get a **generator expression**: values are produced **one at a time, on demand** (lazy evaluation).

```python
import sys

list_comprehension = [i for i in range(11) if i % 2 == 0]
print(list_comprehension)

generator_expression = (i for i in range(11) if i % 2 == 0)
print(generator_expression)                  # <generator object …>: nothing computed yet
for i in generator_expression:
    print(i, end=" ")
print()

big_list = [i * i for i in range(1_000_000)]
big_gen = (i * i for i in range(1_000_000))
print(sys.getsizeof(big_list), "bytes versus", sys.getsizeof(big_gen))
print(sum(i * i for i in range(1_000_000)))  # sum consumes the generator without a list
```

Generators are **more memory-efficient** (and often faster) when you go through the values **only once**.

> ⚠️ A generator gets **exhausted**: once consumed, it is empty. To go through it again you must recreate it (or turn it into a list with `list(...)`).

### Writing your own iterables with `yield`

A function containing `yield` is a **generator function**: calling it does not run it, but returns a generator. At each `next()`, it runs until the next `yield`, returns the value, then **pauses** while keeping its local variables.

```python
def myrange(a, b):
    i = a
    while i < b:
        yield i          # gives i, then pauses here
        i = i + 1

for i in myrange(3, 7):
    print(i)

gen = myrange(0, 2)
print(next(gen), next(gen), list(gen))   # 0 1 []: already exhausted
```

> ⚠️ Do not mistake `yield` for `return`: `return` **ends** the function and returns a single value; `yield` **suspends** the function and can produce a sequence (possibly infinite) of values.

```python
def fibonacci():
    """Infinite Fibonacci sequence: only take what you need."""
    a, b = 1, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fibonacci(), 10)))     # the first 10 terms
```

### The iterator protocol in a class

To make an object iterable “by hand”, define two special methods: `__iter__` (returns the iterator, often `self`) and `__next__` (returns the next element or raises `StopIteration`). Here, the state is stored **in the object**.

```python
class PowTwo:
    """Class to implement an iterator of powers of two."""

    def __init__(self, max=0):
        self.max = max

    def __iter__(self):
        self.n = 0
        return self

    def __next__(self):
        if self.n <= self.max:
            result = 2 ** self.n
            self.n += 1
            return result
        raise StopIteration


numbers = PowTwo(3)
i = iter(numbers)
print(next(i), next(i))
print(list(PowTwo(5)))          # for, list(), sum()… all use this protocol
```

> 🎯 **Key points**: `for` = `iter()` + `next()` until `StopIteration`; `[…]` builds a list, `(…)` a lazy, memory-efficient generator; `yield` turns a function into a generator (pause between values); an iterable class defines `__iter__` and `__next__`.
