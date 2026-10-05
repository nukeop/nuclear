import { useLayoutEffect } from 'react';

import { DEFAULT_THEME_ID, setThemeId } from '@nuclearplayer/themes';

export const useRootTheme = () => {
  useLayoutEffect(() => {
    setThemeId(DEFAULT_THEME_ID);
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);
};
