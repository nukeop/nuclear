import { useLayoutEffect } from 'react';

import { setThemeId } from '@nuclearplayer/themes';

export type ThemeMode = 'light' | 'dark';

export const useRootTheme = (themeId: string, mode: ThemeMode) => {
  useLayoutEffect(() => {
    setThemeId(themeId);
    document.documentElement.setAttribute('data-theme', mode);
  }, [themeId, mode]);
};
