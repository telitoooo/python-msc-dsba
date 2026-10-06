import { ArrowRight, CircleCheck, CircleX, PartyPopper } from "lucide-react";
import InlineMarkdown from "../ui/InlineMarkdown.jsx";
import Button from "../ui/Button.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";

/** Rapport des tests automatiques d'un niveau. */
export default function TestResults({ results, nextLabel, onNext }) {
  const { t } = useLang();
  const passed = results.filter((r) => r.passed).length;
  const success = passed === results.length;

  return (
    <div
      className={`mt-4 rounded-xl border p-4 ${
        success
          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {success ? (
          <p className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
            <PartyPopper className="size-5" /> {t("allPassed")}
          </p>
        ) : (
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            {t("testsPassed", { passed, total: results.length })}
            <span className="font-normal text-slate-500 dark:text-slate-400">{t("almost")}</span>
          </p>
        )}
        {success && onNext && (
          <Button variant="success" className="ml-auto" onClick={onNext}>
            {nextLabel} <ArrowRight className="size-3.5" />
          </Button>
        )}
      </div>
      <ul className="space-y-2">
        {results.map((r, i) => (
          <li key={i} className="flex gap-2.5 text-sm">
            {r.passed ? (
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-label={t("passed")} />
            ) : (
              <CircleX className="mt-0.5 size-4 shrink-0 text-rose-500" aria-label={t("failed")} />
            )}
            <div className="min-w-0">
              <p className={r.passed ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-slate-100"}>
                <InlineMarkdown text={r.label} />
              </p>
              {!r.passed && r.message && (
                <p className="mt-0.5 font-mono text-xs break-words text-rose-600 dark:text-rose-400">{r.message}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
