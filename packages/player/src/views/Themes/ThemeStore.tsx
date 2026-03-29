import { noop } from 'lodash-es';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { CenteredLoader, Input, ThemeStoreItem } from '@nuclearplayer/ui';

import { useFilteredMarketplaceThemes } from '../../hooks/useFilteredMarketplaceThemes';

export const ThemeStore: FC = () => {
  const { t } = useTranslation('themes');
  const { themes, search, setSearch, isLoading } =
    useFilteredMarketplaceThemes();

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
          onInstall={noop}
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
