import { CircleCheck } from "lucide-react";
import { TIERS } from "../../content/tiers.js";
import { useLang } from "../../i18n/LanguageContext.jsx";

/** Onglets Core / Extra / Stretch avec l'état de validation de chaque niveau. */
export default function TierTabs({ value, onChange, isDone, available }) {
  const { t, tr } = useLang();
  return (
    <div role="tablist" aria-label={t("difficulty")} className="grid grid-cols-3 gap-2">
      {TIERS.filter((tier) => available.includes(tier.id)).map((tier) => {
        const selected = tier.id === value;
        const done = isDone(tier.id);
        return (
          <button
            key={tier.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tier.id)}
            className={`rounded-xl border-2 px-3 py-2.5 text-left transition-colors ${
              selected
                ? tier.active
                : "border-transparent bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800/60 dark:hover:bg-slate-800"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`size-2 rounded-full ${tier.dot}`} />
              <span className={`text-sm font-bold ${selected ? tier.text : "text-slate-700 dark:text-slate-200"}`}>
                {tier.label}
              </span>
              {done && <CircleCheck className="ml-auto size-4 text-emerald-500" aria-label={t("validated")} />}
            </span>
            <span className="mt-0.5 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
              {tr(tier.description)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
