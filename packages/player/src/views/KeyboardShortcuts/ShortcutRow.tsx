import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { KeyCombo } from '@nuclearplayer/ui';

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
      className="flex items-center justify-between py-2"
    >
      <span className="text-foreground text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          data-testid="shortcut-keybinding"
          onClick={startRecording}
          className="hover:bg-muted/50 cursor-pointer rounded px-2 py-1 transition-colors"
        >
          {isRecording ? (
            <span className="text-muted-foreground text-sm italic">
              {t('shortcuts.recording')}
            </span>
          ) : (
            <KeyCombo shortcut={shortcut} />
          )}
        </button>
        {isOverridden && (
          <button
            type="button"
            onClick={() => resetShortcut(commandId)}
            className="text-muted-foreground hover:text-foreground cursor-pointer text-xs transition-colors"
          >
            {t('shortcuts.reset')}
          </button>
        )}
      </div>
    </div>
  );
};
