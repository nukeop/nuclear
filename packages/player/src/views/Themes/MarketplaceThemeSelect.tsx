import { useTranslation } from '@nuclearplayer/i18n';
import { SectionShell, Select } from '@nuclearplayer/ui';

import { useMarketplaceThemeOptions } from '../../hooks/useMarketplaceThemeOptions';
import { useThemeStore } from '../../stores/themeStore';

export const MarketplaceThemeSelect = () => {
  const { t } = useTranslation('themes');
  const marketplaceThemes = useThemeStore((state) => state.marketplaceThemes);
  const options = useMarketplaceThemeOptions();

  if (marketplaceThemes.length === 0) {
    return null;
  }

  return (
    <SectionShell data-testid="marketplace-themes" title={t('marketplace')}>
      <div className="max-w-80 p-1">
        <Select options={options} onValueChange={() => {}} />
      </div>
    </SectionShell>
  );
};
