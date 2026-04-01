import { join } from '@tauri-apps/api/path';
import {
  BaseDirectory,
  readDir,
  readTextFile,
  watchImmediate,
} from '@tauri-apps/plugin-fs';

import { parseAdvancedTheme } from '@nuclearplayer/themes';

import type { AdvancedThemeFile } from '../stores/themeStore';
import { useThemeStore } from '../stores/themeStore';
import { reportError } from '../utils/logging';
import { ensureDir } from '../utils/path';
import { loadAndApplyAdvancedThemeFromFile } from './advancedThemeService';

let unwatch: (() => void) | null = null;

export const THEMES_DIR_NAME = 'themes';

export const ensureThemesDir = async (): Promise<string> => {
  return ensureDir(THEMES_DIR_NAME);
};

export const listAdvancedThemes = async (): Promise<AdvancedThemeFile[]> => {
  const dir = await ensureThemesDir();
  let entries: Array<{ name?: string; isDirectory?: boolean }>;
  try {
    entries = await readDir(dir, { baseDir: BaseDirectory.AppData });
  } catch (error) {
    await reportError('themes', {
      userMessage: 'Failed to read themes directory',
      error,
    });
    return [];
  }
  const themes: AdvancedThemeFile[] = [];
  for (const e of entries) {
    if (e.isDirectory) {
      continue;
    }
    const name = e.name ?? '';
    if (!name.toLowerCase().endsWith('.json')) {
      continue;
    }
    const path = await join(dir, name);
    try {
      const text = await readTextFile(path, { baseDir: BaseDirectory.AppData });
      const json = JSON.parse(text);
      const parsed = parseAdvancedTheme(json);
      themes.push({ path, name: parsed.name });
    } catch (error) {
      await reportError('themes', {
        userMessage: 'Failed to read theme file',
        error,
      });
    }
  }
  themes.sort((a, b) => a.name.localeCompare(b.name));
  return themes;
};

export const refreshAdvancedThemeList = async (): Promise<void> => {
  const themes = await listAdvancedThemes();
  useThemeStore.getState().setAdvancedThemes(themes);
};

export const startAdvancedThemeWatcher = async (): Promise<void> => {
  const dir = await ensureThemesDir();
  await refreshAdvancedThemeList();
  if (unwatch) {
    return;
  }
  try {
    unwatch = await watchImmediate(
      dir,
      async (event) => {
        await refreshAdvancedThemeList();

        const { activeTheme } = useThemeStore.getState();

        if (activeTheme.type !== 'advanced' || !activeTheme.path) {
          return;
        }

        if (!event.paths.some((p) => p.endsWith(activeTheme.path))) {
          return;
        }

        try {
          await loadAndApplyAdvancedThemeFromFile(activeTheme.path);
        } catch (error) {
          await reportError('themes', {
            userMessage: 'Theme reload failed',
            error,
          });
        }
      },
      { baseDir: BaseDirectory.AppData },
    );
  } catch (error) {
    await reportError('themes', {
      userMessage: "Couldn't watch themes directory",
      error,
    });
  }
};

export const stopAdvancedThemeWatcher = (): void => {
  if (unwatch) {
    unwatch();
    unwatch = null;
  }
};
