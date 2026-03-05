import { useHotkeys } from 'react-hotkeys-hook';

import { useShortcutsStore } from '../stores/shortcutsStore';
import { COMMANDS } from './commands';

export const useShortcut = (commandId: string, handler: () => void): void => {
  const override = useShortcutsStore((state) => state.overrides[commandId]);
  const isRecording = useShortcutsStore((state) => state.isRecording);
  const binding = override ?? COMMANDS[commandId]?.defaultShortcut ?? '';

  useHotkeys(binding, handler, {
    enableOnFormTags: false,
    preventDefault: true,
    delimiter: '|',
    enabled: !isRecording,
  });
};
