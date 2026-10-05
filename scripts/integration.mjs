import { runTests } from '@vscode/test-electron';
import path from 'node:path';
import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
const root = path.resolve(import.meta.dirname, '..');
const supported = ['decouverte', 'edition', 'apercu', 'corrections', 'documents', 'organisation'];
const suite = process.argv.find(arg => arg.startsWith('--suite='))?.slice('--suite='.length)
  ?? (process.argv.includes('--organisation') ? 'organisation' : process.env.MPI_CORRECTIONS_TEST ? 'corrections' : '');
if (suite && !supported.includes(suite)) throw new Error(`Suite inconnue : ${suite}. Choisir ${supported.join(', ')}.`);
const bank = process.env.MPI_EXERCICES_BANK ?? path.resolve(root, suite === 'corrections' ? '../corrections' : '../mpi-exercices');
// VS Code doit démarrer comme application, même depuis un terminal hébergé par Electron.
delete process.env.ELECTRON_RUN_AS_NODE;
await mkdir(path.join(root, '.vscode-test'), { recursive: true });
const userData = await mkdtemp(path.join(root, '.vscode-test', 'user-data-'));
// L'ajout de dossiers à une fenêtre mono-dossier redémarre l'hôte d'extensions.
// Démarrer en espace de travail pour garder les suites et leur API dans la même session.
const workspace = path.join(userData, 'integration.code-workspace');
await writeFile(workspace, JSON.stringify({ folders: [{ path: bank }] }));
const extensions = path.join(homedir(), '.vscode/extensions');
const tinymist = process.env.TINYMIST_PATH ?? path.join(extensions, (await readdir(extensions)).filter(name => name.startsWith('myriad-dreamin.tinymist-')).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0] ?? 'missing');
try {
  await runTests({
    extensionDevelopmentPath: [root, tinymist],
    extensionTestsPath: path.join(root, 'dist/integration.js'),
    vscodeExecutablePath: process.env.VSCODE_EXECUTABLE,
    launchArgs: [workspace, '--new-window', '--disable-extensions', '--disable-workspace-trust', '--skip-welcome', '--skip-release-notes', '--user-data-dir', userData],
    extensionTestsEnv: {
      MPI_EXERCICES_BANK: bank,
      MPI_PACKAGE_ROOT: process.env.MPI_PACKAGE_ROOT ?? path.resolve(root, '../mpi-exercices'),
      MPI_CORRECTIONS_ROOT: process.env.MPI_CORRECTIONS_ROOT ?? path.resolve(root, '../corrections'),
      MPI_INTEGRATION_SUITE: suite,
      PREVIEW_REVIEW: process.env.PREVIEW_REVIEW ?? ''
    }
  });
} finally {
  await rm(userData, { recursive: true, force: true });
}
