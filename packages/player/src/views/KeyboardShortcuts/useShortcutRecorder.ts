import { useCallback, useEffect } from 'react';
import { useRecordHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';

import { useTranslation } from '@nuclearplayer/i18n';

import { COMMANDS } from '../../shortcuts/commands';
import { useShortcutsStore } from '../../stores/shortcutsStore';

const RECORDED_KEY_TO_SHORTCUT: Record<string, string> = {
  arrowleft: 'left',
  arrowright: 'right',
  arrowup: 'up',
  arrowdown: 'down',
  ' ': 'space',
};

const normalizeRecordedKeys = (keys: Set<string>): string => {
  const modifiers: string[] = [];
  const rest: string[] = [];

  for (const key of keys) {
    if (key === 'ctrl' || key === 'meta') {
      if (!modifiers.includes('mod')) {
        modifiers.push('mod');
      }
    } else if (key === 'shift') {
      modifiers.push('shift');
    } else if (key === 'alt') {
      modifiers.push('alt');
    } else {
      rest.push(RECORDED_KEY_TO_SHORTCUT[key] ?? key);
    }
  }

  return [...modifiers, ...rest].join('+');
};

const findConflict = (
  shortcut: string,
  excludeCommandId: string,
): string | null => {
  const overrides = useShortcutsStore.getState().overrides;

  for (const [commandId, command] of Object.entries(COMMANDS)) {
    if (commandId === excludeCommandId) {
      continue;
    }
    const effective = overrides[commandId] ?? command.defaultShortcut;
    if (effective === shortcut) {
      return commandId;
    }
  }

  return null;
};

type UseShortcutRecorderResult = {
  isRecording: boolean;
  startRecording: () => void;
};

export const useShortcutRecorder = (
  commandId: string,
): UseShortcutRecorderResult => {
  const { t } = useTranslation('preferences');
  const setShortcut = useShortcutsStore((state) => state.setShortcut);
  const [keys, { start, stop, isRecording }] = useRecordHotkeys();

  const handleRecordedKeys = useCallback(
    (recorded: Set<string>) => {
      if (recorded.size === 0) {
        return;
      }

      const normalized = normalizeRecordedKeys(recorded);

      // Shortcuts don't support escape. It's used to cancel recording
      if (normalized === 'escape') {
        stop();
        return;
      }

      const conflictId = findConflict(normalized, commandId);
      if (conflictId) {
        const conflictLabel = t(`shortcuts.commands.${conflictId}`);
        toast.error(t('shortcuts.conflict', { command: conflictLabel }));
        stop();
        return;
      }

      setShortcut(commandId, normalized);
      stop();
    },
    [commandId, setShortcut, stop, t],
  );

  useEffect(() => {
    if (isRecording && keys.size > 0) {
      handleRecordedKeys(keys);
    }
  }, [isRecording, keys, handleRecordedKeys]);

  return {
    isRecording,
    startRecording: start,
  };
};
