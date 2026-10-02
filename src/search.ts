import * as vscode from 'vscode';
import * as path from 'node:path';
import { Browser, Source } from './browser';
import { duration } from './core';

interface Choice extends vscode.QuickPickItem { source?: Source }
export function searchItem(source: Source): Choice {
  const ex = source.ex ?? source.metadata?.[0];
  const metadata = source.ex ? [source.ex] : source.metadata ?? [];
  const chapters = [...new Set(metadata.flatMap(ex => ex.chapitres))];
  const languages = [...new Set(metadata.flatMap(ex => ex.langages))];
  const levels = [...new Set(metadata.flatMap(ex => ex.niveaux))];
  return {
    label: ex?.titre ?? path.basename(source.source, '.typ'),
    description: `${source.bank.name} · ${source.source}`,
    detail: [ex?.concours && Object.values(ex.concours).filter(value => typeof value !== 'boolean').join(' '),
      source.members && `${source.members.length} exercices`, source.ex && `${source.ex.difficulte}/5`,
      ex && duration(ex), levels.join(', '), languages.join(', '), chapters.join(', ')].filter(Boolean).join(' · '),
    source,
    // The bank matcher handles accents, multiple words and member metadata.
    alwaysShow: true
  };
}

export function searchPicker(browser: Browser): Promise<{ query: string; source?: Source } | undefined> {
  const picker = vscode.window.createQuickPick<Choice>();
  picker.title = `Rechercher : ${browser.category}`;
  picker.placeholder = 'Titre, chemin, concours, chapitre… Entrée : appliquer ; ↓ : choisir un fichier.';
  picker.value = browser.query;
  const refresh = () => {
    const items = browser.search(picker.value).map(searchItem).sort((a, b) => a.label.localeCompare(b.label, 'fr', { numeric: true }));
    const apply: Choice = { label: '$(filter) Appliquer la recherche à la vue', description: `${items.length} résultat(s)`, alwaysShow: true };
    picker.items = [apply, ...items];
    picker.activeItems = [apply];
  };
  return new Promise(resolve => {
    let result: { query: string; source?: Source } | undefined;
    const subscriptions = [picker.onDidChangeValue(refresh), browser.onDidChangeTreeData(refresh),
      picker.onDidAccept(() => {
        result = { query: picker.value.trim(), source: (picker.selectedItems[0] ?? picker.activeItems[0])?.source };
        picker.hide();
      }),
      picker.onDidHide(() => { for (const subscription of subscriptions) subscription.dispose(); picker.dispose(); resolve(result); })];
    refresh(); picker.show();
  });
}
