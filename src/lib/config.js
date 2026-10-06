/** Version de Pyodide chargée depuis le CDN jsDelivr (Python 3.14). */
export const PYODIDE_VERSION = "314.0.7";
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/** Délai maximal d'exécution avant interruption automatique (boucle infinie…). */
export const RUN_TIMEOUT_MS = 10_000;
export const VERIFY_TIMEOUT_MS = 30_000;
/** Délai maximal de chargement des bibliothèques (numpy, pandas… au premier import). */
export const LIBRARY_TIMEOUT_MS = 120_000;

/** Préfixe de toutes les clés localStorage de l'application. */
export const STORAGE_PREFIX = "pylab:";
