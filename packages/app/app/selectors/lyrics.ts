import { createStateSelectors } from './helpers';

export const lyricsSelectors = createStateSelectors(
  'lyrics',
  [
    'lyricsSearchStarted',
    'lyricsSearchResult'
  ]
);
