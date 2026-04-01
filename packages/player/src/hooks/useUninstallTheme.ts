import { useMutation } from '@tanstack/react-query';
import { BaseDirectory, remove } from '@tauri-apps/plugin-fs';

import { useTranslation } from '@nuclearplayer/i18n';
import { clearAdvancedTheme, DEFAULT_THEME_ID } from '@nuclearplayer/themes';

import { useThemeStore } from '../stores/themeStore';
import { reportError } from '../utils/logging';

type UninstallThemeParams = {
  id: string;
  name: string;
  path: string;
};

export const useUninstallTheme = () => {
  const { t } = useTranslation('themes');

  return useMutation({
    mutationFn: async ({ path }: UninstallThemeParams) => {
      await remove(path, { baseDir: BaseDirectory.AppData });
    },
    onSuccess: (_, { id }) => {
      const store = useThemeStore.getState();

      store.setMarketplaceThemes(
        store.marketplaceThemes.filter((theme) => theme.id !== id),
      );

      if (store.isMarketplaceThemeActive(id)) {
        clearAdvancedTheme();
        store.selectBasicTheme(DEFAULT_THEME_ID);
      }
    },
    onError: (error, { name }) => {
      reportError('themes', {
        userMessage: t('store.uninstallError', { name }),
        error,
      });
    },
  });
};
