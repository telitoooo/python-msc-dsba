### Functions that handle functions

**Functional programming** composes functions rather than writing loops that modify variables. Python offers its essential tools: `lambda`, `map`, `filter`, `sorted(key=…)`, `any`, `all`, `zip`, `enumerate`, and the `itertools` and `functools` modules.

```python
l = [1, 2, 3, 4, 5]

l_squared = map(lambda x: x**2, l)          # applies a function to each element
l_even = filter(lambda x: x % 2 == 0, l)    # keeps the elements satisfying the condition
print(list(l_squared), list(l_even))        # map and filter return lazy iterators

all_positive = all(map(lambda x: x > 0, l)) # True if ALL satisfy the condition
any_positive = any(map(lambda x: x > 0, l)) # True if AT LEAST ONE does
print(all_positive, any_positive)

pairs = [(1, "one"), (2, "two"), (3, "three"), (4, "four")]
pairs.sort(key=lambda pair: pair[1])        # sorts on the 2nd element (alphabetical order)
print(pairs)
print(sorted(["banana", "Apple", "cherry"], key=str.lower))   # key: any function
```

> 💡 A comprehension is often more readable than `map` / `filter` with a lambda: `[x**2 for x in l if x % 2 == 0]`. Both styles are “pythonic”; choose the clearer one.

### `zip` and `enumerate`

```python
names = ["Ada", "Alan", "Grace"]
years = [1815, 1912, 1906]
for i, (name, year) in enumerate(zip(names, years), start=1):
    print(f"{i}. {name} ({year})")
print(dict(zip(names, years)))
```

### `itertools`, `functools`, `collections`

```python
import itertools
import functools
import collections

print(list(itertools.product("AB", [1, 2])))          # Cartesian product
print(list(itertools.combinations("ABC", 2)))         # combinations
print(list(itertools.permutations("ABC", 2))[:4])     # permutations
print(list(itertools.accumulate([1, 2, 3, 4])))       # running sums
print(list(itertools.chain([1, 2], (3, 4))))          # chaining

print(functools.reduce(lambda acc, x: acc * x, [1, 2, 3, 4, 5]))   # 5! = 120
square_of = functools.partial(pow, exp=2)             # freezes one argument
print(square_of(7))

counts = collections.Counter("abracadabra")           # counting in one line
print(counts.most_common(2))
```

An example from the course, to be read from the inside out: find the IP address that received the most 404 errors in a web server log, in a single expression.

```python norun
print(
  max(
    [(count, ip) for ip, count in
      collections.Counter([
        ip for ip, code in
        [ip_and_code(x) for x in
          urllib.request.urlopen(logurl).read().decode("utf8").splitlines()]
        if code == "404"
      ]).items()
    ]
  )
)
```

### Decorators

A function can **take** a function and **return** another one: this is a **decorator**. The `@decorator` syntax above a `def` is shorthand for `f = decorator(f)`. You will meet them everywhere (`@property`, `@lru_cache`, Flask's `@app.route` in module 11…).

```python
import functools
import time

def timed(func):
    """Decorator that prints the duration of each call."""
    @functools.wraps(func)                 # keeps the name and docstring of func
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__}: {time.perf_counter() - start:.4f} s")
        return result
    return wrapper

@timed                                     # same as: slow_sum = timed(slow_sum)
def slow_sum(n):
    return sum(range(n))

print(slow_sum(1_000_000))

@functools.lru_cache                       # remembers results already computed
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)
print(fib(80))
```

> 🎯 **Key points**: `lambda` for a small anonymous function; `map`, `filter` (lazy); `sorted(…, key=…)` / `list.sort(key=…)`; `any`, `all`, `zip`, `enumerate`; `itertools` (product, combinations, accumulate, chain), `functools` (reduce, partial, lru_cache, wraps), `collections.Counter`; a decorator takes a function and returns a new one.
