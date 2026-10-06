### Matplotlib : tracer des graphiques

**Matplotlib** est la bibliothèque de référence pour tracer des graphiques en Python ([matplotlib.org](https://matplotlib.org/)). Elle est totalement intégrée à NumPy : toutes les fonctions de tracé acceptent des tableaux. Tout est personnalisable : couleurs, tailles, textes, axes…

On importe le module `pyplot` sous le nom `plt`. Hors notebook, `plt.show()` affiche les figures ; **dans ce site, les figures s'affichent dans le terminal** à l'appel de `plt.show()` (ou à la fin du programme).

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 100)
plt.plot(x, np.sin(x), label="sin(x)")
plt.plot(x, np.cos(x), "--", label="cos(x)")       # "--" : ligne pointillée
plt.title("Fonctions trigonométriques")
plt.xlabel("x (radians)")
plt.ylabel("valeur")
plt.legend()                                         # affiche les labels
plt.grid(True)
plt.show()
```

### Figure et axes

Le concept central est la **figure** (`plt.figure()`), la « feuille » sur laquelle on dessine. Une figure contient un ou plusieurs **axes** (*Axes*) : chaque axe est un sous-graphique avec son repère. La plupart des fonctions existent en deux versions : `plt.plot(…)` (agit sur l'axe courant) et `ax.plot(…)` (agit sur un axe précis).

Pour une figure à plusieurs axes : `fig, axes = plt.subplots(lignes, colonnes)`. `axes` est alors un **tableau NumPy d'axes** : `axes[i, j]` est le sous-graphique de la ligne `i`, colonne `j`.

```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
fig, axes = plt.subplots(2, 2, figsize=(8, 6))

axes[0, 0].plot([1, 2, 3, 4], [1, 4, 9, 16], marker="o")
axes[0, 0].set_title("plot : courbe")

axes[0, 1].scatter(rng.random(50), rng.random(50), c="crimson")
axes[0, 1].set_title("scatter : nuage de points")

axes[1, 0].bar(["candy", "gums", "cake"], [12, 7, 3])
axes[1, 0].set_title("bar : diagramme en barres")

axes[1, 1].hist(rng.normal(170, 8, size=500), bins=20)
axes[1, 1].set_title("hist : histogramme")

fig.suptitle("Quatre types de graphiques")
fig.tight_layout()                      # évite les chevauchements de titres
plt.show()
```

> 💡 Sur un axe, les réglages s'écrivent `ax.set_title`, `ax.set_xlabel`, `ax.set_ylabel`, `ax.set_xlim`… (avec `set_`), alors qu'avec `plt` on écrit `plt.title`, `plt.xlabel`…

### Échelle logarithmique

Pour visualiser une grandeur qui varie sur plusieurs ordres de grandeur (une erreur qui passe de 1e-1 à 1e-15, par exemple), on utilise une échelle **logarithmique** : `plt.semilogy` (axe des y logarithmique), `plt.semilogx`, `plt.loglog`, ou `ax.set_yscale("log")`. Une décroissance exponentielle y apparaît comme une **droite**.

```python
import numpy as np
import matplotlib.pyplot as plt

n = np.arange(1, 30)
plt.semilogy(n, 1 / n, label="1/n : lente")
plt.semilogy(n, 0.5 ** n, label="0.5ⁿ : exponentielle")
plt.xlabel("n")
plt.ylabel("erreur")
plt.legend()
plt.show()
```

### Enregistrer une figure

`plt.savefig("figure.png", dpi=150)` écrit l'image dans un fichier (à appeler **avant** `plt.show()`). Dans ce site, le fichier apparaît dans le panneau « Dossier de travail ».

> 🎯 **À retenir** : `import matplotlib.pyplot as plt` ; `plt.plot`, `scatter`, `bar`, `hist` ; `title`, `xlabel`, `ylabel`, `legend` ; une figure contient des axes : `fig, axes = plt.subplots(l, c)` puis `axes[i, j].plot(…)` ; `semilogy` pour une échelle log ; `plt.show()`, `plt.savefig()`.
