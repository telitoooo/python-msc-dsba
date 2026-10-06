import { useLang } from "../i18n/LanguageContext.jsx";

export default function NotFoundView() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="font-mono text-5xl font-bold text-indigo-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{t("lessonNotFound")}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{t("lessonNotFoundText")}</p>
      <a href="#/" className="mt-6 inline-block font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
        {t("backHome")}
      </a>
    </div>
  );
}
