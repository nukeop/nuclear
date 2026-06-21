import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';

import { useCoreSetting } from './useCoreSetting';

export const useFramelessWindow = () => {
  const [frameless] = useCoreSetting<boolean>('appearance.framelessWindow');
  const [customTitleBar] = useCoreSetting<boolean>('appearance.customTitleBar');

  useEffect(() => {
    if (customTitleBar) {
      getCurrentWindow().setDecorations(false);
    }

    if (!customTitleBar && frameless !== undefined) {
      getCurrentWindow().setDecorations(!frameless);
    }
  }, [frameless, customTitleBar]);

  return Boolean(frameless);
};
