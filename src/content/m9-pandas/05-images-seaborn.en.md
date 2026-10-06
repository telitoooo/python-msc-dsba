### Plotting directly from pandas

A `DataFrame` (or a `Series`) knows how to plot itself: `df.plot(kind=…)` calls matplotlib behind the scenes.

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

Other useful kinds: `kind="line"`, `"bar"`, `"barh"`, `"box"`, `"pie"`. With a `groupby`: `df.groupby("machine")["price"].sum().plot(kind="bar")`.

### Seaborn: exploring a dataset

**Seaborn** builds on matplotlib and pandas to produce polished statistical charts in one line, very handy to **discover** a new dataset:

- `sns.histplot`: the distribution of one variable (replaces the old `sns.distplot` of the slides, now removed);
- `sns.jointplot`: the **joint** distribution of two variables (scatter + marginal histograms);
- `sns.pairplot`: all the **pairwise** joint distributions of a table.

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

> 💡 On this site, seaborn is installed from PyPI on the first `import seaborn`: it needs an internet connection and a few seconds.

### An image is a NumPy array

A colour image is an array of shape `(height, width, 3)`: for each pixel, three **channels** red, green, blue (integers from 0 to 255, or reals from 0 to 1). `plt.imread("photo.jpg")` reads an image into such an array, `plt.imshow` displays it, `plt.imsave` saves it.

```python
import numpy as np
import matplotlib.pyplot as plt

h, w = 120, 200
y, x = np.mgrid[0:h, 0:w]                          # coordinates of each pixel
image = np.zeros((h, w, 3))
image[..., 0] = x / w                              # red: increases to the right
image[..., 1] = y / h                              # green: increases downwards
image[..., 2] = 0.6                                # constant blue
print(image.shape, image.dtype)

only_blue = image.copy()
only_blue[..., :2] = 0                             # remove red and green

gray_mean = image.mean(axis=2)                     # mean of the 3 channels
gray_weighted = image @ np.array([0.3, 0.59, 0.11])  # weighting closer to the human eye

fig, axes = plt.subplots(1, 4, figsize=(12, 3))
for ax, img, title in zip(axes, [image, only_blue, gray_mean, gray_weighted],
                          ["original", "blue only", "gray (mean)", "gray (weighted)"]):
    ax.imshow(img, cmap="gray" if img.ndim == 2 else None)
    ax.set_title(title)
    ax.axis("off")
plt.show()
```

### Pillow: creating and editing images pixel by pixel

**Pillow** (module `PIL`) handles images: creation, reading/writing many formats, rotation, resizing…

```python
from PIL import Image

width, height = 6, 4
img = Image.new("RGB", (width, height))            # black image
for x in range(width):
    for y in range(height):
        img.putpixel((x, y), (255, 200, 0) if x < 3 else (0, 90, 200))
print(img.size, img.getpixel((0, 0)), img.getpixel((5, 3)))
img.save("demo.png")                               # visible in the working folder
img.resize((60, 40), Image.NEAREST).show()         # show() displays the image (here in the terminal)
```

> 🎯 **Key points**: `df.plot(kind="scatter" | "hist" | "bar"…)`; seaborn: `histplot`, `jointplot`, `pairplot` to explore; an image = a `(h, w, 3)` array; `imread`, `imshow`, `imsave`; grayscale by mean or weights 0.3 / 0.59 / 0.11; Pillow: `Image.new`, `putpixel`, `getpixel`, `save`, `show`.
