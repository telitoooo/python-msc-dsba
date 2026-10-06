import { ArrowRight, BookOpen, CircleCheckBig, Code, Map as MapIcon, Trophy } from "lucide-react";
import { allLessons, modules } from "../content/index.js";
import { TIERS } from "../content/tiers.js";
import { countProgress, useProgress } from "../hooks/useProgress.jsx";
import { useLang } from "../i18n/LanguageContext.jsx";
import ProgressBar from "../components/ui/ProgressBar.jsx";

const STEPS = [
  { icon: BookOpen, title: "step1Title", text: "step1Text" },
  { icon: Code, title: "step2Title", text: "step2Text" },
  { icon: CircleCheckBig, title: "step3Title", text: "step3Text" },
];

export default function HomeView() {
  const { done } = useProgress();
  const { t, tr } = useLang();
  const total = countProgress(allLessons, done);
  const resume = allLessons.find((l) => countProgress([l], done).ratio < 1) ?? allLessons[0];
  const started = total.completed > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      {/* En-tête */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-6 py-10 text-white shadow-xl sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -top-16 -right-10 font-mono text-[180px] leading-none font-bold text-white/5 select-none">
          {">>>"}
        </div>
        <p className="text-sm font-semibold tracking-wide text-indigo-200 uppercase">{t("heroKicker")}</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-5xl">
          {t("heroTitleA")} <span className="text-amber-300">{t("heroTitleB")}</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-indigo-100 sm:text-lg">
          {t("heroText", { modules: modules.length, lessons: allLessons.length, levels: total.total })}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={`#/lesson/${resume.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700 shadow-sm transition hover:bg-amber-50"
          >
            {started ? t("resume") : t("start")}
            {t("colon")} {resume.number} {tr(resume.title)}
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#/syllabus"
            className="inline-flex items-center gap-1.5 font-semibold text-indigo-100 underline-offset-4 hover:underline"
          >
            <MapIcon className="size-4" /> {t("openSyllabus")}
          </a>
          <a href="#/sandbox" className="font-semibold text-indigo-100 underline-offset-4 hover:underline">
            {t("openSandbox")}
          </a>
        </div>
        {started && (
          <div className="mt-8 max-w-md">
            <div className="mb-1.5 flex justify-between text-sm text-indigo-100">
              <span className="flex items-center gap-1.5">
                <Trophy className="size-4 text-amber-300" />{" "}
                {t("levelsValidated", { done: total.completed, total: total.total })}
              </span>
              <span>{Math.round(total.ratio * 100)} %</span>
            </div>
            <ProgressBar value={total.ratio} tone="bg-amber-300" className="bg-white/20 dark:bg-white/20" />
          </div>
        )}
      </section>

      {/* Méthode */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                <Icon className="size-5" />
              </span>
              <span className="text-xs font-bold text-slate-400">{t("stepN", { n: i + 1 })}</span>
            </div>
            <h3 className="mt-3 font-bold text-slate-900 dark:text-white">{t(title)}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t(text)}</p>
          </div>
        ))}
      </section>

      {/* Niveaux */}
      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-bold text-slate-900 dark:text-white">{t("tiersHeading")}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <div key={tier.id} className={`rounded-xl border-2 px-4 py-3 ${tier.active}`}>
              <p className={`flex items-center gap-2 font-bold ${tier.text}`}>
                <span className={`size-2 rounded-full ${tier.dot}`} /> {tier.label}
              </p>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{tr(tier.description)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <h2 className="mt-12 mb-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {t("programHeading")}
      </h2>
      <section className="grid gap-5 md:grid-cols-2">
        {modules.map((m) => {
          const p = countProgress(m.lessons, done);
          const first = m.lessons.find((l) => countProgress([l], done).ratio < 1) ?? m.lessons[0];
          return (
            <a
              key={m.id}
              href={`#/lesson/${first.id}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-lg font-extrabold text-white dark:bg-white dark:text-slate-900">
                  {m.number}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">
                    {t("moduleN", { n: m.number })}
                    {m.session && <span className="normal-case"> · {t("session", { n: m.session })}</span>}
                  </p>
                  <h3 className="font-bold text-slate-900 dark:text-white">{tr(m.title)}</h3>
                </div>
              </div>
              <p className="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-400">{tr(m.description)}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {m.lessons.map((l) => (
                  <li
                    key={l.id}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {tr(l.title)}
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <div className="mb-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{t("moduleStats", { lessons: m.lessons.length, levels: p.total })}</span>
                  <span className="tabular-nums">{Math.round(p.ratio * 100)} %</span>
                </div>
                <ProgressBar value={p.ratio} />
              </div>
              <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {p.completed === 0 ? t("start") : p.ratio === 1 ? t("review") : t("continue")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          );
        })}
      </section>

      <p className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500">{t("localSave")}</p>
    </div>
  );
}
