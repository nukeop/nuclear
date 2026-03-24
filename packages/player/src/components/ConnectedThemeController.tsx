import { FC } from 'react';

import { ThemeController } from '@nuclearplayer/ui';

import { useCoreSetting } from '../hooks/useCoreSetting';

export const ConnectedThemeController: FC = () => {
  const [isDark, setIsDark] = useCoreSetting<boolean>('theme.dark');

  return (
    <ThemeController
      isDark={isDark ?? false}
      onThemeChange={setIsDark}
      className="justify-self-end"
    />
  );
};
