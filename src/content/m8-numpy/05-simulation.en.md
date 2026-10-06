### NumPy's random generator

To simulate, we draw **pseudo-random** numbers. Create a generator with a **seed**: the same seed gives exactly the same sequence of draws again, which makes experiments **reproducible** (essential to debug and compare).

```python
import numpy as np

rng = np.random.default_rng(seed=42)
print(rng.random(3))                     # 3 uniform reals in [0, 1[
print(rng.integers(1, 7, size=10))       # 10 dice rolls (7 excluded)
print(rng.normal(loc=170, scale=8, size=4).round(1))   # normal distribution
print(rng.choice(["heads", "tails"], size=5))
print(rng.permutation(5))                # a permutation of 0..4
```

> 💡 The older interface `np.random.seed(0)` / `np.random.rand(…)` still exists and is often found online; `default_rng` is the modern, recommended way.

### The Monte-Carlo method

The idea: estimate a quantity by **simulating a large number of random experiments**. A famous example: draw random points in the square [0, 1] × [0, 1]; the proportion of points falling inside the quarter disc of radius 1 tends to its area, π/4.

```python
import numpy as np

rng = np.random.default_rng(0)
n = 100_000
x, y = rng.random(n), rng.random(n)      # n points at once: no loop
inside = x**2 + y**2 <= 1                 # boolean mask
print("π ≈", 4 * inside.mean())          # mean() of a mask = proportion of True

# Convergence: estimate after 1, 2, …, n points
estimates = 4 * np.cumsum(inside) / np.arange(1, n + 1)
print(estimates[[9, 99, 999, 9_999, 99_999]])
```

The error decreases like 1/√n: to gain one digit of precision you need **100 times** more points.

> ⚠️ **Do not store what you do not need**: for a billion points, keeping every draw would fill the memory. Simulate in **batches** instead (for instance 1 million at a time) and only accumulate the counter.

### Simulating an experiment step by step

Some experiments have a sequential logic. Example (*Hands-on “flight seats assignment”*): 100 passengers board a plane with 100 seats. The first one sits at random; each next one takes their own seat if it is free, otherwise a random free seat. What is the probability that the last passenger gets their own seat?

```python
import numpy as np

def last_gets_own_seat(n_seats, rng):
    free = set(range(n_seats))
    free.remove(rng.integers(n_seats))            # passenger 0: at random
    for passenger in range(1, n_seats - 1):
        if passenger in free:
            free.remove(passenger)                # their seat is free
        else:
            free.remove(rng.choice(list(free)))   # otherwise a random free seat
    return (n_seats - 1) in free                  # is the last passenger's seat left?

rng = np.random.default_rng(1)
results = [last_gets_own_seat(100, rng) for _ in range(2000)]
print("estimated probability:", np.mean(results))
```

Each simulation contains a loop, but you can **repeat** the experiment, count the successes with NumPy (`np.mean` of a list of booleans) and, to speed things up, vectorise *across simulations* (move every simulation forward by one passenger at a time).

> 🎯 **Key points**: `rng = np.random.default_rng(seed)` then `rng.random`, `rng.integers`, `rng.normal`, `rng.choice`, `rng.permutation`; Monte-Carlo = simulate a lot and count; `mask.mean()` gives a proportion; `np.cumsum` to follow a convergence; error in 1/√n.
