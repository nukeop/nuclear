import { mockIPC } from '@tauri-apps/api/mocks';
import { screen } from '@testing-library/react';

import { FetchMock } from '../../test/mocks/fetch';
import { PluginFsMock } from '../../test/mocks/plugin-fs';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { PluginsWrapper } from './Plugins.test-wrapper';
import {
  fakeGitHubRelease,
  fakeMarketplacePlugins,
  fakeYouTubePluginManifest,
} from './Plugins.test.data';

const setupRegistryMock = () => {
  FetchMock.get('plugin-registry', {
    version: 1,
    plugins: fakeMarketplacePlugins,
  });
};

describe('Plugin Store', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    FetchMock.reset();
  });

  it('(Snapshot) renders the plugin store with plugins from the registry', async () => {
    setupRegistryMock();

    const component = (await PluginsWrapper.mount()).getByRole('dialog');
    await PluginsWrapper.goToStoreTab();

    await screen.findAllByTestId('plugin-store-item');

    expect(component).toMatchSnapshot();
  });

  it('displays plugins with their name, description, and author', async () => {
    setupRegistryMock();

    await PluginsWrapper.mount();
    await PluginsWrapper.goToStoreTab();

    await screen.findAllByTestId('plugin-store-item');

    const storePlugins = PluginsWrapper.getStorePlugins();
    expect(storePlugins.map((p) => p.data)).toMatchInlineSnapshot(`
      [
        {
          "author": "by nukeop",
          "description": "Stream music from YouTube",
          "isInstalled": false,
          "name": "YouTube Music",
        },
        {
          "author": "by nukeop",
          "description": "Scrobble your listening history to Last.fm",
          "isInstalled": false,
          "name": "Last.fm Scrobbler",
        },
        {
          "author": "by nukeop",
          "description": "Fetch metadata from MusicBrainz database",
          "isInstalled": false,
          "name": "MusicBrainz Metadata",
        },
      ]
    `);
  });

  it('filters plugins by search text', async () => {
    setupRegistryMock();

    await PluginsWrapper.mount();
    await PluginsWrapper.goToStoreTab();
    await screen.findAllByTestId('plugin-store-item');

    await PluginsWrapper.searchStore('youtube');

    const storePlugins = PluginsWrapper.getStorePlugins();
    expect(storePlugins).toHaveLength(1);
    expect(storePlugins[0].name).toBe('YouTube Music');
  });

  it('filters plugins by category', async () => {
    setupRegistryMock();

    await PluginsWrapper.mount();
    await PluginsWrapper.goToStoreTab();
    await screen.findAllByTestId('plugin-store-item');

    await PluginsWrapper.selectCategory('Metadata');

    const storePlugins = PluginsWrapper.getStorePlugins();
    expect(storePlugins).toHaveLength(1);
    expect(storePlugins[0].name).toBe('MusicBrainz Metadata');
  });

  it('shows empty state when no plugins match filters', async () => {
    setupRegistryMock();

    await PluginsWrapper.mount();
    await PluginsWrapper.goToStoreTab();
    await screen.findAllByTestId('plugin-store-item');

    await PluginsWrapper.searchStore('nonexistent plugin xyz');

    expect(PluginsWrapper.getStorePlugins()).toHaveLength(0);
    expect(screen.getByText('No plugins found')).toBeVisible();
  });

  it('installs a plugin from the store', async () => {
    setupRegistryMock();
    FetchMock.get(
      '/repos/NuclearPlayer/nuclear-youtube-plugin/releases/latest',
      fakeGitHubRelease('NuclearPlayer/nuclear-youtube-plugin'),
    );

    mockIPC((cmd) => {
      if (cmd === 'download_file') {
        return undefined;
      }
      if (cmd === 'extract_zip') {
        return undefined;
      }
      if (cmd === 'copy_dir_recursive') {
        return undefined;
      }
    });

    PluginFsMock.setExists(true);
    PluginFsMock.setMkdir(undefined);
    PluginFsMock.setRemove();
    PluginFsMock.setReadTextFile(fakeYouTubePluginManifest);

    await PluginsWrapper.mount();
    await PluginsWrapper.goToStoreTab();
    await screen.findAllByTestId('plugin-store-item');

    const youtubePlugin = PluginsWrapper.getStorePlugins()[0];
    expect(youtubePlugin.name).toBe('YouTube Music');
    expect(youtubePlugin.isInstalled).toBe(false);

    await youtubePlugin.install();

    await screen.findByRole('button', { name: /installed/i });

    await PluginsWrapper.goToInstalledTab();
    const installedPlugins = PluginsWrapper.getPlugins();
    expect(installedPlugins).toHaveLength(1);
    expect(installedPlugins[0].name).toBe('YouTube Music');
  });
});
