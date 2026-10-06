/**
 * Contenu bilingue.
 *
 * Les exercices sont écrits en français dans `exercises.js` (avec le code, les
 * tests et les fichiers). Leur traduction anglaise vit à côté, dans
 * `exercises.en.js`, qui ne contient QUE les textes :
 *
 *   export default {
 *     "m7-l1": {
 *       ex1: {
 *         title: "…", intro: "…",
 *         core: { title, prompt, hint, explanation, tests: ["libellé 1", "libellé 2", …] },
 *         extra: { … }, stretch: { … },
 *       },
 *     },
 *   };
 *
 * `defineModule` fusionne les deux : chaque texte devient un objet { fr, en },
 * que les composants affichent avec `tr()` (voir src/i18n/LanguageContext.jsx).
 * Une traduction manquante retombe sur le français (et `npm run check-content` la signale).
 */
const TEXT_FIELDS = ["title", "prompt", "hint", "explanation"];

const pair = (fr, en) => (fr === undefined ? undefined : en === undefined ? fr : { fr, en });

function mergeTier(tier, en = {}) {
  const merged = { ...tier };
  for (const field of TEXT_FIELDS) merged[field] = pair(tier[field], en[field]);
  merged.tests = (tier.tests ?? []).map((t, i) => ({ ...t, label: pair(t.label, en.tests?.[i]) }));
  return merged;
}

export function mergeExercises(exercises = [], english = {}) {
  return exercises.map((ex) => {
    const en = english[ex.id] ?? {};
    return {
      ...ex,
      title: pair(ex.title, en.title),
      intro: pair(ex.intro, en.intro),
      tiers: Object.fromEntries(Object.entries(ex.tiers).map(([id, tier]) => [id, mergeTier(tier, en[id])])),
    };
  });
}

/**
 * Déclare un module : métadonnées bilingues + leçons, auxquelles on rattache
 * les exercices de `exercises.js` traduits par `exercises.en.js`.
 */
export function defineModule(module, exercises, english = {}) {
  return {
    ...module,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      exercises: mergeExercises(exercises[lesson.id], english[lesson.id]),
    })),
  };
}
