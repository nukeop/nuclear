import type { LyricsType } from '@nuclearplayer/model';

export type LyricsSource = {
  id: string;
  name: string;
  type: LyricsType;
};

export type LyricsTypeLabels = Record<LyricsType, string>;
