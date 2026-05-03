import { type Mock } from 'vitest';

import { pluginMarketplaceApi } from '../../apis/pluginMarketplaceApi';
import { usePluginStore } from '../../stores/pluginStore';
import { getSetting } from '../../stores/settingsStore';
import { MarketplacePluginBuilder } from '../../test/builders/MarketplacePluginBuilder';
import { PluginRegistryEntryBuilder } from '../../test/builders/PluginRegistryEntryBuilder';
import { checkAndUpdatePlugins } from './pluginAutoUpdate';
import { downloadAndExtractPlugin } from './pluginDownloader';
import { listRegistryEntries } from './pluginRegistry';

vi.mock('../../stores/settingsStore', () => ({
  getSetting: vi.fn(),
}));

vi.mock('./pluginRegistry', () => ({
  listRegistryEntries: vi.fn(),
}));

vi.mock('./pluginDownloader', () => ({
  downloadAndExtractPlugin: vi.fn(),
}));

vi.mock('../../apis/pluginMarketplaceApi', () => ({
  pluginMarketplaceApi: {
    getPlugins: vi.fn(),
  },
}));

vi.mock('../../stores/pluginStore', () => ({
  usePluginStore: {
    getState: vi.fn(),
  },
}));

const mockGetSetting = getSetting as Mock;
const mockListRegistryEntries = listRegistryEntries as Mock;
const mockGetPlugins = pluginMarketplaceApi.getPlugins as Mock;
const mockDownloadAndExtract = downloadAndExtractPlugin as Mock;

const mockUnloadPlugin = vi.fn();
const mockLoadPluginFromPath = vi.fn();

describe('checkAndUpdatePlugins', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePluginStore.getState as Mock).mockReturnValue({
      unloadPlugin: mockUnloadPlugin,
      loadPluginFromPath: mockLoadPluginFromPath,
    });
  });

  it('skips entirely if plugins.autoUpdate is disabled', async () => {
    mockGetSetting.mockReturnValue(false);
    mockListRegistryEntries.mockResolvedValue([
      new PluginRegistryEntryBuilder()
        .withId('outdated-plugin')
        .withVersion('1.0.0')
        .build(),
    ]);
    mockGetPlugins.mockResolvedValue([
      new MarketplacePluginBuilder()
        .withId('outdated-plugin')
        .withVersion('2.0.0')
        .withDownloadUrl('https://example.com/outdated-plugin.zip')
        .build(),
    ]);

    await checkAndUpdatePlugins();

    expect(mockUnloadPlugin).not.toHaveBeenCalled();
    expect(mockLoadPluginFromPath).not.toHaveBeenCalled();
  });

  it('does nothing when all plugins are up to date', async () => {
    mockGetSetting.mockReturnValue(true);
    mockListRegistryEntries.mockResolvedValue([
      new PluginRegistryEntryBuilder()
        .withId('plugin-a')
        .withVersion('2.0.0')
        .build(),
    ]);
    mockGetPlugins.mockResolvedValue([
      new MarketplacePluginBuilder()
        .withId('plugin-a')
        .withVersion('2.0.0')
        .withDownloadUrl('https://example.com/plugin-a.zip')
        .build(),
    ]);

    await checkAndUpdatePlugins();

    expect(mockUnloadPlugin).not.toHaveBeenCalled();
    expect(mockLoadPluginFromPath).not.toHaveBeenCalled();
  });
  it.todo('updates multiple plugins, skipping ones that are already current');
  it.todo('skips dev plugins');
  it.todo('keeps old version and logs warning when update fails');
  it.todo('skips plugins missing version or downloadUrl in marketplace');
});
