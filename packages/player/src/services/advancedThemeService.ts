import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';
import { toast } from 'sonner';

import {
  applyAdvancedTheme,
  parseAdvancedTheme,
  setThemeId,
} from '@nuclearplayer/themes';

import { useThemeStore, type ActiveTheme } from '../stores/themeStore';
import { errorMessage } from '../utils/errorMessage';

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
  const path = useThemeStore.getState().getMarketplaceThemePath(id);
  if (!path) {
    return;
  }
  await loadAndApplyThemeFile(path);
  await useThemeStore.getState().selectMarketplaceTheme(id);
};

const resolveThemePath = (activeTheme: ActiveTheme): string | undefined => {
  switch (activeTheme.type) {
    case 'advanced':
      return activeTheme.path;
    case 'marketplace':
      return useThemeStore.getState().getMarketplaceThemePath(activeTheme.id);
    default:
      return undefined;
  }
};

export const applyThemeFromSettingsIfAny = async (): Promise<void> => {
  const { activeTheme } = useThemeStore.getState();
  const path = resolveThemePath(activeTheme);
  if (!path) {
    return;
  }

  try {
    setThemeId('');
    await loadAndApplyThemeFile(path);
  } catch (error) {
    toast.error("Couldn't load theme", {
      description: errorMessage(error),
    });
  }
};
