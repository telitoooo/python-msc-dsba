/**
 * Outils d'écriture du contenu des exercices.
 *
 *   py`...`  → code Python brut (les « \n » restent tels quels), désindenté.
 *   md`...`  → texte Markdown désindenté (écrire \` pour un backtick).
 *   test(label, check, show?)
 *       label : description affichée à l'élève (Markdown court)
 *       check : expression Python évaluée après le code de l'élève
 *       show  : expression dont la valeur est affichée en cas d'échec
 *
 * Dans `check`, on dispose de toutes les variables du programme ainsi que de :
 *   OUTPUT, LINES, SOURCE, uses('For'), calls('sum'), capture(f, *args),
 *   run_with(stdin="", **variables), pick(env, 'a', 'b'), approx(a, b),
 *   raises(Exc, f, *args), error_message(f, *args), recursive('f'), assigns('list'),
 *   read_file(chemin), file_exists(chemin), FILES, uses_in(fichier, ...), calls_in(fichier, nom)
 * (voir src/lib/runner.py).
 *
 * Champs facultatifs d'un niveau : stdin, files (données en lecture seule),
 * modules + solutionModules (autres fichiers .py éditables, en onglets), hint, explanation.
 */
function dedent(text) {
  const lines = text.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min)).join("\n");
}

/**
 * Assemble un gabarit. Une valeur insérée sur plusieurs lignes (ex. une fonction
 * partagée entre exercices) reprend l'indentation de la ligne où elle est placée.
 */
function interpolate(parts, values) {
  let out = "";
  parts.forEach((part, i) => {
    out += part;
    if (i < values.length) {
      const indent = /(?:^|\n)([ \t]*)[^\n]*$/.exec(out)[1];
      out += String(values[i]).replace(/\n$/, "").split("\n").join("\n" + indent);
    }
  });
  return out;
}

export function py(strings, ...values) {
  return dedent(interpolate(strings.raw, values)) + "\n";
}

export function md(strings, ...values) {
  return dedent(interpolate(strings, values));
}

export function test(label, check, show) {
  return show ? { label, check, show } : { label, check };
}
