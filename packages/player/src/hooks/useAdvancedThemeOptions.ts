import { useMemo } from 'react';

import { SelectOption } from '@nuclearplayer/ui';

import { useThemeStore } from '../stores/themeStore';

export const useAdvancedThemeOptions = (): SelectOption[] => {
  const advancedThemes = useThemeStore((state) => state.advancedThemes);
  return useMemo(
    () =>
      advancedThemes.map((theme) => ({
        id: theme.path,
        label: theme.name,
      })),
    [advancedThemes],
  );
};
