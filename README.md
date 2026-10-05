# Exercices Typst

Installer le VSIX de `releases/`, puis ouvrir une banque `mpi-exercices`, le dépôt privé `corrections`
ou un dépôt de documents Typst avec un Makefile et des modèles dans `templates/`. Prérequis : VS Code ≥ 1.100 et Nix ou Make/Typst/Python. Tinymist est facultatif (testé avec 0.15.8).

- **Fichier** : liens métadonnées et barème, questions et exercices cliquables ; parties repliées.
- **Exercices** : banque réutilisable. **Feuilles** : TD, devoirs, concours et types personnalisés, recherche commune, filtre par type, dossiers repliables ou liste. Aucun classement imposé : le type est déclaré dans `feuille.with(type: "…", ...)`.
- Seuls les dossiers contenant un fichier visible dans la vue sont affichés, sous-dossiers et filtres compris. Un nouveau dossier vide apparaît dès qu'un fichier y est ajouté.
- La recherche sert uniquement à choisir et ouvrir un fichier, avec ses métadonnées. Les fichiers ouverts passent en premier, puis les fichiers consultés récemment (historique conservé entre les sessions), puis les autres par titre. La saisie affine la liste mais ne filtre jamais le panneau. Entrée ouvre le fichier sélectionné ; Échap annule. Les filtres de métadonnées déjà actifs restent appliqués.
- Le catalogue est actualisé automatiquement toutes les 5 secondes si des sources Typst ont changé sur disque (imports compris). Aucune reconstruction sans changement ; les erreurs sont signalées sans remplacer le dernier catalogue valide.
- **Créer une feuille** propose les modèles de `templates/`, puis un emplacement libre. Ajouter un type revient à ajouter un modèle avec un autre `type`. TD et devoirs démarrent vides : les sélectionner dans **Feuilles**, puis ajouter ou glisser des exercices.
- Barème dans `question(..., points: ...)`, sans notes d'élèves. Les points suivent les questions. Les anciens tableaux `bareme` restent compatibles ; un document portant ce tableau doit être réorganisé dans la source pour ne pas décaler les points.
- Réordonner les exercices par glisser-déposer ou avec les flèches ; **×** retire aussi l'import. Ces modifications sont enregistrées automatiquement et restent annulables. Un import utilisé ailleurs n'est pas supprimé silencieusement.
- Déplacer les fichiers en les glissant sur un dossier ou dans le fond de leur section. Les références Typst littérales sont actualisées ; vérifier les chemins calculés et les références externes.
- Bouton **Nouveau dossier** ; clic droit pour créer un exercice depuis le modèle ou supprimer un fichier dans la corbeille. Un fichier encore référencé ne peut pas être supprimé.
- Clic droit sur un dossier : créer un fichier dans ce dossier, avec choix du type pour les documents. Les boutons permettent aussi de créer à la racine ou dans un autre dossier. VS Code ne fournit pas de menu personnalisable sur la zone vide de ces arborescences.

## Raccourcis

Dans un éditeur Typst ou une liste du panneau Exercices Typst (hors champs de saisie) :

| Touche | Seule | Avec Maj |
| --- | --- | --- |
| F2 | Chercher un exercice | Chercher une feuille |
| F3 | Filtrer les exercices | Filtrer les feuilles |
| F4 | Ajouter un exercice | Créer une feuille |
| F5 | Afficher l'énoncé | Télécharger l'énoncé |
| F6 | Afficher le corrigé | Télécharger le corrigé |

Le téléchargement propose un emplacement puis compile et enregistre le PDF, sans ouvrir l'aperçu. Enregistrer les sources avant l'export. Maj+F2 inclut les concours ; l'ouverture du panneau reste accessible par la palette.

F1 reste inchangé. Ailleurs, les raccourcis habituels de VS Code restent disponibles. Sur Mac, **Fn** peut être nécessaire selon les réglages du clavier.

**Échap** dans le panneau ou **×** efface les filtres de métadonnées, seulement lorsqu'ils sont actifs. **Tout replier** et **Basculer dossiers / liste** sont dans **…**.

## Aperçu

Énoncé et Corrigé ont deux boutons distincts. **↔** active les sauts source–aperçu et leur surlignage ; **lune** inverse le thème, qui suit VS Code par défaut.

