# Publier PyLab sur GitHub, puis le mettre à jour

Ce guide part de zéro. On utilise l'application **GitHub Desktop** : tout se fait avec des boutons,
sans ligne de commande ni mot de passe à taper dans le terminal.

**Vue d'ensemble**

- **Partie A** (une seule fois, environ 20 minutes) : créer le compte, installer GitHub Desktop, envoyer
  le projet, activer la publication.
- **Partie B** (à chaque nouveau cours, environ 2 minutes) : enregistrer les modifications et les envoyer.
  GitHub vérifie les 75 exercices et met le site à jour tout seul.

---

## Partie A : la première publication (une seule fois)

### Étape 1 : créer un compte GitHub

1. Ouvrez <https://github.com/signup> dans votre navigateur.
2. Saisissez votre adresse e-mail, choisissez un mot de passe et un **nom d'utilisateur** (votre « pseudo »).
   Il apparaîtra dans l'adresse du site : `https://votre-pseudo.github.io/...`. Choisissez-le court et sans espace.
3. Validez le petit test anti-robot, puis entrez le code reçu par e-mail.
4. Si GitHub vous propose une offre payante, choisissez l'offre **gratuite (Free)**.

> Déjà un compte ? Passez directement à l'étape 2.

### Étape 2 : masquer votre adresse e-mail (recommandé)

Chaque enregistrement (*commit*) contient le nom et l'e-mail de son auteur, visibles publiquement.

1. Sur github.com, cliquez sur votre **photo de profil** (en haut à droite), puis sur **Settings**.
2. Dans la colonne de gauche, cliquez sur **Emails**.
3. Cochez **Keep my email addresses private**.
4. Notez l'adresse affichée juste en dessous, de la forme `12345678+votre-pseudo@users.noreply.github.com`.

### Étape 3 : installer GitHub Desktop

1. Ouvrez <https://desktop.github.com> et cliquez sur **Download for macOS**.
2. Ouvrez le fichier téléchargé (dans *Téléchargements*) : il contient l'application **GitHub Desktop**.
3. Glissez **GitHub Desktop** dans le dossier **Applications**, puis lancez-la.
   Si macOS demande « Voulez-vous vraiment ouvrir cette application ? », répondez **Ouvrir**.

### Étape 4 : connecter GitHub Desktop à votre compte

1. Sur l'écran d'accueil, cliquez sur **Sign in to GitHub.com**.
2. Votre navigateur s'ouvre : connectez-vous, puis cliquez sur **Authorize desktop**.
   Si le navigateur demande d'ouvrir GitHub Desktop, acceptez.
3. GitHub Desktop affiche **Configure Git** :
   - **Name** : votre nom ou votre pseudo (public) ;
   - **Email** : choisissez dans la liste l'adresse `...@users.noreply.github.com` notée à l'étape 2.
4. Cliquez sur **Finish**.

> Ces réglages remplacent les valeurs d'exemple (« Votre nom ou pseudo ») enregistrées plus tôt.
> Pour les revoir plus tard : menu **GitHub Desktop → Settings… → Git**.

### Étape 5 : ouvrir le projet dans GitHub Desktop

1. Menu **File → Add Local Repository…**
2. Cliquez sur **Choose…**, allez dans **Bureau** (*Desktop*), sélectionnez le dossier
   **Test Python Site**, puis cliquez sur **Add Repository**.

Le dossier est déjà prêt pour Git : GitHub Desktop doit afficher une liste d'environ 85 fichiers dans la
colonne de gauche (onglet **Changes**).

> Message « This directory does not appear to be a Git repository » ? Vérifiez que vous avez bien choisi
> le dossier **Test Python Site** lui-même, et non un dossier qui le contient ou qu'il contient.

### Étape 6 : faire le premier enregistrement (*commit*)

Un *commit* est une photo du projet à un instant donné, avec un petit message qui la décrit.

1. Vérifiez que toutes les cases de la liste des fichiers sont cochées. Elles le sont par défaut.
2. En bas à gauche, dans le champ **Summary**, écrivez par exemple : `Première version du site`.
3. Cliquez sur le bouton bleu **Commit to main**.

La liste des fichiers se vide : c'est normal, tout est enregistré.

### Étape 7 : envoyer le projet sur GitHub

1. Cliquez sur le bouton **Publish repository** en haut de la fenêtre.
2. Dans la fenêtre qui s'ouvre :
   - **Name** : le nom du dépôt, qui sera la fin de l'adresse du site, par exemple `pylab-python` ;
   - **Description** (facultatif) : `Plateforme d'entraînement Python` ;
   - **Décochez « Keep this code private »**. Avec un compte gratuit, GitHub Pages ne fonctionne qu'avec
     un dépôt **public** : tout le monde pourra voir le code et le site.
3. Cliquez sur **Publish Repository**.

Après quelques secondes, le projet est en ligne sur `https://github.com/votre-pseudo/pylab-python`.

### Étape 8 : activer la publication du site (GitHub Pages)

1. Dans GitHub Desktop, menu **Repository → View on GitHub** : la page du dépôt s'ouvre dans le navigateur.
2. Cliquez sur l'onglet **Settings** (l'icône d'engrenage, en haut de la page du dépôt).
3. Dans la colonne de gauche, rubrique *Code and automation*, cliquez sur **Pages**.
4. Sous **Build and deployment**, dans la liste **Source**, choisissez **GitHub Actions**.

