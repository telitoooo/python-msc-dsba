import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/layout/Sidebar.jsx";
import TopBar from "./components/layout/TopBar.jsx";
import HomeView from "./views/HomeView.jsx";
import LessonView from "./views/LessonView.jsx";
import SandboxView from "./views/SandboxView.jsx";
import SyllabusView from "./views/SyllabusView.jsx";
import { ProgressProvider } from "./hooks/useProgress.jsx";
import { useHashRoute } from "./hooks/useHashRoute.js";
import { useTheme } from "./hooks/useTheme.js";
import { LanguageProvider, useLang } from "./i18n/LanguageContext.jsx";
import { findLesson } from "./content/index.js";
import "./lib/pythonRunner.js"; // démarre le chargement de Python dès l'ouverture

function pageTitle(route, t, tr) {
  if (route.view === "sandbox") return t("sandbox");
  if (route.view === "syllabus") return t("syllabus");
  if (route.view === "lesson") {
    const ctx = findLesson(route.lessonId);
    return ctx
      ? `${t("moduleN", { n: ctx.module.number })} · ${ctx.lesson.number} ${tr(ctx.lesson.title)}`
      : t("lessonNotFound");
  }
  return t("home");
}

function Shell() {
  const [route, navigate] = useHashRoute();
  const [dark, setDark] = useTheme();
  const { lang, t, tr } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef(null);
  const title = pageTitle(route, t, tr);

  // Nouvelle page : on remonte en haut et on ferme le menu mobile.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    setMenuOpen(false);
  }, [route]);

  useEffect(() => {
    document.title = `${title} · PyLab`;
  }, [title]);

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar route={route} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} onMenu={() => setMenuOpen(true)} dark={dark} onToggleTheme={() => setDark((d) => !d)} />
        {/* relative : les éléments en position absolue (sr-only…) restent dans la zone qui défile */}
        <main ref={mainRef} className="relative flex-1 overflow-y-auto">
          {route.view === "home" && <HomeView />}
          {route.view === "sandbox" && <SandboxView key={lang} />}
          {route.view === "syllabus" && <SyllabusView />}
          {route.view === "lesson" && <LessonView key={route.lessonId} lessonId={route.lessonId} onNavigate={navigate} />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <Shell />
      </ProgressProvider>
    </LanguageProvider>
  );
}
