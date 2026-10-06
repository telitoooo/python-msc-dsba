import { md, py, test } from "../helpers.js";

const r = String.raw;

// ------------------------------------------------------------------ données
// Début de « Pride and Prejudice » (Jane Austen, 1813, domaine public), comme dans le TD.
const LIVRE = py`
  It is a truth universally acknowledged, that a single man in possession
  of a good fortune, must be in want of a wife.

  However little known the feelings or views of such a man may be on his
  first entering a neighbourhood, this truth is so well fixed in the minds
  of the surrounding families, that he is considered the rightful property
  of some one or other of their daughters.

  "My dear Mr. Bennet," said his lady to him one day, "have you heard that
  Netherfield Park is let at last?"

  Mr. Bennet replied that he had not.

  "But it is," returned she; "for Mrs. Long has just been here, and she
  told me all about it."

  Mr. Bennet made no answer.

  "Do you not want to know who has taken it?" cried his wife impatiently.

  "_You_ want to tell me, and I have no objection to hearing it."

  This was invitation enough.
`;

// Extrait de la carte du TD (format : ville:x:y, puis --, puis villeA:villeB:distance).
const CARTE = py`
  La Baule-Escoublac:356:638
  Saint-Nazaire:484:563
  Guerande:180:340
  Saint-Andre-des-Eaux:345:402
  Pornichet:420:690
  Le Croisic:120:600
  Nantes:880:520
  Saint-Brevin-les-Pins:520:760
  --
  La Baule-Escoublac:Saint-Nazaire:15
  La Baule-Escoublac:Guerande:6
  La Baule-Escoublac:Saint-Andre-des-Eaux:8
  La Baule-Escoublac:Pornichet:5
  Le Croisic:La Baule-Escoublac:10
  Guerande:Le Croisic:11
  Guerande:Saint-Andre-des-Eaux:9
  Saint-Nazaire:Pornichet:11
  Saint-Nazaire:Saint-Andre-des-Eaux:10
  Saint-Nazaire:Nantes:63
  Saint-Nazaire:Saint-Brevin-les-Pins:14
`;

const LIRE_CARTE = py`
  def lire_carte(chemin):
      """Renvoie {ville: {"coords": (x, y), "next": {voisin: distance}}}."""
      carte = {}
      with open(chemin, encoding="utf-8") as f:
          lignes = [ligne.strip() for ligne in f if ligne.strip()]
      separation = lignes.index("--")
      for ligne in lignes[:separation]:
          nom, x, y = ligne.split(":")
          carte[nom] = {"coords": (int(x), int(y)), "next": {}}
      for ligne in lignes[separation + 1:]:
          ville_a, ville_b, distance = ligne.split(":")
          carte[ville_a]["next"][ville_b] = int(distance)
          carte[ville_b]["next"][ville_a] = int(distance)   # route à double sens
      return carte
`;

const PROJET = {
  "analyse_ventes/README.md": "# Analyse des ventes\n\nProjet d'exemple pour explorer une arborescence.\n",
  "analyse_ventes/app.py": "from src.statistiques import resume\n\nprint(resume())\n",
  "analyse_ventes/config.py": "SEUIL = 100\nDEVISE = \"EUR\"\n",
  "analyse_ventes/.env": "API_KEY=ne-jamais-publier\n",
  "analyse_ventes/src/__init__.py": "",
  "analyse_ventes/src/nettoyage.py": "def nettoyer(lignes):\n    return [l.strip() for l in lignes if l.strip()]\n",
  "analyse_ventes/src/statistiques.py": "def resume():\n    return \"rien à signaler\"\n",
  "analyse_ventes/tests/test_statistiques.py": "from src.statistiques import resume\n\n\ndef test_resume():\n    assert resume()\n",
  "analyse_ventes/data/ventes_2025.csv": "mois;montant\njan;120\nfev;95\nmar;143\n",
  "analyse_ventes/data/ventes_2026.csv": "mois;montant\njan;131\nfev;102\n",
  "analyse_ventes/data/clients.json": "[{\"nom\": \"Ada\"}, {\"nom\": \"Alan\"}]\n",
};

const TELECHARGEMENTS = {
  "telechargements/rapport_final.pdf": "%PDF-1.7 (contenu fictif)\n",
  "telechargements/photo_vacances.jpg": "JFIF (image fictive)\n",
  "telechargements/ventes.csv": "mois;montant\njan;120\n",
  "telechargements/clients.csv": "nom;ville\nAda;Londres\n",
  "telechargements/notes.txt": "Penser à trier ce dossier !\n",
  "telechargements/script.py": "print('bonjour')\n",
  "telechargements/LISEZMOI": "Fichier sans extension.\n",
};

const BANQUE_MONOLITHE = py`
  import json


  class SoldeInsuffisant(Exception):
      """Retrait supérieur au solde."""


  def nouveau_compte(solde=100.0):
      return {"solde": float(solde), "historique": []}


  def deposer(compte, montant):
      if montant <= 0:
          raise ValueError("Le montant doit être positif")
      compte["solde"] += montant
      compte["historique"].append(["dépôt", montant])


  def retirer(compte, montant):
      if montant <= 0:
          raise ValueError("Le montant doit être positif")
      if montant > compte["solde"]:
          raise SoldeInsuffisant(f"Solde insuffisant : {compte['solde']:.2f} €")
      compte["solde"] -= montant
      compte["historique"].append(["retrait", montant])


  def sauvegarder(compte, chemin):
      with open(chemin, "w", encoding="utf-8") as f:
          json.dump(compte, f)


  def charger(chemin):
      try:
          with open(chemin, encoding="utf-8") as f:
              return json.load(f)
      except FileNotFoundError:
          return nouveau_compte()


  def main():
      compte = charger("compte.json")
      while True:
          commande = input("> ").split()
          if not commande or commande[0] == "quitter":
              break
          try:
              if commande[0] == "depot":
                  deposer(compte, float(commande[1]))
              elif commande[0] == "retrait":
                  retirer(compte, float(commande[1]))
              print(f"Solde : {compte['solde']:.2f} €")
          except (ValueError, IndexError):
              print("Montant invalide")
          except SoldeInsuffisant as e:
              print(e)
      sauvegarder(compte, "compte.json")


  if __name__ == "__main__":
      main()
`;

// Petits fichiers texte pour les mini-commandes wc et grep (leçon 5.2).
const TEXTES = {
  "textes/poeme.txt": "Le Python est un langage\nqui se lit comme une page.\n\nOn l'écrit avec plaisir,\net il fait ce qu'on désire.\n",
  "textes/notes.txt": "python : listes et dictionnaires\nSQL : jointures\nPython : fichiers et exceptions\npandas : DataFrame\n",
  "textes/sans_fin.txt": "un deux\ntrois",
  "textes/vide.txt": "",
};

