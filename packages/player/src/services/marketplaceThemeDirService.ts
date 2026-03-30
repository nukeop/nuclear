import { join } from '@tauri-apps/api/path';
import { BaseDirectory, readDir, readTextFile } from '@tauri-apps/plugin-fs';

import { parseAdvancedTheme } from '@nuclearplayer/themes';

import type { AdvancedThemeFile } from '../stores/themeStore';
import { useThemeStore } from '../stores/themeStore';
import { reportError } from '../utils/logging';
import { ensureDir } from '../utils/path';

const STORE_THEMES_DIR = 'themes/store';

const ensureStoreThemesDir = async (): Promise<string> => {
  return ensureDir(STORE_THEMES_DIR);
};

const listMarketplaceThemes = async (): Promise<AdvancedThemeFile[]> => {
  const dir = await ensureStoreThemesDir();
  let entries: Array<{ name?: string; isDirectory?: boolean }>;
  try {
    entries = await readDir(dir, { baseDir: BaseDirectory.AppData });
  } catch (error) {
    await reportError('themes', {
      userMessage: 'Failed to read store themes directory',
      error,
    });
    return [];
  }

  const themes: AdvancedThemeFile[] = [];
  for (const entry of entries) {
    const filename = entry.name ?? '';
    if (entry.isDirectory || !filename.toLowerCase().endsWith('.json')) {
      continue;
    }

    const id = filename.replace(/\.json$/i, '');
    const path = await join(dir, filename);
    try {
      const text = await readTextFile(path, { baseDir: BaseDirectory.AppData });
      const json = JSON.parse(text);
      const parsed = parseAdvancedTheme(json);
      themes.push({ id, path, name: parsed.name });
    } catch (error) {
      await reportError('themes', {
        userMessage: 'Failed to read store theme file',
        error,
      });
    }
  }

  themes.sort((a, b) => a.name.localeCompare(b.name));
  return themes;
};

export const loadMarketplaceThemes = async (): Promise<void> => {
  const themes = await listMarketplaceThemes();
  useThemeStore.getState().setMarketplaceThemes(themes);
};
