import { CircleCheck, CircleDashed, Circle } from "lucide-react";
import { SESSIONS } from "../content/syllabus.js";
import { findLesson } from "../content/index.js";
import { countProgress, useProgress } from "../hooks/useProgress.jsx";
import { useLang } from "../i18n/LanguageContext.jsx";
import ProgressBar from "../components/ui/ProgressBar.jsx";

function LessonChip({ lessonId, done }) {
  const { tr } = useLang();
  const ctx = findLesson(lessonId);
  if (!ctx) return null;
  const p = countProgress([ctx.lesson], done);
  const Icon = p.total > 0 && p.completed === p.total ? CircleCheck : p.completed > 0 ? CircleDashed : Circle;
  const tone =
    p.total > 0 && p.completed === p.total
      ? "text-emerald-500"
      : p.completed > 0
        ? "text-amber-500"
        : "text-slate-300 dark:text-slate-600";
  return (
    <a
      href={`#/lesson/${lessonId}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-indigo-300"
    >
      <Icon className={`size-3.5 ${tone}`} />
      <span className="text-slate-400 tabular-nums dark:text-slate-500">{ctx.lesson.number}</span>
      {tr(ctx.lesson.title)}
    </a>
  );
}

/** Plan du cours : chaque séance du PDF, ses notions et les leçons qui les traitent. */
export default function SyllabusView() {
  const { t, tr } = useLang();
  const { done } = useProgress();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t("syllabusTitle")}</h1>
      <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-400">{t("syllabusIntro")}</p>

      <div className="mt-8 space-y-6">
        {SESSIONS.map((session) => {
          const lessonIds = [...new Set(session.topics.flatMap((topic) => topic.lessons))];
          const lessons = lessonIds.map((id) => findLesson(id)?.lesson).filter(Boolean);
          const progress = countProgress(lessons, done);
          return (
            <section
              key={session.number}
              id={`session-${session.number}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <header className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-600 text-lg font-extrabold text-white">
                  {session.number}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
                    {t("session", { n: session.number })} · {t("slides", { r: session.slides })} ·{" "}
                    {t("notions", { n: session.topics.length })}
                  </p>
                  <h2 className="font-bold text-slate-900 dark:text-white">{tr(session.title)}</h2>
                </div>
                <div className="w-full sm:w-40">
                  <div className="mb-1 text-right text-xs text-slate-500 tabular-nums dark:text-slate-400">
                    {Math.round(progress.ratio * 100)} %
                  </div>
                  <ProgressBar value={progress.ratio} />
                </div>
              </header>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {session.topics.map((topic) => (
                  <li key={tr(topic.label)} className="grid gap-2 px-5 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{tr(topic.label)}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{t("slides", { r: topic.slides })}</p>
                    </div>
                    <div className="flex flex-wrap items-start gap-1.5">
                      {topic.lessons.map((id) => (
                        <LessonChip key={id} lessonId={id} done={done} />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
