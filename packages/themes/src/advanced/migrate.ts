import type { AdvancedTheme, V1AdvancedTheme } from './schema';

type ThemeVars = Record<string, string>;

const v1ToV2Tokens: Record<string, string[]> = {
  'background-secondary': ['muted'],
  'background-input': ['input'],
  'foreground-secondary': ['muted-foreground'],
  'foreground-input': ['input-foreground'],
  primary: ['primary', 'card', 'popover'],
  foreground: [
    'foreground',
    'primary-foreground',
    'card-foreground',
    'popover-foreground',
    'accent-green-foreground',
    'accent-yellow-foreground',
    'accent-purple-foreground',
    'accent-blue-foreground',
    'accent-orange-foreground',
    'accent-cyan-foreground',
    'accent-red-foreground',
  ],
};

const migrateTokenNames = (vars: ThemeVars): ThemeVars => {
  const entries = Object.entries(vars);
  const untouched = entries.filter(([name]) => !(name in v1ToV2Tokens));
  const derived = entries.flatMap(([name, value]) =>
    (v1ToV2Tokens[name] ?? []).map((v2Name) => [v2Name, value]),
  );
  return Object.fromEntries([...untouched, ...derived]);
};

const migrateOptionalVars = (vars: ThemeVars | undefined) => {
  if (vars === undefined) {
    return undefined;
  }
  return migrateTokenNames(vars);
};

export const migrateV1ToV2 = (theme: V1AdvancedTheme): AdvancedTheme => ({
  ...theme,
  version: 2,
  vars: migrateOptionalVars(theme.vars),
  dark: migrateOptionalVars(theme.dark),
});
