### Matplotlib: plotting charts

**Matplotlib** is the reference library for plotting in Python ([matplotlib.org](https://matplotlib.org/)). It is fully integrated with NumPy: every plotting function accepts arrays. Everything can be customised: colours, sizes, texts, axes…

The `pyplot` module is imported as `plt`. Outside a notebook, `plt.show()` displays the figures; **on this site, figures are displayed in the terminal** when `plt.show()` is called (or at the end of the program).

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 100)
plt.plot(x, np.sin(x), label="sin(x)")
plt.plot(x, np.cos(x), "--", label="cos(x)")       # "--": dashed line
plt.title("Trigonometric functions")
plt.xlabel("x (radians)")
plt.ylabel("value")
plt.legend()                                         # displays the labels
plt.grid(True)
plt.show()
```

### Figures and axes

The central concept is the **figure** (`plt.figure()`), the “sheet” you draw on. A figure contains one or several **axes** (*Axes*): each axes is a subplot with its own coordinate system. Most functions come in two flavours: `plt.plot(…)` (acts on the current axes) and `ax.plot(…)` (acts on a given axes).

For a figure with several axes: `fig, axes = plt.subplots(rows, columns)`. `axes` is then a **NumPy array of axes**: `axes[i, j]` is the subplot of row `i`, column `j`.

```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
fig, axes = plt.subplots(2, 2, figsize=(8, 6))

axes[0, 0].plot([1, 2, 3, 4], [1, 4, 9, 16], marker="o")
axes[0, 0].set_title("plot: line")

axes[0, 1].scatter(rng.random(50), rng.random(50), c="crimson")
axes[0, 1].set_title("scatter: point cloud")

axes[1, 0].bar(["candy", "gums", "cake"], [12, 7, 3])
axes[1, 0].set_title("bar: bar chart")

axes[1, 1].hist(rng.normal(170, 8, size=500), bins=20)
axes[1, 1].set_title("hist: histogram")

fig.suptitle("Four kinds of charts")
fig.tight_layout()                      # avoids overlapping titles
plt.show()
```

> 💡 On an axes, settings are written `ax.set_title`, `ax.set_xlabel`, `ax.set_ylabel`, `ax.set_xlim`… (with `set_`), whereas with `plt` you write `plt.title`, `plt.xlabel`…

### Logarithmic scale

To visualise a quantity that spans several orders of magnitude (an error going from 1e-1 to 1e-15, for instance), use a **logarithmic** scale: `plt.semilogy` (logarithmic y axis), `plt.semilogx`, `plt.loglog`, or `ax.set_yscale("log")`. An exponential decay then looks like a **straight line**.

```python
import numpy as np
import matplotlib.pyplot as plt

n = np.arange(1, 30)
plt.semilogy(n, 1 / n, label="1/n: slow")
plt.semilogy(n, 0.5 ** n, label="0.5ⁿ: exponential")
plt.xlabel("n")
plt.ylabel("error")
plt.legend()
plt.show()
```

### Saving a figure

`plt.savefig("figure.png", dpi=150)` writes the image to a file (call it **before** `plt.show()`). On this site, the file shows up in the “Working folder” panel.

> 🎯 **Key points**: `import matplotlib.pyplot as plt`; `plt.plot`, `scatter`, `bar`, `hist`; `title`, `xlabel`, `ylabel`, `legend`; a figure contains axes: `fig, axes = plt.subplots(r, c)` then `axes[i, j].plot(…)`; `semilogy` for a log scale; `plt.show()`, `plt.savefig()`.
