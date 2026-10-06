/**
 * Vérifie la cohérence du contenu, sans exécuter Python :
 *
 * 1. Bilinguisme : chaque titre, objectif, leçon, énoncé, indice, explication et
 *    libellé de test existe en français ET en anglais (mêmes nombres d'éléments).
 * 2. Couverture du cours : chaque notion du plan (src/content/syllabus.js) renvoie
 *    à des leçons existantes, dont le contenu contient bien les mots-clés de la notion ;
 *    chaque leçon du site est rattachée à au moins une notion du cours.
 *
 * Usage : npm run check-content
 */
import { modules } from "../src/content/index.js";
import { SESSIONS } from "../src/content/syllabus.js";

const problems = [];
const warn = (where, message) => problems.push(`${where} : ${message}`);

const isPair = (v) => v && typeof v === "object" && !Array.isArray(v) && "fr" in v && "en" in v;

function checkPair(where, value, { required = true } = {}) {
  if (value === undefined || value === null) {
    if (required) warn(where, "manquant");
    return;
  }
  if (!isPair(value)) return warn(where, "pas de traduction anglaise");
  if (!value.fr || !value.en) warn(where, "texte vide");
  else if (typeof value.fr === "string" && value.fr.trim() === value.en.trim() && value.fr.length > 40) {
    warn(where, "le texte anglais est identique au français");
  }
}

/** Tout le texte d'une leçon (théorie FR + EN, énoncés, code, tests) pour chercher les mots-clés. */
function lessonCorpus(lesson) {
  const parts = [lesson.theory?.fr, lesson.theory?.en];
  for (const ex of lesson.exercises) {
    parts.push(ex.title?.fr, ex.title?.en);
    for (const tier of Object.values(ex.tiers)) {
      for (const field of ["title", "prompt", "hint", "explanation"]) parts.push(tier[field]?.fr, tier[field]?.en);
      parts.push(tier.starter, tier.solution, ...Object.values(tier.modules ?? {}), ...Object.values(tier.solutionModules ?? {}));
      for (const t of tier.tests) parts.push(t.check, t.label?.fr, t.label?.en);
    }
  }
  return parts.filter(Boolean).join("\n");
}

// --- 1. Bilinguisme -----------------------------------------------------------
let lessonCount = 0;
let levelCount = 0;
const lessonsById = new Map();

for (const m of modules) {
  for (const field of ["title", "shortTitle", "description"]) checkPair(`${m.id}.${field}`, m[field]);
  for (const lesson of m.lessons) {
    lessonCount += 1;
    lessonsById.set(lesson.id, lesson);
    const where = lesson.id;
    checkPair(`${where}.title`, lesson.title);
    if (!isPair(lesson.objectives)) warn(`${where}.objectives`, "pas de traduction anglaise");
    else if (lesson.objectives.fr.length !== lesson.objectives.en.length) warn(`${where}.objectives`, "nombre d'objectifs différent FR / EN");
    checkPair(`${where}.theory`, lesson.theory);
    if (isPair(lesson.theory)) {
      const fences = (text) => (text.match(/^```/gm) ?? []).length;
      if (fences(lesson.theory.fr) !== fences(lesson.theory.en)) warn(`${where}.theory`, "nombre de blocs de code différent FR / EN");
      if (/\$[^$`\n]*[\\^_{][^$`\n]*\$/.test(lesson.theory.fr + lesson.theory.en)) warn(`${where}.theory`, "formule LaTeX ($…$) : non rendue par le site");
    }
    if (!lesson.exercises.length) warn(where, "aucun exercice");
    for (const ex of lesson.exercises) {
      const exWhere = `${where}/${ex.id}`;
      checkPair(`${exWhere}.title`, ex.title);
      checkPair(`${exWhere}.intro`, ex.intro, { required: false });
      for (const [tierId, tier] of Object.entries(ex.tiers)) {
        levelCount += 1;
        const tierWhere = `${exWhere}/${tierId}`;
        checkPair(`${tierWhere}.title`, tier.title);
        checkPair(`${tierWhere}.prompt`, tier.prompt);
        checkPair(`${tierWhere}.hint`, tier.hint, { required: false });
        checkPair(`${tierWhere}.explanation`, tier.explanation, { required: false });
        tier.tests.forEach((t, i) => {
          if (!isPair(t.label)) warn(`${tierWhere}.tests[${i}]`, "libellé sans traduction anglaise");
        });
        for (const field of ["prompt", "hint", "explanation"]) {
          const text = [tier[field]?.fr, tier[field]?.en].join("");
          if (/\$[^$`\n]*[\\^_{][^$`\n]*\$/.test(text)) warn(`${tierWhere}.${field}`, "formule LaTeX ($…$) : non rendue par le site");
        }
      }
    }
  }
}

// --- 2. Couverture du cours ------------------------------------------------------
let topicCount = 0;
const referenced = new Set();
const corpusCache = new Map();
const corpus = (id) => {
  if (!corpusCache.has(id)) corpusCache.set(id, lessonCorpus(lessonsById.get(id)));
  return corpusCache.get(id);
};

for (const session of SESSIONS) {
  checkPair(`séance ${session.number}.title`, session.title);
  for (const topic of session.topics) {
    topicCount += 1;
    const where = `séance ${session.number} « ${topic.label?.fr ?? "?"} »`;
    checkPair(`${where}.label`, topic.label);
    if (!topic.lessons?.length) warn(where, "aucune leçon associée");
    for (const id of topic.lessons ?? []) {
      if (!lessonsById.has(id)) warn(where, `leçon inconnue : ${id}`);
      else referenced.add(id);
    }
    const text = (topic.lessons ?? []).filter((id) => lessonsById.has(id)).map(corpus).join("\n");
    for (const keyword of topic.keywords ?? []) {
      if (!new RegExp(keyword, "i").test(text)) warn(where, `mot-clé introuvable dans ses leçons : /${keyword}/`);
    }
    if (!topic.keywords?.length) warn(where, "aucun mot-clé de contrôle");
  }
}
for (const id of lessonsById.keys()) {
  if (!referenced.has(id)) warn(id, "leçon rattachée à aucune notion du plan du cours");
}

// --- Rapport ---------------------------------------------------------------------
console.log(
  `${modules.length} modules, ${lessonCount} leçons, ${levelCount} niveaux d'exercices · ` +
    `plan du cours : ${SESSIONS.length} séances, ${topicCount} notions.`,
);
if (problems.length) {
  console.log(`\n${problems.length} problème(s) :`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log("Tout est bilingue et chaque notion du cours est couverte. ✔");
