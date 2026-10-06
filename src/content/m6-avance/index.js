import { defineModule } from "../i18n.js";
import exercises from "./exercises.js";
import exercisesEn from "./exercises.en.js";
import executionFr from "./01-execution.md?raw";
import executionEn from "./01-execution.en.md?raw";
import porteesFr from "./02-portees.md?raw";
import porteesEn from "./02-portees.en.md?raw";
import aliasingFr from "./03-aliasing.md?raw";
import aliasingEn from "./03-aliasing.en.md?raw";
import argumentsFr from "./04-arguments.md?raw";
import argumentsEn from "./04-arguments.en.md?raw";
import recursiviteFr from "./05-recursivite.md?raw";
import recursiviteEn from "./05-recursivite.en.md?raw";

export default defineModule(
  {
    id: "m6",
    number: 6,
    session: 4,
    title: { fr: "Fonctions avancées, portées et mutabilité", en: "Advanced functions, scopes and mutability" },
    shortTitle: { fr: "Fonctions avancées", en: "Advanced functions" },
    description: {
      fr: "Séance 4 : comment l'interpréteur exécute un programme, fonctions de première classe et fermetures, global et nonlocal, identité et copies, pièges des arguments, récursivité.",
      en: "Session 4: how the interpreter runs a program, first-class functions and closures, global and nonlocal, identity and copies, argument traps, recursion.",
    },
    lessons: [
      {
        id: "m6-l1",
        number: "6.1",
        title: { fr: "L'interpréteur et les fonctions-valeurs", en: "The interpreter and functions as values" },
        duration: "35 min",
        objectives: {
          fr: [
            "Comprendre ce qu'est un programme et comment on le lance",
            "Suivre l'exécution d'un script ligne par ligne",
            "Distinguer mots-clés et fonctions intégrées",
            "Passer et renvoyer des fonctions, écrire des lambda",
          ],
          en: [
            "Understand what a program is and how to run it",
            "Follow the execution of a script line by line",
            "Tell keywords and built-in functions apart",
            "Pass and return functions, write lambdas",
          ],
        },
        theory: { fr: executionFr, en: executionEn },
      },
      {
        id: "m6-l2",
        number: "6.2",
        title: { fr: "Portées et fermetures", en: "Scopes and closures" },
        duration: "35 min",
        objectives: {
          fr: [
            "Modifier une variable avec global ou nonlocal",
            "Créer des usines à fonctions (closures)",
            "Remplacer une globale par une fermeture",
            "Éviter le piège de la liaison tardive",
          ],
          en: [
            "Modify a variable with global or nonlocal",
            "Create function factories (closures)",
            "Replace a global with a closure",
            "Avoid the late binding trap",
          ],
        },
        theory: { fr: porteesFr, en: porteesEn },
      },
      {
        id: "m6-l3",
        number: "6.3",
        title: { fr: "Identité, alias et copies", en: "Identity, aliases and copies" },
        duration: "35 min",
        objectives: {
          fr: [
            "Distinguer == et is, utiliser id()",
            "Comprendre mutable et immuable",
            "Prévoir les effets de l'aliasing",
            "Choisir entre copy et deepcopy, définir __eq__",
          ],
          en: [
            "Tell == and is apart, use id()",
            "Understand mutable and immutable",
            "Predict the effects of aliasing",
            "Choose between copy and deepcopy, define __eq__",
          ],
        },
        theory: { fr: aliasingFr, en: aliasingEn },
      },
      {
        id: "m6-l4",
        number: "6.4",
        title: { fr: "Arguments : pièges et souplesse", en: "Arguments: traps and flexibility" },
        duration: "30 min",
        objectives: {
          fr: [
            "Éviter les valeurs par défaut mutables",
            "Utiliser *args et **kwargs",
            "Déclarer des paramètres nommés obligatoires",
            "Déballer une liste ou un dict à l'appel",
          ],
          en: [
            "Avoid mutable default values",
            "Use *args and **kwargs",
            "Declare keyword-only parameters",
            "Unpack a list or a dict at the call",
          ],
        },
        theory: { fr: argumentsFr, en: argumentsEn },
      },
      {
        id: "m6-l5",
        number: "6.5",
        title: { fr: "Récursivité", en: "Recursion" },
        duration: "40 min",
        objectives: {
          fr: [
            "Écrire un cas de base et un cas récursif",
            "Comprendre la pile d'appels",
            "Comparer récursif, itératif et mémoïsé",
            "Parcourir une arborescence, faire du backtracking",
          ],
          en: [
            "Write a base case and a recursive case",
            "Understand the call stack",
            "Compare recursive, iterative and memoised",
            "Walk a file tree, do backtracking",
          ],
        },
        theory: { fr: recursiviteFr, en: recursiviteEn },
      },
    ],
  },
  exercises,
  exercisesEn,
);
