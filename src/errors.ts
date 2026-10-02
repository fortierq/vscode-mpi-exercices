import * as vscode from 'vscode';

// One shared indicator; successful jobs only clear their own error.
class ErrorStatus implements vscode.Disposable {
  private entries = new Map<string, { title: string; message: string; open: () => unknown }>();
  private reported = new WeakSet<object>();
  private item?: vscode.StatusBarItem;
  private command?: vscode.Disposable;
  has(error: unknown): boolean { return typeof error === 'object' && error !== null && this.reported.has(error); }
  set(key: string, title: string, error: unknown, open: () => unknown): void {
    if (error instanceof vscode.CancellationError) return;
    if (typeof error === 'object' && error !== null) this.reported.add(error);
    this.entries.delete(key);
    this.entries.set(key, { title, message: error instanceof Error ? error.message : String(error), open });
    this.update();
  }
  clear(key: string): void { this.entries.delete(key); this.update(); }
  private update(): void {
    if (!this.entries.size) { this.item?.hide(); return; }
    if (!this.item) {
      this.item = vscode.window.createStatusBarItem('exercicesMpi.errors', vscode.StatusBarAlignment.Left, 10);
      this.item.name = 'Erreurs Exercices Typst';
      this.item.command = 'exercicesMpi.showErrorDetails';
      this.item.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
      this.command = vscode.commands.registerCommand('exercicesMpi.showErrorDetails', async () => {
        const entries = [...this.entries.values()];
        const selected = entries.length === 1 ? entries[0] : (await vscode.window.showQuickPick(entries.map(entry => ({ label: entry.title, detail: entry.message, entry })), { title: 'Erreurs Exercices Typst' }))?.entry;
        if (selected) await selected.open();
      });
    }
    const last = [...this.entries.values()].at(-1)!;
    this.item.text = `$(error) ${last.title}${this.entries.size > 1 ? ` (${this.entries.size})` : ''}`;
    this.item.tooltip = `${last.message}\n\nCliquer pour afficher les détails.`;
    this.item.show();
  }
  dispose(): void { this.item?.dispose(); this.command?.dispose(); this.entries.clear(); }
}
export const errorStatus = new ErrorStatus();
