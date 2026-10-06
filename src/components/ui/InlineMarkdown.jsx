/**
 * Mini-rendu Markdown pour les textes courts (libellés de tests, astuces…) :
 * gère uniquement `code` et **gras**, sans charger tout react-markdown.
 */
export default function InlineMarkdown({ text }) {
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <code
          key={i}
          className="rounded bg-slate-900/10 px-1 py-px font-mono text-[0.9em] dark:bg-white/10"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