export default {
  // ---------------------------------------------------------------- 5.1
  "m5-l1": [
    {
      id: "ex1",
      title: "Lire et écrire des fichiers texte",
      tiers: {
        core: {
          title: "Un carnet de notes sur disque",
          prompt: md`
            Écrivez deux fonctions :

            - \`ecrire_notes(chemin, notes)\` : écrit le dictionnaire \`notes\` dans le fichier, une ligne
              \`nom;note\` par élève (le fichier est **écrasé** s'il existe) ;
            - \`lire_notes(chemin)\` : relit ce fichier et renvoie le dictionnaire \`{nom: note}\`, les notes
              étant converties en \`float\`. Les lignes vides doivent être ignorées.

            Utilisez \`with open(...)\` avec \`encoding="utf-8"\`. Après l'exécution, ouvrez le panneau
            **Dossier de travail** sous le terminal pour voir le fichier créé.
          `,
          hint: md`
            En lecture : \`for ligne in f:\`, puis \`ligne.strip()\` ; si la ligne est vide, \`continue\` ;
            sinon \`nom, note = ligne.split(";")\`.
          `,
          starter: py`
            def ecrire_notes(chemin, notes):
                """Écrit une ligne « nom;note » par élève."""
                ...


            def lire_notes(chemin):
                """Relit le fichier et renvoie {nom: note (float)}."""
                ...


            notes = {"Ada": 17.5, "Alan": 14, "Grace": 19}
            ecrire_notes("notes.txt", notes)
            print(lire_notes("notes.txt"))
          `,
          solution: py`
            def ecrire_notes(chemin, notes):
                """Écrit une ligne « nom;note » par élève."""
                with open(chemin, "w", encoding="utf-8") as f:
                    for nom, note in notes.items():
                        f.write(f"{nom};{note}\n")


            def lire_notes(chemin):
                """Relit le fichier et renvoie {nom: note (float)}."""
                resultat = {}
                with open(chemin, encoding="utf-8") as f:
                    for ligne in f:
                        ligne = ligne.strip()
                        if not ligne:
                            continue
                        nom, note = ligne.split(";")
                        resultat[nom] = float(note)
                return resultat


            notes = {"Ada": 17.5, "Alan": 14, "Grace": 19}
            ecrire_notes("notes.txt", notes)
            print(lire_notes("notes.txt"))
          `,
          tests: [
            test(
              "`notes.txt` contient une ligne `nom;note` par élève",
              r`read_file('notes.txt') == 'Ada;17.5\nAlan;14\nGrace;19\n'`,
              "read_file('notes.txt')",
            ),
            test(
              "`lire_notes` relit les notes en `float`",
              "lire_notes('notes.txt') == {'Ada': 17.5, 'Alan': 14.0, 'Grace': 19.0} and all(type(v) is float for v in lire_notes('notes.txt').values())",
              "lire_notes('notes.txt')",
            ),
            test("Les lignes vides sont ignorées", r`(open('trous.txt', 'w').write('A;1\n\nB;2\n\n'), lire_notes('trous.txt'))[1] == {'A': 1.0, 'B': 2.0}`),
            test(
              "`ecrire_notes` écrase le fichier existant (mode `\"w\"`)",
              r`(ecrire_notes('t.txt', {'X': 1}), ecrire_notes('t.txt', {'Y': 2}), read_file('t.txt'))[2] == 'Y;2\n'`,
            ),
            test("Les fichiers sont ouverts avec `with`", "uses('With')"),
          ],
        },
        extra: {
          title: "Statistiques de mots d'un livre",
          prompt: md`
            Le dossier de travail contient \`livre.txt\` : le début de *Pride and Prejudice* de Jane Austen
            (le TD le télécharge depuis le projet Gutenberg avec \`requests\`, indisponible dans le navigateur).

            1. \`lire_mots(chemin)\` : liste de tous les mots, **en minuscules**, sans ponctuation. Règle :
               toute lettre (\`c.isalpha()\`) est conservée, tout autre caractère devient un espace.
            2. \`compter_mots(mots)\` : dictionnaire \`{mot: occurrences}\`, **écrit à la main**.
            3. \`ecrire_frequences(compte, chemin)\` : écrit une ligne \`mot nombre\` par mot, du plus fréquent
               au moins fréquent, et par **ordre alphabétique** en cas d'égalité.

            Le programme compare ensuite avec \`collections.Counter\`, dont \`most_common(n)\` fait la dernière étape pour vous.
          `,
          hint: md`
            \`"".join(c if c.isalpha() else " " for c in texte)\` puis \`.split()\`.
            Pour le tri : \`sorted(compte.items(), key=lambda paire: (-paire[1], paire[0]))\`.
          `,
          files: { "livre.txt": LIVRE },
          starter: py`
            from collections import Counter


            def lire_mots(chemin):
                """Liste des mots du fichier, en minuscules, sans ponctuation."""
                ...


            def compter_mots(mots):
                """Dictionnaire {mot: nombre d'occurrences}, sans utiliser Counter."""
                ...


            def ecrire_frequences(compte, chemin):
                """Une ligne « mot nombre », du plus fréquent au moins fréquent."""
                ...


            mots = lire_mots("livre.txt")
            compte = compter_mots(mots)
            ecrire_frequences(compte, "frequences.txt")
            print(len(mots), "mots,", len(compte), "mots différents")

            # Comparaison avec collections.Counter :
            print(Counter(mots).most_common(5))
          `,
          solution: py`
            from collections import Counter


            def lire_mots(chemin):
                """Liste des mots du fichier, en minuscules, sans ponctuation."""
                with open(chemin, encoding="utf-8") as f:
                    texte = f.read().lower()
                propre = "".join(c if c.isalpha() else " " for c in texte)
                return propre.split()


            def compter_mots(mots):
                """Dictionnaire {mot: nombre d'occurrences}, sans utiliser Counter."""
                compte = {}
                for mot in mots:
                    compte[mot] = compte.get(mot, 0) + 1
                return compte


            def ecrire_frequences(compte, chemin):
                """Une ligne « mot nombre », du plus fréquent au moins fréquent."""
                tries = sorted(compte.items(), key=lambda paire: (-paire[1], paire[0]))
                with open(chemin, "w", encoding="utf-8") as f:
                    for mot, nombre in tries:
                        f.write(f"{mot} {nombre}\n")


            mots = lire_mots("livre.txt")
            compte = compter_mots(mots)
            ecrire_frequences(compte, "frequences.txt")
            print(len(mots), "mots,", len(compte), "mots différents")

            # Comparaison avec collections.Counter :
            print(Counter(mots).most_common(5))
          `,
          explanation: md`
            Avec \`Counter\`, tout tient en deux lignes : \`compte = Counter(mots)\` puis
            \`compte.most_common(20)\`. Écrire la version manuelle d'abord permet de comprendre ce qu'il fait.
          `,
          tests: [
            test(
              "`lire_mots` ignore ponctuation et majuscules",
              `(open('mini.txt', 'w').write('Hello, world! "Hello" -- WORLD.'), lire_mots('mini.txt'))[1] == ['hello', 'world', 'hello', 'world']`,
            ),
            test("`livre.txt` contient 153 mots, dont 99 différents", "len(mots) == 153 and len(compte) == 99", "(len(mots), len(compte))"),
            test(
              "`compter_mots` donne le même résultat que `Counter`",
              "compter_mots(mots) == dict(__import__('collections').Counter(mots)) and compter_mots(['a', 'b', 'a']) == {'a': 2, 'b': 1}",
            ),
            test(
              "`frequences.txt` commence par `a 6`, `of 6`, `is 5`, `it 5`",
              "read_file('frequences.txt').splitlines()[:4] == ['a 6', 'of 6', 'is 5', 'it 5']",
              "read_file('frequences.txt').splitlines()[:4]",
            ),
            test("Une ligne par mot différent", "len(read_file('frequences.txt').splitlines()) == 99"),
          ],
        },
        stretch: {
          title: "Lire la carte de France",
          prompt: md`
            Le fichier \`france_lite.map\` décrit des villes reliées par des routes, en deux blocs séparés par \`--\` :

            \`\`\`text
            La Baule-Escoublac:356:638          ← ville:x:y
            ...
            --
            La Baule-Escoublac:Saint-Nazaire:15 ← villeA:villeB:distance
            \`\`\`

            1. \`lire_carte(chemin)\` renvoie **trois dictionnaires imbriqués** :
               \`{ville: {"coords": (x, y), "next": {voisin: distance}}}\`, avec des entiers.
               Les routes sont **à double sens** : chaque route apparaît dans le \`next\` de ses deux villes.
            2. \`voisins_tries(carte, ville)\` renvoie la liste des \`(voisin, distance)\`, du plus proche au plus lointain.

            Une fois que cela fonctionne, votre code doit lire aussi le fichier complet \`france.map\` des ressources du TD.
          `,
          hint: md`
            Lisez toutes les lignes non vides, trouvez l'indice de \`"--"\` avec \`lignes.index("--")\`,
            puis traitez séparément \`lignes[:i]\` et \`lignes[i + 1:]\` avec \`split(":")\`.
          `,
          files: { "france_lite.map": CARTE },
          starter: py`
            def lire_carte(chemin):
                """Renvoie {ville: {"coords": (x, y), "next": {voisin: distance}}}."""
                ...


            def voisins_tries(carte, ville):
                """Liste des (voisin, distance), du plus proche au plus lointain."""
                ...


            carte = lire_carte("france_lite.map")
            print(len(carte), "villes")
            for voisin, distance in voisins_tries(carte, "La Baule-Escoublac"):
                print(f"  {voisin:<22} {distance:>3} km")
          `,
          solution: py`
            ${LIRE_CARTE}

            def voisins_tries(carte, ville):
                """Liste des (voisin, distance), du plus proche au plus lointain."""
                return sorted(carte[ville]["next"].items(), key=lambda paire: paire[1])


            carte = lire_carte("france_lite.map")
            print(len(carte), "villes")
            for voisin, distance in voisins_tries(carte, "La Baule-Escoublac"):
                print(f"  {voisin:<22} {distance:>3} km")
          `,
          tests: [
            test("La carte contient 8 villes", "len(carte) == 8", "len(carte)"),
            test(
              "Les coordonnées sont un tuple d'entiers",
              "carte['La Baule-Escoublac']['coords'] == (356, 638) and type(carte['Nantes']['coords']) is tuple",
              "carte['La Baule-Escoublac']['coords']",
            ),
            test(
              "Voisins de La Baule-Escoublac (routes dans les deux sens)",
              "carte['La Baule-Escoublac']['next'] == {'Saint-Nazaire': 15, 'Guerande': 6, 'Saint-Andre-des-Eaux': 8, 'Pornichet': 5, 'Le Croisic': 10}",
              "carte['La Baule-Escoublac']['next']",
            ),
            test("Nantes n'a qu'un voisin : Saint-Nazaire à 63 km", "carte['Nantes']['next'] == {'Saint-Nazaire': 63}", "carte['Nantes']['next']"),
            test(
              "`voisins_tries` trie par distance",
              "voisins_tries(carte, 'La Baule-Escoublac') == [('Pornichet', 5), ('Guerande', 6), ('Saint-Andre-des-Eaux', 8), ('Le Croisic', 10), ('Saint-Nazaire', 15)]",
              "voisins_tries(carte, 'La Baule-Escoublac')",
            ),
            test(
              "Fonctionne sur une autre carte",
              r`(open('mini.map', 'w').write('A:0:0\nB:3:4\n--\nA:B:5\n'), lire_carte('mini.map'))[1] == {'A': {'coords': (0, 0), 'next': {'B': 5}}, 'B': {'coords': (3, 4), 'next': {'A': 5}}}`,
            ),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 5.2
  "m5-l2": [
    {
      id: "ex1",
      title: "Explorer une arborescence",
      tiers: {
        core: {
          title: "Chercher des fichiers avec glob",
          prompt: md`
            Le dossier de travail contient un petit projet \`analyse_ventes/\` (ouvrez le panneau
            **Dossier de travail** pour le parcourir). Avec le module \`glob\`, créez :

            - \`racine\` : la liste **triée** des fichiers \`.py\` situés directement dans \`analyse_ventes/\` ;
            - \`tous\` : la liste **triée** de tous les fichiers \`.py\` du projet, sous-dossiers compris ;
            - \`nb_csv\` : le nombre de fichiers \`.csv\` dans \`analyse_ventes/data/\`.
          `,
          hint: md`
            \`glob.glob("analyse_ventes/*.py")\` pour un seul niveau ;
            \`glob.glob("analyse_ventes/**/*.py", recursive=True)\` pour tous les niveaux.
          `,
          files: PROJET,
          starter: py`
            import glob

            racine = ...
            tous = ...
            nb_csv = ...

            print(racine)
            for chemin in tous:
                print(" -", chemin)
            print(nb_csv, "fichiers CSV")
          `,
          solution: py`
            import glob

            racine = sorted(glob.glob("analyse_ventes/*.py"))
            tous = sorted(glob.glob("analyse_ventes/**/*.py", recursive=True))
            nb_csv = len(glob.glob("analyse_ventes/data/*.csv"))

            print(racine)
            for chemin in tous:
                print(" -", chemin)
            print(nb_csv, "fichiers CSV")
          `,
          explanation: md`
            Les motifs de \`glob\` **ignorent les fichiers cachés** (dont le nom commence par un point,
            comme \`.env\`). \`pathlib\`, lui, les inclut.
          `,
          tests: [
            test("`racine` : `app.py` et `config.py`", "racine == ['analyse_ventes/app.py', 'analyse_ventes/config.py']", "racine"),
            test(
              "`tous` : les 6 fichiers `.py`, triés",
              "tous == ['analyse_ventes/app.py', 'analyse_ventes/config.py', 'analyse_ventes/src/__init__.py', 'analyse_ventes/src/nettoyage.py', 'analyse_ventes/src/statistiques.py', 'analyse_ventes/tests/test_statistiques.py']",
              "tous",
            ),
            test("`nb_csv` vaut 2", "nb_csv == 2", "nb_csv"),
            test("Le module `glob` est utilisé", "calls('glob')"),
          ],
        },
        extra: {
          title: "Inventaire avec pathlib",
          prompt: md`
            Refaites l'exploration avec \`pathlib\`, le module moderne pour manipuler les chemins :

            - \`inventaire(dossier, extension)\` : liste triée des couples \`(chemin relatif, taille en octets)\`
              de tous les fichiers ayant cette extension, sous-dossiers compris. Le chemin est relatif au
              \`dossier\` et s'écrit avec des \`/\` (ex. \`"data/ventes_2025.csv"\`) ;
            - \`taille_totale(dossier)\` : somme des tailles de **tous** les fichiers du dossier (cachés compris).

            Le programme affiche aussi la date de dernière modification de chaque fichier.
          `,
          hint: md`
            \`Path(dossier).rglob("*" + extension)\`, puis \`p.relative_to(dossier).as_posix()\` et
            \`p.stat().st_size\`. Pour ne garder que les fichiers : \`p.is_file()\`.
          `,
          files: PROJET,
          starter: py`
            from datetime import datetime
            from pathlib import Path


            def inventaire(dossier, extension):
                ...


            def taille_totale(dossier):
                ...


            for chemin, taille in inventaire("analyse_ventes", ".py"):
                modif = datetime.fromtimestamp(Path("analyse_ventes", chemin).stat().st_mtime)
                print(f"{chemin:<32} {taille:>4} o   modifié le {modif:%d/%m/%Y %H:%M}")
            print("Taille totale :", taille_totale("analyse_ventes"), "octets")
          `,
          solution: py`
            from datetime import datetime
            from pathlib import Path


            def inventaire(dossier, extension):
                racine = Path(dossier)
                return sorted(
                    (p.relative_to(racine).as_posix(), p.stat().st_size)
                    for p in racine.rglob("*" + extension)
                    if p.is_file()
                )


            def taille_totale(dossier):
                return sum(p.stat().st_size for p in Path(dossier).rglob("*") if p.is_file())


            for chemin, taille in inventaire("analyse_ventes", ".py"):
                modif = datetime.fromtimestamp(Path("analyse_ventes", chemin).stat().st_mtime)
                print(f"{chemin:<32} {taille:>4} o   modifié le {modif:%d/%m/%Y %H:%M}")
            print("Taille totale :", taille_totale("analyse_ventes"), "octets")
          `,
          explanation: md`
            Comparez avec la version \`os.path\` + \`glob\` : \`pathlib\` regroupe tout dans un seul objet
            (\`.name\`, \`.suffix\`, \`.stat()\`, \`.rglob()\`…), ce qui rend le code plus lisible à maintenir.
          `,
          tests: [
            test(
              "`inventaire(..., '.csv')` donne chemins relatifs et tailles",
              "inventaire('analyse_ventes', '.csv') == [('data/ventes_2025.csv', 36), ('data/ventes_2026.csv', 29)]",
              "inventaire('analyse_ventes', '.csv')",
            ),
            test(
              "`inventaire(..., '.py')` liste les 6 modules, triés",
              "[c for c, t in inventaire('analyse_ventes', '.py')] == ['app.py', 'config.py', 'src/__init__.py', 'src/nettoyage.py', 'src/statistiques.py', 'tests/test_statistiques.py']",
              "inventaire('analyse_ventes', '.py')",
            ),
            test("`taille_totale` compte tous les fichiers (cachés compris)", "taille_totale('analyse_ventes') == 471", "taille_totale('analyse_ventes')"),
            test("`pathlib` est utilisé", "'pathlib' in SOURCE and (calls('rglob') or calls('glob'))"),
          ],
        },
        stretch: {
          title: "Ranger un dossier de téléchargements",
          prompt: md`
            Le dossier \`telechargements/\` est en désordre. Écrivez \`ranger_par_extension(dossier)\` qui :

            - déplace chaque **fichier** situé directement dans \`dossier\` vers un sous-dossier portant le nom
              de son extension, en minuscules et sans le point (\`rapport.pdf\` → \`pdf/rapport.pdf\`) ;
            - range les fichiers sans extension dans \`autres/\` ;
            - ignore les sous-dossiers existants ;
            - renvoie un dictionnaire \`{nom du sous-dossier: nombre de fichiers déplacés}\`.

            Après l'exécution, le panneau **Dossier de travail** montre les fichiers déplacés.
          `,
          hint: md`
            \`for p in Path(dossier).iterdir():\` ; \`p.is_file()\` ; \`p.suffix\` vaut \`""\` sans extension.
            Créez la cible avec \`cible.mkdir(exist_ok=True)\` puis déplacez avec \`p.rename(cible / p.name)\`.
            Attention : construisez la liste des fichiers **avant** de déplacer quoi que ce soit.
          `,
          files: TELECHARGEMENTS,
          starter: py`
            from pathlib import Path


            def ranger_par_extension(dossier):
                ...


            bilan = ranger_par_extension("telechargements")
            print(bilan)
          `,
          solution: py`
            from pathlib import Path


            def ranger_par_extension(dossier):
                racine = Path(dossier)
                bilan = {}
                fichiers = [p for p in racine.iterdir() if p.is_file()]
                for p in fichiers:
                    nom = p.suffix[1:].lower() or "autres"
                    cible = racine / nom
                    cible.mkdir(exist_ok=True)
                    p.rename(cible / p.name)
                    bilan[nom] = bilan.get(nom, 0) + 1
                return bilan


            bilan = ranger_par_extension("telechargements")
            print(bilan)
          `,
          tests: [
            test(
              "Le bilan compte les fichiers par extension",
              "bilan == {'pdf': 1, 'jpg': 1, 'csv': 2, 'txt': 1, 'py': 1, 'autres': 1}",
              "bilan",
            ),
            test(
              "Les CSV sont dans `telechargements/csv/`",
              "file_exists('telechargements/csv/ventes.csv') and file_exists('telechargements/csv/clients.csv')",
            ),
            test("`LISEZMOI` est rangé dans `autres/`", "file_exists('telechargements/autres/LISEZMOI')"),
            test("Plus aucun fichier à la racine du dossier", "not any(f.is_file() for f in __import__('pathlib').Path('telechargements').iterdir())"),
            test("Un second appel ne déplace plus rien (sous-dossiers ignorés)", "ranger_par_extension('telechargements') == {}"),
          ],
        },
      },
    },
    {
      id: "ex2",
      title: "Environnement et commandes du terminal",
      tiers: {
        core: {
          title: "Configurer par l'environnement",
          prompt: md`
            Les variables d'environnement se lisent et se modifient avec le dictionnaire \`os.environ\`. Écrivez :

            1. \`lire_parametre(nom, defaut=None)\` : la valeur de la variable \`nom\`, ou \`defaut\` si elle n'existe
               pas (sans \`KeyError\`) ;
            2. \`ajouter_au_path(dossier)\` : ajoute \`dossier\` **à la fin** de la variable \`PATH\` (les dossiers y
               sont séparés par \`:\`), **seulement s'il n'y est pas déjà** ;
            3. \`retirer_du_path(dossier)\` : retire \`dossier\` de \`PATH\`.

            Exemple : avec \`PATH = "/usr/bin:/bin"\`, \`ajouter_au_path("/opt/py")\` donne \`"/usr/bin:/bin:/opt/py"\`.
          `,
          hint: md`
            \`os.environ.get(nom, defaut)\`. Pour \`PATH\` : \`dossiers = os.environ.get("PATH", "").split(":")\`,
            puis \`":".join(...)\` pour reconstruire la chaîne (en ignorant les morceaux vides).
          `,
          starter: py`
            import os


            def lire_parametre(nom, defaut=None):
                ...


            def ajouter_au_path(dossier):
                ...


            def retirer_du_path(dossier):
                ...


            os.environ["NIVEAU"] = "expert"
            print(lire_parametre("NIVEAU"), lire_parametre("COULEUR", "bleu"))

            os.environ["PATH"] = "/usr/bin:/bin"
            ajouter_au_path("/opt/python")
            print(os.environ["PATH"])
            retirer_du_path("/opt/python")
            print(os.environ["PATH"])
          `,
          solution: py`
            import os


            def lire_parametre(nom, defaut=None):
                return os.environ.get(nom, defaut)


            def ajouter_au_path(dossier):
                dossiers = [d for d in os.environ.get("PATH", "").split(":") if d]
                if dossier not in dossiers:
                    dossiers.append(dossier)
                os.environ["PATH"] = ":".join(dossiers)


            def retirer_du_path(dossier):
                dossiers = [d for d in os.environ.get("PATH", "").split(":") if d and d != dossier]
                os.environ["PATH"] = ":".join(dossiers)


            os.environ["NIVEAU"] = "expert"
            print(lire_parametre("NIVEAU"), lire_parametre("COULEUR", "bleu"))

            os.environ["PATH"] = "/usr/bin:/bin"
            ajouter_au_path("/opt/python")
            print(os.environ["PATH"])
            retirer_du_path("/opt/python")
            print(os.environ["PATH"])
          `,
          tests: [
            test(
              "`lire_parametre` : valeur ou défaut",
              "(os.environ.__setitem__('PYLAB_TEST', 'ok'), lire_parametre('PYLAB_TEST'))[1] == 'ok' and lire_parametre('PYLAB_ABSENT', 'def') == 'def' and lire_parametre('PYLAB_ABSENT') is None",
            ),
            test(
              "`ajouter_au_path` ajoute à la fin",
              "(os.environ.__setitem__('PATH', '/usr/bin:/bin'), ajouter_au_path('/opt/py'), os.environ['PATH'])[2] == '/usr/bin:/bin:/opt/py'",
              "os.environ['PATH']",
            ),
            test(
              "Pas de doublon dans `PATH`",
              "(os.environ.__setitem__('PATH', '/usr/bin:/bin'), ajouter_au_path('/bin'), os.environ['PATH'])[2] == '/usr/bin:/bin'",
            ),
            test(
              "`retirer_du_path`",
              "(os.environ.__setitem__('PATH', '/usr/bin:/opt/py:/bin'), retirer_du_path('/opt/py'), os.environ['PATH'])[2] == '/usr/bin:/bin'",
            ),
            test("`os.environ` est utilisé", "'os.environ' in SOURCE"),
          ],
        },
        extra: {
          title: "Un mini wc",
          prompt: md`
            La commande \`wc\` (*word count*) du terminal affiche le nombre de **lignes**, de **mots** et de
            **caractères** d'un fichier. Programmez-la :

            1. \`wc(chemin)\` renvoie le tuple \`(lignes, mots, caracteres)\`. Comme \`wc\`, on compte les lignes
               en comptant les \`"\\n"\` ; les mots sont séparés par des blancs ;
            2. \`wc_motif(motif)\` applique \`wc\` à tous les fichiers qui correspondent au motif \`glob\` et renvoie
               un dictionnaire \`{chemin: (lignes, mots, caracteres)}\`, plus une clé \`"total"\` qui additionne tout.

            Le dossier \`textes/\` contient quatre fichiers (dont un vide).
          `,
          hint: md`
            \`contenu.count("\\n")\`, \`len(contenu.split())\`, \`len(contenu)\`. Pour le total, additionnez les
            tuples composante par composante (par exemple avec trois compteurs).
          `,
          files: TEXTES,
          starter: py`
            import glob


            def wc(chemin):
                ...


            def wc_motif(motif):
                ...


            for chemin, (lignes, mots, caracteres) in sorted(wc_motif("textes/*.txt").items()):
                print(f"{lignes:>4} {mots:>4} {caracteres:>5}  {chemin}")
          `,
          solution: py`
            import glob


            def wc(chemin):
                with open(chemin, encoding="utf-8") as f:
                    contenu = f.read()
                return contenu.count("\n"), len(contenu.split()), len(contenu)


            def wc_motif(motif):
                resultat = {}
                total_lignes = total_mots = total_caracteres = 0
                for chemin in sorted(glob.glob(motif)):
                    lignes, mots, caracteres = wc(chemin)
                    resultat[chemin] = (lignes, mots, caracteres)
                    total_lignes += lignes
                    total_mots += mots
                    total_caracteres += caracteres
                resultat["total"] = (total_lignes, total_mots, total_caracteres)
                return resultat


            for chemin, (lignes, mots, caracteres) in sorted(wc_motif("textes/*.txt").items()):
                print(f"{lignes:>4} {mots:>4} {caracteres:>5}  {chemin}")
          `,
          tests: [
            test("`wc('textes/poeme.txt')` → (5, 21, 106)", "wc('textes/poeme.txt') == (5, 21, 106)", "wc('textes/poeme.txt')"),
            test("Fichier vide et fichier sans retour final", "wc('textes/vide.txt') == (0, 0, 0) and wc('textes/sans_fin.txt') == (1, 3, 13)"),
            test("`wc_motif` : un résultat par fichier", "set(wc_motif('textes/*.txt')) == {'textes/poeme.txt', 'textes/notes.txt', 'textes/sans_fin.txt', 'textes/vide.txt', 'total'}"),
            test("Le total", "wc_motif('textes/*.txt')['total'] == (10, 40, 219)", "wc_motif('textes/*.txt').get('total')"),
            test("Un motif sans correspondance", "wc_motif('textes/*.csv') == {'total': (0, 0, 0)}"),
          ],
        },
        stretch: {
          title: "Un mini grep",
          prompt: md`
            La commande \`grep motif fichiers\` affiche les lignes des fichiers qui contiennent un motif.
            Programmez :

            1. \`grep(motif, chemins, ignorer_casse=False)\` renvoie la liste des lignes trouvées, au format
               \`"chemin:numéro:ligne"\` (lignes numérotées à partir de 1, sans leur \`"\\n"\`), dans l'ordre des
               fichiers puis des lignes. Avec \`ignorer_casse=True\`, \`"python"\` trouve aussi \`"Python"\` ;
            2. \`compter(motif, chemins)\` (comme \`grep -c\`) renvoie \`{chemin: nombre de lignes trouvées}\`
               pour chaque fichier (0 compris).

            Le programme cherche \`python\` dans tous les fichiers \`textes/*.txt\`, triés.
          `,
          hint: md`
            \`for numero, ligne in enumerate(f, start=1):\` ; comparez \`motif.lower() in ligne.lower()\` si
            \`ignorer_casse\`. \`ligne.rstrip("\\n")\` retire le retour à la ligne final.
          `,
          files: TEXTES,
          starter: py`
            import glob


            def grep(motif, chemins, ignorer_casse=False):
                ...


            def compter(motif, chemins):
                ...


            fichiers = sorted(glob.glob("textes/*.txt"))
            for trouvee in grep("python", fichiers, ignorer_casse=True):
                print(trouvee)
            print(compter("python", fichiers))
          `,
          solution: py`
            import glob


            def grep(motif, chemins, ignorer_casse=False):
                trouvees = []
                for chemin in chemins:
                    with open(chemin, encoding="utf-8") as f:
                        for numero, ligne in enumerate(f, start=1):
                            ligne = ligne.rstrip("\n")
                            if ignorer_casse:
                                present = motif.lower() in ligne.lower()
                            else:
                                present = motif in ligne
                            if present:
                                trouvees.append(f"{chemin}:{numero}:{ligne}")
                return trouvees


            def compter(motif, chemins):
                return {chemin: len(grep(motif, [chemin])) for chemin in chemins}


            fichiers = sorted(glob.glob("textes/*.txt"))
            for trouvee in grep("python", fichiers, ignorer_casse=True):
                print(trouvee)
            print(compter("python", fichiers))
          `,
          tests: [
            test(
              "Recherche sensible à la casse",
              "grep('python', ['textes/notes.txt', 'textes/poeme.txt']) == ['textes/notes.txt:1:python : listes et dictionnaires']",
              "grep('python', ['textes/notes.txt', 'textes/poeme.txt'])",
            ),
            test(
              "`ignorer_casse=True`",
              "grep('python', ['textes/notes.txt', 'textes/poeme.txt'], ignorer_casse=True) == ['textes/notes.txt:1:python : listes et dictionnaires', 'textes/notes.txt:3:Python : fichiers et exceptions', 'textes/poeme.txt:1:Le Python est un langage']",
            ),
            test("Lignes numérotées à partir de 1", "grep('trois', ['textes/sans_fin.txt']) == ['textes/sans_fin.txt:2:trois']"),
            test(
              "`compter`",
              "compter('e', ['textes/poeme.txt', 'textes/vide.txt', 'textes/sans_fin.txt']) == {'textes/poeme.txt': 4, 'textes/vide.txt': 0, 'textes/sans_fin.txt': 1}",
              "compter('e', ['textes/poeme.txt', 'textes/vide.txt', 'textes/sans_fin.txt'])",
            ),
            test("Le programme affiche les lignes trouvées", "'textes/poeme.txt:1:Le Python est un langage' in OUTPUT"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 5.3
  "m5-l3": [
    {
      id: "ex1",
      title: "JSON et pickle",
      tiers: {
        core: {
          title: "Sauvegarder une configuration en JSON",
          prompt: md`
            1. \`sauver_json(objet, chemin)\` enregistre l'objet en JSON, **indenté** (\`indent=2\`) et en
               conservant les accents (\`ensure_ascii=False\`).
            2. \`charger_json(chemin)\` relit le fichier et renvoie l'objet.
            3. Après l'aller-retour, \`identiques\` doit indiquer si la configuration relue est égale à l'originale.

            Ouvrez ensuite \`config.json\` dans le panneau **Dossier de travail** : que deviennent \`True\` et \`None\` ?
          `,
          hint: md`
            \`with open(chemin, "w", encoding="utf-8") as f: json.dump(objet, f, indent=2, ensure_ascii=False)\`
            et \`json.load(f)\` en lecture.
          `,
          starter: py`
            import json


            def sauver_json(objet, chemin):
                ...


            def charger_json(chemin):
                ...


            config = {
                "utilisateur": "Ada",
                "ville": "Orléans",
                "langues": ["fr", "en"],
                "notifications": True,
                "quota": None,
            }
            sauver_json(config, "config.json")
            relue = charger_json("config.json")
            identiques = ...
            print(identiques)
          `,
          solution: py`
            import json


            def sauver_json(objet, chemin):
                with open(chemin, "w", encoding="utf-8") as f:
                    json.dump(objet, f, indent=2, ensure_ascii=False)


            def charger_json(chemin):
                with open(chemin, encoding="utf-8") as f:
                    return json.load(f)


            config = {
                "utilisateur": "Ada",
                "ville": "Orléans",
                "langues": ["fr", "en"],
                "notifications": True,
                "quota": None,
            }
            sauver_json(config, "config.json")
            relue = charger_json("config.json")
            identiques = relue == config
            print(identiques)
          `,
          tests: [
            test("`identiques` vaut `True`", "identiques is True", "identiques"),
            test("`config.json` est du JSON valide", "__import__('json').loads(read_file('config.json')) == config"),
            test("Le fichier est indenté", r`'\n  "utilisateur"' in read_file('config.json')`),
            test("Les accents sont conservés (`ensure_ascii=False`)", "'Orléans' in read_file('config.json')"),
            test("`True` et `None` deviennent `true` et `null`", "'true' in read_file('config.json') and 'null' in read_file('config.json')"),
            test("Aller-retour d'une liste", "(sauver_json([1, 'deux'], 'l.json'), charger_json('l.json'))[1] == [1, 'deux']"),
          ],
        },
        extra: {
          title: "Ce que JSON et pickle acceptent",
          prompt: md`
            Écrivez \`essai_json(objet)\` et \`essai_pickle(objet)\`. Chacune fait un aller-retour **en mémoire**
            (\`json.dumps\` puis \`json.loads\`, \`pickle.dumps\` puis \`pickle.loads\`) et renvoie :

            - \`"identique"\` si l'objet reconstruit est égal à l'original ;
            - \`"différent"\` s'il a été transformé ;
            - \`"erreur"\` si la sérialisation échoue.

            Avant d'exécuter, **prédisez** le tableau affiché : que deviennent un tuple, un ensemble,
            une clé entière, une \`lambda\` ?
          `,
          hint: md`
            Entourez l'aller-retour d'un \`try\`. JSON lève une \`TypeError\` pour un type inconnu ; pickle lève
            une \`PicklingError\` (ou une autre exception) : \`except Exception\` est acceptable ici.
          `,
          starter: py`
            import json
            import pickle


            def essai_json(objet):
                ...


            def essai_pickle(objet):
                ...


            exemples = {
                "dictionnaire": {"a": 1, "b": [2, 3]},
                "tuple": (3, 4),
                "ensemble": {1, 2, 3},
                "clé entière": {1: "un"},
                "lambda": lambda x: x + 1,
            }
            for nom, objet in exemples.items():
                print(f"{nom:<13} JSON : {essai_json(objet)!s:<11} pickle : {essai_pickle(objet)}")
          `,
          solution: py`
            import json
            import pickle


            def essai_json(objet):
                try:
                    copie = json.loads(json.dumps(objet))
                except TypeError:
                    return "erreur"
                return "identique" if copie == objet else "différent"


            def essai_pickle(objet):
                try:
                    copie = pickle.loads(pickle.dumps(objet))
                except Exception:
                    return "erreur"
                return "identique" if copie == objet else "différent"


            exemples = {
                "dictionnaire": {"a": 1, "b": [2, 3]},
                "tuple": (3, 4),
                "ensemble": {1, 2, 3},
                "clé entière": {1: "un"},
                "lambda": lambda x: x + 1,
            }
            for nom, objet in exemples.items():
                print(f"{nom:<13} JSON : {essai_json(objet)!s:<11} pickle : {essai_pickle(objet)}")
          `,
          explanation: md`
            JSON transforme les tuples en listes et les clés en chaînes, et refuse les \`set\` : c'est un format
            **d'échange**, limité aux types que tous les langages comprennent. pickle reconstruit fidèlement les
            objets Python, mais pas les \`lambda\` (elles n'ont pas de nom par lequel les retrouver).
          `,
          tests: [
            test("Un dictionnaire simple : identique dans les deux formats", "essai_json({'a': [1, 2]}) == 'identique' and essai_pickle({'a': [1, 2]}) == 'identique'"),
            test("Un tuple : différent en JSON, identique en pickle", "essai_json((3, 4)) == 'différent' and essai_pickle((3, 4)) == 'identique'"),
            test("Un ensemble : erreur en JSON, identique en pickle", "essai_json({1, 2}) == 'erreur' and essai_pickle({1, 2}) == 'identique'"),
            test("Une clé entière : différent en JSON", "essai_json({1: 'un'}) == 'différent'", "essai_json({1: 'un'})"),
            test("Une `lambda` : erreur dans les deux formats", "essai_json(lambda x: x) == 'erreur' and essai_pickle(lambda x: x) == 'erreur'"),
          ],
        },
        stretch: {
          title: "Sauvegarder la carte de France",
          prompt: md`
            La fonction \`lire_carte\` de la leçon 5.1 est fournie. Sauvegardez la carte de deux façons :

            1. \`sauver_carte_json(carte, chemin)\` et \`charger_carte_json(chemin)\` : au chargement, les
               coordonnées (devenues des listes en JSON) doivent **redevenir des tuples**, pour que la carte
               relue soit égale à l'originale ;
            2. \`sauver_carte_pickle(carte, chemin)\` et \`charger_carte_pickle(chemin)\` (fichier **binaire**).

            Le programme compare ensuite les deux fichiers : \`json_ok\`, \`pickle_ok\`, \`taille_json\`, \`taille_pickle\`.
            Lequel préféreriez-vous transmettre à quelqu'un d'autre, et pourquoi ?
          `,
          hint: md`
            Après \`json.load\`, parcourez \`carte.values()\` et remplacez \`infos["coords"]\` par
            \`tuple(infos["coords"])\`. Pour pickle : modes \`"wb"\` et \`"rb"\`, sans \`encoding\`.
          `,
          files: { "france_lite.map": CARTE },
          starter: py`
            import json
            import os
            import pickle


            ${LIRE_CARTE}

            def sauver_carte_json(carte, chemin):
                ...


            def charger_carte_json(chemin):
                ...


            def sauver_carte_pickle(carte, chemin):
                ...


            def charger_carte_pickle(chemin):
                ...


            carte = lire_carte("france_lite.map")
            sauver_carte_json(carte, "carte.json")
            sauver_carte_pickle(carte, "carte.pickle")

            json_ok = charger_carte_json("carte.json") == carte
            pickle_ok = charger_carte_pickle("carte.pickle") == carte
            taille_json = os.path.getsize("carte.json")
            taille_pickle = os.path.getsize("carte.pickle")
            print(f"JSON : {json_ok}, {taille_json} octets | pickle : {pickle_ok}, {taille_pickle} octets")
          `,
          solution: py`
            import json
            import os
            import pickle


            ${LIRE_CARTE}

            def sauver_carte_json(carte, chemin):
                with open(chemin, "w", encoding="utf-8") as f:
                    json.dump(carte, f, ensure_ascii=False)


            def charger_carte_json(chemin):
                with open(chemin, encoding="utf-8") as f:
                    carte = json.load(f)
                for infos in carte.values():
                    infos["coords"] = tuple(infos["coords"])
                return carte


            def sauver_carte_pickle(carte, chemin):
                with open(chemin, "wb") as f:
                    pickle.dump(carte, f)


            def charger_carte_pickle(chemin):
                with open(chemin, "rb") as f:
                    return pickle.load(f)


            carte = lire_carte("france_lite.map")
            sauver_carte_json(carte, "carte.json")
            sauver_carte_pickle(carte, "carte.pickle")

            json_ok = charger_carte_json("carte.json") == carte
            pickle_ok = charger_carte_pickle("carte.pickle") == carte
            taille_json = os.path.getsize("carte.json")
            taille_pickle = os.path.getsize("carte.pickle")
            print(f"JSON : {json_ok}, {taille_json} octets | pickle : {pickle_ok}, {taille_pickle} octets")
          `,
          explanation: md`
            Le fichier JSON est lisible, éditable à la main et utilisable depuis n'importe quel langage :
            c'est lui qu'on transmet. Le pickle est réservé à Python, et ne doit jamais être chargé s'il vient
            d'une source non fiable.
          `,
          tests: [
            test("La carte relue depuis JSON est égale à l'originale", "json_ok is True", "json_ok"),
            test("Les coordonnées relues sont des tuples", "type(charger_carte_json('carte.json')['Nantes']['coords']) is tuple"),
            test("La carte relue depuis pickle est égale à l'originale", "pickle_ok is True", "pickle_ok"),
            test("`carte.pickle` est un fichier binaire", r`open('carte.pickle', 'rb').read(1) == b'\x80'`),
            test("Les tailles sont mesurées", "isinstance(taille_json, int) and isinstance(taille_pickle, int) and taille_json > 0 and taille_pickle > 0"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 5.4
  "m5-l4": [
    {
      id: "ex1",
      title: "Programmer défensivement",
      tiers: {
        core: {
          title: "Intercepter les erreurs courantes",
          prompt: md`
            Écrivez trois fonctions qui **ne plantent jamais** :

            - \`division_sure(a, b)\` : renvoie \`a / b\`, ou \`None\` en cas de division par zéro ;
            - \`lire_entier(texte, defaut=0)\` : renvoie \`int(texte)\`, ou \`defaut\` si la conversion échoue ;
            - \`moyenne_fichier(chemin)\` : moyenne des nombres du fichier (un par ligne), en **ignorant** les
              lignes invalides ou vides ; renvoie \`None\` si le fichier n'existe pas ou ne contient aucun nombre.

            Le fichier \`mesures.txt\` est fourni.
          `,
          hint: md`
            \`try: ... except ZeroDivisionError:\`, \`except ValueError:\` et \`except FileNotFoundError:\`.
            Dans \`moyenne_fichier\`, un \`try\` par ligne pour la conversion, et un autre autour du \`open\`.
          `,
          files: { "mesures.txt": "12\n15\nabc\n\n9\n" },
          starter: py`
            def division_sure(a, b):
                ...


            def lire_entier(texte, defaut=0):
                ...


            def moyenne_fichier(chemin):
                ...


            print(division_sure(10, 4), division_sure(1, 0))
            print(lire_entier("42"), lire_entier("4.2"), lire_entier("abc", -1))
            print(moyenne_fichier("mesures.txt"), moyenne_fichier("absent.txt"))
          `,
          solution: py`
            def division_sure(a, b):
                try:
                    return a / b
                except ZeroDivisionError:
                    return None


            def lire_entier(texte, defaut=0):
                try:
                    return int(texte)
                except ValueError:
                    return defaut


            def moyenne_fichier(chemin):
                try:
                    with open(chemin, encoding="utf-8") as f:
                        lignes = f.readlines()
                except FileNotFoundError:
                    return None
                valeurs = []
                for ligne in lignes:
                    try:
                        valeurs.append(float(ligne))
                    except ValueError:
                        pass                      # ligne vide ou invalide : ignorée
                if not valeurs:
                    return None
                return sum(valeurs) / len(valeurs)


            print(division_sure(10, 4), division_sure(1, 0))
            print(lire_entier("42"), lire_entier("4.2"), lire_entier("abc", -1))
            print(moyenne_fichier("mesures.txt"), moyenne_fichier("absent.txt"))
          `,
          tests: [
            test("`division_sure(10, 4)` → 2.5 et `division_sure(1, 0)` → `None`", "division_sure(10, 4) == 2.5 and division_sure(1, 0) is None"),
            test("`lire_entier` : `'42'` → 42, `'4.2'` → 0, `'abc'` avec défaut -1 → -1", "lire_entier('42') == 42 and lire_entier('4.2') == 0 and lire_entier('abc', -1) == -1"),
            test("`moyenne_fichier('mesures.txt')` → 12.0", "moyenne_fichier('mesures.txt') == 12.0", "moyenne_fichier('mesures.txt')"),
            test("Fichier absent → `None`", "moyenne_fichier('absent.txt') is None", "moyenne_fichier('absent.txt')"),
            test("Fichier sans nombre → `None`", "(open('vide.txt', 'w').write('abc'), moyenne_fichier('vide.txt'))[1] is None"),
            test("Des blocs `try` / `except` sont utilisés", "uses('Try')"),
          ],
        },
        extra: {
          title: "Lever ses propres exceptions",
          prompt: md`
            1. \`verifier_note(note)\` renvoie la note si elle est valide, et sinon **lève** :
               - une \`TypeError\` si ce n'est pas un nombre (\`int\` ou \`float\`) ;
               - une \`ValueError\` avec le message \`"<note> est hors de [0, 20]"\` si elle sort de l'intervalle.
            2. \`analyser(textes)\` reçoit des saisies (chaînes) et renvoie le tuple \`(notes, erreurs)\` :
               - les notes valides converties en \`float\` ;
               - un message par saisie rejetée : \`"'abc' n'est pas un nombre"\` si la conversion échoue,
                 ou le message de la \`ValueError\` levée par \`verifier_note\`.
          `,
          hint: md`
            \`raise ValueError(f"{note} est hors de [0, 20]")\`. Dans \`analyser\`, utilisez deux \`try\` distincts :
            un pour \`float(texte)\` (message \`f"{texte!r} n'est pas un nombre"\`), un pour \`verifier_note\`
            (message \`str(e)\`).
          `,
          starter: py`
            def verifier_note(note):
                ...


            def analyser(textes):
                ...


            notes, erreurs = analyser(["12", "abc", "25", "8.5"])
            print("Notes :", notes)
            for message in erreurs:
                print("Erreur :", message)
          `,
          solution: py`
            def verifier_note(note):
                if isinstance(note, bool) or not isinstance(note, (int, float)):
                    raise TypeError(f"la note doit être un nombre, pas {type(note).__name__}")
                if not 0 <= note <= 20:
                    raise ValueError(f"{note} est hors de [0, 20]")
                return note


            def analyser(textes):
                notes, erreurs = [], []
                for texte in textes:
                    try:
                        valeur = float(texte)
                    except ValueError:
                        erreurs.append(f"{texte!r} n'est pas un nombre")
                        continue
                    try:
                        notes.append(verifier_note(valeur))
                    except ValueError as e:
                        erreurs.append(str(e))
                return notes, erreurs


            notes, erreurs = analyser(["12", "abc", "25", "8.5"])
            print("Notes :", notes)
            for message in erreurs:
                print("Erreur :", message)
          `,
          tests: [
            test("`verifier_note(15)` → 15", "verifier_note(15) == 15", "verifier_note(15)"),
            test("Note hors limites → `ValueError`", "raises(ValueError, verifier_note, 25) and raises(ValueError, verifier_note, -1)"),
            test("Message : `25 est hors de [0, 20]`", "error_message(verifier_note, 25) == '25 est hors de [0, 20]'", "error_message(verifier_note, 25)"),
            test("Chaîne → `TypeError`", "raises(TypeError, verifier_note, '12')"),
            test(
              "`analyser` sépare notes et erreurs",
              `analyser(['12', 'abc', '25', '8.5']) == ([12.0, 8.5], ["'abc' n'est pas un nombre", '25.0 est hors de [0, 20]'])`,
              "analyser(['12', 'abc', '25', '8.5'])",
            ),
            test("`raise` est utilisé", "uses('Raise')"),
          ],
        },
        stretch: {
          title: "Un compte bancaire robuste",
          prompt: md`
            Programmez le compte bancaire du TD : le solde survit aux redémarrages et **aucune saisie ne doit
            provoquer de traceback**. Le compte est un dictionnaire \`{"solde": float, "historique": [...]}\`.

            - \`deposer(compte, montant)\` / \`retirer(compte, montant)\` : lèvent \`ValueError\` si le montant
              n'est pas strictement positif ; \`retirer\` lève \`SoldeInsuffisant\` (fournie) si le montant dépasse
              le solde. Chaque opération réussie ajoute \`["dépôt", montant]\` ou \`["retrait", montant]\` à l'historique.
            - \`sauvegarder(compte, chemin)\` (JSON) et \`charger(chemin, solde_initial=100.0)\` : si le fichier est
              absent **ou illisible**, \`charger\` renvoie un compte neuf.
            - \`executer(compte, commande)\` traite \`"depot 50"\`, \`"retrait 30"\`, \`"solde"\`, \`"historique"\` et
              **renvoie** le message à afficher, par exemple :

            | Commande | Message renvoyé |
            |---|---|
            | \`solde\` | \`Solde : 100.00 €\` |
            | \`depot 50\` | \`Dépôt de 50.00 € effectué. Solde : 150.00 €\` |
            | \`retrait abc\` | \`Montant invalide : abc\` |
            | \`retrait 500\` | \`Solde insuffisant : 150.00 €\` |
            | \`retrait -5\` | \`Le montant doit être positif\` |
            | \`historique\` | une ligne par opération, ex. \`dépôt 50.00 €\` (ou \`Aucune opération\`) |
            | autre | \`Commande inconnue : bonjour\` |

            La fonction \`main()\` est fournie : elle lit les commandes dans la zone **Entrées**.
          `,
          hint: md`
            Dans \`executer\`, découpez la commande avec \`split()\`. Convertissez le montant dans un premier
            \`try\` (\`except ValueError\` → \`Montant invalide\`), puis appelez \`deposer\` / \`retirer\` dans un
            second \`try\` (\`except (ValueError, SoldeInsuffisant) as e\` → \`str(e)\`).
          `,
          stdin: "depot 50\nretrait abc\nretrait 500\nretrait -5\nretrait 30\nsolde\nhistorique\nbonjour\nquitter",
          starter: py`
            import json


            class SoldeInsuffisant(Exception):
                """Retrait supérieur au solde."""


            def nouveau_compte(solde=100.0):
                return {"solde": float(solde), "historique": []}


            def deposer(compte, montant):
                ...


            def retirer(compte, montant):
                ...


            def sauvegarder(compte, chemin):
                ...


            def charger(chemin, solde_initial=100.0):
                ...


            def executer(compte, commande):
                """Exécute une commande texte et renvoie le message à afficher."""
                ...


            def main():
                compte = charger("compte.json")
                print("Commandes : depot X, retrait X, solde, historique, quitter")
                while True:
                    commande = input("> ").strip()
                    if commande == "quitter":
                        break
                    print(executer(compte, commande))
                sauvegarder(compte, "compte.json")
                print("Compte sauvegardé.")


            if __name__ == "__main__":
                main()
          `,
          solution: py`
            import json


            class SoldeInsuffisant(Exception):
                """Retrait supérieur au solde."""


            def nouveau_compte(solde=100.0):
                return {"solde": float(solde), "historique": []}


            def deposer(compte, montant):
                if montant <= 0:
                    raise ValueError("Le montant doit être positif")
                compte["solde"] += montant
                compte["historique"].append(["dépôt", montant])


            def retirer(compte, montant):
                if montant <= 0:
                    raise ValueError("Le montant doit être positif")
                if montant > compte["solde"]:
                    raise SoldeInsuffisant(f"Solde insuffisant : {compte['solde']:.2f} €")
                compte["solde"] -= montant
                compte["historique"].append(["retrait", montant])


            def sauvegarder(compte, chemin):
                with open(chemin, "w", encoding="utf-8") as f:
                    json.dump(compte, f, ensure_ascii=False)


            def charger(chemin, solde_initial=100.0):
                try:
                    with open(chemin, encoding="utf-8") as f:
                        return json.load(f)
                except (FileNotFoundError, json.JSONDecodeError):
                    return nouveau_compte(solde_initial)


            def executer(compte, commande):
                """Exécute une commande texte et renvoie le message à afficher."""
                morceaux = commande.split()
                if morceaux == ["solde"]:
                    return f"Solde : {compte['solde']:.2f} €"
                if morceaux == ["historique"]:
                    lignes = [f"{op} {montant:.2f} €" for op, montant in compte["historique"]]
                    return "\n".join(lignes) or "Aucune opération"
                if len(morceaux) == 2 and morceaux[0] in ("depot", "retrait"):
                    action, texte = morceaux
                    try:
                        montant = float(texte)
                    except ValueError:
                        return f"Montant invalide : {texte}"
                    try:
                        if action == "depot":
                            deposer(compte, montant)
                            nom = "Dépôt"
                        else:
                            retirer(compte, montant)
                            nom = "Retrait"
                    except (ValueError, SoldeInsuffisant) as e:
                        return str(e)
                    return f"{nom} de {montant:.2f} € effectué. Solde : {compte['solde']:.2f} €"
                return f"Commande inconnue : {commande}"


            def main():
                compte = charger("compte.json")
                print("Commandes : depot X, retrait X, solde, historique, quitter")
                while True:
                    commande = input("> ").strip()
                    if commande == "quitter":
                        break
                    print(executer(compte, commande))
                sauvegarder(compte, "compte.json")
                print("Compte sauvegardé.")


            if __name__ == "__main__":
                main()
          `,
          explanation: md`
            Le TD propose aussi une version avec \`pickle\`. Pour un état que d'autres pourraient lire ou corriger
            à la main, JSON est préférable : il est lisible et indépendant de Python.
          `,
          tests: [
            test(
              "`deposer` met à jour solde et historique",
              "(lambda c: (deposer(c, 50), c)[1])(nouveau_compte(100)) == {'solde': 150.0, 'historique': [['dépôt', 50]]}",
            ),
            test("Montant négatif ou nul → `ValueError`", "raises(ValueError, deposer, nouveau_compte(), -5) and raises(ValueError, retirer, nouveau_compte(), 0)"),
            test(
              "Retrait trop grand → `SoldeInsuffisant`, solde inchangé",
              "(lambda c: raises(SoldeInsuffisant, retirer, c, 500) and c['solde'] == 100)(nouveau_compte(100))",
            ),
            test(
              "`executer` renvoie les bons messages",
              "executer(nouveau_compte(), 'solde') == 'Solde : 100.00 €' and executer(nouveau_compte(), 'depot 50') == 'Dépôt de 50.00 € effectué. Solde : 150.00 €' and executer(nouveau_compte(), 'retrait abc') == 'Montant invalide : abc' and executer(nouveau_compte(), 'retrait 500') == 'Solde insuffisant : 100.00 €' and executer(nouveau_compte(), 'bonjour') == 'Commande inconnue : bonjour'",
            ),
            test(
              "`charger` : fichier absent ou corrompu → compte neuf",
              "charger('absent.json') == {'solde': 100.0, 'historique': []} and (open('casse.json', 'w').write('{pas du json'), charger('casse.json'))[1] == {'solde': 100.0, 'historique': []}",
            ),
            test(
              "`compte.json` contient l'état final (120 € et 2 opérations)",
              "__import__('json').loads(read_file('compte.json')) == {'solde': 120.0, 'historique': [['dépôt', 50.0], ['retrait', 30.0]]}",
              "read_file('compte.json')",
            ),
            test("Le programme n'affiche aucun traceback", "'Traceback' not in OUTPUT and 'Compte sauvegardé.' in OUTPUT"),
          ],
        },
      },
    },
  ],

  // ---------------------------------------------------------------- 5.5
  "m5-l5": [
    {
      id: "ex1",
      title: "Modules et bibliothèque standard",
      tiers: {
        core: {
          title: "Bonjour, selon l'heure",
          prompt: md`
            Le programme lit votre nom et vous salue selon l'heure : *Bonjour*, *Bon après-midi*, *Bonsoir*
            ou *Bonne nuit*. Les bornes doivent être des **constantes nommées** (pas de nombres « magiques »
            au milieu des conditions) : \`MATIN = 5\`, \`APRES_MIDI = 12\`, \`SOIR = 18\`, \`NUIT = 22\`.

            - \`salutation(heure)\` : \`"Bonjour"\` de 5 h à 11 h 59, \`"Bon après-midi"\` de 12 h à 17 h 59,
              \`"Bonsoir"\` de 18 h à 21 h 59, \`"Bonne nuit"\` sinon ;
            - \`saluer(nom, maintenant=None)\` : renvoie par exemple \`"Bonjour Ada !"\`. Si \`maintenant\`
              (un \`datetime\`) n'est pas fourni, utilisez l'heure actuelle avec \`datetime.now()\`.
          `,
          hint: md`
            \`if MATIN <= heure < APRES_MIDI:\` … ; l'heure d'un \`datetime\` est \`maintenant.hour\`.
            Le paramètre \`maintenant\` permet de **tester** la fonction à n'importe quelle heure.
          `,
          stdin: "Ada",
          starter: py`
            from datetime import datetime

            MATIN = ...
            APRES_MIDI = ...
            SOIR = ...
            NUIT = ...


            def salutation(heure):
                ...


            def saluer(nom, maintenant=None):
                ...


            nom = input("Quel est votre nom ? ")
            print(saluer(nom))
          `,
          solution: py`
            from datetime import datetime

            MATIN = 5
            APRES_MIDI = 12
            SOIR = 18
            NUIT = 22


            def salutation(heure):
                if MATIN <= heure < APRES_MIDI:
                    return "Bonjour"
                if APRES_MIDI <= heure < SOIR:
                    return "Bon après-midi"
                if SOIR <= heure < NUIT:
                    return "Bonsoir"
                return "Bonne nuit"


            def saluer(nom, maintenant=None):
                if maintenant is None:
                    maintenant = datetime.now()
                return f"{salutation(maintenant.hour)} {nom} !"


            nom = input("Quel est votre nom ? ")
            print(saluer(nom))
          `,
          tests: [
            test("Constantes `MATIN`, `APRES_MIDI`, `SOIR`, `NUIT`", "(MATIN, APRES_MIDI, SOIR, NUIT) == (5, 12, 18, 22)"),
            test(
              "`salutation` respecte toutes les bornes",
              "[salutation(h) for h in (5, 11, 12, 17, 18, 21, 22, 3)] == ['Bonjour', 'Bonjour', 'Bon après-midi', 'Bon après-midi', 'Bonsoir', 'Bonsoir', 'Bonne nuit', 'Bonne nuit']",
              "[salutation(h) for h in (5, 11, 12, 17, 18, 21, 22, 3)]",
            ),
            test(
              "`saluer` à 9 h 30 → `Bonjour Ada !`",
              "saluer('Ada', __import__('datetime').datetime(2026, 10, 5, 9, 30)) == 'Bonjour Ada !'",
              "saluer('Ada', __import__('datetime').datetime(2026, 10, 5, 9, 30))",
            ),
            test("Sans date fournie, l'heure actuelle est utilisée (`datetime.now()`)", "calls('now') and saluer('Ada').endswith('Ada !')"),
            test("Le programme salue l'utilisateur", "'Ada !' in OUTPUT"),
          ],
        },
        extra: {
          title: "Le temps qui passe",
          prompt: md`
            Avec les modules \`datetime\` et \`time\` :

            1. \`jours_vecus(naissance, aujourd_hui=None)\` : nombre de jours entre deux \`date\`
               (aujourd'hui par défaut, avec \`date.today()\`) ;
            2. \`formater_timestamp(ts)\` : convertit un *timestamp* (secondes depuis le 1er janvier 1970) en
               texte \`"jj/mm/aaaa à hh:mm:ss"\`, en temps universel (UTC) ;
            3. \`chronometrer(f, *args)\` : appelle \`f(*args)\` et renvoie le tuple \`(résultat, durée en secondes)\`,
               mesurée avec \`time.perf_counter()\`.

            Pourquoi \`perf_counter\` plutôt que \`time.time()\` pour chronométrer ?
          `,
          hint: md`
            La différence de deux \`date\` est un \`timedelta\` : utilisez \`.days\`.
            \`datetime.fromtimestamp(ts, timezone.utc).strftime("%d/%m/%Y à %H:%M:%S")\`.
          `,
          starter: py`
            import time
            from datetime import date, datetime, timezone


            def jours_vecus(naissance, aujourd_hui=None):
                ...


            def formater_timestamp(ts):
                ...


            def chronometrer(f, *args):
                ...


            print("Timestamp actuel :", time.time())
            print("Soit le", formater_timestamp(time.time()), "(UTC)")
            print(jours_vecus(date(2003, 5, 14)), "jours vécus depuis le 14/05/2003")
            resultat, duree = chronometrer(sum, range(1_000_000))
            print(resultat, f"calculé en {duree:.4f} s")
          `,
          solution: py`
            import time
            from datetime import date, datetime, timezone


            def jours_vecus(naissance, aujourd_hui=None):
                if aujourd_hui is None:
                    aujourd_hui = date.today()
                return (aujourd_hui - naissance).days


            def formater_timestamp(ts):
                return datetime.fromtimestamp(ts, timezone.utc).strftime("%d/%m/%Y à %H:%M:%S")


            def chronometrer(f, *args):
                debut = time.perf_counter()
                resultat = f(*args)
                return resultat, time.perf_counter() - debut


            print("Timestamp actuel :", time.time())
            print("Soit le", formater_timestamp(time.time()), "(UTC)")
            print(jours_vecus(date(2003, 5, 14)), "jours vécus depuis le 14/05/2003")
            resultat, duree = chronometrer(sum, range(1_000_000))
            print(resultat, f"calculé en {duree:.4f} s")
          `,
          explanation: md`
            \`time.time()\` suit l'horloge du système, qui peut être ajustée (synchronisation réseau, changement
            d'heure) pendant la mesure. \`perf_counter()\` est une horloge **monotone** et haute précision,
            conçue pour mesurer des durées.
          `,
          tests: [
            test(
              "Du 14/05/2003 au 05/10/2026 : 8545 jours",
              "jours_vecus(__import__('datetime').date(2003, 5, 14), __import__('datetime').date(2026, 10, 5)) == 8545",
            ),
            test("Par défaut, comparaison avec aujourd'hui", "jours_vecus(__import__('datetime').date.today()) == 0"),
            test("`formater_timestamp(0)` → `01/01/1970 à 00:00:00`", "formater_timestamp(0) == '01/01/1970 à 00:00:00'", "formater_timestamp(0)"),
            test("`formater_timestamp(1_800_000_000)` → `15/01/2027 à 08:00:00`", "formater_timestamp(1_800_000_000) == '15/01/2027 à 08:00:00'", "formater_timestamp(1_800_000_000)"),
            test(
              "`chronometrer` renvoie le résultat et une durée",
              "chronometrer(sum, [1, 2, 3])[0] == 6 and isinstance(chronometrer(sum, [1])[1], float) and chronometrer(sum, [1])[1] >= 0",
            ),
            test("`perf_counter` est utilisé", "calls('perf_counter')"),
          ],
        },
        stretch: {
          title: "Découper le compte bancaire en modules",
          prompt: md`
            Le programme de \`main.py\` fonctionne, mais tout est dans un seul fichier. Découpez-le en un
            **package** \`banque\` (voir les onglets au-dessus de l'éditeur) :

            \`\`\`text
            banque/
                __init__.py
                compte.py      # SoldeInsuffisant, nouveau_compte, deposer, retirer : aucun print ni input
                stockage.py    # sauvegarder, charger (JSON)
            main.py            # uniquement l'interface : imports + main()
            \`\`\`

            \`main.py\` ne doit plus contenir de logique métier, et \`compte.py\` aucun \`print\` ni \`input\` :
            c'est cette séparation qui rend le code **testable**. Le comportement du programme ne doit pas changer.
          `,
          hint: md`
            Dans \`main.py\` : \`from banque.compte import SoldeInsuffisant, deposer, retirer\` et
            \`from banque.stockage import charger, sauvegarder\`. \`stockage.py\` a besoin de \`nouveau_compte\` :
            \`from banque.compte import nouveau_compte\`.
          `,
          stdin: "depot 50\nretrait 500\nretrait 30\nquitter",
          starter: BANQUE_MONOLITHE,
          modules: {
            "banque/__init__.py": py`
              """Package banque : logique du compte et sauvegarde."""
            `,
            "banque/compte.py": py`
              """Logique du compte : aucune entrée/sortie avec l'utilisateur."""

              # Déplacez ici : SoldeInsuffisant, nouveau_compte, deposer, retirer
            `,
            "banque/stockage.py": py`
              """Sauvegarde et chargement du compte."""

              # Déplacez ici : sauvegarder, charger
            `,
          },
          solution: py`
            from banque.compte import SoldeInsuffisant, deposer, retirer
            from banque.stockage import charger, sauvegarder


            def main():
                compte = charger("compte.json")
                while True:
                    commande = input("> ").split()
                    if not commande or commande[0] == "quitter":
                        break
                    try:
                        if commande[0] == "depot":
                            deposer(compte, float(commande[1]))
                        elif commande[0] == "retrait":
                            retirer(compte, float(commande[1]))
                        print(f"Solde : {compte['solde']:.2f} €")
                    except (ValueError, IndexError):
                        print("Montant invalide")
                    except SoldeInsuffisant as e:
                        print(e)
                sauvegarder(compte, "compte.json")


            if __name__ == "__main__":
                main()
          `,
          solutionModules: {
            "banque/__init__.py": py`
              """Package banque : logique du compte et sauvegarde."""
            `,
            "banque/compte.py": py`
              """Logique du compte : aucune entrée/sortie avec l'utilisateur."""


              class SoldeInsuffisant(Exception):
                  """Retrait supérieur au solde."""


              def nouveau_compte(solde=100.0):
                  return {"solde": float(solde), "historique": []}


              def deposer(compte, montant):
                  if montant <= 0:
                      raise ValueError("Le montant doit être positif")
                  compte["solde"] += montant
                  compte["historique"].append(["dépôt", montant])


              def retirer(compte, montant):
                  if montant <= 0:
                      raise ValueError("Le montant doit être positif")
                  if montant > compte["solde"]:
                      raise SoldeInsuffisant(f"Solde insuffisant : {compte['solde']:.2f} €")
                  compte["solde"] -= montant
                  compte["historique"].append(["retrait", montant])
            `,
            "banque/stockage.py": py`
              """Sauvegarde et chargement du compte."""

              import json

              from banque.compte import nouveau_compte


              def sauvegarder(compte, chemin):
                  with open(chemin, "w", encoding="utf-8") as f:
                      json.dump(compte, f)


              def charger(chemin):
                  try:
                      with open(chemin, encoding="utf-8") as f:
                          return json.load(f)
                  except FileNotFoundError:
                      return nouveau_compte()
            `,
          },
          tests: [
            test(
              "`main.py` ne contient plus de logique métier",
              "not any(f'def {nom}' in SOURCE for nom in ('nouveau_compte', 'deposer', 'retirer', 'sauvegarder', 'charger'))",
            ),
            test("`main.py` importe depuis le package `banque`", "'banque.compte' in SOURCE and 'banque.stockage' in SOURCE"),
            test(
              "`compte.py` définit `deposer` et `retirer`, sans `print` ni `input`",
              "'def deposer' in FILES['banque/compte.py'] and 'def retirer' in FILES['banque/compte.py'] and not calls_in('banque/compte.py', 'print') and not calls_in('banque/compte.py', 'input')",
            ),
            test(
              "`stockage.py` gère la sauvegarde JSON",
              "'def charger' in FILES['banque/stockage.py'] and calls_in('banque/stockage.py', 'dump') and calls_in('banque/stockage.py', 'load')",
            ),
            test(
              "Le programme se comporte comme avant",
              "'Solde : 150.00 €' in OUTPUT and 'Solde insuffisant : 150.00 €' in OUTPUT and 'Solde : 120.00 €' in OUTPUT",
            ),
            test("`compte.json` est bien sauvegardé", "__import__('json').loads(read_file('compte.json'))['solde'] == 120.0"),
          ],
        },
      },
    },
  ],
};
