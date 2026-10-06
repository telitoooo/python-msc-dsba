import { ArrowLeft, ArrowRight, BookOpen, Clock, ListChecks, Target } from "lucide-react";
import { findLesson } from "../content/index.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import Markdown from "../components/ui/Markdown.jsx";
import Exercise from "../components/exercise/Exercise.jsx";
import NotFoundView from "./NotFoundView.jsx";

function SectionTitle({ icon: Icon, step, children }) {
  return (
    <h2 className="mb-5 flex items-center gap-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
      <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="mr-2 text-indigo-600 dark:text-indigo-400">{step}.</span>
        {children}
      </span>
    </h2>
  );
}

function PagerLink({ lesson, direction }) {
  const { t, tr } = useLang();
  if (!lesson) return <span />;
  const next = direction === "next";
  return (
    <a
      href={`#/lesson/${lesson.id}`}
      className={`group flex max-w-[48%] flex-col rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50 ${
        next ? "ml-auto items-end text-right" : "items-start"
      }`}
    >
      <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        {!next && <ArrowLeft className="size-3.5" />}
        {next ? t("nextLesson") : t("prevLesson")}
        {next && <ArrowRight className="size-3.5" />}
      </span>
      <span className="mt-0.5 font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
        {lesson.number} {tr(lesson.title)}
      </span>
    </a>
  );
}

export default function LessonView({ lessonId, onNavigate }) {
  const { lang, t, tr } = useLang();
  const ctx = findLesson(lessonId);
  if (!ctx) return <NotFoundView />;
  const { lesson, module, prev, next } = ctx;
  const objectives = tr(lesson.objectives) ?? [];

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
      <header>
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          {t("moduleN", { n: module.number })} · {tr(module.title)}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          <span className="text-slate-400 dark:text-slate-500">{lesson.number}</span> {tr(lesson.title)}
        </h1>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" /> {lesson.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <ListChecks className="size-4" /> {t("exercisesCount", { n: lesson.exercises.length })}
          </span>
        </div>

        {objectives.length > 0 && (
          <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-500/20 dark:bg-indigo-500/5">
            <p className="flex items-center gap-2 text-sm font-bold text-indigo-900 dark:text-indigo-200">
              <Target className="size-4" /> {t("objectives")}
            </p>
            <ul className="mt-2 grid gap-1.5 text-sm text-slate-700 sm:grid-cols-2 dark:text-slate-300">
              {objectives.map((o) => (
                <li key={o} className="flex gap-2">
                  <span className="text-indigo-500">✓</span> {o}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <section className="mt-10">
        <SectionTitle icon={BookOpen} step={1}>
          {t("theory")}
        </SectionTitle>
        {/* key : les exemples modifiables repartent du texte de la nouvelle langue */}
        <Markdown key={lang}>{tr(lesson.theory)}</Markdown>
      </section>

      <section className="mt-12">
        <SectionTitle icon={Target} step={2}>
          {t("practice")}
        </SectionTitle>
        <div className="space-y-8">
          {lesson.exercises.map((ex, i) => (
            <Exercise
              key={`${lesson.id}-${ex.id}`}
              lesson={lesson}
              exercise={ex}
              index={i}
              nextExerciseId={lesson.exercises[i + 1]?.id}
              nextLesson={next}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      <nav className="mt-12 flex gap-4 border-t border-slate-200 pt-6 dark:border-slate-800" aria-label={t("lessonsNav")}>
        <PagerLink lesson={prev} direction="prev" />
        <PagerLink lesson={next} direction="next" />
      </nav>
    </article>
  );
}
