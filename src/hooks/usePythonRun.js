import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { pythonRunner } from "../lib/pythonRunner.js";
import { RUN_TIMEOUT_MS } from "../lib/config.js";
import { useLang } from "../i18n/LanguageContext.jsx";

/** État global de l'interpréteur : "loading" | "ready" | "error". */
export function usePythonStatus() {
  return useSyncExternalStore(pythonRunner.subscribe, pythonRunner.getSnapshot);
}

const SYSTEM_MESSAGES = {
  timeout: (t, ms) => t("msgTimeout", { s: ms / 1000 }),
  stopped: (t) => t("msgStopped"),
  unavailable: (t, _, msg) => t("msgUnavailable", { msg: msg ?? "" }),
};

/** Une exécution est en cours (en file d'attente, chargement des bibliothèques ou exécution). */
export const isBusy = (state) => state === "queued" || state === "loading" || state === "running";

/**
 * Gère une exécution de code et la sortie du terminal associée.
 *
 * state : "idle" | "queued" | "loading" | "running" | "done"
 * chunks : [{ stream: "stdout" | "stderr" | "stdin" | "system" | "image", text }]
 *          (pour "image", text est une URL data:image/png;base64,…)
 */
export function usePythonRun() {
  const [chunks, setChunks] = useState([]);
  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null);
  const { lang, t } = useLang();
  const buffer = useRef([]);
  const frame = useRef(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      cancelAnimationFrame(frame.current);
    };
  }, []);

  // Regroupe les écritures et ne met à jour React qu'une fois par frame.
  const flush = useCallback(() => {
    frame.current = 0;
    if (!mounted.current || buffer.current.length === 0) return;
    const pending = buffer.current;
    buffer.current = [];
    setChunks((prev) => {
      const next = prev.slice();
      for (const c of pending) {
        const last = next[next.length - 1];
        if (last && last.stream === c.stream && c.stream !== "image") {
          next[next.length - 1] = { ...last, text: last.text + c.text };
        } else {
          next.push(c);
        }
      }
      return next;
    });
  }, []);

  const push = useCallback(
    (stream, text) => {
      buffer.current.push({ stream, text });
      if (!frame.current) frame.current = requestAnimationFrame(flush);
    },
    [flush],
  );

  const run = useCallback(
    async ({ code, stdin = "", tests = null, files = null, timeoutMs = RUN_TIMEOUT_MS }) => {
      buffer.current = [];
      setChunks([]);
      setResult(null);
      setState("queued");
      const res = await pythonRunner.run({
        code,
        stdin,
        tests,
        files,
        lang,
        timeoutMs,
        onLoading: () => mounted.current && setState("loading"),
        onStart: () => mounted.current && setState("running"),
        onOutput: push,
      });
      if (res.status !== "done") push("system", SYSTEM_MESSAGES[res.status](t, timeoutMs, res.message));
      cancelAnimationFrame(frame.current);
      flush();
      if (mounted.current) {
        setResult(res);
        setState("done");
      }
      return res;
    },
    [flush, push, lang, t],
  );

  const clear = useCallback(() => {
    buffer.current = [];
    setChunks([]);
    setResult(null);
    setState("idle");
  }, []);

  const stop = useCallback(() => pythonRunner.stop(), []);

  return { chunks, state, result, run, clear, stop };
}
