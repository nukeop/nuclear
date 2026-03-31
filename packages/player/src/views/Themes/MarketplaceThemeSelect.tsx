import { useCallback } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { SectionShell, Select } from '@nuclearplayer/ui';

import { useMarketplaceThemeOptions } from '../../hooks/useMarketplaceThemeOptions';
import { loadAndApplyThemeFile } from '../../services/advancedThemeService';
import { useThemeStore } from '../../stores/themeStore';

export const MarketplaceThemeSelect = () => {
  const { t } = useTranslation('themes');
  const marketplaceThemes = useThemeStore((state) => state.marketplaceThemes);
  const activeTheme = useThemeStore((state) => state.activeTheme);
  const options = useMarketplaceThemeOptions();
  const value = activeTheme.type === 'marketplace' ? activeTheme.id : '';

  const handleValueChange = useCallback(
    async (id: string) => {
      const theme = marketplaceThemes.find((theme) => theme.id === id);
      if (!theme) {
        return;
      }
      await loadAndApplyThemeFile(theme.path);
      await useThemeStore.getState().selectMarketplaceTheme(id);
    },
    [marketplaceThemes],
  );

  if (marketplaceThemes.length === 0) {
    return null;
  }

  return (
    <SectionShell data-testid="marketplace-themes" title={t('marketplace')}>
      <div className="max-w-80 p-1">
        <Select
          placeholder={t('selectPlaceholder')}
          options={options}
          value={value}
          onValueChange={handleValueChange}
        />
      </div>
    </SectionShell>
  );
};
