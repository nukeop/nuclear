import gt from 'semver/functions/gt';

import { pluginMarketplaceApi } from '../../apis/pluginMarketplaceApi';
import { usePluginStore } from '../../stores/pluginStore';
import { getSetting } from '../../stores/settingsStore';
import { resolveErrorMessage } from '../../utils/logging';
import { Logger } from '../logger';
import { downloadAndExtractPlugin } from './pluginDownloader';
import { listRegistryEntries } from './pluginRegistry';

export const checkAndUpdatePlugins = async (): Promise<void> => {
  const autoUpdate = getSetting('plugins.autoUpdate');
  if (!autoUpdate) {
    return;
  }

  const entries = await listRegistryEntries();
  const storeEntries = entries.filter(
    (entry) => entry.installationMethod === 'store',
  );

  const marketplacePlugins = await pluginMarketplaceApi.getPlugins();

  for (const entry of storeEntries) {
    const remote = marketplacePlugins.find((plugin) => plugin.id === entry.id);
    if (!remote?.version || !remote?.downloadUrl) {
      continue;
    }

    if (!gt(remote.version, entry.version)) {
      continue;
    }

    try {
      const extractedPath = await downloadAndExtractPlugin({
        pluginId: entry.id,
        downloadUrl: remote.downloadUrl,
      });

      await usePluginStore.getState().unloadPlugin(entry.id);
      await usePluginStore.getState().loadPluginFromPath(extractedPath);
    } catch (error) {
      Logger.plugins.warn(
        `Failed to auto-update plugin ${entry.id}: ${resolveErrorMessage(error)}`,
      );
    }
  }
};
