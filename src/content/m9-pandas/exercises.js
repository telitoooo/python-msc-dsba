import { md, py, test } from "../helpers.js";
import { FRANCE_MAP, MOVIES_CSV, exchangeRatesCsv, vendingCsv } from "./datasets.js";

const MOVIES = { "movies.csv": MOVIES_CSV };
const RENAME = py`
  movies = pd.read_csv("movies.csv", index_col="Title")
  movies = movies.rename(columns={"Runtime (Minutes)": "Runtime", "Revenue (Millions)": "Revenue_millions"})
  movies.columns = [col.lower() for col in movies]
`;

const PI_SERIES = py`
  def arctan_series(x, n):
      k = np.arange(n)
      return ((-1.0) ** k * x ** (2 * k + 1) / (2 * k + 1)).sum()


  def pi_leibniz(n):
      return 4 * arctan_series(1, n)


  def pi_machin(n):
      return 4 * (4 * arctan_series(1 / 5, n) - arctan_series(1 / 239, n))
`;

const READ_MAP = py`
  def read_map(path):
      """{city: {"coords": (x, y), "next": {neighbour: distance}}}"""
      cities = {}
      with open(path, encoding="utf-8") as f:
          lines = [line.strip() for line in f if line.strip()]
      separator = lines.index("--")
      for line in lines[:separator]:
          name, x, y = line.split(":")
          cities[name] = {"coords": (int(x), int(y)), "next": {}}
      for line in lines[separator + 1:]:
          a, b, distance = line.split(":")
          cities[a]["next"][b] = int(distance)
          cities[b]["next"][a] = int(distance)
      return cities
`;

const PHOTO = py`
  # A synthetic "photo" (to replace a downloaded JPEG): sky, sun and grass.
  h, w = 90, 160
  y, x = np.mgrid[0:h, 0:w]
  photo = np.zeros((h, w, 3), dtype=np.uint8)
  photo[..., 0] = 90 + y                               # red
  photo[..., 1] = 140 + y // 2                         # green
  photo[..., 2] = 230 - y                              # blue
  photo[(x - 120) ** 2 + (y - 25) ** 2 < 15 ** 2] = (250, 220, 60)   # sun
  photo[y > 65] = (60, 150, 70)                        # grass
`;

