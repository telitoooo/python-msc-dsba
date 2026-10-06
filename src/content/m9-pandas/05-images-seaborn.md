### Tracer directement depuis pandas

Un `DataFrame` (ou une `Series`) sait se tracer lui-même : `df.plot(kind=…)` appelle matplotlib en coulisses.

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

rng = np.random.default_rng(1)
movies = pd.DataFrame({
    "rating": rng.normal(7, 0.8, 200).round(1),
})
movies["revenue_millions"] = (movies["rating"] - 5) * 60 + rng.normal(0, 40, 200)

movies.plot(kind="scatter", x="rating", y="revenue_millions", title="Revenue (millions) vs Rating")
movies["rating"].plot(kind="hist", bins=15, title="Rating")
plt.show()
```

Autres types utiles : `kind="line"`, `"bar"`, `"barh"`, `"box"`, `"pie"`. Avec un `groupby` : `df.groupby("machine")["price"].sum().plot(kind="bar")`.

### Seaborn : explorer un jeu de données

**Seaborn** s'appuie sur matplotlib et pandas pour produire en une ligne des graphiques statistiques soignés, très pratiques pour **découvrir** un nouveau jeu de données :

- `sns.histplot` : la distribution d'une variable (remplace l'ancien `sns.distplot` des diapos, supprimé) ;
- `sns.jointplot` : la distribution **conjointe** de deux variables (nuage + histogrammes en marge) ;
- `sns.pairplot` : toutes les distributions conjointes **deux à deux** d'un tableau.

```python
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

rng = np.random.default_rng(2)
df = pd.DataFrame({"height": rng.normal(170, 8, 300)})
df["weight"] = 0.9 * df["height"] - 85 + rng.normal(0, 6, 300)
df["sport"] = rng.choice(["yes", "no"], 300)

sns.histplot(df["height"], kde=True)
plt.show()
sns.jointplot(data=df, x="height", y="weight")
plt.show()
sns.pairplot(df, hue="sport")
plt.show()
```

> 💡 Dans ce site, seaborn est installé depuis PyPI au premier `import seaborn` : il faut une connexion internet et quelques secondes.

### Une image est un tableau NumPy

Une image couleur est un tableau de forme `(hauteur, largeur, 3)` : pour chaque pixel, trois **canaux** rouge, vert, bleu (entiers de 0 à 255, ou réels de 0 à 1). `plt.imread("photo.jpg")` lit une image dans un tel tableau, `plt.imshow` l'affiche, `plt.imsave` l'enregistre.

```python
import numpy as np
import matplotlib.pyplot as plt

h, w = 120, 200
y, x = np.mgrid[0:h, 0:w]                          # coordonnées de chaque pixel
image = np.zeros((h, w, 3))
image[..., 0] = x / w                              # rouge : augmente vers la droite
image[..., 1] = y / h                              # vert : augmente vers le bas
image[..., 2] = 0.6                                # bleu constant
print(image.shape, image.dtype)

only_blue = image.copy()
only_blue[..., :2] = 0                             # on supprime rouge et vert

gray_mean = image.mean(axis=2)                     # moyenne des 3 canaux
gray_weighted = image @ np.array([0.3, 0.59, 0.11])  # pondération plus fidèle à l'œil

fig, axes = plt.subplots(1, 4, figsize=(12, 3))
for ax, img, title in zip(axes, [image, only_blue, gray_mean, gray_weighted],
                          ["original", "bleu seul", "gris (moyenne)", "gris (pondéré)"]):
    ax.imshow(img, cmap="gray" if img.ndim == 2 else None)
    ax.set_title(title)
    ax.axis("off")
plt.show()
```

### Pillow : créer et modifier des images pixel par pixel

**Pillow** (module `PIL`) manipule des images : création, lecture/écriture de nombreux formats, rotation, redimensionnement…

```python
from PIL import Image

width, height = 6, 4
img = Image.new("RGB", (width, height))            # image noire
for x in range(width):
    for y in range(height):
        img.putpixel((x, y), (255, 200, 0) if x < 3 else (0, 90, 200))
print(img.size, img.getpixel((0, 0)), img.getpixel((5, 3)))
img.save("demo.png")                               # visible dans le dossier de travail
img.resize((60, 40), Image.NEAREST).show()         # show() affiche l'image (ici dans le terminal)
```

> 🎯 **À retenir** : `df.plot(kind="scatter" | "hist" | "bar"…)` ; seaborn : `histplot`, `jointplot`, `pairplot` pour explorer ; une image = tableau `(h, w, 3)` ; `imread`, `imshow`, `imsave` ; niveaux de gris par moyenne ou pondération 0,3 / 0,59 / 0,11 ; Pillow : `Image.new`, `putpixel`, `getpixel`, `save`, `show`.
