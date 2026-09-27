import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const useEntranceProgress = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
};

export const useExitOpacity = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};
