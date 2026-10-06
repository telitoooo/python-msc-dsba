import { defineModule } from "../i18n.js";
import exercises from "./exercises.js";
import exercisesEn from "./exercises.en.js";
import conditionsFr from "./01-conditions.md?raw";
import conditionsEn from "./01-conditions.en.md?raw";
import boucleForFr from "./02-boucle-for.md?raw";
import boucleForEn from "./02-boucle-for.en.md?raw";
import boucleWhileFr from "./03-boucle-while.md?raw";
import boucleWhileEn from "./03-boucle-while.en.md?raw";

export default defineModule(
  {
    id: "m2",
    number: 2,
    session: 1,
    title: { fr: "Structures de contrôle", en: "Control structures" },
    shortTitle: { fr: "Conditions & boucles", en: "Conditions & loops" },
    description: {
      fr: "Séance 1 : faire des choix avec if / elif / else et répéter des actions avec les boucles for et while (break, continue, else) : le cœur de toute logique de programme, avec les hands-on du cours.",
      en: "Session 1: making choices with if / elif / else and repeating actions with for and while loops (break, continue, else): the heart of any program logic, with the course hands-on exercises.",
    },
    lessons: [
      {
        id: "m2-l1",
        number: "2.1",
        title: { fr: "Conditions if / elif / else", en: "Conditions if / elif / else" },
        duration: "30 min",
        objectives: {
          fr: [
            "Écrire des blocs conditionnels correctement indentés",
            "Ordonner une chaîne de elif",
            "Distinguer instructions, expressions et pass",
            "Utiliser l'expression conditionnelle (ternaire)",
          ],
          en: [
            "Write correctly indented conditional blocks",
            "Order an elif chain",
            "Tell statements, expressions and pass apart",
            "Use the conditional (ternary) expression",
          ],
        },
        theory: { fr: conditionsFr, en: conditionsEn },
      },
      {
        id: "m2-l2",
        number: "2.2",
        title: { fr: "La boucle for", en: "The for loop" },
        duration: "35 min",
        objectives: {
          fr: [
            "Parcourir une séquence et un range()",
            "Appliquer les patterns accumulateur et compteur",
            "Imbriquer des boucles",
            "Numéroter avec enumerate()",
          ],
          en: [
            "Loop over a sequence and a range()",
            "Apply the accumulator and counter patterns",
            "Nest loops",
            "Number items with enumerate()",
          ],
        },
        theory: { fr: boucleForFr, en: boucleForEn },
      },
      {
        id: "m2-l3",
        number: "2.3",
        title: { fr: "La boucle while", en: "The while loop" },
        duration: "35 min",
        objectives: {
          fr: [
            "Choisir entre for et while",
            "Contrôler une boucle avec break, continue et else",
            "Émuler do … while et repeat … until",
            "Valider une saisie utilisateur",
          ],
          en: [
            "Choose between for and while",
            "Control a loop with break, continue and else",
            "Emulate do … while and repeat … until",
            "Validate user input",
          ],
        },
        theory: { fr: boucleWhileFr, en: boucleWhileEn },
      },
    ],
  },
  exercises,
  exercisesEn,
);
