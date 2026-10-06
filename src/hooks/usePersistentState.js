import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "../lib/storage.js";

/**
 * useState synchronisé avec localStorage.
 * Tant que la valeur est égale à `initial`, rien n'est stocké : une mise à jour
 * du contenu du cours (ex. nouveau code de départ) sera donc bien prise en compte.
 */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => readJSON(key, initial));
  const [prevKey, setPrevKey] = useState(key);

  if (key !== prevKey) {
    setPrevKey(key);
    setValue(readJSON(key, initial));
  }

  useEffect(() => {
    writeJSON(key, value === initial ? undefined : value);
  }, [key, value, initial]);

  return [value, setValue];
}