Rien d'autre à configurer : le fichier `.github/workflows/deploy.yml` du projet contient déjà les
instructions de compilation et de publication.

### Étape 9 : lancer la première mise en ligne

L'envoi de l'étape 7 a déjà lancé une tentative de publication. Comme Pages n'était pas encore activé,
elle a échoué (une **croix rouge**). C'est normal, il suffit de la relancer :

1. Cliquez sur l'onglet **Actions** du dépôt.
2. Dans la colonne de gauche, cliquez sur **Déployer sur GitHub Pages**.
3. À droite, cliquez sur **Run workflow**, puis sur le bouton vert **Run workflow** qui apparaît.
4. Patientez 2 à 3 minutes (actualisez la page) : le rond jaune devient une **coche verte** ✅.

### Étape 10 : ouvrir votre site

- Retournez dans **Settings → Pages** : en haut, le message **« Your site is live at … »** donne l'adresse.
- Elle a la forme : `https://votre-pseudo.github.io/pylab-python/`

C'est cette adresse que vous partagez. Chaque visiteur a sa propre progression, enregistrée dans son navigateur.

---

## Partie B : mettre le site à jour (à chaque nouveau cours)

### Étape 1 : modifier le contenu

Les cours se trouvent dans `src/content/` (un dossier par module, avec un fichier français et un fichier
anglais pour chaque leçon). Le plus simple : donnez les PDF du nouveau cours et des exercices à Claude,
en précisant le dossier `Bureau/Test Python Site`. Il ajoute le module en français et en anglais, le
rattache au plan du cours (`src/content/syllabus.js`) et vérifie que toutes les solutions passent leurs tests.

### Étape 2 : enregistrer les modifications (*commit*)

1. Ouvrez **GitHub Desktop**. Le projet **Test Python Site** est déjà sélectionné en haut à gauche.
2. L'onglet **Changes** liste les fichiers modifiés ; cliquez sur l'un d'eux pour voir les changements
   (vert = ajouté, rouge = supprimé).
3. Dans **Summary**, décrivez la modification, par exemple : `Ajout du cours 5 : programmation objet`.
4. Cliquez sur **Commit to main**.

### Étape 3 : envoyer sur GitHub (*push*)

1. Cliquez sur **Push origin** en haut de la fenêtre.
2. C'est tout. Sur github.com, onglet **Actions**, une nouvelle publication démarre :
   - GitHub installe le projet, **vérifie les traductions, la couverture du cours, les solutions de tous
     les exercices et les exemples des leçons**, puis compile le site ;
   - après 2 à 3 minutes, la **coche verte** ✅ indique que le site en ligne est à jour.
3. Ouvrez votre site et rechargez la page avec **⌘ + Maj + R** pour voir la nouvelle version.

> Si une vérification échoue, la publication s'arrête (croix rouge ❌) et **l'ancienne
> version du site reste en ligne** : rien n'est cassé pour vos visiteurs. Voir « En cas de problème ».

---

## En cas de problème

| Ce que vous voyez | Que faire |
|---|---|
| Croix rouge ❌ dans **Actions** | Cliquez dessus, puis sur l'étape en rouge pour lire l'erreur. **check-content** : une traduction anglaise manque ou une notion du plan n'est plus couverte (la liste des problèmes est affichée). **verify-content** : une solution d'exercice ne passe plus ses tests (la ligne `[ERR]` indique lequel). **check-examples** : un exemple d'une leçon plante (la ligne `[ERR]` indique le fichier et le numéro de l'exemple). |
| Croix rouge sur l'étape **configure-pages** ou **deploy** | Pages n'est pas activé : refaites l'étape A8 (Source : **GitHub Actions**), puis relancez (étape A9). |
| Le site affiche une erreur **404** | Attendez quelques minutes après la première publication. Vérifiez l'adresse : elle doit se terminer par le nom du dépôt **et** `/`. |
| Le site affiche l'ancienne version | Rechargement complet : **⌘ + Maj + R**. Vérifiez que la dernière publication dans **Actions** est verte. |
| GitHub Desktop indique « Fetch origin » ou « Pull origin » | Cliquez dessus avant de faire **Push origin** : cela récupère d'éventuelles modifications faites directement sur github.com. |
| Pas d'option **Pages** utilisable | Le dépôt est privé. **Settings → General**, tout en bas (*Danger Zone*) → **Change visibility** → **Public**. |

---

## Bon à savoir

- **Tester avant de publier** : la version locale (`dist/`, servie sur http://localhost:8000) n'est mise à
  jour que par une compilation (`npm run build`), qui demande Node.js. Claude peut s'en charger, ou vous
  pouvez installer Node.js (version **LTS** sur <https://nodejs.org>, installeur `.pkg`), puis lancer
  `npm install` une fois et `npm run dev` pour un aperçu qui se met à jour en direct.
- **Ce qui n'est pas envoyé sur GitHub** (voir `.gitignore`) : `dist/` (recompilé par GitHub),
  `node_modules/` (réinstallé par GitHub) et `.claude/` (réglages locaux).
- **Contenu du cours** : le dépôt et le site sont publics. Les exercices reprennent la trame des TD de la
  formation : en cas de doute, demandez l'accord de l'enseignant avant de partager largement le lien.
