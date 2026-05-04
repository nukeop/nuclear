import gt from 'semver/functions/gt';

import { pluginMarketplaceApi } from '../../apis/pluginMarketplaceApi';
import { usePluginStore } from '../../stores/pluginStore';
import { getSetting } from '../../stores/settingsStore';
import { resolveErrorMessage } from '../../utils/logging';
import { Logger } from '../logger';
import { downloadAndExtractPlugin } from './pluginDownloader';
import { listRegistryEntries } from './pluginRegistry';

export const checkAndUpdatePlugins = async (): Promise<void> => {
  const autoUpdate = getSetting('core.plugins.autoUpdate');
  if (!autoUpdate) {
    Logger.plugins.info(
      'Auto-update is disabled, skipping plugin update check',
    );
    return;
  }

  Logger.plugins.info('Checking for plugin updates...');

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
      Logger.plugins.info(
        `Updating plugin ${entry.id} from version ${entry.version} to ${remote.version}...`,
      );
      const wasEnabled = entry.enabled;

      const extractedPath = await downloadAndExtractPlugin({
        pluginId: entry.id,
        downloadUrl: remote.downloadUrl,
      });

      await usePluginStore.getState().unloadPlugin(entry.id);
      await usePluginStore.getState().loadPluginFromPath(extractedPath);

      if (wasEnabled) {
        await usePluginStore.getState().enablePlugin(entry.id);
      }
      Logger.plugins.info(
        `Successfully updated plugin ${entry.id} to version ${remote.version}`,
      );
    } catch (error) {
      Logger.plugins.warn(
        `Failed to auto-update plugin ${entry.id}: ${resolveErrorMessage(error)}`,
      );
    }
  }
};
