import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { CenteredLoader, Input, ThemeStoreItem } from '@nuclearplayer/ui';

import { useFilteredMarketplaceThemes } from '../../hooks/useFilteredMarketplaceThemes';
import { useInstallTheme } from '../../hooks/useInstallTheme';
import { useUninstallTheme } from '../../hooks/useUninstallTheme';
import { loadAndApplyMarketplaceTheme } from '../../services/advancedThemeService';
import { useThemeStore } from '../../stores/themeStore';

export const ThemeStore: FC = () => {
  const { t } = useTranslation('themes');
  const { themes, search, setSearch, isLoading, isError } =
    useFilteredMarketplaceThemes();
  const { mutate: installTheme, isPending, variables } = useInstallTheme();
  const { mutate: uninstallTheme } = useUninstallTheme();
  const { marketplaceThemes, isMarketplaceThemeActive } = useThemeStore();

  const isInstalled = (themeId: string) =>
    marketplaceThemes.some((theme) => theme.id === themeId);

  if (isLoading) {
    return <CenteredLoader />;
  }

  if (isError) {
    return (
      <p
        data-testid="theme-store-error"
        className="text-foreground-secondary p-4 text-sm"
      >
        {t('store.loadError')}
      </p>
    );
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
          onApply={() => loadAndApplyMarketplaceTheme(theme.id)}
          onUninstall={() =>
            uninstallTheme({
              id: theme.id,
              name: theme.name,
              path: `themes/store/${theme.id}.json`,
            })
          }
          isInstalled={isInstalled(theme.id)}
          isInstalling={isPending && variables?.theme.id === theme.id}
          isActive={isMarketplaceThemeActive(theme.id)}
          labels={{
            install: t('store.install'),
            installing: t('store.installing'),
            installed: t('store.installed'),
            apply: t('store.apply'),
            active: t('store.active'),
            uninstall: t('store.uninstall'),
            by: t('store.by'),
          }}
        />
      ))}
    </div>
  );
};
