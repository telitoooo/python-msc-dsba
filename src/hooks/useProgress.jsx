import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readJSON, removeKeys, writeJSON } from "../lib/storage.js";
import { TIERS } from "../content/tiers.js";

const ProgressContext = createContext(null);

/** Identifiant unique d'un niveau d'exercice, ex. "m1-l1/ex1/core". */
export const tierKey = (lessonId, exerciseId, tier) => `${lessonId}/${exerciseId}/${tier}`;

export function ProgressProvider({ children }) {
  const [done, setDone] = useState(() => readJSON("progress", {}));

  useEffect(() => writeJSON("progress", done), [done]);

  const markDone = useCallback(
    (key) => setDone((prev) => (prev[key] ? prev : { ...prev, [key]: Date.now() })),
    [],
  );

  const reset = useCallback(() => {
    setDone({});
    removeKeys((k) => k.startsWith("code:") || k.startsWith("modules:"));
  }, []);

  const value = useMemo(() => ({ done, markDone, reset }), [done, markDone, reset]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress doit être utilisé dans <ProgressProvider>");
  return ctx;
}

/** Nombre de niveaux validés / total pour une liste de leçons. */
export function countProgress(lessons, done) {
  let total = 0;
  let completed = 0;
  for (const lesson of lessons) {
    for (const ex of lesson.exercises) {
      for (const { id } of TIERS) {
        if (!ex.tiers[id]) continue;
        total += 1;
        if (done[tierKey(lesson.id, ex.id, id)]) completed += 1;
      }
    }
  }
  return { completed, total, ratio: total ? completed / total : 0 };
}
