import { useCallback, useEffect } from 'react';
import { useRecordHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';

import { useTranslation } from '@nuclearplayer/i18n';
import { isMac } from '@nuclearplayer/ui';

import { COMMANDS } from '../../shortcuts/commands';
import { useShortcutsStore } from '../../stores/shortcutsStore';

const RECORDED_KEY_TO_SHORTCUT: Record<string, string> = {
  arrowleft: 'left',
  arrowright: 'right',
  arrowup: 'up',
  arrowdown: 'down',
  ' ': 'space',
};

const MODIFIERS = new Set(['ctrl', 'meta', 'shift', 'alt']);

const normalizeRecordedKeys = (keys: Set<string>): string => {
  const modifiers: string[] = [];
  const rest: string[] = [];

  const modKey = isMac() ? 'meta' : 'ctrl';

  for (const key of keys) {
    if (key === modKey) {
      if (!modifiers.includes('mod')) {
        modifiers.push('mod');
      }
    } else if (key === 'ctrl') {
      modifiers.push('ctrl');
    } else if (key === 'meta') {
      modifiers.push('meta');
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
  const setRecording = useShortcutsStore((state) => state.setRecording);
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
        setRecording(false);
        return;
      }

      const conflictId = findConflict(normalized, commandId);
      if (conflictId) {
        const conflictLabel = t(`shortcuts.commands.${conflictId}`);
        toast.error(t('shortcuts.conflict', { command: conflictLabel }));
        stop();
        setRecording(false);
        return;
      }

      setShortcut(commandId, normalized);
      stop();
      setRecording(false);
    },
    [commandId, setShortcut, setRecording, stop, t],
  );

  useEffect(() => {
    if (!isRecording || keys.size === 0) {
      return;
    }

    const hasNonModifier = [...keys].some((key) => !MODIFIERS.has(key));
    if (!hasNonModifier) {
      return;
    }

    handleRecordedKeys(keys);
  }, [isRecording, keys, handleRecordedKeys]);

  const startRecording = useCallback(() => {
    setRecording(true);
    start();
  }, [setRecording, start]);

  return {
    isRecording,
    startRecording,
  };
};