export default {
  // ---------------------------------------------------------------- 9.1
  "m9-l1": [
    {
      id: "ex1",
      title: "Premiers DataFrames",
      tiers: {
        core: {
          title: "Les achats de fruits",
          prompt: md`
            1. Créez le DataFrame \`purchases\` de la leçon : colonnes \`apples\` (3, 2, 0, 1) et \`oranges\`
               (0, 3, 7, 2), index \`["June", "Robert", "Lily", "David"]\`.
            2. \`june\` : la ligne de June (\`.loc\`) ; \`lily_oranges\` : le nombre d'oranges de Lily.
            3. \`total_apples\` : le nombre total de pommes achetées.
            4. Ajoutez une colonne \`total\` (pommes + oranges) à \`purchases\`.
          `,
          starter: py`
            import pandas as pd

            purchases = ...
            june = ...
            lily_oranges = ...
            total_apples = ...

            print(purchases)
            print(june, lily_oranges, total_apples, sep="\n")
          `,
          solution: py`
            import pandas as pd

            purchases = pd.DataFrame(
                {"apples": [3, 2, 0, 1], "oranges": [0, 3, 7, 2]},
                index=["June", "Robert", "Lily", "David"],
            )
            june = purchases.loc["June"]
            lily_oranges = purchases.loc["Lily", "oranges"]
            total_apples = purchases["apples"].sum()
            purchases["total"] = purchases["apples"] + purchases["oranges"]

            print(purchases)
            print(june, lily_oranges, total_apples, sep="\n")
          `,
          tests: [
            test("`purchases` est un DataFrame indexé par les prénoms", "isinstance(purchases, pd.DataFrame) and list(purchases.index) == ['June', 'Robert', 'Lily', 'David']"),
            test("`june` est la ligne de June", "isinstance(june, pd.Series) and june['apples'] == 3 and june['oranges'] == 0"),
            test("`lily_oranges` vaut 7", "lily_oranges == 7", "lily_oranges"),
            test("`total_apples` vaut 6", "total_apples == 6", "total_apples"),
            test("La colonne `total` existe et est correcte", "purchases['total'].tolist() == [3, 5, 7, 3]", "purchases.get('total')"),
          ],
        },
        extra: {
          title: "Lire le fichier des films",
          prompt: md`
            Le fichier \`movies.csv\` (dossier de travail) est un extrait de 40 films du jeu IMDB du cours.

            1. Chargez-le dans \`movies\` avec la colonne \`Title\` comme index.
            2. \`n_rows, n_cols\` : ses dimensions.
            3. \`first_titles\` : la liste des titres des 3 premières lignes (\`head\`) ; \`last_title\` : le titre de la dernière (\`tail\`).
            4. \`columns\` : la liste des noms de colonnes.
            5. \`numeric_columns\` : la liste des colonnes **numériques** (\`movies.select_dtypes("number")\`).
          `,
          files: MOVIES,
          starter: py`
            import pandas as pd

            movies = ...
            n_rows, n_cols = ...
            first_titles = ...
            last_title = ...
            columns = ...
            numeric_columns = ...

            print(n_rows, n_cols, first_titles, last_title, columns, numeric_columns, sep="\n")
            movies.info()
          `,
          solution: py`
            import pandas as pd

            movies = pd.read_csv("movies.csv", index_col="Title")
            n_rows, n_cols = movies.shape
            first_titles = list(movies.head(3).index)
            last_title = movies.tail(1).index[0]
            columns = list(movies.columns)
            numeric_columns = list(movies.select_dtypes("number").columns)

            print(n_rows, n_cols, first_titles, last_title, columns, numeric_columns, sep="\n")
            movies.info()
          `,
          tests: [
            test("`movies` est indexé par `Title`", "isinstance(movies, pd.DataFrame) and movies.index.name == 'Title' and 'Prometheus' in movies.index"),
            test("40 lignes et 9 colonnes", "(n_rows, n_cols) == (40, 9)", "(n_rows, n_cols)"),
            test("`first_titles` et `last_title`", "first_titles == ['Guardians of the Galaxy', 'Prometheus', 'Split'] and last_title == 'Inglourious Basterds'", "(first_titles, last_title)"),
            test("`columns` contient les 9 colonnes dans l'ordre", "columns[0] == 'Rank' and columns[-1] == 'Metascore' and len(columns) == 9", "columns"),
            test(
              "`numeric_columns` : les 7 colonnes numériques",
              "numeric_columns == ['Rank', 'Year', 'Runtime (Minutes)', 'Rating', 'Votes', 'Revenue (Millions)', 'Metascore']",
              "numeric_columns",
            ),
          ],
        },
        stretch: {
          title: "Écrire et relire",
          prompt: md`
            1. Créez \`stock\`, un DataFrame à partir de la **liste de dictionnaires** \`products\`.
            2. Ajoutez une colonne \`value\` = \`price × quantity\`.
            3. Enregistrez-le dans \`stock.csv\` **sans l'index** (\`index=False\`), puis relisez ce fichier dans
               \`reloaded\` en utilisant la colonne \`name\` comme index.
            4. \`most_valuable\` : le nom du produit de plus grande valeur (\`idxmax\`).
            5. Exportez aussi \`stock\` en JSON dans \`stock.json\` (\`orient="records"\` : une liste d'objets).
          `,
          starter: py`
            import json
            import pandas as pd

            products = [
                {"name": "candy", "price": 0.5, "quantity": 8},
                {"name": "chocolate", "price": 1.5, "quantity": 6},
                {"name": "gums", "price": 0.8, "quantity": 10},
                {"name": "cake", "price": 2.0, "quantity": 3},
            ]

            stock = ...
            reloaded = ...
            most_valuable = ...

            print(reloaded, most_valuable, sep="\n")
          `,
          solution: py`
            import json
            import pandas as pd

            products = [
                {"name": "candy", "price": 0.5, "quantity": 8},
                {"name": "chocolate", "price": 1.5, "quantity": 6},
                {"name": "gums", "price": 0.8, "quantity": 10},
                {"name": "cake", "price": 2.0, "quantity": 3},
            ]

            stock = pd.DataFrame(products)
            stock["value"] = stock["price"] * stock["quantity"]
            stock.to_csv("stock.csv", index=False)
            reloaded = pd.read_csv("stock.csv", index_col="name")
            most_valuable = reloaded["value"].idxmax()
            stock.to_json("stock.json", orient="records")

            print(reloaded, most_valuable, sep="\n")
          `,
          tests: [
            test("`stock` a 4 lignes et une colonne `value`", "stock.shape == (4, 4) and stock['value'].tolist() == [4.0, 9.0, 8.0, 6.0]"),
            test("`stock.csv` a été écrit sans index", "read_file('stock.csv').splitlines()[0] == 'name,price,quantity,value'", "read_file('stock.csv').splitlines()[0]"),
            test("`reloaded` est indexé par le nom", "reloaded.index.name == 'name' and reloaded.loc['gums', 'quantity'] == 10"),
            test("`most_valuable` → chocolate", "most_valuable == 'chocolate'", "most_valuable"),
            test("`stock.json` contient une liste de 4 objets", "len(json.loads(read_file('stock.json'))) == 4 and json.loads(read_file('stock.json'))[0]['name'] == 'candy'"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 9.2
  "m9-l2": [
    {
      id: "ex1",
      title: "Nettoyer le jeu de films",
      tiers: {
        core: {
          title: "Renommer les colonnes",
          prompt: md`
            Après avoir chargé \`movies.csv\` (index \`Title\`) :

            1. renommez \`Runtime (Minutes)\` en \`Runtime\` et \`Revenue (Millions)\` en \`Revenue_millions\` (\`rename\`) ;
            2. mettez **tous** les noms de colonnes en minuscules, avec une compréhension de liste
               affectée à \`movies.columns\`.
          `,
          files: MOVIES,
          starter: py`
            import pandas as pd

            movies = pd.read_csv("movies.csv", index_col="Title")
            print(list(movies.columns))

            # 1. rename


            # 2. lower case


            print(list(movies.columns))
          `,
          solution: py`
            import pandas as pd

            movies = pd.read_csv("movies.csv", index_col="Title")
            print(list(movies.columns))

            movies = movies.rename(columns={"Runtime (Minutes)": "Runtime", "Revenue (Millions)": "Revenue_millions"})
            movies.columns = [col.lower() for col in movies]

            print(list(movies.columns))
          `,
          tests: [
            test(
              "Les colonnes sont renommées et en minuscules",
              "list(movies.columns) == ['rank', 'genre', 'director', 'year', 'runtime', 'rating', 'votes', 'revenue_millions', 'metascore']",
              "list(movies.columns)",
            ),
            test("Les données sont intactes", "movies.shape == (40, 9) and movies.loc['Inception', 'rating'] == 8.8"),
            test("`rename` et une compréhension sont utilisés", "calls('rename') and uses('ListComp')"),
          ],
        },
        extra: {
          title: "Doublons et valeurs manquantes",
          prompt: md`
            Les colonnes sont déjà renommées (voir le code de départ).

            1. \`doubled\` : \`movies\` empilé deux fois (\`pd.concat\`) ; \`deduplicated\` : \`doubled\` sans les doublons.
            2. \`missing\` : le nombre de valeurs manquantes **par colonne** (une \`Series\`).
            3. \`complete_rows\` : le nombre de lignes sans aucune valeur manquante (\`dropna\`).
            4. \`complete_cols\` : le nombre de colonnes sans aucune valeur manquante (\`dropna(axis=1)\`).
          `,
          files: MOVIES,
          starter: py`
            import pandas as pd

            ${RENAME}

            doubled = ...
            deduplicated = ...
            missing = ...
            complete_rows = ...
            complete_cols = ...

            print(doubled.shape, deduplicated.shape, missing, complete_rows, complete_cols, sep="\n")
          `,
          solution: py`
            import pandas as pd

            ${RENAME}

            doubled = pd.concat([movies, movies])
            deduplicated = doubled.drop_duplicates()
            missing = movies.isnull().sum()
            complete_rows = movies.dropna().shape[0]
            complete_cols = movies.dropna(axis=1).shape[1]

            print(doubled.shape, deduplicated.shape, missing, complete_rows, complete_cols, sep="\n")
          `,
          tests: [
            test("`doubled` a 80 lignes, `deduplicated` 40", "doubled.shape == (80, 9) and deduplicated.shape == (40, 9)", "(doubled.shape, deduplicated.shape)"),
            test("`missing` : 3 recettes et 2 Metascores manquants", "isinstance(missing, pd.Series) and missing['revenue_millions'] == 3 and missing['metascore'] == 2 and missing.sum() == 5", "missing"),
            test("`complete_rows` vaut 36", "complete_rows == 36", "complete_rows"),
            test("`complete_cols` vaut 7", "complete_cols == 7", "complete_cols"),
          ],
        },
        stretch: {
          title: "Imputation",
          prompt: md`
            Écrivez \`clean(df)\`, qui reçoit le tableau **brut** lu depuis \`movies.csv\` et renvoie un **nouveau**
            DataFrame :

            - colonnes renommées comme au niveau Core (\`runtime\`, \`revenue_millions\`, tout en minuscules) ;
            - recettes manquantes remplacées par la **moyenne** des recettes ;
            - Metascores manquants remplacés par la **médiane** des Metascores ;
            - sans modifier le DataFrame reçu.
          `,
          hint: md`
            \`rename\` renvoie déjà un nouveau DataFrame. Ensuite, réaffectez chaque colonne :
            \`df["revenue_millions"] = df["revenue_millions"].fillna(df["revenue_millions"].mean())\`
            (pas de \`inplace=True\` sur une colonne extraite : avec pandas 3, il ne modifierait pas le tableau).
          `,
          files: MOVIES,
          starter: py`
            import pandas as pd

            raw = pd.read_csv("movies.csv", index_col="Title")


            def clean(df):
                ...


            cleaned = clean(raw)
            print(cleaned.isnull().sum())
            print(cleaned.loc[["Mindhorn", "Dangal"], ["revenue_millions", "metascore"]])
          `,
          solution: py`
            import pandas as pd

            raw = pd.read_csv("movies.csv", index_col="Title")


            def clean(df):
                df = df.rename(columns={"Runtime (Minutes)": "Runtime", "Revenue (Millions)": "Revenue_millions"})
                df.columns = [col.lower() for col in df]
                df["revenue_millions"] = df["revenue_millions"].fillna(df["revenue_millions"].mean())
                df["metascore"] = df["metascore"].fillna(df["metascore"].median())
                return df


            cleaned = clean(raw)
            print(cleaned.isnull().sum())
            print(cleaned.loc[["Mindhorn", "Dangal"], ["revenue_millions", "metascore"]])
          `,
          tests: [
            test("Plus aucune valeur manquante", "clean(raw).isnull().sum().sum() == 0"),
            test("Colonnes renommées en minuscules", "'revenue_millions' in clean(raw).columns and 'runtime' in clean(raw).columns"),
            test(
              "Recette de Mindhorn = moyenne des recettes",
              "approx(clean(raw).loc['Mindhorn', 'revenue_millions'], raw['Revenue (Millions)'].mean())",
              "clean(raw).loc['Mindhorn', 'revenue_millions']",
            ),
            test("Metascore de Dangal = médiane (67.5)", "clean(raw).loc['Dangal', 'metascore'] == raw['Metascore'].median() == 67.5", "clean(raw).loc['Dangal', 'metascore']"),
            test("Le DataFrame d'origine n'est pas modifié", "raw.isnull().sum().sum() == 5 and 'Revenue (Millions)' in raw.columns"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 9.3
  "m9-l3": [
    {
      id: "ex1",
      title: "Explorer et sélectionner",
      tiers: {
        core: {
          title: "Sélections conditionnelles",
          prompt: md`
            Sur le tableau \`movies\` (colonnes déjà renommées) :

            - \`scott\` : les films de Ridley Scott ;
            - \`top\` : les films notés **au moins** 8.6 ;
            - \`nolan_scott\` : les films de Christopher Nolan **ou** de Ridley Scott (avec \`isin\`) ;
            - \`gems\` : les films sortis entre 2005 et 2010 (inclus), notés **plus de** 8.0, dont la recette est
              **inférieure au 1er quartile** des recettes (\`quantile(0.25)\`) ;
            - \`first_four\` : les 4 premières lignes **par position** (\`iloc\`) ;
            - \`range_by_name\` : les lignes de \`"Prometheus"\` à \`"Sing"\` **incluses**, colonnes \`director\` et \`rating\` (\`loc\`).
          `,
          files: MOVIES,
          starter: py`
            import pandas as pd

            ${RENAME}

            scott = ...
            top = ...
            nolan_scott = ...
            gems = ...
            first_four = ...
            range_by_name = ...

            print(len(scott), len(top), len(nolan_scott))
            print(gems[["year", "rating", "revenue_millions"]])
            print(range_by_name)
          `,
          solution: py`
            import pandas as pd

            ${RENAME}

            scott = movies[movies["director"] == "Ridley Scott"]
            top = movies[movies["rating"] >= 8.6]
            nolan_scott = movies[movies["director"].isin(["Christopher Nolan", "Ridley Scott"])]
            gems = movies[
                ((movies["year"] >= 2005) & (movies["year"] <= 2010))
                & (movies["rating"] > 8.0)
                & (movies["revenue_millions"] < movies["revenue_millions"].quantile(0.25))
            ]
            first_four = movies.iloc[:4]
            range_by_name = movies.loc["Prometheus":"Sing", ["director", "rating"]]

            print(len(scott), len(top), len(nolan_scott))
            print(gems[["year", "rating", "revenue_millions"]])
            print(range_by_name)
          `,
          tests: [
            test("`scott` : les 8 films de Ridley Scott", "isinstance(scott, pd.DataFrame) and len(scott) == 8 and set(scott['director']) == {'Ridley Scott'}", "len(scott)"),
            test("`top` : 6 films notés ≥ 8.6", "sorted(top.index) == sorted(movies.index[movies['rating'] >= 8.6]) and len(top) == 6", "list(top.index)"),
            test("`nolan_scott` : 13 films", "len(nolan_scott) == 13 and set(nolan_scott['director']) == {'Christopher Nolan', 'Ridley Scott'}", "len(nolan_scott)"),
            test("`gems` : Taare Zameen Par", "list(gems.index) == ['Taare Zameen Par']", "list(gems.index)"),
            test("`first_four` : 4 premières lignes", "list(first_four.index) == list(movies.index[:4])"),
            test(
              "`range_by_name` : de Prometheus à Sing inclus, 2 colonnes",
              "list(range_by_name.index) == ['Prometheus', 'Split', 'Sing'] and list(range_by_name.columns) == ['director', 'rating']",
              "range_by_name",
            ),
          ],
        },
        extra: {
          title: "Appliquer et regrouper",
          prompt: md`
            1. Ajoutez la colonne \`rating_category\` : \`"good"\` si la note est ≥ 8.0, sinon \`"bad"\`, avec
               \`apply\` et une fonction \`rating_function\`.
            2. Ajoutez la colonne \`main_genre\` : le **premier** genre de la colonne \`genre\` (\`.str.split(",").str[0]\`).
            3. \`genre_counts\` : le nombre de films par genre principal (\`value_counts\`).
            4. \`directors\` : pour chaque réalisateur, le nombre de films (\`count\`) et la note moyenne (\`mean\`) :
               \`movies.groupby("director")["rating"].agg(["count", "mean"])\`.
            5. \`best_director\` : parmi les réalisateurs d'**au moins 2 films**, celui de meilleure note moyenne.
          `,
          files: MOVIES,
          starter: py`
            import pandas as pd

            ${RENAME}


            def rating_function(x):
                ...


            genre_counts = ...
            directors = ...
            best_director = ...

            print(movies[["rating", "rating_category", "main_genre"]].head())
            print(genre_counts, directors.sort_values("mean", ascending=False).head(), best_director, sep="\n")
          `,
          solution: py`
            import pandas as pd

            ${RENAME}


            def rating_function(x):
                if x >= 8.0:
                    return "good"
                return "bad"


            movies["rating_category"] = movies["rating"].apply(rating_function)
            movies["main_genre"] = movies["genre"].str.split(",").str[0]
            genre_counts = movies["main_genre"].value_counts()
            directors = movies.groupby("director")["rating"].agg(["count", "mean"])
            best_director = directors[directors["count"] >= 2]["mean"].idxmax()

            print(movies[["rating", "rating_category", "main_genre"]].head())
            print(genre_counts, directors.sort_values("mean", ascending=False).head(), best_director, sep="\n")
          `,
          tests: [
            test("`rating_category` est correcte", "movies.loc['Inception', 'rating_category'] == 'good' and movies.loc['Split', 'rating_category'] == 'bad' and (movies['rating_category'] == 'good').sum() == 16", "movies.get('rating_category')"),
            test("`apply` est utilisé avec `rating_function`", "calls('apply') and rating_function(8.0) == 'good' and rating_function(7.9) == 'bad'"),
            test("`main_genre` est le premier genre", "movies.loc['Split', 'main_genre'] == 'Horror' and movies.loc['Mindhorn', 'main_genre'] == 'Comedy'", "movies.get('main_genre')"),
            test("`genre_counts` : 14 films d'action", "genre_counts['Action'] == 14 and genre_counts.sum() == 40", "genre_counts"),
            test("`directors` a les colonnes count et mean", "list(directors.columns) == ['count', 'mean'] and directors.loc['Ridley Scott', 'count'] == 8", "directors.head()"),
            test("`best_director` → Christopher Nolan", "best_director == 'Christopher Nolan'", "best_director"),
          ],
        },
        stretch: {
          title: "Taux de change moyens des années 90",
          prompt: md`
            *Hands-on « Mean Exchange Rates ».* Le fichier \`monthly.csv\` reprend le format des données de
            datahub.io : une ligne par mois et par pays (\`Date\`, \`Country\`, \`Exchange rate\` : nombre d'unités
            de la devise pour 1 dollar).

            1. \`rates\` : le fichier chargé, avec la colonne \`Date\` convertie en dates (\`parse_dates=["Date"]\`).
            2. \`mean_rates(df, start_year, end_year)\` : renvoie, pour chaque pays (index \`Country\`, trié par ordre
               alphabétique), le taux moyen entre le 1er janvier de \`start_year\` et le 31 décembre de \`end_year\`.
            3. \`rates_90s\` : \`mean_rates(rates, 1990, 1999)\`.
            4. \`strongest_dollar\` : le pays pour lequel **1 dollar achète le plus d'unités** de devise en
               moyenne sur les années 90 (\`idxmax\`).
          `,
          hint: md`
            \`df["Date"].dt.year\` donne l'année de chaque ligne ; \`between(start_year, end_year)\` filtre.
            Puis \`groupby("Country")["Exchange rate"].mean()\`.
          `,
          files: { "monthly.csv": exchangeRatesCsv() },
          starter: py`
            import pandas as pd

            rates = ...


            def mean_rates(df, start_year, end_year):
                ...


            rates_90s = ...
            strongest_dollar = ...

            print(rates.head())
            print(rates_90s)
            print(strongest_dollar)
          `,
          solution: py`
            import pandas as pd

            rates = pd.read_csv("monthly.csv", parse_dates=["Date"])


            def mean_rates(df, start_year, end_year):
                period = df[df["Date"].dt.year.between(start_year, end_year)]
                return period.groupby("Country")["Exchange rate"].mean()


            rates_90s = mean_rates(rates, 1990, 1999)
            strongest_dollar = rates_90s.idxmax()

            print(rates.head())
            print(rates_90s)
            print(strongest_dollar)
          `,
          tests: [
            test("`rates` : dates converties", "str(rates['Date'].dtype).startswith('datetime64') and len(rates) == 1260", "rates.dtypes"),
            test(
              "`rates_90s` : moyenne par pays sur 1990–1999",
              "(lambda ref: list(rates_90s.index) == sorted(ref.index) and ((rates_90s.sort_index() - ref.sort_index()).abs() < 1e-9).all())(__import__('pandas').read_csv('monthly.csv', parse_dates=['Date']).query('Date >= \"1990-01-01\" and Date <= \"1999-12-31\"').groupby('Country')['Exchange rate'].mean())",
              "rates_90s",
            ),
            test("`mean_rates` fonctionne pour une autre période", "len(mean_rates(rates, 2000, 2000)) == 7 and approx(mean_rates(rates, 2000, 2000)['Japan'], rates[(rates['Country'] == 'Japan') & (rates['Date'].dt.year == 2000)]['Exchange rate'].mean())"),
            test("`strongest_dollar` → Japan", "strongest_dollar == 'Japan'", "strongest_dollar"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 9.4
  "m9-l4": [
    {
      id: "ex1",
      title: "Tracer avec Matplotlib",
      tiers: {
        core: {
          title: "La conjecture de Collatz en image",
          prompt: md`
            *Hands-on 12, dernière étape.* \`collatz_steps(n)\` renvoie le nombre d'étapes pour atteindre 1
            (n ← n / 2 si n est pair, 3n + 1 sinon).

            1. Calculez \`steps\`, la liste des nombres d'étapes pour \`n\` de 1 à 100.
            2. Tracez \`steps\` en fonction de \`n\` (\`plt.plot\` avec des points, ou \`plt.scatter\`), avec un
               **titre**, et des **étiquettes** pour les deux axes.
            3. Affichez la figure avec \`plt.show()\`.
          `,
          starter: py`
            import matplotlib.pyplot as plt


            def collatz_steps(n):
                ...


            ns = list(range(1, 101))
            steps = ...

            # plot
          `,
          solution: py`
            import matplotlib.pyplot as plt


            def collatz_steps(n):
                count = 0
                while n != 1:
                    n = n // 2 if n % 2 == 0 else 3 * n + 1
                    count += 1
                return count


            ns = list(range(1, 101))
            steps = [collatz_steps(n) for n in ns]

            plt.plot(ns, steps, "o", markersize=3)
            plt.title("Collatz: number of steps to reach 1")
            plt.xlabel("n")
            plt.ylabel("steps")
            plt.show()
          `,
          tests: [
            test("`collatz_steps(27)` vaut 111", "collatz_steps(27) == 111 and collatz_steps(1) == 0 and collatz_steps(6) == 8"),
            test("`steps` contient 100 valeurs", "len(steps) == 100 and steps[26] == 111", "len(steps)"),
            test("Une figure a été affichée", "len(FIGURES) >= 1 and len(FIGURES[0]['axes']) >= 1"),
            test("Elle contient des données tracées", "FIGURES[0]['axes'][0]['lines'] + FIGURES[0]['axes'][0]['collections'] >= 1"),
            test("Titre et étiquettes des axes", "all(FIGURES[0]['axes'][0][k] for k in ('title', 'xlabel', 'ylabel'))", "FIGURES and FIGURES[0]['axes'][0]"),
          ],
        },
        extra: {
          title: "La convergence des séries de π",
          prompt: md`
            Les fonctions \`pi_leibniz(n)\` et \`pi_machin(n)\` du module 8 sont fournies.

            1. \`ns\` : les entiers de 1 à 30 ; \`err_leibniz\` et \`err_machin\` : les listes des erreurs
               **relatives** |approximation − π| / π pour chaque \`n\` de \`ns\`.
            2. Tracez les deux courbes sur un même graphique en **échelle logarithmique** pour l'axe des y
               (\`plt.semilogy\`), avec les labels \`"Leibniz"\` et \`"Machin"\`, une légende, un titre et des
               étiquettes d'axes.

            Observez la droite (convergence exponentielle) puis le **plateau** de Machin vers 1e-16.
          `,
          starter: py`
            import math
            import numpy as np
            import matplotlib.pyplot as plt

            ${PI_SERIES}


            ns = ...
            err_leibniz = ...
            err_machin = ...

            # plot
          `,
          solution: py`
            import math
            import numpy as np
            import matplotlib.pyplot as plt

            ${PI_SERIES}


            ns = list(range(1, 31))
            err_leibniz = [abs(pi_leibniz(n) - math.pi) / math.pi for n in ns]
            err_machin = [max(abs(pi_machin(n) - math.pi) / math.pi, 1e-17) for n in ns]

            plt.semilogy(ns, err_leibniz, "o-", label="Leibniz")
            plt.semilogy(ns, err_machin, "s-", label="Machin")
            plt.title("Relative error of the π series")
            plt.xlabel("number of terms N")
            plt.ylabel("relative error")
            plt.legend()
            plt.show()
          `,
          explanation: md`
            Une erreur exactement nulle ne peut pas être placée sur une échelle logarithmique (log 0 = −∞) :
            d'où le \`max(…, 1e-17)\` de la solution.
          `,
          tests: [
            test("`err_leibniz` et `err_machin` ont 30 valeurs", "len(err_leibniz) == len(err_machin) == 30 and approx(err_leibniz[0], abs(4 - math.pi) / math.pi)"),
            test("Une figure avec deux courbes", "len(FIGURES) >= 1 and FIGURES[0]['axes'][0]['lines'] == 2", "FIGURES and FIGURES[0]['axes'][0]['lines']"),
            test("L'axe des y est logarithmique", "FIGURES[0]['axes'][0]['yscale'] == 'log'"),
            test("Légende `Leibniz` / `Machin`", "sorted(FIGURES[0]['axes'][0]['labels']) == ['Leibniz', 'Machin']", "FIGURES and FIGURES[0]['axes'][0]['labels']"),
            test("Titre et étiquettes", "all(FIGURES[0]['axes'][0][k] for k in ('title', 'xlabel', 'ylabel'))"),
          ],
        },
        stretch: {
          title: "Dessiner la carte de France",
          prompt: md`
            *Hands-on « Map of France », avec matplotlib au lieu de Tk.* \`read_map(path)\` (fournie) lit
            \`france_lite.map\` en dictionnaires imbriqués.

            Écrivez \`draw_map(cities)\`, qui crée une figure (\`fig, ax = plt.subplots()\`) et :

            1. trace **chaque route une seule fois** (une route A–B apparaît dans les voisins de A **et** de B) avec \`ax.plot\` ;
            2. place toutes les villes d'un seul \`ax.scatter\` ;
            3. écrit le nom de chaque ville avec \`ax.text\` ;
            4. inverse l'axe des y (\`ax.invert_yaxis()\`) car les coordonnées viennent d'un écran (y vers le bas),
               ajoute un titre, puis affiche la figure.

            \`draw_map\` renvoie le nombre de routes tracées.
          `,
          hint: md`
            Pour ne tracer qu'une fois chaque route, mémorisez les paires déjà vues dans un ensemble de
            \`frozenset({a, b})\`, ou ne tracez une route que si \`a < b\` (ordre alphabétique).
          `,
          files: { "france_lite.map": FRANCE_MAP },
          starter: py`
            import matplotlib.pyplot as plt

            ${READ_MAP}


            def draw_map(cities):
                ...


            cities = read_map("france_lite.map")
            print(draw_map(cities), "roads")
          `,
          solution: py`
            import matplotlib.pyplot as plt

            ${READ_MAP}


            def draw_map(cities):
                fig, ax = plt.subplots(figsize=(7, 5))
                roads = 0
                for a, data in cities.items():
                    for b in data["next"]:
                        if a < b:
                            (xa, ya), (xb, yb) = data["coords"], cities[b]["coords"]
                            ax.plot([xa, xb], [ya, yb], color="gray")
                            roads += 1
                xs = [c["coords"][0] for c in cities.values()]
                ys = [c["coords"][1] for c in cities.values()]
                ax.scatter(xs, ys, color="crimson", zorder=3)
                for name, data in cities.items():
                    x, y = data["coords"]
                    ax.text(x + 8, y - 8, name, fontsize=8)
                ax.invert_yaxis()
                ax.set_title("Map of France (excerpt)")
                plt.show()
                return roads


            cities = read_map("france_lite.map")
            print(draw_map(cities), "roads")
          `,
          tests: [
            test("`draw_map` renvoie 11 routes", "draw_map(read_map('france_lite.map')) == 11"),
            test("Une figure a été affichée", "len(FIGURES) >= 1"),
            test("Chaque route est tracée une seule fois (11 lignes)", "FIGURES[0]['axes'][0]['lines'] == 11", "FIGURES and FIGURES[0]['axes'][0]['lines']"),
            test("Les 8 villes sont placées et nommées", "FIGURES[0]['axes'][0]['collections'] >= 1 and FIGURES[0]['axes'][0]['texts'] == 8", "FIGURES and FIGURES[0]['axes'][0]['texts']"),
            test("La figure a un titre", "FIGURES[0]['axes'][0]['title'] != ''"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 9.5
  "m9-l5": [
    {
      id: "ex1",
      title: "Images et statistiques",
      tiers: {
        core: {
          title: "Le drapeau néerlandais",
          prompt: md`
            *Hands-on 15, avec Pillow.*

            1. \`make_flag(width, height)\` crée une image RGB (\`Image.new\`) en trois bandes **horizontales**
               de même hauteur : rouge \`(174, 28, 40)\`, blanc \`(255, 255, 255)\`, bleu \`(33, 70, 139)\`.
               Coloriez chaque pixel avec \`putpixel\`.
            2. \`rotate90(img)\` renvoie une **nouvelle** image tournée de 90° dans le sens inverse des aiguilles
               d'une montre, construite pixel par pixel avec \`getpixel\` et \`putpixel\` (même résultat que
               \`img.rotate(90, expand=True)\`, que vous ne devez pas utiliser).
            3. Créez un drapeau 300 × 200, enregistrez-le dans \`flag.png\` et affichez-le (\`show()\`), ainsi que sa rotation.
          `,
          hint: md`
            La bande d'un pixel dépend de sa ligne \`y\` : \`y < height // 3\` → rouge… Pour la rotation, une image
            \`w × h\` devient \`h × w\`, et le pixel \`(x, y)\` va en \`(y, w - 1 - x)\`.
          `,
          starter: py`
            from PIL import Image

            RED, WHITE, BLUE = (174, 28, 40), (255, 255, 255), (33, 70, 139)


            def make_flag(width, height):
                ...


            def rotate90(img):
                ...


            flag = make_flag(300, 200)
          `,
          solution: py`
            from PIL import Image

            RED, WHITE, BLUE = (174, 28, 40), (255, 255, 255), (33, 70, 139)


            def make_flag(width, height):
                img = Image.new("RGB", (width, height))
                for y in range(height):
                    if y < height // 3:
                        color = RED
                    elif y < 2 * height // 3:
                        color = WHITE
                    else:
                        color = BLUE
                    for x in range(width):
                        img.putpixel((x, y), color)
                return img


            def rotate90(img):
                w, h = img.size
                rotated = Image.new("RGB", (h, w))
                for x in range(w):
                    for y in range(h):
                        rotated.putpixel((y, w - 1 - x), img.getpixel((x, y)))
                return rotated


            flag = make_flag(300, 200)
            flag.save("flag.png")
            flag.show()
            rotate90(flag).show()
          `,
          tests: [
            test("`make_flag` crée une image de la bonne taille", "make_flag(30, 21).size == (30, 21) and make_flag(30, 21).mode == 'RGB'"),
            test(
              "Trois bandes horizontales rouge, blanc, bleu",
              "(lambda f: (f.getpixel((5, 0)), f.getpixel((29, 10)), f.getpixel((0, 20))))(make_flag(30, 21)) == ((174, 28, 40), (255, 255, 255), (33, 70, 139))",
            ),
            test(
              "`rotate90` équivaut à `rotate(90, expand=True)`",
              "(lambda f: rotate90(f).size == (21, 30) and list(rotate90(f).getdata()) == list(f.rotate(90, expand=True).getdata()))(make_flag(30, 21))",
            ),
            test("`putpixel` et `getpixel` sont utilisés, pas `rotate`", "calls('putpixel') and calls('getpixel') and not calls('rotate') and not calls('transpose')"),
            test("`flag.png` a été enregistré", "file_exists('flag.png')"),
          ],
        },
        extra: {
          title: "Manipuler une image avec NumPy",
          prompt: md`
            *Hands-on « Image Manipulation ».* Le code de départ crée \`photo\`, une image synthétique (un tableau
            \`uint8\` de forme \`(hauteur, largeur, 3)\`) qui remplace une photo téléchargée.

            1. \`shape\` : la forme de \`photo\`.
            2. \`only_blue\` : une copie de \`photo\` où les canaux rouge et vert sont mis à 0.
            3. \`gray_mean\` : l'image en niveaux de gris par **moyenne** des 3 canaux (forme \`(h, w)\`).
            4. \`gray_weighted\` : niveaux de gris avec les poids **0.3** (rouge), **0.59** (vert), **0.11** (bleu).
            5. Enregistrez \`gray_weighted\` dans \`gray.png\` (\`plt.imsave(…, cmap="gray")\`) et affichez les trois
               images côte à côte (\`plt.subplots(1, 3)\` puis \`imshow\` sur chaque axe).
          `,
          starter: py`
            import numpy as np
            import matplotlib.pyplot as plt

            ${PHOTO}

            shape = ...
            only_blue = ...
            gray_mean = ...
            gray_weighted = ...
          `,
          solution: py`
            import numpy as np
            import matplotlib.pyplot as plt

            ${PHOTO}

            shape = photo.shape
            only_blue = photo.copy()
            only_blue[..., 0] = 0
            only_blue[..., 1] = 0
            gray_mean = photo.mean(axis=2)
            gray_weighted = photo @ np.array([0.3, 0.59, 0.11])

            plt.imsave("gray.png", gray_weighted, cmap="gray")
            fig, axes = plt.subplots(1, 3, figsize=(12, 3))
            axes[0].imshow(only_blue)
            axes[1].imshow(gray_mean, cmap="gray")
            axes[2].imshow(gray_weighted, cmap="gray")
            for ax, title in zip(axes, ["blue only", "gray (mean)", "gray (weighted)"]):
                ax.set_title(title)
            plt.show()
          `,
          tests: [
            test("`shape` vaut (90, 160, 3)", "shape == (90, 160, 3)", "shape"),
            test("`only_blue` ne garde que le bleu, sans modifier `photo`", "only_blue[..., :2].max() == 0 and np.array_equal(only_blue[..., 2], photo[..., 2]) and photo[..., 0].max() > 0"),
            test("`gray_mean` : moyenne des canaux", "gray_mean.shape == (90, 160) and np.allclose(gray_mean, photo.mean(axis=2))"),
            test("`gray_weighted` : poids 0.3 / 0.59 / 0.11", "gray_weighted.shape == (90, 160) and np.allclose(gray_weighted, 0.3 * photo[..., 0] + 0.59 * photo[..., 1] + 0.11 * photo[..., 2])"),
            test("`gray.png` enregistré et 3 images affichées", "file_exists('gray.png') and len(FIGURES) >= 1 and sum(ax['images'] for ax in FIGURES[0]['axes']) == 3"),
          ],
        },
        stretch: {
          title: "Statistiques des distributeurs",
          prompt: md`
            *Hands-on « Statistics about Vending Machines ».* \`vending.csv\` contient deux semaines de ventes :
            \`machine\`, \`timestamp\`, \`item\`, \`price\`, \`cost\`, \`payment\` (\`cash\` ou \`card\`).

            1. \`sales\` : le fichier chargé, \`timestamp\` converti en dates. \`n_machines\` : le nombre de machines ;
               \`items\` : la liste **triée** des produits vendus.
            2. \`gain_per_machine\` (somme des prix) et \`sales_per_machine\` (nombre de ventes) : deux \`Series\` indexées par machine.
            3. Tracez l'**histogramme des heures** de vente du chocolat (\`.dt.hour\`), avec un titre.
            4. \`items_by_gain\` : la liste des produits triés par chiffre d'affaires **décroissant** ;
               \`items_by_profit\` : idem pour le bénéfice (prix − coût).
            5. \`likely_purchase\` : un client arrive à la \`machine3\` un **mardi** vers 17 h. Que va-t-il acheter ?
               Le produit le plus vendu par cette machine les mardis entre 16 h et 18 h (heures 16 et 17).
            6. \`profit_with_card_fee\` : le bénéfice total si l'on paie une commission de **25 % du prix** sur
               chaque vente par carte (arrondi à 2 décimales).
          `,
          hint: md`
            \`sales["timestamp"].dt.dayofweek == 1\` sélectionne les mardis (lundi = 0). \`value_counts().idxmax()\`
            donne la valeur la plus fréquente. \`groupby("item")["price"].sum().sort_values(ascending=False).index\`.
          `,
          files: { "vending.csv": vendingCsv() },
          starter: py`
            import pandas as pd
            import matplotlib.pyplot as plt

            sales = ...
            n_machines = ...
            items = ...
            gain_per_machine = ...
            sales_per_machine = ...
            items_by_gain = ...
            items_by_profit = ...
            likely_purchase = ...
            profit_with_card_fee = ...

            print(n_machines, items, gain_per_machine, sales_per_machine, items_by_gain, items_by_profit,
                  likely_purchase, profit_with_card_fee, sep="\n")
          `,
          solution: py`
            import pandas as pd
            import matplotlib.pyplot as plt

            sales = pd.read_csv("vending.csv", parse_dates=["timestamp"])
            n_machines = sales["machine"].nunique()
            items = sorted(sales["item"].unique())
            gain_per_machine = sales.groupby("machine")["price"].sum()
            sales_per_machine = sales.groupby("machine").size()

            chocolate = sales[sales["item"] == "chocolate"]
            plt.hist(chocolate["timestamp"].dt.hour, bins=range(8, 21))
            plt.title("Chocolate sales per hour")
            plt.xlabel("hour")
            plt.show()

            items_by_gain = list(sales.groupby("item")["price"].sum().sort_values(ascending=False).index)
            sales["profit"] = sales["price"] - sales["cost"]
            items_by_profit = list(sales.groupby("item")["profit"].sum().sort_values(ascending=False).index)

            tuesday_evening = sales[
                (sales["machine"] == "machine3")
                & (sales["timestamp"].dt.dayofweek == 1)
                & (sales["timestamp"].dt.hour.isin([16, 17]))
            ]
            likely_purchase = tuesday_evening["item"].value_counts().idxmax()

            fee = 0.25 * sales.loc[sales["payment"] == "card", "price"].sum()
            profit_with_card_fee = round(sales["profit"].sum() - fee, 2)

            print(n_machines, items, gain_per_machine, sales_per_machine, items_by_gain, items_by_profit,
                  likely_purchase, profit_with_card_fee, sep="\n")
          `,
          tests: [
            test("4 machines, 6 produits", "n_machines == 4 and list(items) == ['cake', 'candy', 'chocolate', 'cookie', 'gums', 'soda']", "(n_machines, items)"),
            test(
              "`gain_per_machine` et `sales_per_machine`",
              "(lambda d: ((gain_per_machine.sort_index() - d.groupby('machine')['price'].sum()).abs() < 1e-9).all() and list(sales_per_machine.sort_index().values) == list(d.groupby('machine').size().values))(__import__('pandas').read_csv('vending.csv'))",
              "gain_per_machine",
            ),
            test("Un histogramme a été affiché, avec un titre", "len(FIGURES) >= 1 and FIGURES[0]['axes'][0]['patches'] >= 5 and FIGURES[0]['axes'][0]['title'] != ''"),
            test(
              "`items_by_gain` et `items_by_profit`",
              "(lambda d: list(items_by_gain) == list(d.groupby('item')['price'].sum().sort_values(ascending=False).index) and list(items_by_profit) == list((d['price'] - d['cost']).groupby(d['item']).sum().sort_values(ascending=False).index))(__import__('pandas').read_csv('vending.csv'))",
              "(items_by_gain, items_by_profit)",
            ),
            test("`likely_purchase` → cake", "likely_purchase == 'cake'", "likely_purchase"),
            test(
              "`profit_with_card_fee` est correct",
              "(lambda d: approx(profit_with_card_fee, round((d['price'] - d['cost']).sum() - 0.25 * d.loc[d['payment'] == 'card', 'price'].sum(), 2), 1e-6))(__import__('pandas').read_csv('vending.csv'))",
              "profit_with_card_fee",
            ),
          ],
        },
      },
    },
  ],
};
