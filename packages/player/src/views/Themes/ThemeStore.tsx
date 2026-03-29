import { noop } from 'lodash-es';
import { FC } from 'react';

import { ThemeStoreItem } from '@nuclearplayer/ui';

import { useMarketplaceThemes } from '../../hooks/useThemeRegistry';

export const ThemeStore: FC = () => {
  const { data: themes } = useMarketplaceThemes();

  return (
    <div data-testid="theme-store">
      {themes?.map((theme) => (
        <ThemeStoreItem key={theme.id} {...theme} onInstall={noop} />
      ))}
    </div>
  );
};
