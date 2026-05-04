import '../../test/mocks/plugin-fs';

import { mockIPC } from '@tauri-apps/api/mocks';

import { usePluginStore } from '../../stores/pluginStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { MarketplacePluginBuilder } from '../../test/builders/MarketplacePluginBuilder';
import { FetchMock } from '../../test/mocks/fetch';
import { PluginFsMock } from '../../test/mocks/plugin-fs';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { seedPlugin } from '../../test/utils/seedPlugins';
import { createPluginFolder } from '../../test/utils/testPluginFolder';
import { checkAndUpdatePlugins } from './pluginAutoUpdate';

const logWarn = vi.fn();
vi.mock('@tauri-apps/plugin-log', () => ({
  warn: (...args: unknown[]) => logWarn(...args),
  debug: () => Promise.resolve(),
  trace: () => Promise.resolve(),
  info: () => Promise.resolve(),
  error: () => Promise.resolve(),
}));

const DOWNLOAD_BASE =
  '/home/user/.local/share/com.nuclearplayer/plugins/.downloads';

describe('checkAndUpdatePlugins', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    PluginFsMock.reset();
    FetchMock.init();
    usePluginStore.setState({ plugins: {} });
    mockIPC((cmd) => {
      if (cmd === 'copy_dir_recursive') {
        return true;
      }
    });
  });

  it('skips entirely if plugins.autoUpdate is disabled', async () => {
    useSettingsStore.getState().setValue('core.plugins.autoUpdate', false);
    await seedPlugin({ id: 'outdated' });

    FetchMock.get('plugin-registry', {
      version: 1,
      plugins: [
        new MarketplacePluginBuilder()
          .withId('outdated')
          .withVersion('2.0.0')
          .withDownloadUrl('https://example.com/outdated.zip')
          .build(),
      ],
    });

    await checkAndUpdatePlugins();

    expect(
      usePluginStore.getState().getPlugin('outdated')?.metadata.version,
    ).toBe('1.0.0');
  });

  it('does nothing when all plugins are up to date', async () => {
    useSettingsStore.getState().setValue('core.plugins.autoUpdate', true);
    await seedPlugin({ id: 'current', version: '2.0.0' });

    FetchMock.get('plugin-registry', {
      version: 1,
      plugins: [
        new MarketplacePluginBuilder()
          .withId('current')
          .withVersion('2.0.0')
          .withDownloadUrl('https://example.com/current.zip')
          .build(),
      ],
    });

    await checkAndUpdatePlugins();

    expect(
      usePluginStore.getState().getPlugin('current')?.metadata.version,
    ).toBe('2.0.0');
  });

  it('updates multiple plugins, skipping ones that are already current', async () => {
    useSettingsStore.getState().setValue('core.plugins.autoUpdate', true);
    await seedPlugin({ id: 'outdated-1' });
    await seedPlugin({ id: 'up-to-date', version: '3.0.0' });
    await seedPlugin({ id: 'outdated-2', version: '1.5.0' });

    FetchMock.get('plugin-registry', {
      version: 1,
      plugins: [
        new MarketplacePluginBuilder()
          .withId('outdated-1')
          .withVersion('2.0.0')
          .withDownloadUrl('https://example.com/outdated-1.zip')
          .build(),
        new MarketplacePluginBuilder()
          .withId('up-to-date')
          .withVersion('3.0.0')
          .withDownloadUrl('https://example.com/up-to-date.zip')
          .build(),
        new MarketplacePluginBuilder()
          .withId('outdated-2')
          .withVersion('2.0.0')
          .withDownloadUrl('https://example.com/outdated-2.zip')
          .build(),
      ],
    });

    createPluginFolder(`${DOWNLOAD_BASE}/outdated-1`, {
      id: 'outdated-1',
      version: '2.0.0',
    });
    createPluginFolder(`${DOWNLOAD_BASE}/outdated-2`, {
      id: 'outdated-2',
      version: '2.0.0',
    });

    await checkAndUpdatePlugins();

    const plugins = usePluginStore.getState();
    expect(plugins.getPlugin('outdated-1')?.metadata.version).toBe('2.0.0');
    expect(plugins.getPlugin('up-to-date')?.metadata.version).toBe('3.0.0');
    expect(plugins.getPlugin('outdated-2')?.metadata.version).toBe('2.0.0');
  });

  it('skips dev plugins', async () => {
    useSettingsStore.getState().setValue('core.plugins.autoUpdate', true);
    await seedPlugin({ id: 'dev-plugin', installationMethod: 'dev' });
    await seedPlugin({ id: 'store-plugin' });

    FetchMock.get('plugin-registry', {
      version: 1,
      plugins: [
        new MarketplacePluginBuilder()
          .withId('dev-plugin')
          .withVersion('2.0.0')
          .withDownloadUrl('https://example.com/dev-plugin.zip')
          .build(),
        new MarketplacePluginBuilder()
          .withId('store-plugin')
          .withVersion('2.0.0')
          .withDownloadUrl('https://example.com/store-plugin.zip')
          .build(),
      ],
    });

    createPluginFolder(`${DOWNLOAD_BASE}/store-plugin`, {
      id: 'store-plugin',
      version: '2.0.0',
    });

    await checkAndUpdatePlugins();

    const plugins = usePluginStore.getState();
    expect(plugins.getPlugin('dev-plugin')?.metadata.version).toBe('1.0.0');
    expect(plugins.getPlugin('store-plugin')?.metadata.version).toBe('2.0.0');
  });

  it('keeps old version and logs warning when update fails', async () => {
    useSettingsStore.getState().setValue('core.plugins.autoUpdate', true);
    await seedPlugin({ id: 'failing-plugin' });
    await seedPlugin({ id: 'good-plugin' });

    FetchMock.get('plugin-registry', {
      version: 1,
      plugins: [
        new MarketplacePluginBuilder()
          .withId('failing-plugin')
          .withVersion('2.0.0')
          .withDownloadUrl('https://example.com/failing-plugin.zip')
          .build(),
        new MarketplacePluginBuilder()
          .withId('good-plugin')
          .withVersion('2.0.0')
          .withDownloadUrl('https://example.com/good-plugin.zip')
          .build(),
      ],
    });

    mockIPC((cmd, args) => {
      if (cmd === 'copy_dir_recursive') {
        return true;
      }
      if (
        cmd === 'download_file' &&
        (args as Record<string, string>).url?.includes('failing-plugin')
      ) {
        throw new Error('Network error');
      }
    });

    createPluginFolder(`${DOWNLOAD_BASE}/good-plugin`, {
      id: 'good-plugin',
      version: '2.0.0',
    });

    await checkAndUpdatePlugins();

    const plugins = usePluginStore.getState();
    expect(plugins.getPlugin('failing-plugin')?.metadata.version).toBe('1.0.0');
    expect(plugins.getPlugin('good-plugin')?.metadata.version).toBe('2.0.0');
    expect(logWarn).toHaveBeenCalledWith(
      expect.stringContaining('failing-plugin'),
    );
  });

  it('skips plugins missing version or downloadUrl in marketplace', async () => {
    useSettingsStore.getState().setValue('core.plugins.autoUpdate', true);
    await seedPlugin({ id: 'no-version' });
    await seedPlugin({ id: 'no-url' });
    await seedPlugin({ id: 'has-both' });

    FetchMock.get('plugin-registry', {
      version: 1,
      plugins: [
        new MarketplacePluginBuilder()
          .withId('no-version')
          .withDownloadUrl('https://example.com/no-version.zip')
          .build(),
        new MarketplacePluginBuilder()
          .withId('no-url')
          .withVersion('2.0.0')
          .build(),
        new MarketplacePluginBuilder()
          .withId('has-both')
          .withVersion('2.0.0')
          .withDownloadUrl('https://example.com/has-both.zip')
          .build(),
      ],
    });

    createPluginFolder(`${DOWNLOAD_BASE}/has-both`, {
      id: 'has-both',
      version: '2.0.0',
    });

    await checkAndUpdatePlugins();

    const plugins = usePluginStore.getState();
    expect(plugins.getPlugin('no-version')?.metadata.version).toBe('1.0.0');
    expect(plugins.getPlugin('no-url')?.metadata.version).toBe('1.0.0');
    expect(plugins.getPlugin('has-both')?.metadata.version).toBe('2.0.0');
  });

  it('preserves enabled state after updating a plugin', async () => {
    useSettingsStore.getState().setValue('core.plugins.autoUpdate', true);
    await seedPlugin({ id: 'enabled-plugin', enabled: true });
    await seedPlugin({ id: 'disabled-plugin', enabled: false });

    FetchMock.get('plugin-registry', {
      version: 1,
      plugins: [
        new MarketplacePluginBuilder()
          .withId('enabled-plugin')
          .withVersion('2.0.0')
          .withDownloadUrl('https://example.com/enabled-plugin.zip')
          .build(),
        new MarketplacePluginBuilder()
          .withId('disabled-plugin')
          .withVersion('2.0.0')
          .withDownloadUrl('https://example.com/disabled-plugin.zip')
          .build(),
      ],
    });

    createPluginFolder(`${DOWNLOAD_BASE}/enabled-plugin`, {
      id: 'enabled-plugin',
      version: '2.0.0',
    });
    createPluginFolder(`${DOWNLOAD_BASE}/disabled-plugin`, {
      id: 'disabled-plugin',
      version: '2.0.0',
    });

    await checkAndUpdatePlugins();

    const plugins = usePluginStore.getState();
    expect(plugins.getPlugin('enabled-plugin')?.metadata.version).toBe('2.0.0');
    expect(plugins.getPlugin('enabled-plugin')?.enabled).toBe(true);
    expect(plugins.getPlugin('disabled-plugin')?.metadata.version).toBe(
      '2.0.0',
    );
    expect(plugins.getPlugin('disabled-plugin')?.enabled).toBe(false);
  });
});
