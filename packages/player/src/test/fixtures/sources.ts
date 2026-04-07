import type { SearchResults } from '@nuclearplayer/model';
import type {
  MetadataProvider,
  StreamingProvider,
} from '@nuclearplayer/plugin-sdk';

import { MetadataProviderBuilder } from '../builders/MetadataProviderBuilder';
import { StreamingProviderBuilder } from '../builders/StreamingProviderBuilder';

export const PAIRED_STREAMING_PROVIDER: StreamingProvider =
  new StreamingProviderBuilder()
    .withId('beta-stream')
    .withName('Beta Stream')
    .build();

export const PAIRED_METADATA_PROVIDER: MetadataProvider =
  new MetadataProviderBuilder()
    .withId('beta-meta')
    .withName('Beta Search')
    .withStreamingProviderId('beta-stream')
    .build();

export const UNPAIRED_STREAMING_PROVIDER: StreamingProvider =
  new StreamingProviderBuilder()
    .withId('alpha-stream')
    .withName('Alpha Stream')
    .build();

export const UNPAIRED_METADATA_PROVIDER: MetadataProvider =
  new MetadataProviderBuilder()
    .withId('gamma-meta')
    .withName('Gamma Search')
    .build();

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
