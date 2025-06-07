import { createStateSelectors } from './helpers';

export const searchSelectors = createStateSelectors(
  'search',
  [
    'albumDetails',
    'artistDetails', 
    'searchHistory',
    'playlistSearchStarted',
    'unifiedSearchStarted',
    'isFocused',
    'trackSearchResults',
    'artistSearchResults',
    'albumSearchResults',
    'playlistSearchResults',
    'liveStreamSearchResults',
    'podcastSearchResults'
  ]
);
