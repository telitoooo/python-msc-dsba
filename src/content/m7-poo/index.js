import { defineModule } from "../i18n.js";
import exercises from "./exercises.js";
import exercisesEn from "./exercises.en.js";
import classesFr from "./01-classes.md?raw";
import classesEn from "./01-classes.en.md?raw";
import specialFr from "./02-methodes-speciales.md?raw";
import specialEn from "./02-methodes-speciales.en.md?raw";
import inheritanceFr from "./03-heritage.md?raw";
import inheritanceEn from "./03-heritage.en.md?raw";
import membersFr from "./04-attributs-composition.md?raw";
import membersEn from "./04-attributs-composition.en.md?raw";
import guiFr from "./05-architecture-gui.md?raw";
import guiEn from "./05-architecture-gui.en.md?raw";

export default defineModule(
  {
    id: "m7",
    number: 7,
    session: 5,
    title: { fr: "Programmation orientée objet et interfaces graphiques", en: "Object-oriented programming and GUIs" },
    shortTitle: { fr: "POO & interfaces", en: "OOP & GUIs" },
    description: {
      fr: "Séance 5 : classes, objets et instances, méthodes spéciales, héritage et polymorphisme, attributs de classe et composition, architecture 3 tiers, MVC et callbacks d'une interface tkinter.",
      en: "Session 5: classes, objects and instances, special methods, inheritance and polymorphism, class attributes and composition, 3-tier architecture, MVC and tkinter callbacks.",
    },
    lessons: [
      {
        id: "m7-l1",
        number: "7.1",
        title: { fr: "Classes, objets, instances", en: "Classes, objects, instances" },
        duration: "35 min",
        objectives: {
          fr: [
            "Comprendre le paradigme objet et ses 4 piliers",
            "Définir une classe avec __init__ et self",
            "Écrire et appeler des méthodes",
            "Comprendre l'envoi de messages b.f(x)",
          ],
          en: [
            "Understand the object paradigm and its 4 pillars",
            "Define a class with __init__ and self",
            "Write and call methods",
            "Understand message passing b.f(x)",
          ],
        },
        theory: { fr: classesFr, en: classesEn },
      },
      {
        id: "m7-l2",
        number: "7.2",
        title: { fr: "Méthodes spéciales", en: "Special methods" },
        duration: "35 min",
        objectives: {
          fr: [
            "Afficher un objet avec __str__ et __repr__",
            "Comparer par valeur avec __eq__",
            "Utiliser les crochets : __getitem__, __setitem__",
            "Rendre un objet appelable avec __call__",
          ],
          en: [
            "Display an object with __str__ and __repr__",
            "Compare by value with __eq__",
            "Use square brackets: __getitem__, __setitem__",
            "Make an object callable with __call__",
          ],
        },
        theory: { fr: specialFr, en: specialEn },
      },
      {
        id: "m7-l3",
        number: "7.3",
        title: { fr: "Héritage et polymorphisme", en: "Inheritance and polymorphism" },
        duration: "40 min",
        objectives: {
          fr: [
            "Hériter d'une classe et redéfinir une méthode",
            "Appeler la classe mère avec super()",
            "Concevoir une hiérarchie (Shape2D)",
            "Choisir entre héritage et composition",
          ],
          en: [
            "Inherit from a class and override a method",
            "Call the parent class with super()",
            "Design a hierarchy (Shape2D)",
            "Choose between inheritance and composition",
          ],
        },
        theory: { fr: inheritanceFr, en: inheritanceEn },
      },
      {
        id: "m7-l4",
        number: "7.4",
        title: { fr: "Attributs de classe et composition", en: "Class attributes and composition" },
        duration: "40 min",
        objectives: {
          fr: [
            "Distinguer attributs de classe et d'instance",
            "Protéger un attribut avec @property",
            "Écrire un constructeur alternatif (@classmethod)",
            "Composer des objets et les sauvegarder",
          ],
          en: [
            "Tell class and instance attributes apart",
            "Protect an attribute with @property",
            "Write an alternative constructor (@classmethod)",
            "Compose objects and save them",
          ],
        },
        theory: { fr: membersFr, en: membersEn },
      },
      {
        id: "m7-l5",
        number: "7.5",
        title: { fr: "Architecture, MVC et interfaces graphiques", en: "Architecture, MVC and GUIs" },
        duration: "40 min",
        objectives: {
          fr: [
            "Découper une application en 3 tiers",
            "Appliquer le patron MVC",
            "Connaître les widgets et la boucle d'événements de tkinter",
            "Écrire des callbacks de 4 façons",
          ],
          en: [
            "Split an application into 3 tiers",
            "Apply the MVC pattern",
            "Know tkinter widgets and its event loop",
            "Write callbacks in 4 ways",
          ],
        },
        theory: { fr: guiFr, en: guiEn },
      },
    ],
  },
  exercises,
  exercisesEn,
);
