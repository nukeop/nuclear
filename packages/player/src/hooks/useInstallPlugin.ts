import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useTranslation } from '@nuclearplayer/i18n';

import {
  pluginMarketplaceApi,
  type MarketplacePlugin,
} from '../apis/pluginMarketplaceApi';
import {
  cleanupDownload,
  downloadAndExtractPlugin,
} from '../services/plugins/pluginDownloader';
import { upsertRegistryEntry } from '../services/plugins/pluginRegistry';
import { usePluginStore } from '../stores/pluginStore';
import { errorMessage } from '../utils/errorMessage';

type InstallPluginParams = {
  plugin: MarketplacePlugin;
};

export const useInstallPlugin = () => {
  const { t } = useTranslation('plugins');
  const loadPluginFromPath = usePluginStore((s) => s.loadPluginFromPath);
  const enablePlugin = usePluginStore((s) => s.enablePlugin);

  return useMutation({
    mutationFn: async ({ plugin }: InstallPluginParams) => {
      const release = await pluginMarketplaceApi.getLatestRelease(plugin.repo);

      const extractedPath = await downloadAndExtractPlugin({
        pluginId: plugin.id,
        downloadUrl: release.downloadUrl,
      });

      try {
        const now = new Date().toISOString();
        await upsertRegistryEntry({
          id: plugin.id,
          version: release.version,
          path: extractedPath,
          installationMethod: 'store',
          enabled: false,
          installedAt: now,
          lastUpdatedAt: now,
        });

        await loadPluginFromPath(extractedPath);
        await enablePlugin(plugin.id);
      } finally {
        await cleanupDownload(plugin.id);
      }

      return { plugin, version: release.version };
    },
    onError: (error, { plugin }) => {
      const message = errorMessage(error);
      toast.error(t('store.installError.title', { name: plugin.name }), {
        description: message,
      });
    },
  });
};