Avec Tinymist : rendu vectoriel actualisé à la frappe, positions source précises et variantes gardées en mémoire. Sans Tinymist : lecteur PDF actualisé à l'enregistrement, sans sauts, avec texte sélectionnable et copiable ; les outils de compilation de la banque restent nécessaires.

Les erreurs sont signalées dans la barre d'état : survol pour le détail, clic pour ouvrir uniquement Problems. L'indicateur disparaît après une nouvelle exécution réussie de la tâche concernée. L'indicateur et le bandeau Typst sont masqués pendant la saisie puis réaffichés après 2 secondes sans frappe si l'erreur persiste ; les diagnostics restent consultables dans Problems.

La sauvegarde exporte le PDF courant ; **Exporter les PDF énoncé et corrigé** lance `make c`. Enregistrer les sources avant l'export. Réglages : `mpiExercices.previewTheme`, `bankPath`, `execution`, `nixPath`, `makePath`.

## Développement

Entrer dans l'environnement avec `nix develop`, puis utiliser
`npm ci` · `npm test` · `npm run test:integration` · `npm run package`.
Les tests d'intégration sont séparés dans `test/integration/` : découverte,
édition, aperçu, corrections, documents et organisation. La commande complète
exécute toutes les suites et rapporte leurs échecs séparément.
Pour une suite : `npm run test:integration -- --suite=edition`
(valeurs : `decouverte`, `edition`, `apercu`, `corrections`, `documents`, `organisation`).
L'ancien argument `--organisation` reste utilisable.
`flake.lock` fixe les versions des outils, dont Node 22.

Depuis le terminal habituel, `make check` lance les tests avec Nix et
`make release` les lance puis génère le VSIX versionné dans `releases/`.
Avec direnv et nix-direnv installés, `direnv allow` active automatiquement
l'environnement décrit par `.envrc`.

Tests dans un profil VS Code isolé et sur des documents temporaires ; aucun PDF de la banque inspecté. Variables : `MPI_EXERCICES_BANK`, `MPI_PACKAGE_ROOT`, `MPI_CORRECTIONS_ROOT`,
`VSCODE_EXECUTABLE`, `TINYMIST_PATH`. Distribution locale, licence publique à choisir.

## Copies corrigées

Le dépôt `corrections` est découvert grâce à `scripts/copies.py`, `lib/copie.typ`
et `templates/copie.typ`. Les copies sont dans **Feuilles**, sous le type **Copie**.
Les aperçus Tinymist lisent `notes.csv` et `recapitulatif.csv` dans le dossier
du DS, comme les exports. La création, la modification ou la suppression de ces
CSV actualise l'aperçu. Les exports actualisent les notes avec le Makefile du dépôt. Installer le package
`@local/mpi-exercices:0.1.0` avant de compiler.

La version 0.7 utilise l'identifiant `qfortier.vscode-mpi-exercices` et les réglages
`mpiExercices.*`. Désinstaller l'ancienne extension `qfortier.vscode-exercices-mpi`
puis installer le nouveau VSIX. Reporter les réglages personnalisés vers ce préfixe.

`npm run test:integration -- --suite=corrections` teste la découverte, le modèle,
les notes, les exports et le rechargement des CSV sur des copies fictives.
L'ancienne variable `MPI_CORRECTIONS_TEST=1` sélectionne aussi cette suite.

## Dépôts de cours

Un dépôt peut contenir uniquement des documents : aucun `lib/exercice.typ`,
`scripts/catalogue.py` ou catalogue JSON n'est nécessaire. Il fournit son propre
Makefile et des modèles dans `templates/`. La banque d'exercices peut rester dans
un autre dossier du même espace de travail.

Un modèle et ses documents déclarent leur type dans une fonction de mise en page :
`#show: cours.with(type: "poly", titre: "Automates", ...)` ou
`#show: diapositives.with(type: "presentation", titre: "Automates", ...)`.
Le nom de cette fonction est libre. Les types sont affichés dans **Feuilles**,
avec leurs modèles, filtres et dossiers. Les contenus partagés sans cette
déclaration ne sont pas affichés comme documents.

Regrouper par chapitre le contenu partagé, `poly.typ`, `presentation.typ` et les
figures. Le Makefile du dépôt fournit les cibles
`build/<chemin-sans-extension>/enonce.pdf` et `corrige.pdf`. Tinymist compile
directement les sources : chaque dépôt garde sa propre mise en page.
