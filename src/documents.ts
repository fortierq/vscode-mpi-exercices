import { mask } from './typst';

export const typeLabels: Record<string, string> = { td: 'TD', devoir: 'Devoir', concours: 'Concours', copie: 'Copie' };
export const typeLabel = (type: string): string => typeLabels[type] ?? type;
export const sourceExclusions = '**/{build,lib,templates,ressources,docs,scripts,node_modules,.*}/**';
export const technicalFolders = new Set(['build', 'lib', 'templates', 'ressources', 'docs', 'scripts', 'tmp', 'node_modules']);
export interface SourceKind { kind: 'exercice' | 'document'; type?: string; direct: boolean }

// Literal type declarations are indexable without compiling every file while typing.
export function identify(text: string, source = ''): SourceKind | undefined {
  const code = mask(text);
  const show = /#show\s*:\s*feuille\.with\s*\(/.exec(code);
  if (show) {
    const start = show.index + show[0].length;
    let end = start; let depth = 1;
    while (end < code.length && depth) { if (code[end] === '(') depth++; if (code[end] === ')') depth--; end++; }
    const body = mask(text, false).slice(start, end - 1);
    return { kind: 'document', type: /\btype\s*:\s*"([^"\n]+)"/.exec(body)?.[1] ?? 'td', direct: true };
  }
  const reexports = [...code.matchAll(/#import\s+:\s*([^\n]+)/g)].some(match => match[1].split(',').some(member => /^(?:ex|[\w-]+\s+as\s+ex)$/.test(member.trim())));
  if (/#let\s+ex\s*=/.test(code) || reexports) return source.startsWith('concours/')
    ? { kind: 'document', type: 'concours', direct: false }
    : { kind: 'exercice', direct: false };
  return undefined;
}
