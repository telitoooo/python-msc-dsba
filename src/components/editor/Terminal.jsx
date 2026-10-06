import { useEffect, useRef } from "react";
import { LoaderCircle, Square, SquareTerminal, X } from "lucide-react";
import { isBusy, usePythonStatus } from "../../hooks/usePythonRun.js";
import { useLang } from "../../i18n/LanguageContext.jsx";

const STREAM_CLASS = {
  stdout: "text-slate-100",
  stderr: "text-rose-400",
  stdin: "text-sky-300 font-semibold",
  system: "text-amber-300 italic",
};

function StatusLabel({ state, result }) {
  const { status } = usePythonStatus();
  const { t } = useLang();
  if (state === "queued" || state === "loading" || state === "running") {
    const label =
      state === "running"
        ? t("running")
        : state === "loading"
          ? t("loadingLibs")
          : status === "loading"
            ? t("pythonLoading")
            : t("waiting");
    return (
      <span className={`flex items-center gap-1.5 ${state === "running" ? "text-sky-300" : "text-slate-400"}`}>
        <LoaderCircle className="size-3.5 animate-spin" /> {label}
      </span>
    );
  }
  if (state === "done" && result) {
    if (result.status !== "done") return <span className="text-amber-300">{t("interrupted")}</span>;
    if (result.error) return <span className="text-rose-400">{t("errorStatus", { type: result.error.type })}</span>;
    return <span className="text-emerald-400">{t("doneIn", { ms: Math.max(1, Math.round(result.duration)) })}</span>;
  }
  return <span className="text-slate-500">{t("readyStatus")}</span>;
}

/**
 * Terminal intégré : affiche stdout (blanc), stderr (rouge), les entrées
 * lues par input() (bleu), les messages système (jaune) et les figures
 * matplotlib / images Pillow produites par le programme.
 */
export default function Terminal({ chunks, state, result, onClear, onStop, compact = false }) {
  const { t } = useLang();
  const bodyRef = useRef(null);
  const busy = isBusy(state);
  const empty = chunks.length === 0;

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chunks]);

  return (
    <div className="bg-[#14161b] text-[13px]">
      <div className="flex items-center justify-between gap-2 border-y border-white/5 px-3 py-1.5 text-xs">
        <span className="flex items-center gap-1.5 font-medium text-slate-400">
          <SquareTerminal className="size-3.5" /> {t("terminal")}
        </span>
        <div className="flex items-center gap-3">
          <StatusLabel state={state} result={result} />
          {busy && onStop && (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-rose-300 hover:bg-rose-500/15"
            >
              <Square className="size-3 fill-current" /> {t("stop")}
            </button>
          )}
          {!busy && !empty && onClear && (
            <button
              type="button"
              onClick={onClear}
              title={t("clearTerminal")}
              className="rounded p-0.5 text-slate-500 hover:bg-white/10 hover:text-slate-200"
            >
              <X className="size-3.5" />
              <span className="sr-only">{t("clearTerminal")}</span>
            </button>
          )}
        </div>
      </div>
      <pre
        ref={bodyRef}
        aria-live="polite"
        className={`overflow-auto px-4 py-3 font-mono leading-relaxed whitespace-pre-wrap break-words ${
          compact ? "max-h-[28rem]" : "min-h-28 max-h-[36rem]"
        }`}
      >
        {empty && state === "idle" && <span className="text-slate-600">{compact ? "" : t("terminalPlaceholder")}</span>}
        {empty && state === "done" && result?.status === "done" && !result.error && (
          <span className="text-slate-500 italic">{t("noOutput")}</span>
        )}
        {chunks.map((c, i) =>
          c.stream === "image" ? (
            <img
              key={i}
              src={c.text}
              alt={t("figure")}
              className="my-2 block max-h-[26rem] max-w-full rounded-md bg-white object-contain"
            />
          ) : (
            <span key={i} className={STREAM_CLASS[c.stream]}>
              {c.text}
            </span>
          ),
        )}
      </pre>
    </div>
  );
}
