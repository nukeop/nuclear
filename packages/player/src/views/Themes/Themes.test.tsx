import '../../test/mocks/plugin-fs';

import * as fs from '@tauri-apps/plugin-fs';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as themes from '@nuclearplayer/themes';

import {
  startAdvancedThemeWatcher,
  stopAdvancedThemeWatcher,
} from '../../services/advancedThemeDirService';
import { useSettingsStore } from '../../stores/settingsStore';
import { PluginFsMock, watchImmediateCb } from '../../test/mocks/plugin-fs';
import { ThemesWrapper } from './Themes.test-wrapper';

const logError = vi.fn();
const toastError = vi.fn();
vi.mock('@tauri-apps/plugin-log', () => ({
  error: (...args: unknown[]) => logError(...args),
}));
vi.mock('sonner', () => ({
  toast: { error: (...args: unknown[]) => toastError(...args) },
}));

const advancedThemes = [
  { name: 'My Theme', path: '/themes/my.json' },
  { name: 'Another', path: '/themes/another.json' },
];

describe('Themes view', async () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(themes, 'setThemeId');
    vi.spyOn(themes, 'applyAdvancedTheme');
  });
  afterEach(() => {
    stopAdvancedThemeWatcher();
  });

  it('(Snapshot) renders the themes view', async () => {
    const { getByRole } = await ThemesWrapper.mount();
    expect(getByRole('dialog')).toMatchSnapshot();
  });

  it('renders the Themes view sections', async () => {
    await ThemesWrapper.mount();
    expect(await screen.findByTestId('basic-themes')).toBeInTheDocument();
    expect(await screen.findByTestId('advanced-themes')).toBeInTheDocument();
  });

  it('switches to basic themes', async () => {
    await ThemesWrapper.mount();
    await userEvent.click(await screen.findByText('Ember'));
    expect(useSettingsStore.getState().getValue('core.theme.id')).toBe(
      'nuclear:ember',
    );
  });

  it('loads and applies selected advanced theme file', async () => {
    PluginFsMock.setReadTextFile(
      JSON.stringify({
        version: 1,
        name: 'My Theme',
        vars: { primary: '#123' },
      }),
    );

    await ThemesWrapper.mount({ advancedThemes });

    await ThemesWrapper.selectAdvancedTheme('My Theme');

    expect(fs.readTextFile).toHaveBeenCalledWith('/themes/my.json', {
      baseDir: '/home/user/.local/share/com.nuclearplayer',
    });
    expect(themes.setThemeId).toHaveBeenCalledWith('');
    expect(themes.applyAdvancedTheme).toHaveBeenCalledTimes(1);
    expect(useSettingsStore.getState().getValue('core.theme.mode')).toBe(
      'advanced',
    );
    expect(
      useSettingsStore.getState().getValue('core.theme.advanced.path'),
    ).toBe('/themes/my.json');
  });

  it('reset to default from advanced themes select', async () => {
    PluginFsMock.setReadTextFile(
      JSON.stringify({
        version: 1,
        name: 'My Theme',
        vars: { primary: '#123' },
      }),
    );

    await ThemesWrapper.mount({
      advancedThemes: [{ name: 'My Theme', path: '/themes/my.json' }],
    });

    await ThemesWrapper.selectAdvancedTheme('My Theme');
    await ThemesWrapper.selectDefaultTheme();

    expect(useSettingsStore.getState().getValue('core.theme.mode')).toBe(
      'basic',
    );
    expect(
      useSettingsStore.getState().getValue('core.theme.advanced.path'),
    ).toBe('');
  });

  it('populates advanced themes from the app data themes directory on watcher start and shows them in the UI', async () => {
    PluginFsMock.setExists(false);
    PluginFsMock.setMkdir(undefined);
    PluginFsMock.setReadDir([
      { name: 'another.json', isDirectory: false },
      { name: 'my.json', isDirectory: false },
      { name: 'ignore.txt', isDirectory: false },
      { name: 'nested', isDirectory: true },
    ]);
    PluginFsMock.setReadTextFileByMap({
      '/my.json': JSON.stringify({ version: 1, name: 'My Theme', vars: {} }),
      '/another.json': JSON.stringify({
        version: 1,
        name: 'Another',
        vars: {},
      }),
    });

    await startAdvancedThemeWatcher();

    await ThemesWrapper.mount();
    await ThemesWrapper.openAdvancedThemeSelect();

    expect(await ThemesWrapper.getAdvancedTheme(/Default/)).toBeInTheDocument();
    expect(await ThemesWrapper.getAdvancedTheme('Another')).toBeInTheDocument();
    expect(
      await ThemesWrapper.getAdvancedTheme('My Theme'),
    ).toBeInTheDocument();

    expect(fs.mkdir).toHaveBeenCalledWith('themes', {
      baseDir: '/home/user/.local/share/com.nuclearplayer',
      recursive: true,
    });
  });

  it('reloads the currently selected advanced theme when the watched file changes', async () => {
    PluginFsMock.setExists(true);
    PluginFsMock.setReadDir([{ name: 'my.json', isDirectory: false }]);
    PluginFsMock.setReadTextFile(
      JSON.stringify({ version: 1, name: 'My Theme', vars: { p: '#111' } }),
    );

    await startAdvancedThemeWatcher();

    await ThemesWrapper.mount();
    await ThemesWrapper.selectAdvancedTheme('My Theme');
    expect(themes.applyAdvancedTheme).toHaveBeenCalledTimes(1);

    watchImmediateCb?.({ paths: ['themes/my.json'], type: 'any', attrs: {} });

    await waitFor(() =>
      expect(themes.applyAdvancedTheme).toHaveBeenCalledTimes(2),
    );
    expect(fs.readTextFile).toHaveBeenCalledWith('themes/my.json', {
      baseDir: '/home/user/.local/share/com.nuclearplayer',
    });
  });

  it("doesn't reload when a different file changes or when not in advanced mode", async () => {
    PluginFsMock.setExists(true);
    PluginFsMock.setReadDir([
      { name: 'my.json', isDirectory: false },
      { name: 'other.json', isDirectory: false },
    ]);
    PluginFsMock.setReadTextFileByMap({
      'themes/my.json': JSON.stringify({
        version: 1,
        name: 'My Theme',
        vars: { p: '#111' },
      }),
      'themes/other.json': JSON.stringify({
        version: 1,
        name: 'Other',
        vars: { p: '#222' },
      }),
    });

    await startAdvancedThemeWatcher();

    await ThemesWrapper.mount();
    await ThemesWrapper.selectAdvancedTheme('My Theme');
    expect(themes.applyAdvancedTheme).toHaveBeenCalledTimes(1);

    // Change unrelated file -> no reload
    watchImmediateCb?.({
      paths: ['/appdata/themes/other.json'],
      type: 'any',
      attrs: {},
    });
    await new Promise((r) => setTimeout(r, 0));
    expect(themes.applyAdvancedTheme).toHaveBeenCalledTimes(1);

    // Switch back to Default (basic mode)
    await ThemesWrapper.selectDefaultTheme();

    // Now even if the same file changes, no reload should occur
    watchImmediateCb?.({
      paths: ['/appdata/themes/my.json'],
      type: 'any',
      attrs: {},
    });
    expect(themes.applyAdvancedTheme).toHaveBeenCalledTimes(1);
  });

  it('gracefully reports errors when reading the themes directory fails', async () => {
    PluginFsMock.setExists(true);
    PluginFsMock.setReadDirError(new Error('boom'));

    await startAdvancedThemeWatcher();

    await ThemesWrapper.mount();
    expect(toastError).toHaveBeenCalledWith('Failed to read themes directory', {
      description: 'boom',
    });
    expect(logError).toHaveBeenCalledWith(
      expect.stringMatching(
        /^\[themes\] Failed to read themes directory: Error: boom/,
      ),
    );
  });
});
