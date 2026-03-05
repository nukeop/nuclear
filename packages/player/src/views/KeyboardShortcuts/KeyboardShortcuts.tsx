import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { ViewShell } from '@nuclearplayer/ui';

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
    <ViewShell title={t('shortcuts.title')}>
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
        <button
          type="button"
          onClick={resetAll}
          className="text-muted-foreground hover:text-foreground mt-4 cursor-pointer text-sm transition-colors"
        >
          {t('shortcuts.resetAll')}
        </button>
      )}
    </ViewShell>
  );
};
