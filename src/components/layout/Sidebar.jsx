import { useEffect, useState } from "react";
import {
  ChevronDown,
  Circle,
  CircleCheck,
  CircleDashed,
  FlaskConical,
  House,
  Map as MapIcon,
  RotateCcw,
  X,
} from "lucide-react";
import { modules, allLessons } from "../../content/index.js";
import { countProgress, useProgress } from "../../hooks/useProgress.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";

function LessonStatusIcon({ completed, total }) {
  if (total > 0 && completed === total) return <CircleCheck className="size-4 shrink-0 text-emerald-500" />;
  if (completed > 0) return <CircleDashed className="size-4 shrink-0 text-amber-500" />;
  return <Circle className="size-4 shrink-0 text-slate-300 dark:text-slate-600" />;
}

function NavLink({ href, active, children }) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
      }`}
    >
      {children}
    </a>
  );
}

function ModuleGroup({ module, route, done }) {
  const { t, tr } = useLang();
  const containsCurrent = module.lessons.some((l) => l.id === route.lessonId);
  const [open, setOpen] = useState(containsCurrent);
  const progress = countProgress(module.lessons, done);

  useEffect(() => {
    if (containsCurrent) setOpen(true);
  }, [containsCurrent]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800/70"
      >
        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
          {module.number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
            {tr(module.shortTitle)}
          </span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400">
            {t("levelsDone", { done: progress.completed, total: progress.total })}
          </span>
        </span>
        <ChevronDown className={`size-4 text-slate-400 transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>

      {open && (
        <ul className="mt-1 mb-2 ml-[22px] space-y-0.5 border-l border-slate-200 pl-3 dark:border-slate-800">
          {module.lessons.map((lesson) => {
            const p = countProgress([lesson], done);
            const active = route.lessonId === lesson.id;
            return (
              <li key={lesson.id}>
                <a
                  href={`#/lesson/${lesson.id}`}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors ${
                    active
                      ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
                  }`}
                >
                  <LessonStatusIcon completed={p.completed} total={p.total} />
                  <span className="text-slate-400 tabular-nums dark:text-slate-500">{lesson.number}</span>
                  <span className="truncate">{tr(lesson.title)}</span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Barre de navigation latérale : chapitres (modules), sous-chapitres (leçons) et progression. */
export default function Sidebar({ route, open, onClose }) {
  const { done, reset } = useProgress();
  const { t } = useLang();
  const total = countProgress(allLessons, done);

  const handleReset = () => {
    if (window.confirm(t("resetConfirm"))) reset();
  };

  return (
    <>
      {/* Fond sombre sur mobile */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label={t("courseNav")}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800">
          <img src="./favicon.svg" alt="" className="size-8" />
          <div className="leading-tight">
            <p className="font-extrabold tracking-tight text-slate-900 dark:text-white">PyLab</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("appTagline")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          >
            <X className="size-5" />
            <span className="sr-only">{t("closeMenu")}</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <NavLink href="#/" active={route.view === "home"}>
            <House className="size-4" /> {t("home")}
          </NavLink>
          <NavLink href="#/syllabus" active={route.view === "syllabus"}>
            <MapIcon className="size-4" /> {t("syllabus")}
          </NavLink>
          <NavLink href="#/sandbox" active={route.view === "sandbox"}>
            <FlaskConical className="size-4" /> {t("sandbox")}
          </NavLink>

          <p className="px-3 pt-5 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            {t("program")}
          </p>
          {modules.map((m) => (
            <ModuleGroup key={m.id} module={m} route={route} done={done} />
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t("globalProgress")}</span>
            <span className="text-slate-500 tabular-nums dark:text-slate-400">{Math.round(total.ratio * 100)} %</span>
          </div>
          <ProgressBar value={total.ratio} />
          <button
            type="button"
            onClick={handleReset}
            className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-rose-500"
          >
            <RotateCcw className="size-3" /> {t("resetProgress")}
          </button>
        </div>
      </aside>
    </>
  );
}
