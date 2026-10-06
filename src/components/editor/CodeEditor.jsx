import { useMemo, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { indentUnit } from "@codemirror/language";
import { Prec } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";

const baseTheme = EditorView.theme(
  {
    "&": { fontSize: "14px", backgroundColor: "#1e2127" },
    ".cm-content": { fontFamily: "var(--font-mono)", padding: "10px 0" },
    ".cm-gutters": { backgroundColor: "#1e2127", borderRight: "1px solid #2c313a" },
    ".cm-scroller": { lineHeight: "1.6" },
    "&.cm-focused": { outline: "none" },
  },
  { dark: true },
);

/**
 * Éditeur Python basé sur CodeMirror 6.
 * Ctrl/Cmd + Entrée déclenche `onRun`.
 */
export default function CodeEditor({
  value,
  onChange,
  onRun,
  readOnly = false,
  compact = false,
  minHeight = "160px",
  maxHeight = "520px",
  ariaLabel = "Python",
}) {
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const extensions = useMemo(
    () => [
      python(),
      indentUnit.of("    "),
      baseTheme,
      EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
      Prec.highest(
        keymap.of([
          {
            key: "Mod-Enter",
            run: () => {
              onRunRef.current?.();
              return true;
            },
          },
        ]),
      ),
    ],
    [ariaLabel],
  );

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme={oneDark}
      extensions={extensions}
      editable={!readOnly}
      readOnly={readOnly}
      minHeight={compact ? undefined : minHeight}
      maxHeight={maxHeight}
      basicSetup={{
        lineNumbers: !compact,
        foldGutter: false,
        highlightActiveLine: !readOnly,
        highlightActiveLineGutter: !readOnly,
        autocompletion: !readOnly,
        tabSize: 4,
      }}
    />
  );
}
