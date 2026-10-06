import { md } from "../helpers.js";

export default {
  "m9-l1": {
    ex1: {
      title: "First DataFrames",
      core: {
        title: "Fruit purchases",
        prompt: md`
          1. Create the \`purchases\` DataFrame of the lesson: columns \`apples\` (3, 2, 0, 1) and \`oranges\` (0, 3, 7, 2),
             index \`["June", "Robert", "Lily", "David"]\`.
          2. \`june\`: June's row (\`.loc\`); \`lily_oranges\`: the number of oranges bought by Lily.
          3. \`total_apples\`: the total number of apples bought.
          4. Add a \`total\` column (apples + oranges) to \`purchases\`.
        `,
        tests: [
          "`purchases` is a DataFrame indexed by first names",
          "`june` is June's row",
          "`lily_oranges` is 7",
          "`total_apples` is 6",
          "The `total` column exists and is correct",
        ],
      },
      extra: {
        title: "Reading the movie file",
        prompt: md`
          The file \`movies.csv\` (working folder) is an excerpt of 40 movies from the course's IMDB dataset.

          1. Load it into \`movies\` with the \`Title\` column as index.
          2. \`n_rows, n_cols\`: its dimensions.
          3. \`first_titles\`: the list of titles of the first 3 rows (\`head\`); \`last_title\`: the title of the last one (\`tail\`).
          4. \`columns\`: the list of column names.
          5. \`numeric_columns\`: the list of **numeric** columns (\`movies.select_dtypes("number")\`).
        `,
        tests: [
          "`movies` is indexed by `Title`",
          "40 rows and 9 columns",
          "`first_titles` and `last_title`",
          "`columns` contains the 9 columns in order",
          "`numeric_columns`: the 7 numeric columns",
        ],
      },
      stretch: {
        title: "Writing and reading back",
        prompt: md`
          1. Create \`stock\`, a DataFrame built from the **list of dictionaries** \`products\`.
          2. Add a \`value\` column = \`price × quantity\`.
          3. Save it to \`stock.csv\` **without the index** (\`index=False\`), then read this file back into \`reloaded\` using
             the \`name\` column as index.
          4. \`most_valuable\`: the name of the product with the highest value (\`idxmax\`).
          5. Also export \`stock\` as JSON into \`stock.json\` (\`orient="records"\`: a list of objects).
        `,
        tests: [
          "`stock` has 4 rows and a `value` column",
          "`stock.csv` was written without the index",
          "`reloaded` is indexed by name",
          "`most_valuable` → chocolate",
          "`stock.json` contains a list of 4 objects",
        ],
      },
    },
  },

  "m9-l2": {
    ex1: {
      title: "Cleaning the movie dataset",
      core: {
        title: "Renaming columns",
        prompt: md`
          After loading \`movies.csv\` (index \`Title\`):

          1. rename \`Runtime (Minutes)\` to \`Runtime\` and \`Revenue (Millions)\` to \`Revenue_millions\` (\`rename\`);
          2. put **all** column names in lower case, with a list comprehension assigned to \`movies.columns\`.
        `,
        tests: [
          "Columns are renamed and in lower case",
          "The data are intact",
          "`rename` and a comprehension are used",
        ],
      },
      extra: {
        title: "Duplicates and missing values",
        prompt: md`
          Columns are already renamed (see the starter code).

          1. \`doubled\`: \`movies\` stacked twice (\`pd.concat\`); \`deduplicated\`: \`doubled\` without duplicates.
          2. \`missing\`: the number of missing values **per column** (a \`Series\`).
          3. \`complete_rows\`: the number of rows without any missing value (\`dropna\`).
          4. \`complete_cols\`: the number of columns without any missing value (\`dropna(axis=1)\`).
        `,
        tests: [
          "`doubled` has 80 rows, `deduplicated` 40",
          "`missing`: 3 revenues and 2 Metascores missing",
          "`complete_rows` is 36",
          "`complete_cols` is 7",
        ],
      },
      stretch: {
        title: "Imputation",
        prompt: md`
          Write \`clean(df)\`, which receives the **raw** table read from \`movies.csv\` and returns a **new** DataFrame:

          - columns renamed as in the Core level (\`runtime\`, \`revenue_millions\`, all lower case);
          - missing revenues replaced by the **mean** revenue;
          - missing Metascores replaced by the **median** Metascore;
          - without modifying the DataFrame it received.
        `,
        hint: md`
          \`rename\` already returns a new DataFrame. Then reassign each column:
          \`df["revenue_millions"] = df["revenue_millions"].fillna(df["revenue_millions"].mean())\` (no \`inplace=True\`
          on an extracted column: with pandas 3 it would not modify the table).
        `,
        tests: [
          "No missing value left",
          "Columns renamed in lower case",
          "Mindhorn's revenue = mean revenue",
          "Dangal's Metascore = median (67.5)",
          "The original DataFrame is not modified",
        ],
      },
    },
  },

  "m9-l3": {
    ex1: {
      title: "Exploring and selecting",
      core: {
        title: "Conditional selections",
        prompt: md`
          On the \`movies\` table (columns already renamed):

          - \`scott\`: Ridley Scott's movies;
          - \`top\`: movies rated **at least** 8.6;
          - \`nolan_scott\`: movies by Christopher Nolan **or** Ridley Scott (with \`isin\`);
          - \`gems\`: movies released between 2005 and 2010 (included), rated **above** 8.0, whose revenue is **below the
            1st quartile** of revenues (\`quantile(0.25)\`);
          - \`first_four\`: the first 4 rows **by position** (\`iloc\`);
          - \`range_by_name\`: the rows from \`"Prometheus"\` to \`"Sing"\` **included**, columns \`director\` and \`rating\` (\`loc\`).
        `,
        tests: [
          "`scott`: Ridley Scott's 8 movies",
          "`top`: 6 movies rated ≥ 8.6",
          "`nolan_scott`: 13 movies",
          "`gems`: Taare Zameen Par",
          "`first_four`: first 4 rows",
          "`range_by_name`: from Prometheus to Sing included, 2 columns",
        ],
      },
      extra: {
        title: "Applying and grouping",
        prompt: md`
          1. Add the \`rating_category\` column: \`"good"\` if the rating is ≥ 8.0, otherwise \`"bad"\`, with \`apply\` and a
             function \`rating_function\`.
          2. Add the \`main_genre\` column: the **first** genre of the \`genre\` column (\`.str.split(",").str[0]\`).
          3. \`genre_counts\`: the number of movies per main genre (\`value_counts\`).
          4. \`directors\`: for each director, the number of movies (\`count\`) and the mean rating (\`mean\`):
             \`movies.groupby("director")["rating"].agg(["count", "mean"])\`.
          5. \`best_director\`: among the directors of **at least 2 movies**, the one with the best mean rating.
        `,
        tests: [
          "`rating_category` is correct",
          "`apply` is used with `rating_function`",
          "`main_genre` is the first genre",
          "`genre_counts`: 14 action movies",
          "`directors` has the count and mean columns",
          "`best_director` → Christopher Nolan",
        ],
      },
      stretch: {
        title: "Mean exchange rates in the 90s",
        prompt: md`
          *Hands-on “Mean Exchange Rates”.* The file \`monthly.csv\` follows the format of the datahub.io data: one row per
          month and per country (\`Date\`, \`Country\`, \`Exchange rate\`: number of units of the currency for 1 dollar).

          1. \`rates\`: the loaded file, with the \`Date\` column converted to dates (\`parse_dates=["Date"]\`).
          2. \`mean_rates(df, start_year, end_year)\`: returns, for each country (index \`Country\`, sorted alphabetically),
             the mean rate between January 1st of \`start_year\` and December 31st of \`end_year\`.
          3. \`rates_90s\`: \`mean_rates(rates, 1990, 1999)\`.
          4. \`strongest_dollar\`: the country for which **1 dollar buys the most units** of currency on average over the
             90s (\`idxmax\`).
        `,
        hint: md`
          \`df["Date"].dt.year\` gives the year of each row; \`between(start_year, end_year)\` filters. Then
          \`groupby("Country")["Exchange rate"].mean()\`.
        `,
        tests: [
          "`rates`: dates converted",
          "`rates_90s`: mean per country over 1990–1999",
          "`mean_rates` works for another period",
          "`strongest_dollar` → Japan",
        ],
      },
    },
  },

  "m9-l4": {
    ex1: {
      title: "Plotting with Matplotlib",
      core: {
        title: "The Collatz conjecture as a picture",
        prompt: md`
          *Hands-on 12, last step.* \`collatz_steps(n)\` returns the number of steps needed to reach 1 (n ← n / 2 if n is
          even, 3n + 1 otherwise).

          1. Compute \`steps\`, the list of numbers of steps for \`n\` from 1 to 100.
          2. Plot \`steps\` as a function of \`n\` (\`plt.plot\` with markers, or \`plt.scatter\`), with a **title** and
             **labels** for both axes.
          3. Display the figure with \`plt.show()\`.
        `,
        tests: [
          "`collatz_steps(27)` is 111",
          "`steps` contains 100 values",
          "A figure was displayed",
          "It contains plotted data",
          "Title and axis labels",
        ],
      },
      extra: {
        title: "Convergence of the π series",
        prompt: md`
          The functions \`pi_leibniz(n)\` and \`pi_machin(n)\` of module 8 are provided.

          1. \`ns\`: the integers from 1 to 30; \`err_leibniz\` and \`err_machin\`: the lists of **relative** errors
             |approximation − π| / π for each \`n\` in \`ns\`.
          2. Plot both curves on the same chart with a **logarithmic** y axis (\`plt.semilogy\`), with labels
             \`"Leibniz"\` and \`"Machin"\`, a legend, a title and axis labels.

          Look at the straight line (exponential convergence) then Machin's **plateau** around 1e-16.
        `,
        explanation: md`
          An error that is exactly zero cannot be placed on a logarithmic scale (log 0 = −∞): hence the
          \`max(…, 1e-17)\` in the solution.
        `,
        tests: [
          "`err_leibniz` and `err_machin` have 30 values",
          "A figure with two curves",
          "The y axis is logarithmic",
          "Legend `Leibniz` / `Machin`",
          "Title and labels",
        ],
      },
      stretch: {
        title: "Drawing the map of France",
        prompt: md`
          *Hands-on “Map of France”, with matplotlib instead of Tk.* \`read_map(path)\` (provided) reads
          \`france_lite.map\` into nested dictionaries.

          Write \`draw_map(cities)\`, which creates a figure (\`fig, ax = plt.subplots()\`) and:

          1. draws **each road only once** (a road A–B appears in the neighbours of A **and** of B) with \`ax.plot\`;
          2. places all the cities with a single \`ax.scatter\`;
          3. writes the name of each city with \`ax.text\`;
          4. inverts the y axis (\`ax.invert_yaxis()\`) because coordinates come from a screen (y downwards), adds a title,
             then displays the figure.

          \`draw_map\` returns the number of roads drawn.
        `,
        hint: md`
          To draw each road only once, remember the pairs already seen in a set of \`frozenset({a, b})\`, or only draw a
          road if \`a < b\` (alphabetical order).
        `,
        tests: [
          "`draw_map` returns 11 roads",
          "A figure was displayed",
          "Each road is drawn only once (11 lines)",
          "The 8 cities are placed and named",
          "The figure has a title",
        ],
      },
    },
  },

  "m9-l5": {
    ex1: {
      title: "Images and statistics",
      core: {
        title: "The Dutch flag",
        prompt: md`
          *Hands-on 15, with Pillow.*

          1. \`make_flag(width, height)\` creates an RGB image (\`Image.new\`) with three **horizontal** bands of equal
             height: red \`(174, 28, 40)\`, white \`(255, 255, 255)\`, blue \`(33, 70, 139)\`. Colour each pixel with \`putpixel\`.
          2. \`rotate90(img)\` returns a **new** image rotated by 90° counter-clockwise, built pixel by pixel with \`getpixel\`
             and \`putpixel\` (same result as \`img.rotate(90, expand=True)\`, which you must not use).
          3. Create a 300 × 200 flag, save it to \`flag.png\` and display it (\`show()\`), as well as its rotation.
        `,
        hint: md`
          The band of a pixel depends on its row \`y\`: \`y < height // 3\` → red… For the rotation, a \`w × h\` image becomes
          \`h × w\`, and pixel \`(x, y)\` goes to \`(y, w - 1 - x)\`.
        `,
        tests: [
          "`make_flag` creates an image of the right size",
          "Three horizontal bands red, white, blue",
          "`rotate90` is equivalent to `rotate(90, expand=True)`",
          "`putpixel` and `getpixel` are used, not `rotate`",
          "`flag.png` was saved",
        ],
      },
      extra: {
        title: "Handling an image with NumPy",
        prompt: md`
          *Hands-on “Image Manipulation”.* The starter code creates \`photo\`, a synthetic image (a \`uint8\` array of shape
          \`(height, width, 3)\`) that replaces a downloaded photo.

          1. \`shape\`: the shape of \`photo\`.
          2. \`only_blue\`: a copy of \`photo\` where the red and green channels are set to 0.
          3. \`gray_mean\`: the grayscale image as the **mean** of the 3 channels (shape \`(h, w)\`).
          4. \`gray_weighted\`: grayscale with weights **0.3** (red), **0.59** (green), **0.11** (blue).
          5. Save \`gray_weighted\` to \`gray.png\` (\`plt.imsave(…, cmap="gray")\`) and display the three images side by side
             (\`plt.subplots(1, 3)\` then \`imshow\` on each axes).
        `,
        tests: [
          "`shape` is (90, 160, 3)",
          "`only_blue` keeps only blue, without modifying `photo`",
          "`gray_mean`: mean of the channels",
          "`gray_weighted`: weights 0.3 / 0.59 / 0.11",
          "`gray.png` saved and 3 images displayed",
        ],
      },
      stretch: {
        title: "Vending machine statistics",
        prompt: md`
          *Hands-on “Statistics about Vending Machines”.* \`vending.csv\` contains two weeks of sales: \`machine\`,
          \`timestamp\`, \`item\`, \`price\`, \`cost\`, \`payment\` (\`cash\` or \`card\`).

          1. \`sales\`: the loaded file, \`timestamp\` converted to dates. \`n_machines\`: the number of machines; \`items\`:
             the **sorted** list of products sold.
          2. \`gain_per_machine\` (sum of prices) and \`sales_per_machine\` (number of sales): two \`Series\` indexed by machine.
          3. Plot the **histogram of the hours** of chocolate sales (\`.dt.hour\`), with a title.
          4. \`items_by_gain\`: the list of products sorted by **decreasing** revenue; \`items_by_profit\`: same for the
             profit (price − cost).
          5. \`likely_purchase\`: a customer arrives at \`machine3\` on a **Tuesday** around 5 pm. What will they buy? The
             product sold most by this machine on Tuesdays between 4 pm and 6 pm (hours 16 and 17).
          6. \`profit_with_card_fee\`: the total profit if a fee of **25% of the price** is charged on every card sale
             (rounded to 2 decimals).
        `,
        hint: md`
          \`sales["timestamp"].dt.dayofweek == 1\` selects Tuesdays (Monday = 0). \`value_counts().idxmax()\` gives the most
          frequent value. \`groupby("item")["price"].sum().sort_values(ascending=False).index\`.
        `,
        tests: [
          "4 machines, 6 products",
          "`gain_per_machine` and `sales_per_machine`",
          "A histogram was displayed, with a title",
          "`items_by_gain` and `items_by_profit`",
          "`likely_purchase` → cake",
          "`profit_with_card_fee` is correct",
        ],
      },
    },
  },
};
