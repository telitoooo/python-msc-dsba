/**
 * Programme du cours. Pour ajouter un module :
 *   1. créer un dossier src/content/mX-nom/ avec un index.js (métadonnées + leçons),
 *      un fichier .md par leçon (rappel théorique) et un exercises.js ;
 *   2. l'ajouter au tableau `modules` ci-dessous ;
 *   3. lancer `npm run verify-content` pour vérifier les solutions.
 */
import m1 from "./m1-variables/index.js";
import m2 from "./m2-controle/index.js";
import m3 from "./m3-fonctions/index.js";
import m4 from "./m4-structures/index.js";
import m5 from "./m5-fichiers/index.js";
import m6 from "./m6-avance/index.js";
import m7 from "./m7-poo/index.js";
import m8 from "./m8-numpy/index.js";
import m9 from "./m9-pandas/index.js";
import m10 from "./m10-pythonique/index.js";
import m11 from "./m11-web/index.js";

export const modules = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11];

export const allLessons = modules.flatMap((m) => m.lessons);

const moduleByLesson = new Map(modules.flatMap((m) => m.lessons.map((l) => [l.id, m])));

/** Leçon + module parent + leçons précédente / suivante (ou null). */
export function findLesson(id) {
  const index = allLessons.findIndex((l) => l.id === id);
  if (index === -1) return null;
  return {
    lesson: allLessons[index],
    module: moduleByLesson.get(id),
    prev: allLessons[index - 1] ?? null,
    next: allLessons[index + 1] ?? null,
  };
}
