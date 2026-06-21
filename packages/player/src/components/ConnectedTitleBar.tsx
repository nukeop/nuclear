import { getCurrentWindow } from '@tauri-apps/api/window';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { TitleBar } from '@nuclearplayer/ui';

import { useCoreSetting } from '../hooks/useCoreSetting';

const appWindow = getCurrentWindow();

export const ConnectedTitleBar: FC = () => {
  const [isEnabled] = useCoreSetting<boolean>('appearance.customTitleBar');
  const { t } = useTranslation('titleBar');
  const [titleBarStyle] = useCoreSetting<string>('appearance.titleBarStyle');

  const styleOverride =
    titleBarStyle === 'auto' || !titleBarStyle
      ? undefined
      : (titleBarStyle as 'macos' | 'windows');

  return (
    isEnabled && (
      <TitleBar
        title={t('title')}
        styleOverride={styleOverride}
        onMinimize={() => appWindow.minimize()}
        onMaximize={() => appWindow.toggleMaximize()}
        onClose={() => appWindow.close()}
        onStartDrag={() => appWindow.startDragging()}
        labels={{
          minimize: t('minimize'),
          maximize: t('maximize'),
          close: t('close'),
        }}
      />
    )
  );
};
