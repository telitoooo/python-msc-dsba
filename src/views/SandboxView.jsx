import { usePersistentState } from "../hooks/usePersistentState.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import CodeWorkspace from "../components/editor/CodeWorkspace.jsx";

const STARTER = {
  fr: `# Bac à sable : testez librement vos idées.
# Raccourci : Ctrl/⌘ + Entrée pour exécuter.
import math

notes = [12, 15.5, 9, 17]
moyenne = sum(notes) / len(notes)
print(f"Moyenne : {moyenne:.2f}")
print("Racine de 2 :", math.sqrt(2))

nom = input("Votre prénom ? ")
print(f"Bonjour {nom} !")

# Les bibliothèques scientifiques se chargent au premier import :
# import numpy as np
# import matplotlib.pyplot as plt
# x = np.linspace(0, 6.3, 100)
# plt.plot(x, np.sin(x)); plt.title("sin(x)"); plt.show()
`,
  en: `# Sandbox: try out your ideas freely.
# Shortcut: Ctrl/⌘ + Enter to run.
import math

grades = [12, 15.5, 9, 17]
average = sum(grades) / len(grades)
print(f"Average: {average:.2f}")
print("Square root of 2:", math.sqrt(2))

name = input("Your first name? ")
print(f"Hello {name}!")

# Scientific libraries are loaded on first import:
# import numpy as np
# import matplotlib.pyplot as plt
# x = np.linspace(0, 6.3, 100)
# plt.plot(x, np.sin(x)); plt.title("sin(x)"); plt.show()
`,
};

export default function SandboxView() {
  const { lang, t } = useLang();
  const starter = STARTER[lang];
  const [code, setCode] = usePersistentState("code:sandbox", starter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t("sandbox")}</h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{t("sandboxText")}</p>
      <div className="mt-6">
        <CodeWorkspace code={code} onCodeChange={setCode} starter={starter} defaultStdin="Ada" minHeight="360px" />
      </div>
    </div>
  );
}
