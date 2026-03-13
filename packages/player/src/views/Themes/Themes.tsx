import { useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { listBasicThemes } from '@nuclearplayer/themes';
import {
  Button,
  cn,
  ScrollableArea,
  SectionShell,
  Select,
  ViewShell,
} from '@nuclearplayer/ui';

import { useCoreSetting } from '../../hooks/useCoreSetting';
import { loadAndApplyAdvancedThemeFromFile } from '../../services/advancedThemeService';
import {
  resetToDefaultTheme,
  setAndPersistThemeId,
} from '../../services/themeService';
import { useAdvancedThemeStore } from '../../stores/advancedThemeStore';

export const Themes = () => {
  const { t } = useTranslation('themes');
  const basicThemes = useMemo(() => listBasicThemes(), []);
  const [selected] = useCoreSetting<string>('theme.id');
  const { themes } = useAdvancedThemeStore();

  return (
    <ViewShell title={t('title')}>
      <ScrollableArea className="overflow-hidden">
        <SectionShell data-testid="basic-themes" title={t('basic')}>
          <div className="flex flex-wrap gap-4 p-1">
            {basicThemes.map((t) => {
              const isActive = selected === t.id;
              return (
                <Button
                  key={t.id}
                  variant="text"
                  size="flexible"
                  className={cn(
                    'bg-background-secondary border-border shadow-shadow hover:translate-x-shadow-x hover:translate-y-shadow-y flex flex-col justify-between gap-2 rounded-md border-(length:--border-width) px-4 py-2 transition hover:shadow-none',
                    {
                      'bg-primary': isActive,
                    },
                  )}
                  onClick={() => setAndPersistThemeId(t.id)}
                >
                  <span className="text-foreground text-left text-base font-bold">
                    {t.name}
                  </span>
                  <div className="block">
                    {t.palette.map((c, idx) => (
                      <span
                        key={idx}
                        aria-hidden
                        className="ring-border inline-block size-5 rounded-full ring-2"
                        style={{ backgroundColor: c }}
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
                ...themes.map((t) => ({ id: t.path, label: t.name })),
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
    </ViewShell>
  );
};
