import { FC, ReactNode } from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';

import { DEFAULT_THEME_ID } from '@nuclearplayer/themes';

import { ThemeMode, useRootTheme } from '../../theme/useRootTheme';

type VideoRootProps = {
  themeId?: string;
  mode: ThemeMode;
  children: ReactNode;
};

export const VideoRoot: FC<VideoRootProps> = ({
  themeId = DEFAULT_THEME_ID,
  mode,
  children,
}) => {
  const { width, height } = useVideoConfig();
  useRootTheme(themeId, mode);

  const scale = Math.min(width, height) / 720;

  return (
    <AbsoluteFill
      style={{ zoom: scale, width: width / scale, height: height / scale }}
    >
      {children}
    </AbsoluteFill>
  );
};
