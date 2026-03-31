import { useTranslation } from '@nuclearplayer/i18n';
import { SectionShell, Select } from '@nuclearplayer/ui';

import { useThemeStore } from '../../stores/themeStore';

export const MarketplaceThemeSelect = () => {
  const { t } = useTranslation('themes');
  const { marketplaceThemes } = useThemeStore();

  if (marketplaceThemes.length === 0) {
    return null;
  }

  return (
    <SectionShell data-testid="marketplace-themes" title={t('marketplace')}>
      <div className="max-w-80 p-1">
        <Select
          options={marketplaceThemes
            .filter((theme) => theme.id)
            .map((theme) => ({
              id: theme.id!,
              label: theme.name,
            }))}
          onValueChange={() => {}}
        />
      </div>
    </SectionShell>
  );
};
