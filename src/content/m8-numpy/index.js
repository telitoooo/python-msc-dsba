import { defineModule } from "../i18n.js";
import exercises from "./exercises.js";
import exercisesEn from "./exercises.en.js";
import arraysFr from "./01-tableaux.md?raw";
import arraysEn from "./01-tableaux.en.md?raw";
import indexingFr from "./02-indexation.md?raw";
import indexingEn from "./02-indexation.en.md?raw";
import broadcastingFr from "./03-broadcasting.md?raw";
import broadcastingEn from "./03-broadcasting.en.md?raw";
import masksFr from "./04-masques.md?raw";
import masksEn from "./04-masques.en.md?raw";
import simulationFr from "./05-simulation.md?raw";
import simulationEn from "./05-simulation.en.md?raw";

export default defineModule(
  {
    id: "m8",
    number: 8,
    session: 6,
    title: { fr: "NumPy : calcul numérique", en: "NumPy: numerical computing" },
    shortTitle: { fr: "NumPy", en: "NumPy" },
    description: {
      fr: "Séance 6 (1re partie) : tableaux à n dimensions, formes et axes, indexation et découpage, calcul vectorisé et broadcasting, masques, tri, tableaux structurés et simulations de Monte-Carlo.",
      en: "Session 6 (part 1): n-dimensional arrays, shapes and axes, indexing and slicing, vectorised computing and broadcasting, masks, sorting, structured arrays and Monte-Carlo simulations.",
    },
    lessons: [
      {
        id: "m8-l1",
        number: "8.1",
        title: { fr: "Créer et façonner des tableaux", en: "Creating and shaping arrays" },
        duration: "30 min",
        objectives: {
          fr: [
            "Créer des tableaux avec array, arange, linspace, zeros",
            "Lire shape, ndim, size et dtype",
            "Distinguer liste et tableau NumPy",
            "Remodeler avec reshape, swapaxes et .T",
          ],
          en: [
            "Create arrays with array, arange, linspace, zeros",
            "Read shape, ndim, size and dtype",
            "Tell a list and a NumPy array apart",
            "Reshape with reshape, swapaxes and .T",
          ],
        },
        theory: { fr: arraysFr, en: arraysEn },
      },
      {
        id: "m8-l2",
        number: "8.2",
        title: { fr: "Axes, indexation et découpage", en: "Axes, indexing and slicing" },
        duration: "35 min",
        objectives: {
          fr: [
            "Agréger le long d'un axe (axis=0 / 1)",
            "Indexer avec a[i, j]",
            "Extraire lignes, colonnes et sous-tableaux",
            "Distinguer vue et copie",
          ],
          en: [
            "Aggregate along an axis (axis=0 / 1)",
            "Index with a[i, j]",
            "Extract rows, columns and subarrays",
            "Tell a view from a copy",
          ],
        },
        theory: { fr: indexingFr, en: indexingEn },
      },
      {
        id: "m8-l3",
        number: "8.3",
        title: { fr: "Calcul vectorisé et broadcasting", en: "Vectorised computing and broadcasting" },
        duration: "40 min",
        objectives: {
          fr: [
            "Calculer élément par élément sans boucle",
            "Appliquer les règles du broadcasting",
            "Utiliser le produit matriciel @",
            "Mesurer le gain par rapport à une boucle",
          ],
          en: [
            "Compute element-wise without loops",
            "Apply the broadcasting rules",
            "Use the matrix product @",
            "Measure the gain over a loop",
          ],
        },
        theory: { fr: broadcastingFr, en: broadcastingEn },
      },
      {
        id: "m8-l4",
        number: "8.4",
        title: { fr: "Masques, tri et tableaux structurés", en: "Masks, sorting and structured arrays" },
        duration: "35 min",
        objectives: {
          fr: [
            "Filtrer avec un masque booléen",
            "Combiner des conditions avec & | ~",
            "Trier, transposer, concaténer",
            "Manipuler un tableau structuré",
          ],
          en: [
            "Filter with a boolean mask",
            "Combine conditions with & | ~",
            "Sort, transpose, concatenate",
            "Handle a structured array",
          ],
        },
        theory: { fr: masksFr, en: masksEn },
      },
      {
        id: "m8-l5",
        number: "8.5",
        title: { fr: "Aléatoire et simulations", en: "Randomness and simulations" },
        duration: "40 min",
        objectives: {
          fr: [
            "Tirer des nombres avec un générateur reproductible",
            "Estimer π par la méthode de Monte-Carlo",
            "Simuler une expérience pour estimer une probabilité",
            "Étudier la convergence de séries",
          ],
          en: [
            "Draw numbers with a reproducible generator",
            "Estimate π with the Monte-Carlo method",
            "Simulate an experiment to estimate a probability",
            "Study the convergence of series",
          ],
        },
        theory: { fr: simulationFr, en: simulationEn },
      },
    ],
  },
  exercises,
  exercisesEn,
);
