import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { listBasicThemes } from '@nuclearplayer/themes';
import { Button, cn, SectionShell, Toggle } from '@nuclearplayer/ui';

import {
  applyMatugenTheme,
  checkMatugenAvailability,
  disableMatugenTheme,
  matugenCssExists,
} from '../../services/matugenService';
import { useThemeStore } from '../../stores/themeStore';

export const BasicThemes = () => {
  const { t } = useTranslation('themes');
  const basicThemes = useMemo(() => listBasicThemes(), []);
  const { isSelected, selectBasicTheme, isMatugenEnabled } = useThemeStore();

  const [cssExists, setCssExists] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const checkCss = async () => {
      const available = await checkMatugenAvailability();
      if (available) {
        const exists = await matugenCssExists();
        setCssExists(exists);
      }
    };
    checkCss();
  }, []);

  const handleMatugenToggle = async (enabled: boolean) => {
    setIsToggling(true);
    try {
      if (enabled) {
        await applyMatugenTheme();
      } else {
        await disableMatugenTheme();
      }
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <SectionShell data-testid="basic-themes" title={t('basic')}>
      <div className="flex flex-wrap gap-4 p-1">
        {cssExists && (
          <div className="border-border bg-background-secondary flex items-center gap-2 rounded-md border px-3 py-2">
            <span className="text-foreground text-sm">Matugen</span>
            <Toggle
              checked={isMatugenEnabled}
              onChange={handleMatugenToggle}
              disabled={isToggling}
            />
          </div>
        )}
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
