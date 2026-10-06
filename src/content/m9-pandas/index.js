import { defineModule } from "../i18n.js";
import exercises from "./exercises.js";
import exercisesEn from "./exercises.en.js";
import dataframesFr from "./01-dataframes.md?raw";
import dataframesEn from "./01-dataframes.en.md?raw";
import cleaningFr from "./02-nettoyage.md?raw";
import cleaningEn from "./02-nettoyage.en.md?raw";
import selectionFr from "./03-selection.md?raw";
import selectionEn from "./03-selection.en.md?raw";
import matplotlibFr from "./04-matplotlib.md?raw";
import matplotlibEn from "./04-matplotlib.en.md?raw";
import imagesFr from "./05-images-seaborn.md?raw";
import imagesEn from "./05-images-seaborn.en.md?raw";

export default defineModule(
  {
    id: "m9",
    number: 9,
    session: 6,
    title: { fr: "Pandas et visualisation", en: "Pandas and visualisation" },
    shortTitle: { fr: "Pandas & graphiques", en: "Pandas & charts" },
    description: {
      fr: "Séance 6 (2e partie) : Series et DataFrame, lecture de CSV, nettoyage (doublons, valeurs manquantes), sélection et agrégation, graphiques matplotlib, tracés pandas, seaborn et images.",
      en: "Session 6 (part 2): Series and DataFrame, reading CSV files, cleaning (duplicates, missing values), selection and aggregation, matplotlib charts, pandas plots, seaborn and images.",
    },
    lessons: [
      {
        id: "m9-l1",
        number: "9.1",
        title: { fr: "Series et DataFrame", en: "Series and DataFrame" },
        duration: "30 min",
        objectives: {
          fr: [
            "Créer un DataFrame et son index",
            "Accéder à une ligne avec .loc",
            "Lire et écrire un CSV",
            "Inspecter avec head, shape, info",
          ],
          en: [
            "Create a DataFrame and its index",
            "Access a row with .loc",
            "Read and write a CSV file",
            "Inspect with head, shape, info",
          ],
        },
        theory: { fr: dataframesFr, en: dataframesEn },
      },
      {
        id: "m9-l2",
        number: "9.2",
        title: { fr: "Nettoyer les données", en: "Cleaning data" },
        duration: "30 min",
        objectives: {
          fr: [
            "Concaténer et supprimer les doublons",
            "Renommer les colonnes",
            "Compter et supprimer les valeurs manquantes",
            "Imputer avec la moyenne ou la médiane",
          ],
          en: [
            "Concatenate and remove duplicates",
            "Rename columns",
            "Count and drop missing values",
            "Impute with the mean or the median",
          ],
        },
        theory: { fr: cleaningFr, en: cleaningEn },
      },
      {
        id: "m9-l3",
        number: "9.3",
        title: { fr: "Explorer, sélectionner, agréger", en: "Exploring, selecting, aggregating" },
        duration: "40 min",
        objectives: {
          fr: [
            "Résumer avec describe et value_counts",
            "Sélectionner avec loc, iloc et des conditions",
            "Appliquer une fonction à une colonne",
            "Regrouper avec groupby",
          ],
          en: [
            "Summarise with describe and value_counts",
            "Select with loc, iloc and conditions",
            "Apply a function to a column",
            "Group with groupby",
          ],
        },
        theory: { fr: selectionFr, en: selectionEn },
      },
      {
        id: "m9-l4",
        number: "9.4",
        title: { fr: "Visualiser avec Matplotlib", en: "Visualising with Matplotlib" },
        duration: "35 min",
        objectives: {
          fr: [
            "Tracer courbes, nuages, barres et histogrammes",
            "Organiser une figure en sous-graphiques",
            "Utiliser une échelle logarithmique",
            "Titrer, légender et enregistrer une figure",
          ],
          en: [
            "Plot lines, scatter plots, bars and histograms",
            "Organise a figure into subplots",
            "Use a logarithmic scale",
            "Add titles, legends and save a figure",
          ],
        },
        theory: { fr: matplotlibFr, en: matplotlibEn },
      },
      {
        id: "m9-l5",
        number: "9.5",
        title: { fr: "Pandas, Seaborn et images", en: "Pandas, Seaborn and images" },
        duration: "40 min",
        objectives: {
          fr: [
            "Tracer directement depuis un DataFrame",
            "Explorer un jeu de données avec seaborn",
            "Manipuler une image comme un tableau NumPy",
            "Créer une image pixel par pixel avec Pillow",
          ],
          en: [
            "Plot directly from a DataFrame",
            "Explore a dataset with seaborn",
            "Handle an image as a NumPy array",
            "Create an image pixel by pixel with Pillow",
          ],
        },
        theory: { fr: imagesFr, en: imagesEn },
      },
    ],
  },
  exercises,
  exercisesEn,
);
