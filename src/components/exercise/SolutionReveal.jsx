import { useState } from "react";
import { Copy, Eye, EyeOff } from "lucide-react";
import CodeEditor from "../editor/CodeEditor.jsx";
import Button from "../ui/Button.jsx";
import Markdown from "../ui/Markdown.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";

/**
 * Bouton « Voir la solution » : la correction reste masquée par défaut.
 * `modules` (facultatif) : solution des autres fichiers .py, affichée en onglets.
 */
export default function SolutionReveal({ solution, modules, explanation, onLoad }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("main.py");
  const names = ["main.py", ...Object.keys(modules ?? {})];
  const shown = active === "main.py" ? solution : modules[active];

  return (
    <div className="mt-4">
      <Button variant="outline" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        {open ? t("hideSolution") : t("showSolution")}
      </Button>
      {!open && (
        <span className="ml-3 hidden text-xs text-slate-500 sm:inline dark:text-slate-400">
          {t("tryFirst")}
        </span>
      )}

      {open && (
        <div className="mt-3 overflow-hidden rounded-xl border border-indigo-200 dark:border-indigo-500/30">
          <div className="flex items-center justify-between gap-2 bg-indigo-50 px-4 py-2 dark:bg-indigo-500/10">
            <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">{t("proposedSolution")}</span>
            <Button variant="subtle" onClick={onLoad} title={t("loadSolutionTitle")}>
              <Copy className="size-3.5" /> {t("loadSolution")}
            </Button>
          </div>
          {names.length > 1 && (
            <div role="tablist" className="flex gap-1 bg-[#181a1f] px-3 py-1.5 font-mono text-xs">
              {names.map((name) => (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={active === name}
                  onClick={() => setActive(name)}
                  className={`rounded-md px-2 py-1 ${
                    active === name ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
          <CodeEditor key={active} value={shown} readOnly compact ariaLabel={t("solutionFile", { file: active })} />
          {explanation && (
            <div className="border-t border-indigo-200 bg-white px-4 py-3 dark:border-indigo-500/30 dark:bg-slate-900">
              <Markdown runnable={false} className="prose-sm">
                {explanation}
              </Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
