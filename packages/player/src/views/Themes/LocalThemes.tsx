import { useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { listBasicThemes } from '@nuclearplayer/themes';
import {
  Button,
  cn,
  ScrollableArea,
  SectionShell,
  Select,
} from '@nuclearplayer/ui';

import { loadAndApplyAdvancedThemeFromFile } from '../../services/advancedThemeService';
import {
  resetToDefaultTheme,
  setAndPersistThemeId,
} from '../../services/themeService';
import { useThemeStore } from '../../stores/themeStore';

export const LocalThemes = () => {
  const { t } = useTranslation('themes');
  const basicThemes = useMemo(() => listBasicThemes(), []);
  const { advancedThemes, isSelected } = useThemeStore();

  return (
    <ScrollableArea className="overflow-hidden">
      <SectionShell data-testid="basic-themes" title={t('basic')}>
        <div className="flex flex-wrap gap-4 p-1">
          {basicThemes.map((theme) => {
            const isActive = isSelected({ type: 'basic', id: theme.id });
            return (
              <Button
                key={theme.id}
                variant="text"
                size="flexible"
                className={cn(
                  'bg-background-secondary border-border shadow-shadow hover:translate-x-shadow-x hover:translate-y-shadow-y flex flex-col justify-between gap-2 rounded-md border-(length:--border-width) px-4 py-2 transition hover:shadow-none',
                  {
                    'bg-primary': isActive,
                  },
                )}
                onClick={() => setAndPersistThemeId(theme.id)}
              >
                <span className="text-foreground text-left text-base font-bold">
                  {theme.name}
                </span>
                <div className="block">
                  {theme.palette.map((color, idx) => (
                    <span
                      key={idx}
                      aria-hidden
                      className="ring-border inline-block size-5 rounded-full ring-2"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </Button>
            );
          })}
        </div>
      </SectionShell>
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
                await resetToDefaultTheme();
                return;
              }
              await loadAndApplyAdvancedThemeFromFile(val);
            }}
          />
        </div>
      </SectionShell>
    </ScrollableArea>
  );
};
