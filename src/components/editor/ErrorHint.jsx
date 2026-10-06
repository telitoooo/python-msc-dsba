import { Lightbulb } from "lucide-react";
import { getErrorHint } from "../../lib/errorHints.js";
import InlineMarkdown from "../ui/InlineMarkdown.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";

/** Explique l'erreur sur laquelle le programme s'est arrêté. */
export default function ErrorHint({ error }) {
  const { lang, t } = useLang();
  if (!error) return null;
  const hint = getErrorHint(error.type, lang);
  return (
    <div className="flex gap-3 border-t border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
      <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
      <div>
        <p className="font-semibold">{t("errorAt", error)}</p>
        {hint && (
          <p className="mt-0.5 text-amber-800/90 dark:text-amber-100/80">
            <InlineMarkdown text={hint} />
          </p>
        )}
      </div>
    </div>
  );
}
