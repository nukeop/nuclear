import type { AdvancedTheme, V1AdvancedTheme } from './schema';

type ThemeVars = Record<string, string>;

const v1ToV2Tokens: Record<string, string> = {
  'background-secondary': 'muted',
  'background-input': 'input',
  'foreground-secondary': 'muted-foreground',
  'foreground-input': 'input-foreground',
};

const migrateTokenNames = (vars: ThemeVars): ThemeVars =>
  Object.fromEntries(
    Object.entries(vars).map(([name, value]) => [
      v1ToV2Tokens[name] ?? name,
      value,
    ]),
  );

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
