import { useEffect, useMemo, useState } from "react";
import { CircleCheckBig, Keyboard, Play, RotateCcw } from "lucide-react";
import CodeEditor from "./CodeEditor.jsx";
import Terminal from "./Terminal.jsx";
import ErrorHint from "./ErrorHint.jsx";
import FilesPanel from "./FilesPanel.jsx";
import Button from "../ui/Button.jsx";
import { isBusy, usePythonRun } from "../../hooks/usePythonRun.js";
import { useLang } from "../../i18n/LanguageContext.jsx";
import { VERIFY_TIMEOUT_MS } from "../../lib/config.js";

const MAIN = "main.py";
const usesInput = (code) => /\binput\s*\(/.test(code);

/**
 * Espace de travail complet : barre d'outils, éditeur, zone stdin, terminal.
 *
 * - `tests` (optionnel) active le bouton « Vérifier » ; le résultat est passé
 *   à `renderTests(results)` et à `onVerified(res)`.
 * - `defaultStdin` pré-remplit les entrées lues par input() ; c'est aussi
 *   l'entrée utilisée pendant la vérification, pour des tests reproductibles.
 * - `modules` (optionnel) : autres fichiers .py éditables, affichés en onglets
 *   à côté de main.py et importables par celui-ci.
 * - `dataFiles` (optionnel) : fichiers en lecture seule déposés dans le dossier
 *   de travail avant chaque exécution (données, arborescence…).
 */
export default function CodeWorkspace({
  code,
  onCodeChange,
  starter,
  modules,
  onModulesChange,
  startModules,
  dataFiles,
  defaultStdin,
  tests,
  onVerified,
  renderTests,
  minHeight,
}) {
  const { chunks, state, result, run, clear, stop } = usePythonRun();
  const { t } = useLang();
  const [stdin, setStdin] = useState(defaultStdin ?? "");
  const [active, setActive] = useState(MAIN);
  const [testResults, setTestResults] = useState(null);
  const [runCount, setRunCount] = useState(0);
  const busy = isBusy(state);
  const canVerify = Array.isArray(tests) && tests.length > 0;
  const moduleNames = modules ? Object.keys(modules) : [];
  const allCode = [code, ...moduleNames.map((n) => modules[n])].join("\n");
  const needsInput = usesInput(allCode);
  const [stdinOpen, setStdinOpen] = useState(Boolean(defaultStdin) || needsInput);

  useEffect(() => {
    if (needsInput) setStdinOpen(true);
  }, [needsInput]);

  const isActiveModule = active !== MAIN && modules && active in modules;
  const editorValue = isActiveModule ? modules[active] : code;
  const handleEditorChange = (value) => {
    if (isActiveModule) onModulesChange({ ...modules, [active]: value });
    else onCodeChange(value);
  };

  const modified =
    (starter !== undefined && code !== starter) ||
    (startModules && JSON.stringify(modules) !== JSON.stringify(startModules));
  const reset = () => {
    onCodeChange(starter);
    if (startModules) onModulesChange(startModules);
  };

  const files = dataFiles || modules ? { data: dataFiles ?? {}, modules: modules ?? {} } : null;

  const execute = async () => {
    if (busy) return;
    setTestResults(null);
    await run({ code, stdin, files });
    setRunCount((n) => n + 1);
  };

  const verify = async () => {
    if (busy) return;
    setTestResults(null);
    const res = await run({ code, stdin: defaultStdin ?? stdin, tests, files, timeoutMs: VERIFY_TIMEOUT_MS });
    setRunCount((n) => n + 1);
    if (res.status === "done" && res.tests) setTestResults(res.tests);
    onVerified?.(res);
  };

  // Fichiers à afficher : état du dossier après la dernière exécution, sinon fichiers fournis.
  const folder = useMemo(() => {
    if (result?.status === "done" && Array.isArray(result.files)) return result.files;
    return Object.entries(dataFiles ?? {}).map(([path, text]) => ({
      path,
      text,
      size: new TextEncoder().encode(text).length,
      status: "fourni",
      truncated: false,
    }));
  }, [result, dataFiles]);

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-slate-900/10 bg-[#1e2127] shadow-lg shadow-slate-900/5 dark:border-white/10">
        {/* Barre d'outils */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/5 bg-[#181a1f] px-3 py-2">
          <div className="mr-auto flex min-w-0 items-center gap-2 font-mono text-xs text-slate-400">
            <span className="flex shrink-0 gap-1">
              <span className="size-2.5 rounded-full bg-rose-500/70" />
              <span className="size-2.5 rounded-full bg-amber-400/70" />
              <span className="size-2.5 rounded-full bg-emerald-500/70" />
            </span>
            {moduleNames.length === 0 ? (
              MAIN
            ) : (
              <div role="tablist" aria-label={t("pythonFiles")} className="flex min-w-0 gap-1 overflow-x-auto">
                {[MAIN, ...moduleNames].map((name) => (
                  <button
                    key={name}
                    type="button"
                    role="tab"
                    aria-selected={active === name}
                    onClick={() => setActive(name)}
                    className={`shrink-0 rounded-md px-2 py-1 ${
                      active === name ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {modified && (
            <Button variant="ghostDark" onClick={reset} title={t("resetCodeTitle")}>
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">{t("resetCode")}</span>
            </Button>
          )}
          <Button
            variant="ghostDark"
            onClick={() => setStdinOpen((o) => !o)}
            aria-pressed={stdinOpen}
            title={t("stdinTitle")}
            className={stdinOpen ? "bg-white/10 text-white" : ""}
          >
            <Keyboard className="size-3.5" />
            <span className="hidden sm:inline">{t("stdin")}</span>
          </Button>
          <Button variant="primary" onClick={execute} disabled={busy} title={t("runTitle")}>
            <Play className="size-3.5 fill-current" /> {t("run")}
          </Button>
          {canVerify && (
            <Button variant="success" onClick={verify} disabled={busy} title={t("verifyTitle")}>
              <CircleCheckBig className="size-3.5" /> {t("verify")}
            </Button>
          )}
        </div>

        <CodeEditor
          key={isActiveModule ? active : MAIN}
          value={editorValue}
          onChange={handleEditorChange}
          onRun={execute}
          minHeight={minHeight}
          ariaLabel={t("editorFile", { file: isActiveModule ? active : MAIN })}
        />

        {stdinOpen && (
          <div className="border-t border-white/5 bg-[#181a1f] px-3 py-2">
            <label className="mb-1 flex items-center justify-between text-xs text-slate-400">
              <span>
                {t("stdinHelpA")} <code className="text-sky-300">input()</code>
              </span>
              {defaultStdin && canVerify && <span className="hidden text-slate-500 md:inline">{t("stdinVerifyNote")}</span>}
            </label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              rows={Math.min(5, Math.max(2, stdin.split("\n").length))}
              spellCheck={false}
              placeholder={t("stdinPlaceholder")}
              className="w-full resize-y rounded-md border border-white/10 bg-[#14161b] px-3 py-2 font-mono text-[13px] text-sky-200 placeholder:text-slate-600 focus:border-indigo-400 focus:outline-none"
            />
          </div>
        )}

        <Terminal chunks={chunks} state={state} result={result} onClear={clear} onStop={stop} />
        <ErrorHint error={result?.status === "done" ? result.error : null} />
        <FilesPanel files={folder} autoOpenKey={runCount} />
      </div>

      {testResults && renderTests?.(testResults)}
    </div>
  );
}
