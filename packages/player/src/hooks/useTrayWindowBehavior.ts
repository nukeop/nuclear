import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';

import { useCoreSetting } from './useCoreSetting';

export const useTrayWindowBehavior = () => {
  const [closeToTray] = useCoreSetting<boolean>('window.closeToTray');
  const [minimizeToTray] = useCoreSetting<boolean>('window.minimizeToTray');

  useEffect(() => {
    const window = getCurrentWindow();

    const unlistenClose = window.onCloseRequested(async (event) => {
      if (!closeToTray) {
        return;
      }

      event.preventDefault();
      await window.hide();
    });

    return () => {
      void unlistenClose.then((unlisten) => unlisten());
    };
  }, [closeToTray]);

  useEffect(() => {
    const window = getCurrentWindow();

    const unlistenResize = window.onResized(async () => {
      if (!minimizeToTray) {
        return;
      }

      const isMinimized = await window.isMinimized();
      if (isMinimized) {
        await window.hide();
      }
    });

    return () => {
      void unlistenResize.then((unlisten) => unlisten());
    };
  }, [minimizeToTray]);
};
