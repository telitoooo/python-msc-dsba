import { useState } from "react";
import { Code } from "lucide-react";
import TierTabs from "./TierTabs.jsx";
import TierPanel from "./TierPanel.jsx";
import { TIERS, tierById } from "../../content/tiers.js";
import { tierKey, useProgress } from "../../hooks/useProgress.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";

const anchor = (lessonId, exerciseId) => `ex-${lessonId}-${exerciseId}`;

/** Un exercice décliné en trois niveaux : Core, Extra et Stretch. */
export default function Exercise({ lesson, exercise, index, nextExerciseId, nextLesson, onNavigate }) {
  const { done } = useProgress();
  const { t, tr } = useLang();
  const available = TIERS.map((tier) => tier.id).filter((id) => exercise.tiers[id]);
  const isDone = (tier) => Boolean(done[tierKey(lesson.id, exercise.id, tier)]);
  const [tier, setTier] = useState(() => available.find((id) => !isDone(id)) ?? available[0]);

  const position = available.indexOf(tier);
  const nextTier = available[position + 1];
  let next = null;
  if (nextTier) {
    next = { label: t("levelX", { x: tierById[nextTier].label }), go: () => setTier(nextTier) };
  } else if (nextExerciseId) {
    next = {
      label: t("nextExercise"),
      go: () =>
        document.getElementById(anchor(lesson.id, nextExerciseId))?.scrollIntoView({ behavior: "smooth" }),
    };
  } else if (nextLesson) {
    next = { label: t("nextLesson"), go: () => onNavigate(`/lesson/${nextLesson.id}`) };
  }

  const key = tierKey(lesson.id, exercise.id, tier);

  return (
    <section
      id={anchor(lesson.id, exercise.id)}
      className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <header className="mb-4 flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
          <Code className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
            {t("exerciseN", { n: index + 1 })}
          </p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{tr(exercise.title)}</h2>
          {exercise.intro && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{tr(exercise.intro)}</p>}
        </div>
      </header>

      <TierTabs value={tier} onChange={setTier} isDone={isDone} available={available} />
      <TierPanel key={key} storageKey={key} data={exercise.tiers[tier]} next={next} />
    </section>
  );
}
