import { useCallback, useEffect, useState } from "react";

/**
 * Routage minimaliste basé sur le hash de l'URL (aucune configuration serveur requise) :
 *   #/                 → accueil
 *   #/lesson/m1-l2     → leçon
 *   #/sandbox          → bac à sable
 *   #/syllabus         → plan du cours (séances du PDF → leçons)
 */
function parse(hash) {
  const [view, param] = hash.replace(/^#\/?/, "").split("/");
  if (view === "lesson" && param) return { view: "lesson", lessonId: decodeURIComponent(param) };
  if (view === "sandbox") return { view: "sandbox" };
  if (view === "syllabus") return { view: "syllabus" };
  return { view: "home" };
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path;
  }, []);

  return [route, navigate];
}
