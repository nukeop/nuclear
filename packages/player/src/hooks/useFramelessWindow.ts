import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';

import { useCoreSetting } from './useCoreSetting';

export const useFramelessWindow = () => {
  const [frameless] = useCoreSetting<boolean>('appearance.framelessWindow');
  const [customTitleBar] = useCoreSetting<boolean>('appearance.customTitleBar');

  useEffect(() => {
    const window = getCurrentWindow();

    if (customTitleBar) {
      window.setDecorations(false);
      // Removing decorations causes the window to become unminimizable
      // We need to explicitly add the attribute back
      window.setMinimizable(true);
    }

    if (!customTitleBar && frameless !== undefined) {
      window.setDecorations(!frameless);
      window.setMinimizable(true);
    }
  }, [frameless, customTitleBar]);

  return Boolean(frameless);
};
