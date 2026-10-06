// Permet à Node d'importer les fichiers « ?raw » comme le fait Vite
// (ex. import theorie from "./01-lecon.md?raw"), pour les scripts de vérification.
//   node --import ./scripts/raw-loader.mjs scripts/check-content.mjs
import { register } from "node:module";

register("./raw-hooks.mjs", import.meta.url);
