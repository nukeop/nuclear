import { useHotkeys } from 'react-hotkeys-hook';

import { useShortcutsStore } from '../stores/shortcutsStore';
import { COMMANDS } from './commands';

export const useShortcut = (commandId: string, handler: () => void): void => {
  const override = useShortcutsStore((state) => state.overrides[commandId]);
  const binding = override ?? COMMANDS[commandId]?.defaultShortcut ?? '';

  useHotkeys(binding, handler, {
    enableOnFormTags: false,
    preventDefault: true,
  });
};
