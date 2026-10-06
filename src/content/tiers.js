/**
 * Les trois niveaux de difficulté de chaque exercice (comme dans les TD).
 * Les classes Tailwind sont écrites en entier pour être détectées au build.
 */
export const TIERS = [
  {
    id: "core",
    label: "Core",
    description: { fr: "L'essentiel à maîtriser", en: "The essentials to master" },
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    active: "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    id: "extra",
    label: "Extra",
    description: { fr: "Pour consolider", en: "To consolidate" },
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    active: "border-amber-500 bg-amber-50 dark:bg-amber-500/10",
  },
  {
    id: "stretch",
    label: "Stretch",
    description: { fr: "Pour aller plus loin", en: "To go further" },
    dot: "bg-fuchsia-500",
    text: "text-fuchsia-700 dark:text-fuchsia-400",
    active: "border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-500/10",
  },
];

export const tierById = Object.fromEntries(TIERS.map((t) => [t.id, t]));
