import { useHotkeys } from 'react-hotkeys-hook';

import { useSettingsModalStore } from '../stores/settingsModalStore';
import { COMMANDS } from './commands';

// TODO: To be expanded with more shortcuts in the future
// Also needs a better shortcut registration system
export const useGlobalShortcuts = () => {
  const { isOpen, open, close } = useSettingsModalStore();

  useHotkeys(
    COMMANDS.toggleSettings.shortcut,
    (event) => {
      event.preventDefault();
      if (isOpen) {
        close();
      } else {
        open();
      }
    },
    { enableOnFormTags: false },
    [isOpen, open, close],
  );
};
