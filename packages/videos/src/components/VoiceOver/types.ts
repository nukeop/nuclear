export type VoiceLine = {
  src: string;
  startFrame: number;
  durationInFrames: number;
};

export const voiceLineEndFrame = (line: VoiceLine) =>
  line.startFrame + line.durationInFrames;
