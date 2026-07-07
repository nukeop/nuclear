import { BaseDirectory, watchImmediate } from '@tauri-apps/plugin-fs';

import { useThemeStore } from '../stores/themeStore';
import { createDebouncedBatcher } from '../utils/debouncedBatcher';
import { reportError } from '../utils/logging';
import {
  ensureThemesDir,
  refreshAdvancedThemeList,
} from './advancedThemeDirService';
import { loadAndApplyThemeFile } from './advancedThemeService';

export const WATCH_DEBOUNCE_MS = 250;

let unwatch: (() => void) | null = null;
let watcherStart: Promise<void> | null = null;

const reloadActiveAdvancedTheme = async (
  changedPaths: string[],
): Promise<void> => {
  const { activeTheme } = useThemeStore.getState();

  if (activeTheme.type !== 'advanced' || !activeTheme.path) {
    return;
  }

  if (!changedPaths.some((path) => path.endsWith(activeTheme.path))) {
    return;
  }

  try {
    await loadAndApplyThemeFile(activeTheme.path);
  } catch (error) {
    await reportError('themes', {
      userMessage: 'Theme reload failed',
      error,
    });
  }
};

const handleThemesDirChange = async (changedPaths: string[]): Promise<void> => {
  await refreshAdvancedThemeList();
  await reloadActiveAdvancedTheme(changedPaths);
};

const changedPathsBatcher = createDebouncedBatcher<string>({
  delayMs: WATCH_DEBOUNCE_MS,
  flush: handleThemesDirChange,
  onError: (error) => {
    void reportError('themes', {
      userMessage: 'Theme refresh failed',
      error,
    });
  },
});

const initAdvancedThemeWatcher = async (): Promise<void> => {
  const dir = await ensureThemesDir();
  await refreshAdvancedThemeList();
  try {
    unwatch = await watchImmediate(
      dir,
      (event) => changedPathsBatcher.push(event.paths),
      { baseDir: BaseDirectory.AppData },
    );
  } catch (error) {
    await reportError('themes', {
      userMessage: "Couldn't watch themes directory",
      error,
    });
  }
};

export const startAdvancedThemeWatcher = (): Promise<void> => {
  if (!watcherStart) {
    watcherStart = initAdvancedThemeWatcher();
  }
  return watcherStart;
};

export const stopAdvancedThemeWatcher = (): void => {
  changedPathsBatcher.cancel();
  if (unwatch) {
    unwatch();
    unwatch = null;
  }
  watcherStart = null;
};
