import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, ViewShell } from '@nuclearplayer/ui';

import {
  getCommandsBySection,
  SHORTCUT_SECTIONS,
} from '../../shortcuts/commands';
import { useShortcutsStore } from '../../stores/shortcutsStore';
import { ShortcutRow } from './ShortcutRow';

export const KeyboardShortcuts: FC = () => {
  const { t } = useTranslation('preferences');
  const overrides = useShortcutsStore((state) => state.overrides);
  const resetAll = useShortcutsStore((state) => state.resetAll);

  return (
    <ViewShell
      title={t('shortcuts.title')}
      classes={{ scrollableArea: 'px-4' }}
    >
      {SHORTCUT_SECTIONS.map((section) => (
        <div
          key={section}
          data-testid={`shortcut-section-${section}`}
          className="mb-6"
        >
          <h2 className="text-foreground mb-2 text-lg font-semibold">
            {t(`shortcuts.sections.${section}`)}
          </h2>
          {getCommandsBySection(section).map((command) => {
            const effective = overrides[command.id] ?? command.defaultShortcut;
            const isOverridden = command.id in overrides;

            return (
              <ShortcutRow
                key={command.id}
                commandId={command.id}
                label={t(`shortcuts.commands.${command.id}`)}
                shortcut={effective}
                isOverridden={isOverridden}
              />
            );
          })}
        </div>
      ))}
      {Object.keys(overrides).length > 0 && (
        <div className="flex items-center justify-center pb-4">
          <Button onClick={resetAll}>{t('shortcuts.resetAll')}</Button>
        </div>
      )}
    </ViewShell>
  );
};
