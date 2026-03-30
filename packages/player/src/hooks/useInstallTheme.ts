import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';

import { useTranslation } from '@nuclearplayer/i18n';
import { type MarketplaceTheme } from '@nuclearplayer/themes';

import { themeRegistryApi } from '../apis/themeRegistryApi';
import { useThemeStore } from '../stores/themeStore';
import { reportError } from '../utils/logging';
import { ensureDir } from '../utils/path';
import { MARKETPLACE_THEMES_QUERY_KEY } from './useThemeRegistry';

type InstallThemeParams = {
  theme: MarketplaceTheme;
};

export const useInstallTheme = () => {
  const { t } = useTranslation('themes');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ theme }: InstallThemeParams) => {
      const themeFile = await themeRegistryApi.getThemeFile(theme.path);

      await ensureDir('themes/store');

      await writeTextFile(
        `themes/store/${theme.id}.json`,
        JSON.stringify(themeFile, null, 2),
        { baseDir: BaseDirectory.AppData },
      );

      return theme;
    },
    onSuccess: (theme) => {
      const store = useThemeStore.getState();
      store.setMarketplaceThemes([
        ...store.marketplaceThemes,
        {
          id: theme.id,
          name: theme.name,
          path: `themes/store/${theme.id}.json`,
        },
      ]);
      queryClient.invalidateQueries({
        queryKey: MARKETPLACE_THEMES_QUERY_KEY,
      });
    },
    onError: (error, { theme }) => {
      reportError('themes', {
        userMessage: t('store.installError', { name: theme.name }),
        error,
      });
    },
  });
};
