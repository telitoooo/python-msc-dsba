import { defineModule } from "../i18n.js";
import exercises from "./exercises.js";
import exercisesEn from "./exercises.en.js";
import listesFr from "./01-listes.md?raw";
import listesEn from "./01-listes.en.md?raw";
import tuplesFr from "./02-tuples.md?raw";
import tuplesEn from "./02-tuples.en.md?raw";
import dictionnairesFr from "./03-dictionnaires.md?raw";
import dictionnairesEn from "./03-dictionnaires.en.md?raw";
import ensemblesFr from "./04-ensembles.md?raw";
import ensemblesEn from "./04-ensembles.en.md?raw";
import comprehensionsFr from "./05-comprehensions.md?raw";
import comprehensionsEn from "./05-comprehensions.en.md?raw";

export default defineModule(
  {
    id: "m4",
    number: 4,
    session: 2,
    title: { fr: "Structures de données", en: "Data structures" },
    shortTitle: { fr: "Structures de données", en: "Data structures" },
    description: {
      fr: "Séance 2 : organiser l'information avec les listes, tuples, dictionnaires et ensembles (jeu de cartes, login, distances, pays voisins), et les transformer efficacement grâce aux compréhensions.",
      en: "Session 2: organising information with lists, tuples, dictionaries and sets (deck of cards, login, distances, neighbouring countries), and transforming it efficiently with comprehensions.",
    },
    lessons: [
      {
        id: "m4-l1",
        number: "4.1",
        title: { fr: "Listes", en: "Lists" },
        duration: "40 min",
        objectives: {
          fr: [
            "Créer, indexer, découper et modifier une liste",
            "Utiliser append, pop, remove, sort…",
            "Distinguer sorted() et .sort()",
            "Éviter le piège de l'alias",
          ],
          en: [
            "Create, index, slice and modify a list",
            "Use append, pop, remove, sort…",
            "Tell sorted() and .sort() apart",
            "Avoid the alias trap",
          ],
        },
        theory: { fr: listesFr, en: listesEn },
      },
      {
        id: "m4-l2",
        number: "4.2",
        title: { fr: "Tuples", en: "Tuples" },
        duration: "30 min",
        objectives: {
          fr: [
            "Créer des tuples et comprendre leur immuabilité",
            "Déballer avec a, b = t et *reste",
            "Renvoyer plusieurs valeurs (ou None)",
            "Trier avec key=lambda",
          ],
          en: [
            "Create tuples and understand their immutability",
            "Unpack with a, b = t and *rest",
            "Return several values (or None)",
            "Sort with key=lambda",
          ],
        },
        theory: { fr: tuplesFr, en: tuplesEn },
      },
      {
        id: "m4-l3",
        number: "4.3",
        title: { fr: "Dictionnaires", en: "Dictionaries" },
        duration: "40 min",
        objectives: {
          fr: [
            "Accéder, ajouter et supprimer des clés",
            "Parcourir avec keys(), values(), items()",
            "Compter et regrouper des données",
            "Comprendre le hachage et les clés tuples",
          ],
          en: [
            "Access, add and delete keys",
            "Loop with keys(), values(), items()",
            "Count and group data",
            "Understand hashing and tuple keys",
          ],
        },
        theory: { fr: dictionnairesFr, en: dictionnairesEn },
      },
      {
        id: "m4-l4",
        number: "4.4",
        title: { fr: "Ensembles (sets)", en: "Sets" },
        duration: "30 min",
        objectives: {
          fr: [
            "Dédoublonner avec set()",
            "Calculer union, intersection, différence",
            "Tester l'appartenance efficacement",
            "Modéliser un graphe de voisins",
          ],
          en: [
            "Deduplicate with set()",
            "Compute union, intersection, difference",
            "Test membership efficiently",
            "Model a graph of neighbours",
          ],
        },
        theory: { fr: ensemblesFr, en: ensemblesEn },
      },
      {
        id: "m4-l5",
        number: "4.5",
        title: { fr: "Compréhensions", en: "Comprehensions" },
        duration: "35 min",
        objectives: {
          fr: [
            "Écrire des compréhensions de liste",
            "Filtrer et transformer en une ligne",
            "Construire des dict et des set en compréhension",
            "Utiliser les expressions génératrices",
          ],
          en: [
            "Write list comprehensions",
            "Filter and transform in one line",
            "Build dicts and sets by comprehension",
            "Use generator expressions",
          ],
        },
        theory: { fr: comprehensionsFr, en: comprehensionsEn },
      },
    ],
  },
  exercises,
  exercisesEn,
);
