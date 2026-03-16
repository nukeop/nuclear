import type { SearchResults } from '@nuclearplayer/model';

export const SEARCH_RESULTS_PROVIDER_A: SearchResults = {
  artists: [
    {
      name: 'Alpha Artist',
      artwork: { items: [] },
      source: { provider: 'provider-a', id: 'artist-a-1' },
    },
  ],
  albums: [
    {
      title: 'Giant Steps',
      artwork: { items: [] },
      source: { provider: 'test-metadata-provider', id: 'album-1' },
    },
  ],
};

export const SEARCH_RESULTS_PROVIDER_B: SearchResults = {
  artists: [
    {
      name: 'Beta Artist',
      artwork: { items: [] },
      source: { provider: 'provider-b', id: 'artist-b-1' },
    },
  ],
};
