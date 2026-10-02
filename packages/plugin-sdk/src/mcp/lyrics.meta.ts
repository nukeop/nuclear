import type { DomainMeta } from './meta';

export const LyricsAPIMeta: DomainMeta = {
  description: 'Fetch lyrics for tracks from lyrics providers.',
  methods: {
    getLyricsForTrack: {
      name: 'getLyricsForTrack',
      description:
        'Fetch lyrics for a track. Without a provider ID, asks all lyrics providers and returns the results ranked by type: word-synced, line-synced, plain, instrumental. With a provider ID, asks only that provider.',
      params: [
        { name: 'track', type: 'Track' },
        { name: 'providerId', type: 'string?' },
      ],
      returns: 'AttributedLyrics[]',
    },
  },
};
