import { runTests } from '@vscode/test-electron';
import path from 'node:path';
import { mkdir, readdir } from 'node:fs/promises';
import { homedir } from 'node:os';
const root = path.resolve(import.meta.dirname, '..');
const bank = process.env.MPI_EXERCICES_BANK ?? path.resolve(root, process.env.MPI_CORRECTIONS_TEST ? '../corrections' : '../mpi-exercices');
// VS Code doit démarrer comme application, même depuis un terminal hébergé par Electron.
delete process.env.ELECTRON_RUN_AS_NODE;
const userData = path.join(root, '.vscode-test', 'user-data');
await mkdir(userData, { recursive: true });
const extensions = path.join(homedir(), '.vscode/extensions');
const tinymist = process.env.TINYMIST_PATH ?? path.join(extensions, (await readdir(extensions)).filter(name => name.startsWith('myriad-dreamin.tinymist-')).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0] ?? 'missing');
await runTests({
  extensionDevelopmentPath: [root, tinymist],
  extensionTestsPath: path.join(root, 'dist/integration.js'),
  vscodeExecutablePath: process.env.VSCODE_EXECUTABLE,
  launchArgs: [bank, '--disable-extensions', '--disable-workspace-trust', '--skip-welcome', '--skip-release-notes', '--user-data-dir', userData],
  extensionTestsEnv: { MPI_EXERCICES_BANK: bank, PREVIEW_REVIEW: process.env.PREVIEW_REVIEW ?? '', MPI_CORRECTIONS_TEST: process.env.MPI_CORRECTIONS_TEST ?? '', MPI_ORGANISATION_TEST: process.argv.includes('--organisation') ? '1' : '' }
});
