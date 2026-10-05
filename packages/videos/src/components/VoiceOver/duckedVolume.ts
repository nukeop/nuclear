import { interpolate } from 'remotion';

import { VoiceLine, voiceLineEndFrame } from './types';

const FULL_VOLUME = 1;

type DuckingOptions = {
  duckedLevel?: number;
  downFrames?: number;
  upFrames?: number;
};

export const duckedVolume = (
  voiceLines: VoiceLine[],
  { duckedLevel = 0.2, downFrames = 18, upFrames = 30 }: DuckingOptions = {},
) => {
  const volumeDuring = (line: VoiceLine, frame: number) => {
    const endFrame = voiceLineEndFrame(line);

    return interpolate(
      frame,
      [
        line.startFrame - downFrames,
        line.startFrame,
        endFrame,
        endFrame + upFrames,
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
