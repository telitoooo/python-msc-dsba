// Exporte tous les exercices (src/content/*/exercises.js) dans scripts/content.json,
// pour que scripts/verify_content.py puisse vérifier les solutions avec Python.
import { existsSync, readdirSync, writeFileSync } from "node:fs";

const contentDir = new URL("../src/content/", import.meta.url);
const all = {};

for (const entry of readdirSync(contentDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = new URL(`${entry.name}/exercises.js`, contentDir);
  if (!existsSync(file)) continue;
  const { default: exercises } = await import(file);
  Object.assign(all, exercises);
}

writeFileSync(new URL("./content.json", import.meta.url), JSON.stringify(all, null, 2));
console.log(`${Object.keys(all).length} leçons exportées vers scripts/content.json`);
