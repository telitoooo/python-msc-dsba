import { defineModule } from "../i18n.js";
import exercises from "./exercises.js";
import exercisesEn from "./exercises.en.js";
import definirFr from "./01-definir.md?raw";
import definirEn from "./01-definir.en.md?raw";
import parametresFr from "./02-parametres.md?raw";
import parametresEn from "./02-parametres.en.md?raw";
import porteeFr from "./03-portee.md?raw";
import porteeEn from "./03-portee.en.md?raw";

export default defineModule(
  {
    id: "m3",
    number: 3,
    session: 2,
    title: { fr: "Fonctions", en: "Functions" },
    shortTitle: { fr: "Fonctions", en: "Functions" },
    description: {
      fr: "Séances 1 et 2 : structurer son code en blocs réutilisables, avec la dichotomie du cours : définir une fonction, passer des fonctions en paramètre, valeurs par défaut, pile d'appels et portée des variables.",
      en: "Sessions 1 and 2: structuring code into reusable blocks, with the course's dichotomy example: defining a function, passing functions as parameters, default values, call stack and variable scope.",
    },
    lessons: [
      {
        id: "m3-l1",
        number: "3.1",
        title: { fr: "Définir une fonction", en: "Defining a function" },
        duration: "35 min",
        objectives: {
          fr: [
            "Définir une fonction avec def et la documenter",
            "Distinguer return et print",
            "Remplacer du code répété par une fonction",
            "Comprendre le flot d'exécution et la pile d'appels",
          ],
          en: [
            "Define a function with def and document it",
            "Tell return from print",
            "Replace repeated code with a function",
            "Understand program flow and the call stack",
          ],
        },
        theory: { fr: definirFr, en: definirEn },
      },
      {
        id: "m3-l2",
        number: "3.2",
        title: { fr: "Paramètres et arguments", en: "Parameters and arguments" },
        duration: "35 min",
        objectives: {
          fr: [
            "Appeler avec des arguments positionnels et nommés",
            "Passer une fonction en argument",
            "Définir des valeurs par défaut",
            "Accepter un nombre variable d'arguments (*args, **kwargs)",
          ],
          en: [
            "Call with positional and named arguments",
            "Pass a function as an argument",
            "Define default values",
            "Accept a variable number of arguments (*args, **kwargs)",
          ],
        },
        theory: { fr: parametresFr, en: parametresEn },
      },
      {
        id: "m3-l3",
        number: "3.3",
        title: { fr: "Portée des variables", en: "Variable scope" },
        duration: "30 min",
        objectives: {
          fr: [
            "Distinguer variables locales et globales",
            "Comprendre et corriger une UnboundLocalError",
            "Appliquer la règle LEGB",
            "Écrire des fonctions pures (et une fermeture)",
          ],
          en: [
            "Tell local and global variables apart",
            "Understand and fix an UnboundLocalError",
            "Apply the LEGB rule",
            "Write pure functions (and a closure)",
          ],
        },
        theory: { fr: porteeFr, en: porteeEn },
      },
    ],
  },
  exercises,
  exercisesEn,
);
