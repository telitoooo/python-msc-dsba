/**
 * Web Worker qui héberge l'interpréteur Python (Pyodide).
 *
 * Exécuter Python hors du thread principal garde l'interface fluide et permet
 * d'interrompre une boucle infinie en terminant simplement le worker.
 *
 * Avant chaque exécution, les bibliothèques importées par le code (numpy,
 * pandas, matplotlib, PIL…) sont chargées automatiquement ; flask et seaborn,
 * absents de la distribution Pyodide, sont installés depuis PyPI avec micropip.
 *
 * Protocole :
 *   → { type: "run", id, code, stdin, tests, files, lang }
 *   ← { type: "ready" } | { type: "init-error", message }
 *   ← { type: "loading", id }                      (chargement de bibliothèques)
 *   ← { type: "started", id } | { type: "output", id, stream, text }
 *   ← { type: "result", id, error, tests, files, duration }
 */
import RUNNER_SOURCE from "./runner.py?raw";
import { PYODIDE_INDEX_URL } from "./config.js";

/** Paquets absents de Pyodide : nom importé → nom PyPI. */
const PYPI_PACKAGES = { flask: "flask", seaborn: "seaborn" };

const LOADING_MESSAGE = {
  fr: (names) => `📦 Chargement de ${names}…\n`,
  en: (names) => `📦 Loading ${names}…\n`,
};

let currentId = null;
let pyodide = null;
const installedFromPyPI = new Set();

function emit(stream, text) {
  self.postMessage({ type: "output", id: currentId, stream, text });
}

async function init() {
  const { loadPyodide } = await import(/* @vite-ignore */ `${PYODIDE_INDEX_URL}pyodide.mjs`);
  pyodide = await loadPyodide({ indexURL: PYODIDE_INDEX_URL });
  pyodide.globals.set("_js_emit", emit);
  pyodide.runPython(RUNNER_SOURCE);
  return pyodide.globals.get("run");
}

const ready = init().then(
  (runFn) => {
    self.postMessage({ type: "ready" });
    return runFn;
  },
  (err) => {
    self.postMessage({ type: "init-error", message: String(err?.message ?? err) });
    throw err;
  },
);

const importsPackage = (source, name) => new RegExp(`^\\s*(?:import|from)\\s+${name}\\b`, "m").test(source);

/** Charge les bibliothèques utilisées par le code (une seule fois par session). */
async function loadLibraries(source, lang) {
  const say = LOADING_MESSAGE[lang] ?? LOADING_MESSAGE.fr;
  let announced = false;
  const announce = (names) => {
    if (!announced) self.postMessage({ type: "loading", id: currentId }); // le délai max ne court pas encore
    announced = true;
    emit("system", say(names));
  };
  const options = {
    messageCallback: (msg) => {
      if (msg.startsWith("Loading ")) announce(msg.slice(8));
    },
    errorCallback: (msg) => emit("stderr", `${msg}\n`),
  };
  // df.plot() importe matplotlib « en coulisses » : on l'anticipe.
  const extra = /\bpandas\b/.test(source) && /\.plot\b|\.hist\(/.test(source) ? "\nimport matplotlib" : "";
  await pyodide.loadPackagesFromImports(source + extra, options);

  const fromPyPI = Object.keys(PYPI_PACKAGES).filter(
    (name) => importsPackage(source, name) && !installedFromPyPI.has(name),
  );
  if (fromPyPI.length > 0) {
    announce(fromPyPI.join(", ") + " (PyPI)");
    await pyodide.loadPackage("micropip", options);
    const micropip = pyodide.pyimport("micropip");
    try {
      await micropip.install(fromPyPI.map((name) => PYPI_PACKAGES[name]));
      fromPyPI.forEach((name) => installedFromPyPI.add(name));
    } finally {
      micropip.destroy();
    }
  }
}

// Les exécutions sont traitées une par une, dans l'ordre d'arrivée
// (le chargement des bibliothèques est asynchrone).
let queue = Promise.resolve();

self.onmessage = ({ data }) => {
  if (data.type === "run") queue = queue.then(() => handleRun(data));
};

async function handleRun(data) {
  let runFn;
  try {
    runFn = await ready;
  } catch {
    return; // l'erreur d'initialisation a déjà été signalée
  }

  currentId = data.id;
  const lang = data.lang ?? "fr";
  const source = [data.code, ...Object.values(data.files?.modules ?? {})].join("\n");
  try {
    await loadLibraries(source, lang);
  } catch (err) {
    // Hors ligne ou paquet introuvable : l'import échouera avec une erreur explicite.
    // (Une erreur de syntaxe sera, elle, signalée proprement par runner.py.)
    const message = String(err?.message ?? err);
    if (!message.includes("SyntaxError")) emit("stderr", `${message.split("\n")[0]}\n`);
  }

  self.postMessage({ type: "started", id: data.id });
  const t0 = performance.now();
  try {
    const raw = runFn(
      data.code,
      data.stdin ?? "",
      JSON.stringify(data.tests ?? null),
      JSON.stringify(data.files ?? null),
      lang,
    );
    const { error, tests, files } = JSON.parse(raw);
    self.postMessage({ type: "result", id: data.id, error, tests, files, duration: performance.now() - t0 });
  } catch (err) {
    // Erreur interne inattendue (ne devrait pas arriver : runner.py intercepte tout).
    self.postMessage({
      type: "result",
      id: data.id,
      error: { type: "InternalError", message: String(err?.message ?? err), line: null },
      tests: null,
      files: [],
      duration: performance.now() - t0,
    });
  } finally {
    currentId = null;
  }
}
