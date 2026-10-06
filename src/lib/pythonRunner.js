import { LIBRARY_TIMEOUT_MS, RUN_TIMEOUT_MS } from "./config.js";

/**
 * Pilote le Web Worker Pyodide depuis le thread principal.
 *
 * Un seul interpréteur est partagé par toute l'application : les exécutions
 * sont mises en file d'attente par le worker. `run()` ne rejette jamais, il
 * résout avec un objet `{ status, ... }` :
 *   - "done"        → { error, tests, files, duration }
 *   - "timeout"     → le délai maximal a été dépassé (worker redémarré)
 *                     ou le chargement des bibliothèques a échoué à temps
 *   - "stopped"     → l'utilisateur a cliqué sur « Arrêter »
 *   - "unavailable" → Pyodide n'a pas pu être chargé (hors ligne ?)
 */
class PythonRunner {
  #listeners = new Set();
  #pending = new Map();
  #nextId = 1;
  #worker = null;

  snapshot = { status: "loading", message: null, busy: false };

  constructor() {
    this.#spawn();
  }

  // --- abonnement (pour useSyncExternalStore) --------------------------------
  subscribe = (listener) => {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  };

  getSnapshot = () => this.snapshot;

  #update(patch) {
    this.snapshot = { ...this.snapshot, ...patch };
    this.#listeners.forEach((l) => l());
  }

  // --- cycle de vie du worker ---------------------------------------------
  #spawn() {
    this.#worker = new Worker(new URL("./pyodide.worker.js", import.meta.url), { type: "module" });
    this.#worker.onmessage = (event) => this.#handle(event.data);
    this.#worker.onerror = (event) => {
      this.#fail(event.message || "Le worker Python a planté.");
    };
    this.#update({ status: "loading", message: null, busy: false });
  }

  #restart(reason) {
    this.#worker.terminate();
    for (const p of this.#pending.values()) {
      clearTimeout(p.timer);
      p.resolve({ status: reason });
    }
    this.#pending.clear();
    this.#spawn();
  }

  #fail(message) {
    this.#update({ status: "error", message, busy: false });
    for (const p of this.#pending.values()) {
      clearTimeout(p.timer);
      p.resolve({ status: "unavailable", message });
    }
    this.#pending.clear();
  }

  #handle(msg) {
    const p = this.#pending.get(msg.id);
    switch (msg.type) {
      case "ready":
        this.#update({ status: "ready", message: null });
        break;
      case "init-error":
        this.#fail(msg.message);
        break;
      case "loading":
        // Chargement de numpy, pandas… : délai généreux, indépendant du délai d'exécution.
        if (!p) break;
        p.timer = setTimeout(() => this.#restart("timeout"), LIBRARY_TIMEOUT_MS);
        p.onLoading?.();
        break;
      case "started":
        if (!p) break;
        clearTimeout(p.timer);
        p.timer = setTimeout(() => this.#restart("timeout"), p.timeoutMs);
        p.onStart?.();
        break;
      case "output":
        p?.onOutput?.(msg.stream, msg.text);
        break;
      case "result":
        if (!p) break;
        clearTimeout(p.timer);
        this.#pending.delete(msg.id);
        this.#update({ busy: this.#pending.size > 0 });
        p.resolve({ status: "done", error: msg.error, tests: msg.tests, files: msg.files, duration: msg.duration });
        break;
    }
  }

  // --- API publique ---------------------------------------------------------
  /**
   * files (facultatif) : { data: {chemin: texte}, modules: {nom.py: code} }
   * lang : langue des messages produits par Python ("fr" | "en")
   */
  run({ code, stdin = "", tests = null, files = null, lang = "fr", onOutput, onLoading, onStart, timeoutMs = RUN_TIMEOUT_MS }) {
    if (this.snapshot.status === "error") {
      return Promise.resolve({ status: "unavailable", message: this.snapshot.message });
    }
    const id = this.#nextId++;
    return new Promise((resolve) => {
      this.#pending.set(id, { resolve, onOutput, onLoading, onStart, timeoutMs, timer: null });
      this.#update({ busy: true });
      this.#worker.postMessage({ type: "run", id, code, stdin, tests, files, lang });
    });
  }

  /** Interrompt l'exécution en cours (et la file d'attente) puis recharge Python. */
  stop() {
    this.#restart("stopped");
  }

  /** Nouvelle tentative après un échec de chargement. */
  retry() {
    this.#restart("stopped");
  }
}

export const pythonRunner = new PythonRunner();
