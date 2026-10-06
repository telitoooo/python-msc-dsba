import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import CodeEditor from "./CodeEditor.jsx";
import Terminal from "./Terminal.jsx";
import { isBusy, usePythonRun } from "../../hooks/usePythonRun.js";
import { useLang } from "../../i18n/LanguageContext.jsx";

/**
 * Exemple de code du cours : modifiable et exécutable sur place.
 * Si le code appelle input(), un champ « Entrées » apparaît (pré-rempli par `stdin`).
 * `prelude` (facultatif) : code exécuté avant l'exemple, sans être affiché (données d'un bloc « setup »).
 */
export default function RunnableSnippet({ code: initial, stdin: initialStdin = "", prelude = "" }) {
  const { t } = useLang();
  const [code, setCode] = useState(initial);
  const [stdin, setStdin] = useState(initialStdin);
  const { chunks, state, result, run, clear, stop } = usePythonRun();
  const busy = isBusy(state);
  const needsInput = /\binput\s*\(/.test(code);

  const execute = () => {
    if (!busy) run({ code: prelude ? `${prelude}\n${code}` : code, stdin });
  };

  return (
    <div className="not-prose my-5 overflow-hidden rounded-xl border border-slate-900/10 bg-[#1e2127] dark:border-white/10">
      <div className="flex items-center justify-between gap-2 bg-[#181a1f] px-3 py-1.5">
        <span className="font-mono text-[11px] tracking-wide text-slate-500 uppercase">{t("snippetEditable")}</span>
        <div className="flex items-center gap-1">
          {code !== initial && (
            <button
              type="button"
              onClick={() => setCode(initial)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="size-3" /> {t("restore")}
            </button>
          )}
          <button
            type="button"
            onClick={execute}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-md bg-indigo-500/15 px-2.5 py-1 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/30 disabled:opacity-50"
          >
            <Play className="size-3 fill-current" /> {t("run")}
          </button>
        </div>
      </div>
      <CodeEditor value={code} onChange={setCode} onRun={execute} compact ariaLabel={t("snippetLabel")} />
      {needsInput && (
        <label className="flex items-center gap-3 border-t border-white/5 bg-[#181a1f] px-3 py-2 text-xs text-slate-400">
          <span className="shrink-0">{t("snippetInputs")}</span>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            rows={Math.max(1, stdin.split("\n").length)}
            spellCheck={false}
            className="min-w-0 flex-1 resize-none rounded border border-white/10 bg-[#14161b] px-2 py-1 font-mono text-[13px] text-sky-200 focus:border-indigo-400 focus:outline-none"
          />
        </label>
      )}
      {state !== "idle" && (
        <Terminal chunks={chunks} state={state} result={result} onClear={clear} onStop={stop} compact />
      )}
    </div>
  );
}
