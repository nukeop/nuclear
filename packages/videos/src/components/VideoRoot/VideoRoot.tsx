import { FC, ReactNode } from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';

import { useRootTheme } from '../../theme/useRootTheme';

const DESIGN_SHORT_SIDE = 720;

type VideoRootProps = {
  children: ReactNode;
};

export const VideoRoot: FC<VideoRootProps> = ({ children }) => {
  const { width, height } = useVideoConfig();
  useRootTheme();

  const scale = Math.min(width, height) / DESIGN_SHORT_SIDE;

  return (
    <AbsoluteFill
      className="video-root bg-background text-foreground"
      style={{ zoom: scale, width: width / scale, height: height / scale }}
    >
      {children}
    </AbsoluteFill>
  );
};
