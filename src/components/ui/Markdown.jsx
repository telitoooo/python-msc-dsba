import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import RunnableSnippet from "../editor/RunnableSnippet.jsx";
import CodeEditor from "../editor/CodeEditor.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";

/** Texte brut d'un nœud HAST (pour détecter le type d'encadré). */
function nodeText(node) {
  if (!node) return "";
  if (node.type === "text") return node.value;
  return (node.children ?? []).map(nodeText).join("");
}

// > 💡 … → astuce · > ⚠️ … → piège · > 🎯 … → à retenir · sinon note
const CALLOUTS = [
  { match: /^\s*⚠️?/, className: "callout callout-warning" },
  { match: /^\s*💡/, className: "callout callout-tip" },
  { match: /^\s*🎯/, className: "callout callout-key" },
];

function Callout({ node, children }) {
  const text = nodeText(node);
  const variant = CALLOUTS.find((c) => c.match.test(text))?.className ?? "callout callout-note";
  return <div className={variant}>{children}</div>;
}

/** ```python stdin=25|Ada → "25\nAda" (valeurs lues par input() dans l'exemple). */
function parseStdin(meta) {
  const match = /stdin=(\S+)/.exec(meta ?? "");
  return match ? match[1].split("|").join("\n") : undefined;
}

/**
 * ```python norun → exemple à lire, non exécutable dans le navigateur
 * (fenêtres tkinter, serveur réseau, multiprocessing, ligne de commande…).
 */
function StaticExample({ code }) {
  const { t } = useLang();
  return (
    <div className="not-prose my-5 overflow-hidden rounded-xl border border-slate-900/10 bg-[#1e2127] dark:border-white/10">
      <div className="bg-[#181a1f] px-3 py-1.5 font-mono text-[11px] tracking-wide text-slate-500 uppercase">
        {t("snippetStatic")}
      </div>
      <CodeEditor value={code} readOnly compact />
    </div>
  );
}

/**
 * ```python setup → exemple qui prépare des données : son code est repris
 * (invisible) en tête de tous les exemples Python qui le suivent dans la leçon,
 * pour que chacun reste exécutable seul.
 */
function findSetups(markdown) {
  const setups = [];
  const fence = /^```python([^\n]*)\n([\s\S]*?)^```/gm;
  let match;
  while ((match = fence.exec(markdown ?? "")) !== null) {
    if (/\bsetup\b/.test(match[1])) setups.push({ offset: match.index, code: match[2].replace(/\n$/, "") });
  }
  return setups;
}

function makePre(runnable, setups = []) {
  return function Pre({ node, children }) {
    const codeEl = Array.isArray(children) ? children[0] : children;
    const className = codeEl?.props?.className ?? "";
    const code = String(codeEl?.props?.children ?? "").replace(/\n$/, "");

    if (/language-python/.test(className)) {
      const meta = node?.children?.[0]?.data?.meta ?? "";
      if (runnable && /\bnorun\b/.test(meta)) return <StaticExample code={code} />;
      const offset = node?.position?.start?.offset ?? -1;
      const prelude = setups
        .filter((s) => s.offset < offset)
        .map((s) => s.code)
        .join("\n");
      return runnable ? (
        <RunnableSnippet code={code} stdin={parseStdin(meta)} prelude={prelude} />
      ) : (
        <div className="not-prose my-4 overflow-hidden rounded-xl border border-white/10">
          <CodeEditor value={code} readOnly compact />
        </div>
      );
    }
    // Bloc « sortie attendue » (```text) ou autre langage : affichage statique.
    return (
      <pre className="not-prose my-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 font-mono text-[13px] leading-relaxed text-slate-800 dark:border-white/10 dark:bg-[#14161b] dark:text-slate-200">
        {code}
      </pre>
    );
  };
}

const PreStatic = makePre(false);

function Table({ children }) {
  return (
    <div className="my-5 overflow-x-auto">
      <table className="my-0">{children}</table>
    </div>
  );
}

/**
 * Rendu Markdown des leçons et énoncés.
 * Les blocs ```python deviennent des exemples exécutables si `runnable`.
 */
export default function Markdown({ children, runnable = true, className = "" }) {
  const pre = useMemo(() => (runnable ? makePre(true, findSetups(children)) : PreStatic), [runnable, children]);
  return (
    <div className={`markdown prose prose-slate max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ pre, blockquote: Callout, table: Table }}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
