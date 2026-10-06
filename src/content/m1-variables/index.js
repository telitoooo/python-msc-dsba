import { defineModule } from "../i18n.js";
import exercises from "./exercises.js";
import exercisesEn from "./exercises.en.js";
import decouvrirFr from "./00-decouvrir.md?raw";
import decouvrirEn from "./00-decouvrir.en.md?raw";
import variablesTypesFr from "./01-variables-types.md?raw";
import variablesTypesEn from "./01-variables-types.en.md?raw";
import operateursFr from "./02-operateurs.md?raw";
import operateursEn from "./02-operateurs.en.md?raw";
import chainesFr from "./03-chaines.md?raw";
import chainesEn from "./03-chaines.en.md?raw";
import conversionsFr from "./04-conversions.md?raw";
import conversionsEn from "./04-conversions.en.md?raw";

// Les identifiants des leçons (m1-l0, m1-l1…) ne changent jamais : ils servent de clés
// à la progression enregistrée. Seuls les numéros affichés (1.1, 1.2…) peuvent évoluer.
export default defineModule(
  {
    id: "m1",
    number: 1,
    session: 1,
    title: { fr: "Variables, types et expressions", en: "Variables, types and expressions" },
    shortTitle: { fr: "Variables & types", en: "Variables & types" },
    description: {
      fr: "Séance 1 : découvrir Python et son écosystème, puis les briques de base : variables, types élémentaires (int, float, complex, bool, str, None), opérateurs, chaînes de caractères et conversions.",
      en: "Session 1: discovering Python and its ecosystem, then the building blocks: variables, elementary types (int, float, complex, bool, str, None), operators, strings and conversions.",
    },
    lessons: [
      {
        id: "m1-l0",
        number: "1.1",
        title: { fr: "Découvrir Python", en: "Discovering Python" },
        duration: "25 min",
        objectives: {
          fr: [
            "Situer Python : interprété, multi-paradigme",
            "Exécuter du code : console, script, -m, notebook",
            "Installer des bibliothèques avec pip (requirements.txt)",
            "Connaître les règles de syntaxe et la documentation",
          ],
          en: [
            "Place Python: interpreted, multi-paradigm",
            "Run code: console, script, -m, notebook",
            "Install libraries with pip (requirements.txt)",
            "Know the syntax rules and the documentation",
          ],
        },
        theory: { fr: decouvrirFr, en: decouvrirEn },
      },
      {
        id: "m1-l1",
        number: "1.2",
        title: { fr: "Variables et types de base", en: "Variables and basic types" },
        duration: "25 min",
        objectives: {
          fr: [
            "Créer et réaffecter des variables",
            "Reconnaître int, float, complex, bool, str et None",
            "Comprendre le typage dynamique et le duck typing",
            "Distinguer égalité (==) et identité (is, id)",
          ],
          en: [
            "Create and rebind variables",
            "Recognise int, float, complex, bool, str and None",
            "Understand dynamic typing and duck typing",
            "Tell equality (==) from identity (is, id)",
          ],
        },
        theory: { fr: variablesTypesFr, en: variablesTypesEn },
      },
      {
        id: "m1-l2",
        number: "1.3",
        title: { fr: "Opérateurs et expressions", en: "Operators and expressions" },
        duration: "30 min",
        objectives: {
          fr: [
            "Maîtriser /, //, %, ** et divmod",
            "Utiliser abs, pow, round et les nombres complexes",
            "Écrire des comparaisons et des expressions booléennes",
            "Comprendre le court-circuit et le piège des flottants",
          ],
          en: [
            "Master /, //, %, ** and divmod",
            "Use abs, pow, round and complex numbers",
            "Write comparisons and boolean expressions",
            "Understand short circuit and the floating-point trap",
          ],
        },
        theory: { fr: operateursFr, en: operateursEn },
      },
      {
        id: "m1-l3",
        number: "1.4",
        title: { fr: "Chaînes de caractères", en: "Strings" },
        duration: "35 min",
        objectives: {
          fr: [
            "Indexer et découper une chaîne (slicing)",
            "Utiliser les séquences d'échappement",
            "Utiliser les méthodes strip, split, join, center…",
            "Formater du texte avec les f-strings",
          ],
          en: [
            "Index and slice a string",
            "Use escape sequences",
            "Use the methods strip, split, join, center…",
            "Format text with f-strings",
          ],
        },
        theory: { fr: chainesFr, en: chainesEn },
      },
      {
        id: "m1-l4",
        number: "1.5",
        title: { fr: "Conversions et saisie", en: "Conversions and input" },
        duration: "30 min",
        objectives: {
          fr: [
            "Convertir avec int(), float(), str(), bool()",
            "Passer d'une base à l'autre, utiliser ord() et chr()",
            "Lire une saisie avec input()",
            "Connaître les valeurs « fausses » en Python",
          ],
          en: [
            "Convert with int(), float(), str(), bool()",
            "Switch between bases, use ord() and chr()",
            "Read user input with input()",
            "Know the “falsy” values in Python",
          ],
        },
        theory: { fr: conversionsFr, en: conversionsEn },
      },
    ],
  },
  exercises,
  exercisesEn,
);
