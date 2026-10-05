import { VoiceLine } from '../VoiceOver';

export type CaptionLine = VoiceLine & {
  text: string;
};

export type CaptionPage = {
  text: string;
  startFrame: number;
};

export type CaptionGroup = {
  startFrame: number;
  durationInFrames: number;
  pages: CaptionPage[];
};
