import { useTranslation } from '@nuclearplayer/i18n';
import { SectionShell, Select } from '@nuclearplayer/ui';

import { useAdvancedThemeOptions } from '../../hooks/useAdvancedThemeOptions';
import { loadAndApplyAdvancedThemeFromFile } from '../../services/advancedThemeService';

export const AdvancedThemeSelect = () => {
  const { t } = useTranslation('themes');
  const options = useAdvancedThemeOptions();

  return (
    <SectionShell data-testid="advanced-themes" title={t('advanced')}>
      <div className="max-w-80 p-1">
        <Select
          description={t('description')}
          options={options}
          onValueChange={loadAndApplyAdvancedThemeFromFile}
        />
      </div>
    </SectionShell>
  );
};
