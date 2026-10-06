import { LoaderCircle, Menu, Moon, Sun, TriangleAlert } from "lucide-react";
import { usePythonStatus } from "../../hooks/usePythonRun.js";
import { pythonRunner } from "../../lib/pythonRunner.js";
import { PYODIDE_VERSION } from "../../lib/config.js";
import { LANGS, useLang } from "../../i18n/LanguageContext.jsx";

function PythonStatus() {
  const { status, message } = usePythonStatus();
  const { t } = useLang();
  if (status === "ready") {
    return (
      <span
        title={t("pythonReadyTitle", { v: PYODIDE_VERSION })}
        className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
      >
        <span className="size-1.5 rounded-full bg-emerald-500" /> <span className="hidden sm:inline">{t("pythonReady")}</span>
        <span className="sm:hidden">Python</span>
      </span>
    );
  }
  if (status === "error") {
    return (
      <button
        type="button"
        onClick={() => pythonRunner.retry()}
        title={message ?? ""}
        className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400"
      >
        <TriangleAlert className="size-3.5" /> <span className="hidden sm:inline">{t("pythonUnavailable")}</span>{" "}
        {t("retry")}
      </button>
    );
  }
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      <LoaderCircle className="size-3.5 animate-spin" />
      <span className="sm:hidden">{t("pythonShort")}</span>
      <span className="hidden sm:inline">{t("pythonLoading")}</span>
    </span>
  );
}

/** Bouton FR / EN : traduit instantanément l'interface, les leçons et les énoncés. */
function LanguageSwitch() {
  const { lang, setLang, t } = useLang();
  return (
    <div
      role="group"
      aria-label="Langue / Language"
      title={t("switchLanguage")}
      className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
    >
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={`rounded-md px-2 py-1 uppercase transition-colors ${
            lang === code
              ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-950 dark:text-indigo-300"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export default function TopBar({ title, onMenu, dark, onToggleTheme }) {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:gap-3 sm:px-6 dark:border-slate-800 dark:bg-slate-950/80">
      <button
        type="button"
        onClick={onMenu}
        className="-ml-1 rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Menu className="size-5" />
        <span className="sr-only">{t("openMenu")}</span>
      </button>
      <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <PythonStatus />
      <LanguageSwitch />
      <button
        type="button"
        onClick={onToggleTheme}
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        title={dark ? t("lightTheme") : t("darkTheme")}
      >
        {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
        <span className="sr-only">{t("toggleTheme")}</span>
      </button>
    </header>
  );
}
