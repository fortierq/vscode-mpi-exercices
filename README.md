# Exercices Typst

Installer le VSIX de `releases/`, puis ouvrir une banque `exercices-mpi` approuvée. Prérequis : VS Code ≥ 1.100 et Nix ou Make/Typst/Python. Tinymist est facultatif (testé avec 0.15.8).

- **Fichier** : liens métadonnées et barème, questions et exercices cliquables ; parties repliées.
- **Exercices** : banque réutilisable. **Feuilles** : TD, devoirs, concours et types personnalisés, recherche commune, filtre par type, dossiers repliables ou liste. Aucun classement imposé : le type est déclaré dans `feuille.with(type: "…", ...)`.
- Seuls les dossiers contenant un fichier visible dans la vue sont affichés, sous-dossiers et filtres compris. Un nouveau dossier vide apparaît dès qu'un fichier y est ajouté.
- La recherche sert uniquement à choisir et ouvrir un fichier, avec ses métadonnées. La saisie affine la liste mais ne filtre jamais le panneau. Entrée ouvre le fichier sélectionné ; Échap annule. Les filtres de métadonnées déjà actifs restent appliqués.
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

Avec Tinymist : rendu vectoriel actualisé à la frappe, positions source précises et variantes gardées en mémoire. Sans Tinymist : lecteur PDF actualisé à l'enregistrement, sans sauts ; les outils de compilation de la banque restent nécessaires.

Les erreurs sont signalées dans la barre d'état : survol pour le détail, clic pour ouvrir uniquement Problems. L'indicateur disparaît après une nouvelle exécution réussie de la tâche concernée. L'indicateur et le bandeau Typst sont masqués pendant la saisie puis réaffichés après 2 secondes sans frappe si l'erreur persiste ; les diagnostics restent consultables dans Problems.

La sauvegarde exporte le PDF courant ; **Exporter les PDF énoncé et corrigé** lance `make c`. Enregistrer les sources avant l'export. Réglages : `exercicesMpi.previewTheme`, `bankPath`, `execution`, `nixPath`, `makePath`.

## Développement

Entrer dans l'environnement avec `nix develop`, puis utiliser
`npm ci` · `npm test` · `npm run test:integration` · `npm run package`.
`flake.lock` fixe les versions des outils, dont Node 22.

Depuis le terminal habituel, `make check` lance les tests avec Nix et
`make release` les lance puis génère le VSIX versionné dans `releases/`.
Avec direnv et nix-direnv installés, `direnv allow` active automatiquement
l'environnement décrit par `.envrc`.

Tests dans un profil VS Code isolé et sur des documents temporaires ; aucun PDF de la banque inspecté. Variables : `EXERCICES_MPI_BANK`, `VSCODE_EXECUTABLE`, `TINYMIST_PATH`. Distribution locale, licence publique à choisir.
