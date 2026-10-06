import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UI } from "./ui.js";

/**
 * Contexte de langue (FR / EN).
 *
 *   const { lang, setLang, t, tr } = useLang();
 *   t("run")                → texte de l'interface (src/i18n/ui.js)
 *   t("levelsDone", { n })  → avec variables {n} ou fonction de pluriel
 *   tr(lesson.title)        → contenu bilingue : chaîne simple ou objet { fr, en }
 */
export const LANGS = ["fr", "en"];
const KEY = "pylab:lang"; // aussi lu par le script inline de index.html

const LanguageContext = createContext(null);

function initialLang() {
  try {
    const saved = localStorage.getItem(KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    /* stockage indisponible */
  }
  return navigator.language?.toLowerCase().startsWith("en") ? "en" : "fr";
}

/** Valeur de contenu dans la langue demandée (repli sur le français). */
export function localize(value, lang) {
  if (value && typeof value === "object" && !Array.isArray(value) && ("fr" in value || "en" in value)) {
    return value[lang] ?? value.fr ?? value.en;
  }
  return value;
}

function format(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
}

/** Texte de l'interface, utilisable hors de React (ex. pour un message système). */
export function translate(lang, key, vars) {
  const entry = UI[lang]?.[key] ?? UI.fr[key];
  if (entry === undefined) return key;
  return typeof entry === "function" ? entry(vars ?? {}) : format(entry, vars);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);
  const tr = useCallback((value) => localize(value, lang), [lang]);
  const toggle = useCallback(() => setLang((l) => (l === "fr" ? "en" : "fr")), []);

  const value = useMemo(() => ({ lang, setLang, toggle, t, tr }), [lang, toggle, t, tr]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang doit être utilisé dans <LanguageProvider>");
  return ctx;
}
