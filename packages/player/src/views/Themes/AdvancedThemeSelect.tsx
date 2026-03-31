import { useTranslation } from '@nuclearplayer/i18n';
import { SectionShell, Select } from '@nuclearplayer/ui';

import { loadAndApplyAdvancedThemeFromFile } from '../../services/advancedThemeService';
import { useThemeStore } from '../../stores/themeStore';

export const AdvancedThemeSelect = () => {
  const { t } = useTranslation('themes');
  const { advancedThemes, resetTheme } = useThemeStore();

  return (
    <SectionShell data-testid="advanced-themes" title={t('advanced')}>
      <div className="max-w-80 p-1">
        <Select
          description={t('description')}
          options={[
            { id: '', label: t('default') },
            ...advancedThemes.map((theme) => ({
              id: theme.path,
              label: theme.name,
            })),
          ]}
          onValueChange={async (val) => {
            if (!val) {
              await resetTheme();
              return;
            }
            await loadAndApplyAdvancedThemeFromFile(val);
          }}
        />
      </div>
    </SectionShell>
  );
};
