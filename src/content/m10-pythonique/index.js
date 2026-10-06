import { defineModule } from "../i18n.js";
import exercises from "./exercises.js";
import exercisesEn from "./exercises.en.js";
import iteratorsFr from "./01-iterateurs.md?raw";
import iteratorsEn from "./01-iterateurs.en.md?raw";
import functionalFr from "./02-fonctionnel.md?raw";
import functionalEn from "./02-fonctionnel.en.md?raw";
import reliabilityFr from "./03-fiabilite.md?raw";
import reliabilityEn from "./03-fiabilite.en.md?raw";
import practicesFr from "./04-bonnes-pratiques.md?raw";
import practicesEn from "./04-bonnes-pratiques.en.md?raw";
import efficiencyFr from "./05-efficacite.md?raw";
import efficiencyEn from "./05-efficacite.en.md?raw";

export default defineModule(
  {
    id: "m10",
    number: 10,
    session: 7,
    title: { fr: "Code pythonique, qualité et efficacité", en: "Pythonic code, quality and efficiency" },
    shortTitle: { fr: "Pythonique & efficace", en: "Pythonic & efficient" },
    description: {
      fr: "Séance 7 : générateurs et itérateurs, programmation fonctionnelle et décorateurs, assertions, with, tests unitaires, logging, argparse, PEP 8, annotations de type, match et efficacité (vectorisation, bonnes structures, multiprocessing, Numba).",
      en: "Session 7: generators and iterators, functional programming and decorators, assertions, with, unit tests, logging, argparse, PEP 8, type hints, match and efficiency (vectorisation, data structures, multiprocessing, Numba).",
    },
    lessons: [
      {
        id: "m10-l1",
        number: "10.1",
        title: { fr: "Itérables, générateurs et itérateurs", en: "Iterables, generators and iterators" },
        duration: "35 min",
        objectives: {
          fr: [
            "Comprendre iter(), next() et StopIteration",
            "Choisir entre compréhension et expression génératrice",
            "Écrire une fonction génératrice avec yield",
            "Implémenter __iter__ et __next__",
          ],
          en: [
            "Understand iter(), next() and StopIteration",
            "Choose between a comprehension and a generator expression",
            "Write a generator function with yield",
            "Implement __iter__ and __next__",
          ],
        },
        theory: { fr: iteratorsFr, en: iteratorsEn },
      },
      {
        id: "m10-l2",
        number: "10.2",
        title: { fr: "Programmation fonctionnelle", en: "Functional programming" },
        duration: "35 min",
        objectives: {
          fr: [
            "Utiliser lambda, map, filter, any, all",
            "Trier avec une clé, combiner avec zip",
            "Connaître itertools, functools et Counter",
            "Écrire un décorateur",
          ],
          en: [
            "Use lambda, map, filter, any, all",
            "Sort with a key, combine with zip",
            "Know itertools, functools and Counter",
            "Write a decorator",
          ],
        },
        theory: { fr: functionalFr, en: functionalEn },
      },
      {
        id: "m10-l3",
        number: "10.3",
        title: { fr: "Assertions, tests et logging", en: "Assertions, tests and logging" },
        duration: "40 min",
        objectives: {
          fr: [
            "Vérifier ses hypothèses avec assert",
            "Écrire un gestionnaire de contexte",
            "Écrire des tests unitaires avec unittest",
            "Journaliser avec logging plutôt que print",
          ],
          en: [
            "Check your assumptions with assert",
            "Write a context manager",
            "Write unit tests with unittest",
            "Log with logging rather than print",
          ],
        },
        theory: { fr: reliabilityFr, en: reliabilityEn },
      },
      {
        id: "m10-l4",
        number: "10.4",
        title: { fr: "Ligne de commande et bonnes pratiques", en: "Command line and good practices" },
        duration: "35 min",
        objectives: {
          fr: [
            "Lire des arguments avec argparse",
            "Appliquer PEP 8 et le zen de Python",
            "Documenter avec docstrings et annotations de type",
            "Organiser un projet en paquets",
          ],
          en: [
            "Read arguments with argparse",
            "Apply PEP 8 and the Zen of Python",
            "Document with docstrings and type hints",
            "Organise a project into packages",
          ],
        },
        theory: { fr: practicesFr, en: practicesEn },
      },
      {
        id: "m10-l5",
        number: "10.5",
        title: { fr: "Efficacité des programmes", en: "Program efficiency" },
        duration: "40 min",
        objectives: {
          fr: [
            "Mesurer le temps d'exécution",
            "Choisir la bonne structure de données",
            "Vectoriser avec NumPy et pandas",
            "Connaître multiprocessing et Numba",
          ],
          en: [
            "Measure execution time",
            "Choose the right data structure",
            "Vectorise with NumPy and pandas",
            "Know multiprocessing and Numba",
          ],
        },
        theory: { fr: efficiencyFr, en: efficiencyEn },
      },
    ],
  },
  exercises,
  exercisesEn,
);
