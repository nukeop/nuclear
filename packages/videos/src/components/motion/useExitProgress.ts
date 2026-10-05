import { useCurrentFrame, useVideoConfig } from 'remotion';

import { easeInCubic, EXIT_FRAMES, progressOver } from './motion';

export const useExitProgress = (exitFrames = EXIT_FRAMES) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return progressOver(
    frame - (durationInFrames - exitFrames),
    exitFrames,
    easeInCubic,
  );
};
