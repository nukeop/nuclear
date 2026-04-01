import '../../test/mocks/plugin-fs';

import * as fs from '@tauri-apps/plugin-fs';
import { screen, waitFor } from '@testing-library/react';

import * as themes from '@nuclearplayer/themes';

import {
  startAdvancedThemeWatcher,
  stopAdvancedThemeWatcher,
} from '../../services/advancedThemeDirService';
import { useThemeStore } from '../../stores/themeStore';
import { SAKURA_THEME_FILE } from '../../test/fixtures/themeRegistry';
import { PluginFsMock, watchImmediateCb } from '../../test/mocks/plugin-fs';
import { ThemesWrapper } from './Themes.test-wrapper';

const logError = vi.fn();
const toastError = vi.fn();
vi.mock('@tauri-apps/plugin-log', () => ({
  error: (...args: unknown[]) => logError(...args),
  warn: () => Promise.resolve(),
  debug: () => Promise.resolve(),
  trace: () => Promise.resolve(),
  info: () => Promise.resolve(),
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
    const options = await ThemesWrapper.advancedThemeSelect.availableOptions();
    expect(options).toContain('Another');
    expect(options).toContain('My Theme');

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
    await ThemesWrapper.advancedThemeSelect.select('My Theme');
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
    await ThemesWrapper.advancedThemeSelect.select('My Theme');
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
    await ThemesWrapper.selectBasicTheme('Default');

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

  describe('Theme selection', () => {
    it('selects a basic theme', async () => {
      await ThemesWrapper.mount();
      await ThemesWrapper.selectBasicTheme('Ember');
      expect(
        useThemeStore
          .getState()
          .isSelected({ type: 'basic', id: 'nuclear:ember' }),
      ).toBe(true);
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

      await ThemesWrapper.advancedThemeSelect.select('My Theme');

      expect(fs.readTextFile).toHaveBeenCalledWith('/themes/my.json', {
        baseDir: '/home/user/.local/share/com.nuclearplayer',
      });
      expect(themes.setThemeId).toHaveBeenCalledWith('');
      expect(themes.applyAdvancedTheme).toHaveBeenCalledTimes(1);
      expect(useThemeStore.getState().isAdvancedThemeSelected()).toBe(true);
      expect(
        useThemeStore
          .getState()
          .isSelected({ type: 'advanced', path: '/themes/my.json' }),
      ).toBe(true);
    });

    it('resets to default when the Default basic theme is clicked', async () => {
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

      await ThemesWrapper.advancedThemeSelect.select('My Theme');
      await ThemesWrapper.selectBasicTheme('Default');

      expect(useThemeStore.getState().isBasicThemeSelected()).toBe(true);
    });

    it('unhighlights basic themes when an advanced theme is selected', async () => {
      PluginFsMock.setReadTextFile(
        JSON.stringify({
          version: 1,
          name: 'My Theme',
          vars: { primary: '#123' },
        }),
      );

      await ThemesWrapper.mount({ advancedThemes });
      await ThemesWrapper.selectBasicTheme('Ember');
      expect(ThemesWrapper.activeBasicTheme).toBe('Ember');

      await ThemesWrapper.advancedThemeSelect.select('My Theme');
      expect(ThemesWrapper.activeBasicTheme).toBeNull();
    });

    it('hides the marketplace dropdown when no marketplace themes are installed', async () => {
      await ThemesWrapper.mount();
      expect(ThemesWrapper.marketplaceThemeSelect).toBeNull();
    });

    it('shows the marketplace dropdown when marketplace themes are installed', async () => {
      await ThemesWrapper.mountWithMarketplaceTheme();
      expect(ThemesWrapper.marketplaceThemeSelect).not.toBeNull();
    });

    it('selects a marketplace theme from the my themes tab dropdown', async () => {
      await ThemesWrapper.mountWithMarketplaceTheme();
      await ThemesWrapper.marketplaceThemeSelect!.select('Sakura');
      expect(ThemesWrapper.activeBasicTheme).toBeNull();
      expect(ThemesWrapper.advancedThemeSelect.selected()).toBe(
        'Select a theme',
      );
    });

    it('unhighlights basic themes when a marketplace theme is selected', async () => {
      await ThemesWrapper.mountWithMarketplaceTheme();
      await ThemesWrapper.selectBasicTheme('Ember');
      expect(ThemesWrapper.activeBasicTheme).toBe('Ember');

      await ThemesWrapper.marketplaceThemeSelect!.select('Sakura');
      expect(ThemesWrapper.activeBasicTheme).toBeNull();
    });

    it('deselects the marketplace theme when a basic theme is clicked', async () => {
      await ThemesWrapper.mountWithMarketplaceTheme();
      await ThemesWrapper.marketplaceThemeSelect!.select('Sakura');
      expect(ThemesWrapper.marketplaceThemeSelect!.selected()).toBe('Sakura');

      await ThemesWrapper.selectBasicTheme('Ember');
      expect(ThemesWrapper.activeBasicTheme).toBe('Ember');
      expect(ThemesWrapper.marketplaceThemeSelect!.selected()).toBe(
        'Select a theme',
      );
    });

    it('deselects the marketplace theme when an advanced theme is selected', async () => {
      PluginFsMock.setReadTextFile(
        JSON.stringify({
          version: 1,
          name: 'My Theme',
          vars: { primary: '#123' },
        }),
      );

      await ThemesWrapper.mountWithMarketplaceTheme({ advancedThemes });
      await ThemesWrapper.marketplaceThemeSelect!.select('Sakura');
      expect(ThemesWrapper.marketplaceThemeSelect!.selected()).toBe('Sakura');

      await ThemesWrapper.advancedThemeSelect.select('My Theme');
      expect(ThemesWrapper.marketplaceThemeSelect!.selected()).toBe(
        'Select a theme',
      );
    });
  });

  describe('Store tab', () => {
    beforeEach(() => {
      ThemesWrapper.setupStoreIndex();
    });

    it('shows theme cards with names, descriptions, authors, and palette swatches', async () => {
      await ThemesWrapper.mount();
      await ThemesWrapper.goToStoreTab();

      const storeThemes = await ThemesWrapper.getStoreThemes();
      expect(storeThemes.map((theme) => theme.data)).toEqual([
        {
          name: 'Sakura',
          description: 'Cherry blossom',
          author: 'by nukeop',
          isInstalled: false,
        },
        {
          name: 'Nordic Frost',
          description: 'Cool blue Scandinavian theme',
          author: 'by someone',
          isInstalled: false,
        },
      ]);
    });

    it('filters themes by search input matching name, description, author, and tags', async () => {
      await ThemesWrapper.mount();
      await ThemesWrapper.goToStoreTab();
      await ThemesWrapper.getStoreThemes();

      await ThemesWrapper.searchStore('sakura');
      expect(ThemesWrapper.storeThemeNames).toEqual(['Sakura']);

      await ThemesWrapper.searchStore('someone');
      expect(ThemesWrapper.storeThemeNames).toEqual(['Nordic Frost']);

      await ThemesWrapper.searchStore('blue');
      expect(ThemesWrapper.storeThemeNames).toEqual(['Nordic Frost']);

      await ThemesWrapper.searchStore('nonexistent');
      expect(ThemesWrapper.storeThemeNames).toEqual([]);
    });

    it('installs a theme when the user clicks install', async () => {
      ThemesWrapper.setupThemeFile('sakura');
      PluginFsMock.setExists(true);
      PluginFsMock.setMkdir(undefined);

      await ThemesWrapper.mount();
      await ThemesWrapper.goToStoreTab();

      await ThemesWrapper.installTheme('Sakura');

      const sakura = await ThemesWrapper.getStoreTheme('Sakura');
      await waitFor(() => {
        expect(sakura.isInstalled).toBe(true);
      });

      expect(fs.writeTextFile).toHaveBeenCalledWith(
        'themes/store/sakura.json',
        JSON.stringify(SAKURA_THEME_FILE, null, 2),
        { baseDir: fs.BaseDirectory.AppData },
      );
    });

    it('shows already-installed themes as installed', async () => {
      await ThemesWrapper.mount({
        marketplaceThemes: [
          { id: 'sakura', name: 'Sakura', path: 'themes/store/sakura.json' },
        ],
      });
      await ThemesWrapper.goToStoreTab();

      const sakura = await ThemesWrapper.getStoreTheme('Sakura');
      const nordic = await ThemesWrapper.getStoreTheme('Nordic Frost');

      expect(sakura.isInstalled).toBe(true);
      expect(nordic.isInstalled).toBe(false);
    });

    it('shows an error toast and logs the error when installation fails', async () => {
      ThemesWrapper.setupThemeFile('sakura');
      vi.mocked(fs.writeTextFile).mockRejectedValueOnce(
        new Error('Permission denied'),
      );

      await ThemesWrapper.mount();
      await ThemesWrapper.goToStoreTab();

      await ThemesWrapper.installTheme('Sakura');

      await waitFor(() => {
        expect(toastError).toHaveBeenCalled();
      });
      expect(logError).toHaveBeenCalledWith(
        expect.stringContaining('Permission denied'),
      );
      const sakura = await ThemesWrapper.getStoreTheme('Sakura');
      expect(sakura.isInstalled).toBe(false);
    });

    it('shows an error toast and logs the error when fetching the theme file fails', async () => {
      ThemesWrapper.setupThemeFileError('sakura', 404, 'Not Found');

      await ThemesWrapper.mount();
      await ThemesWrapper.goToStoreTab();

      await ThemesWrapper.installTheme('Sakura');

      await waitFor(() => {
        expect(toastError).toHaveBeenCalled();
      });
      expect(logError).toHaveBeenCalledWith(expect.stringContaining('404'));
      const sakura = await ThemesWrapper.getStoreTheme('Sakura');
      expect(sakura.isInstalled).toBe(false);
    });

    it('shows an error state when the store fails to load', async () => {
      ThemesWrapper.setupStoreIndexError(500, 'Internal Server Error');

      await ThemesWrapper.mount();
      await ThemesWrapper.goToStoreTab();

      expect(await ThemesWrapper.storeErrorState).toBeInTheDocument();
    });

    it('shows an apply button on installed store themes', async () => {
      await ThemesWrapper.mount({
        marketplaceThemes: [
          { id: 'sakura', name: 'Sakura', path: 'themes/store/sakura.json' },
        ],
      });
      await ThemesWrapper.goToStoreTab();

      const sakura = await ThemesWrapper.getStoreTheme('Sakura');
      expect(sakura.applyButton.element).toBeInTheDocument();

      const nordic = await ThemesWrapper.getStoreTheme('Nordic Frost');
      expect(nordic.applyButton.element).not.toBeInTheDocument();
    });

    it('applies a marketplace theme when the apply button is clicked', async () => {
      await ThemesWrapper.mountWithMarketplaceTheme();
      await ThemesWrapper.goToStoreTab();

      const sakura = await ThemesWrapper.getStoreTheme('Sakura');
      await sakura.applyButton.click();

      await ThemesWrapper.goToMyThemesTab();
      expect(ThemesWrapper.activeBasicTheme).toBeNull();
      expect(ThemesWrapper.marketplaceThemeSelect!.selected()).toBe('Sakura');
    });

    it('shows the active marketplace theme as active', async () => {
      await ThemesWrapper.mountWithMarketplaceTheme();
      await ThemesWrapper.goToStoreTab();

      const sakura = await ThemesWrapper.getStoreTheme('Sakura');
      expect(sakura.isActive).toBe(false);

      await sakura.applyButton.click();
      expect(sakura.isActive).toBe(true);
    });

    it('shows an uninstall button on installed store themes', async () => {
      await ThemesWrapper.mount({
        marketplaceThemes: [
          { id: 'sakura', name: 'Sakura', path: 'themes/store/sakura.json' },
        ],
      });
      await ThemesWrapper.goToStoreTab();

      const sakura = await ThemesWrapper.getStoreTheme('Sakura');
      expect(sakura.uninstallButton.element).toBeInTheDocument();

      const nordic = await ThemesWrapper.getStoreTheme('Nordic Frost');
      expect(nordic.uninstallButton.element).not.toBeInTheDocument();
    });

    it('uninstalls a theme and shows it as not installed', async () => {
      await ThemesWrapper.mountWithMarketplaceTheme();
      await ThemesWrapper.goToStoreTab();

      const sakura = await ThemesWrapper.getStoreTheme('Sakura');
      expect(sakura.isInstalled).toBe(true);

      await sakura.uninstallButton.click();

      await waitFor(() => {
        expect(sakura.isInstalled).toBe(false);
      });
      expect(fs.remove).toHaveBeenCalledWith('themes/store/sakura.json', {
        baseDir: '/home/user/.local/share/com.nuclearplayer',
      });
    });

    it('resets to default when the active theme is uninstalled', async () => {
      await ThemesWrapper.mountWithMarketplaceTheme();
      await ThemesWrapper.goToStoreTab();

      const sakura = await ThemesWrapper.getStoreTheme('Sakura');
      await sakura.applyButton.click();
      expect(sakura.isActive).toBe(true);

      await sakura.uninstallButton.click();

      await waitFor(() => {
        expect(sakura.isInstalled).toBe(false);
      });

      await ThemesWrapper.goToMyThemesTab();
      expect(ThemesWrapper.activeBasicTheme).toBe('Default');
    });
  });
});
