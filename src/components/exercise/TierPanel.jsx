import { useMemo, useState } from "react";
import { Lightbulb } from "lucide-react";
import CodeWorkspace from "../editor/CodeWorkspace.jsx";
import Markdown from "../ui/Markdown.jsx";
import TestResults from "./TestResults.jsx";
import SolutionReveal from "./SolutionReveal.jsx";
import { usePersistentState } from "../../hooks/usePersistentState.js";
import { useProgress } from "../../hooks/useProgress.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";

/** Contenu d'un niveau : énoncé, indice, éditeur, tests et solution. */
export default function TierPanel({ storageKey, data, next }) {
  const { t, tr } = useLang();
  const [code, setCode] = usePersistentState(`code:${storageKey}`, data.starter);
  const [stored, setModules] = usePersistentState(`modules:${storageKey}`, data.modules ?? null);
  // Si l'exercice a changé de liste de fichiers depuis la sauvegarde, on repart des fichiers de départ.
  const sameFiles = (a, b) => Object.keys(a ?? {}).sort().join() === Object.keys(b ?? {}).sort().join();
  const modules = stored && sameFiles(stored, data.modules) ? stored : data.modules;
  const [hintOpen, setHintOpen] = useState(false);
  const { markDone } = useProgress();

  // Les libellés des tests sont envoyés à Python dans la langue courante.
  const tests = useMemo(() => data.tests.map((test) => ({ ...test, label: tr(test.label) })), [data.tests, tr]);

  const handleVerified = (res) => {
    if (res.status === "done" && res.tests?.length && res.tests.every((r) => r.passed)) {
      markDone(storageKey);
    }
  };

  return (
    <div className="mt-5">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{tr(data.title)}</h3>
      <Markdown runnable={false} className="mt-2">
        {tr(data.prompt)}
      </Markdown>

      {data.hint && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setHintOpen((o) => !o)}
            aria-expanded={hintOpen}
            className="flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
          >
            <Lightbulb className="size-4" /> {hintOpen ? t("hideHint") : t("showHint")}
          </button>
          {hintOpen && (
            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-500/30 dark:bg-amber-500/10">
              <Markdown runnable={false} className="prose-sm">
                {tr(data.hint)}
              </Markdown>
            </div>
          )}
        </div>
      )}

      <div className="mt-5">
        <CodeWorkspace
          code={code}
          onCodeChange={setCode}
          starter={data.starter}
          modules={modules ?? undefined}
          onModulesChange={setModules}
          startModules={data.modules}
          dataFiles={data.files}
          defaultStdin={data.stdin}
          tests={tests}
          onVerified={handleVerified}
          renderTests={(results) => (
            <TestResults
              results={results.map((r, i) => ({ ...r, label: tests[i]?.label ?? r.label }))}
              nextLabel={next?.label}
              onNext={next?.go}
            />
          )}
        />
      </div>

      <SolutionReveal
        solution={data.solution}
        modules={data.solutionModules}
        explanation={tr(data.explanation)}
        onLoad={() => {
          setCode(data.solution);
          if (data.solutionModules) setModules(data.solutionModules);
        }}
      />
    </div>
  );
}
