import { useEffect, useState } from "react";
import { ChevronDown, FileText, FolderOpen, Image as ImageIcon } from "lucide-react";
import { useLang } from "../../i18n/LanguageContext.jsx";

const STATUS_CLASS = {
  fourni: "bg-slate-500/20 text-slate-300",
  nouveau: "bg-emerald-500/20 text-emerald-300",
  modifié: "bg-amber-500/20 text-amber-300",
  supprimé: "bg-rose-500/20 text-rose-300",
};

/**
 * Contenu du dossier de travail (/home/pyodide/projet) : fichiers fournis par
 * l'exercice avant l'exécution, puis fichiers créés / modifiés par le programme.
 * Les images (.png, .jpg…) sont prévisualisées.
 */
export default function FilesPanel({ files, autoOpenKey }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const changed = files.filter((f) => f.status !== "fourni");

  // Après une exécution qui a créé ou modifié des fichiers : on ouvre le panneau.
  useEffect(() => {
    if (autoOpenKey && changed.length > 0) {
      setOpen(true);
      setSelected(changed[0].path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenKey]);

  if (files.length === 0) return null;
  const current = files.find((f) => f.path === selected) ?? files[0];
  const formatSize = (bytes) =>
    bytes < 1024 ? `${bytes} ${t("bytes")}` : `${(bytes / 1024).toFixed(1)} ${t("kilobytes")}`;

  let body;
  if (current.status === "supprimé") body = t("fileDeleted");
  else if (current.image) body = null;
  else if (current.text === null) body = t("binaryFile");
  else body = current.text || t("emptyFile");

  return (
    <div className="border-t border-white/5 bg-[#181a1f] text-[13px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-400 hover:text-slate-200"
      >
        <FolderOpen className="size-3.5" />
        <span className="font-medium">{t("workdir")}</span>
        <span className="truncate text-slate-500">
          {t("fileCount", { n: files.length })}
          {changed.length > 0 && t("changedCount", { n: changed.length })}
        </span>
        <ChevronDown className={`ml-auto size-3.5 transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>

      {open && (
        <div className="grid border-t border-white/5 md:grid-cols-[minmax(0,14rem)_1fr]">
          <ul className="max-h-64 overflow-auto border-b border-white/5 py-1 md:border-r md:border-b-0">
            {files.map((f) => {
              const Icon = f.image ? ImageIcon : FileText;
              return (
                <li key={f.path}>
                  <button
                    type="button"
                    onClick={() => setSelected(f.path)}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left font-mono text-xs ${
                      current.path === f.path ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{f.path}</span>
                    <span className={`rounded px-1.5 py-px font-sans text-[10px] ${STATUS_CLASS[f.status]}`}>
                      {t(`status_${f.status}`)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="min-w-0">
            <p className="flex justify-between border-b border-white/5 px-3 py-1.5 font-mono text-[11px] text-slate-500">
              <span className="truncate">{current.path}</span>
              <span>{current.status === "supprimé" ? t("status_supprimé") : formatSize(current.size)}</span>
            </p>
            {body === null ? (
              <div className="max-h-64 overflow-auto p-3">
                <img
                  src={current.image}
                  alt={current.path}
                  className="max-w-full rounded bg-white/90 [image-rendering:pixelated]"
                />
              </div>
            ) : (
              <pre className="max-h-64 overflow-auto px-3 py-2 font-mono leading-relaxed whitespace-pre-wrap text-slate-200">
                {body}
                {current.truncated && <span className="text-slate-500">{t("truncated")}</span>}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
