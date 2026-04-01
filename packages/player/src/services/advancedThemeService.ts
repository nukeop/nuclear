import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';
import { toast } from 'sonner';

import {
  applyAdvancedTheme,
  parseAdvancedTheme,
  setThemeId,
} from '@nuclearplayer/themes';

import { useThemeStore, type AdvancedTheme } from '../stores/themeStore';

export const loadAndApplyThemeFile = async (path: string): Promise<void> => {
  const contents = await readTextFile(path, { baseDir: BaseDirectory.AppData });
  const json = JSON.parse(contents);
  const theme = parseAdvancedTheme(json);
  setThemeId('');
  applyAdvancedTheme(theme);
};

export const loadAndApplyAdvancedThemeFromFile = async (
  path: string,
): Promise<void> => {
  await loadAndApplyThemeFile(path);
  await useThemeStore.getState().selectAdvancedTheme(path);
};

export const loadAndApplyMarketplaceTheme = async (
  id: string,
): Promise<void> => {
  const theme = useThemeStore
    .getState()
    .marketplaceThemes.find((theme) => theme.id === id);
  if (!theme) {
    return;
  }
  await loadAndApplyThemeFile(theme.path);
  await useThemeStore.getState().selectMarketplaceTheme(id);
};

export const applyAdvancedThemeFromSettingsIfAny = async (): Promise<void> => {
  const { activeTheme, isAdvancedThemeSelected } = useThemeStore.getState();
  if (!isAdvancedThemeSelected()) {
    return;
  }

  const { path } = activeTheme as AdvancedTheme;

  try {
    setThemeId('');
    await loadAndApplyAdvancedThemeFromFile(path);
  } catch (error) {
    toast.error("Couldn't load advanced theme", {
      description: error instanceof Error ? error.message : String(error),
    });
  }
};
