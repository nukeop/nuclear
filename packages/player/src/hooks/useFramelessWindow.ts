import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';

import { useCoreSetting } from './useCoreSetting';

export const useFramelessWindow = () => {
  const [frameless] = useCoreSetting<boolean>('appearance.framelessWindow');

  useEffect(() => {
    if (frameless !== undefined) {
      getCurrentWindow().setDecorations(!frameless);
    }
  }, [frameless]);

  return Boolean(frameless);
};
