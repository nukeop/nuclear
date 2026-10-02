import type { LyricsHost } from '@nuclearplayer/plugin-sdk';

export const createLyricsHost = (): LyricsHost => ({
  getLyricsForTrack: async () => [],
});
