import { STORAGE_PREFIX } from "./config.js";

/**
 * Accès sécurisé au localStorage : en navigation privée ou si le stockage est
 * bloqué, les lectures renvoient la valeur par défaut et les écritures sont ignorées.
 */
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    if (value === undefined) localStorage.removeItem(STORAGE_PREFIX + key);
    else localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* stockage indisponible : on continue sans persistance */
  }
}

export function removeKeys(predicate) {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX) && predicate(k.slice(STORAGE_PREFIX.length)))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
