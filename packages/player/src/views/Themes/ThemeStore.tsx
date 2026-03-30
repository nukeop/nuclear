import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { CenteredLoader, Input, ThemeStoreItem } from '@nuclearplayer/ui';

import { useFilteredMarketplaceThemes } from '../../hooks/useFilteredMarketplaceThemes';
import { useInstallTheme } from '../../hooks/useInstallTheme';
import { useThemeStore } from '../../stores/themeStore';

export const ThemeStore: FC = () => {
  const { t } = useTranslation('themes');
  const { themes, search, setSearch, isLoading } =
    useFilteredMarketplaceThemes();
  const { mutate: installTheme, isPending, variables } = useInstallTheme();
  const marketplaceThemes = useThemeStore((state) => state.marketplaceThemes);

  const isInstalled = (themeId: string) =>
    marketplaceThemes.some((theme) => theme.id === themeId);

  if (isLoading) {
    return <CenteredLoader />;
  }

  return (
    <div data-testid="theme-store" className="flex flex-col gap-4 p-1">
      <Input
        placeholder={t('store.searchPlaceholder')}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {themes?.map((theme) => (
        <ThemeStoreItem
          key={theme.id}
          {...theme}
          onInstall={() => installTheme({ theme })}
          isInstalled={isInstalled(theme.id)}
          isInstalling={isPending && variables?.theme.id === theme.id}
          labels={{
            install: t('store.install'),
            installing: t('store.installing'),
            installed: t('store.installed'),
            by: t('store.by'),
          }}
        />
      ))}
    </div>
  );
};
