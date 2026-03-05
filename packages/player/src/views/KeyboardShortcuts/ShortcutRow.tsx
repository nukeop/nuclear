import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, KeyCombo } from '@nuclearplayer/ui';

import { useShortcutsStore } from '../../stores/shortcutsStore';
import { useShortcutRecorder } from './useShortcutRecorder';

type ShortcutRowProps = {
  commandId: string;
  label: string;
  shortcut: string;
  isOverridden: boolean;
};

export const ShortcutRow: FC<ShortcutRowProps> = ({
  commandId,
  label,
  shortcut,
  isOverridden,
}) => {
  const { t } = useTranslation('preferences');
  const resetShortcut = useShortcutsStore((state) => state.resetShortcut);
  const { isRecording, startRecording } = useShortcutRecorder(commandId);

  return (
    <div
      role="row"
      aria-label={label}
      className="flex items-center justify-between p-2"
    >
      <span className="text-foreground text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          data-testid="shortcut-keybinding"
          onClick={startRecording}
          className="cursor-pointer rounded px-2 py-1 transition-colors"
        >
          {isRecording ? (
            <span className="text-sm italic">{t('shortcuts.recording')}</span>
          ) : (
            <KeyCombo shortcut={shortcut} />
          )}
        </button>
        {isOverridden && (
          <Button size="xs" onClick={() => resetShortcut(commandId)}>
            {t('shortcuts.reset')}
          </Button>
        )}
      </div>
    </div>
  );
};
