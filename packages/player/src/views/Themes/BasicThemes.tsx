import { useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { listBasicThemes } from '@nuclearplayer/themes';
import { Button, cn, SectionShell } from '@nuclearplayer/ui';

import { useThemeStore } from '../../stores/themeStore';

export const BasicThemes = () => {
  const { t } = useTranslation('themes');
  const basicThemes = useMemo(() => listBasicThemes(), []);
  const { isSelected, selectBasicTheme } = useThemeStore();

  return (
    <SectionShell data-testid="basic-themes" title={t('basic')}>
      <div className="flex flex-wrap gap-4 p-1">
        {basicThemes.map((theme) => {
          const isActive = isSelected({ type: 'basic', id: theme.id });
          return (
            <Button
              key={theme.id}
              aria-pressed={isActive}
              variant="text"
              size="flexible"
              className={cn(
                'bg-background-secondary border-border shadow-shadow hover:translate-x-shadow-x hover:translate-y-shadow-y flex flex-col justify-between gap-2 rounded-md border-(length:--border-width) px-4 py-2 transition hover:shadow-none',
                {
                  'bg-primary': isActive,
                },
              )}
              onClick={() => selectBasicTheme(theme.id)}
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
  );
};
