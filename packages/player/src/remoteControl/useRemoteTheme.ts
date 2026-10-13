import { useEffect } from 'react';

import { setThemeId } from '@nuclearplayer/themes';

import { useRemoteStore } from './remoteStore';

export const useRemoteTheme = () => {
  const dark = useRemoteStore((state) => state.settings.dark);
  const themeId = useRemoteStore((state) => state.settings.themeId);

  useEffect(() => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [dark]);

  useEffect(() => {
    setThemeId(themeId);
  }, [themeId]);
};
