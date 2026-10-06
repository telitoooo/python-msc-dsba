import { defineModule } from "../i18n.js";
import exercises from "./exercises.js";
import exercisesEn from "./exercises.en.js";
import fichiersTexteFr from "./01-fichiers-texte.md?raw";
import fichiersTexteEn from "./01-fichiers-texte.en.md?raw";
import systemeFr from "./02-systeme.md?raw";
import systemeEn from "./02-systeme.en.md?raw";
import serialisationFr from "./03-serialisation.md?raw";
import serialisationEn from "./03-serialisation.en.md?raw";
import exceptionsFr from "./04-exceptions.md?raw";
import exceptionsEn from "./04-exceptions.en.md?raw";
import modulesFr from "./05-modules.md?raw";
import modulesEn from "./05-modules.en.md?raw";

export default defineModule(
  {
    id: "m5",
    number: 5,
    session: 3,
    title: { fr: "Fichiers, système, modules et exceptions", en: "Files, system, modules and exceptions" },
    shortTitle: { fr: "Fichiers & modules", en: "Files & modules" },
    description: {
      fr: "Séance 3 : lire et écrire des fichiers, explorer le système de fichiers et l'environnement, sérialiser en JSON ou pickle, gérer les erreurs avec les exceptions et organiser son code en modules.",
      en: "Session 3: reading and writing files, exploring the file system and the environment, serialising with JSON or pickle, handling errors with exceptions and organising code into modules.",
    },
    lessons: [
      {
        id: "m5-l1",
        number: "5.1",
        title: { fr: "Lire et écrire des fichiers", en: "Reading and writing files" },
        duration: "35 min",
        objectives: {
          fr: [
            "Distinguer chemins absolus et relatifs",
            "Ouvrir un fichier avec with et le bon mode",
            "Lire ligne par ligne et écrire du texte",
            "Toujours préciser encoding=\"utf-8\"",
          ],
          en: [
            "Tell absolute and relative paths apart",
            "Open a file with with and the right mode",
            "Read line by line and write text",
            "Always specify encoding=\"utf-8\"",
          ],
        },
        theory: { fr: fichiersTexteFr, en: fichiersTexteEn },
      },
      {
        id: "m5-l2",
        number: "5.2",
        title: { fr: "Système de fichiers et terminal", en: "File system and terminal" },
        duration: "40 min",
        objectives: {
          fr: [
            "Utiliser os et os.path",
            "Chercher des fichiers avec glob",
            "Manipuler les chemins avec pathlib",
            "Lire et modifier les variables d'environnement",
            "Connaître les commandes du terminal",
          ],
          en: [
            "Use os and os.path",
            "Find files with glob",
            "Handle paths with pathlib",
            "Read and modify environment variables",
            "Know the terminal commands",
          ],
        },
        theory: { fr: systemeFr, en: systemeEn },
      },
      {
        id: "m5-l3",
        number: "5.3",
        title: { fr: "Sérialiser : JSON et pickle", en: "Serialising: JSON and pickle" },
        duration: "25 min",
        objectives: {
          fr: [
            "Sauvegarder et recharger avec json",
            "Sauvegarder et recharger avec pickle",
            "Connaître les limites de chaque format",
            "Choisir le bon format selon l'usage",
          ],
          en: [
            "Save and reload with json",
            "Save and reload with pickle",
            "Know the limits of each format",
            "Choose the right format for the job",
          ],
        },
        theory: { fr: serialisationFr, en: serialisationEn },
      },
      {
        id: "m5-l4",
        number: "5.4",
        title: { fr: "Gérer les erreurs : exceptions", en: "Handling errors: exceptions" },
        duration: "35 min",
        objectives: {
          fr: [
            "Intercepter une exception avec try / except",
            "Utiliser else et finally",
            "Lever une exception avec raise",
            "Créer sa propre exception",
          ],
          en: [
            "Catch an exception with try / except",
            "Use else and finally",
            "Raise an exception with raise",
            "Create your own exception",
          ],
        },
        theory: { fr: exceptionsFr, en: exceptionsEn },
      },
      {
        id: "m5-l5",
        number: "5.5",
        title: { fr: "Modules et bibliothèque standard", en: "Modules and the standard library" },
        duration: "40 min",
        objectives: {
          fr: [
            "Importer des modules et créer un package (__init__.py)",
            "Protéger le point d'entrée avec __name__",
            "Éviter le piège des noms de modules",
            "Utiliser datetime, time, collections et argparse",
          ],
          en: [
            "Import modules and create a package (__init__.py)",
            "Protect the entry point with __name__",
            "Avoid the module-name trap",
            "Use datetime, time, collections and argparse",
          ],
        },
        theory: { fr: modulesFr, en: modulesEn },
      },
    ],
  },
  exercises,
  exercisesEn,
);
