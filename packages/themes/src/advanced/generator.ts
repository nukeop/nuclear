import type { AdvancedTheme } from './schema';

const escapeValue = (v: string) => v.replace(/\n/g, ' ').trim();

const toDecls = (vars?: Record<string, string>) =>
  Object.entries(vars ?? {})
    .map(([k, v]) => `--${k}: ${escapeValue(v)};`)
    .join(' ');

export function generateAdvancedThemeCSS(theme: AdvancedTheme): string {
  const light = toDecls(theme.vars);
  const dark = toDecls(theme.dark);

  const parts: string[] = [];
  if (light) {
    parts.push(`:root{${light}}`);
  }
  if (dark) {
    parts.push(`[data-theme='dark']{${dark}}`);
  }
  return parts.join('\n');
}
