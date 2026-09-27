import { interpolate } from 'remotion';

import { VoiceLine } from './types';

const FULL_VOLUME = 1;

type DuckingOptions = {
  duckedLevel?: number;
  rampFrames?: number;
};

export const duckedVolume = (
  voiceLines: VoiceLine[],
  { duckedLevel = 0.3, rampFrames = 6 }: DuckingOptions = {},
) => {
  const volumeDuring = (line: VoiceLine, frame: number) => {
    const endFrame = line.startFrame + line.durationInFrames;

    return interpolate(
      frame,
      [
        line.startFrame - rampFrames,
        line.startFrame,
        endFrame,
        endFrame + rampFrames,
      ],
      [FULL_VOLUME, duckedLevel, duckedLevel, FULL_VOLUME],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );
  };

  return (frame: number) =>
    Math.min(
      FULL_VOLUME,
      ...voiceLines.map((line) => volumeDuring(line, frame)),
    );
};
