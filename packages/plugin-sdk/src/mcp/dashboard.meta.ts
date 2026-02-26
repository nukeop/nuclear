import type { DomainMeta } from './meta';

export const DashboardAPIMeta: DomainMeta = {
  description: 'Fetch trending and editorial content from music providers.',
  methods: {
    fetchTopTracks: {
      name: 'fetchTopTracks',
      description:
        'Fetch top/trending tracks, optionally from a specific provider.',
      params: [{ name: 'providerId', type: 'string?' }],
      returns: 'AttributedResult<Track>[]',
    },
    fetchTopArtists: {
      name: 'fetchTopArtists',
      description:
        'Fetch top/trending artists, optionally from a specific provider.',
      params: [{ name: 'providerId', type: 'string?' }],
      returns: 'AttributedResult<ArtistRef>[]',
    },
    fetchTopAlbums: {
      name: 'fetchTopAlbums',
      description:
        'Fetch top/trending albums, optionally from a specific provider.',
      params: [{ name: 'providerId', type: 'string?' }],
      returns: 'AttributedResult<AlbumRef>[]',
    },
    fetchEditorialPlaylists: {
      name: 'fetchEditorialPlaylists',
      description:
        'Fetch editorial/curated playlists, optionally from a specific provider.',
      params: [{ name: 'providerId', type: 'string?' }],
      returns: 'AttributedResult<PlaylistRef>[]',
    },
    fetchNewReleases: {
      name: 'fetchNewReleases',
      description:
        'Fetch new album releases, optionally from a specific provider.',
      params: [{ name: 'providerId', type: 'string?' }],
      returns: 'AttributedResult<AlbumRef>[]',
    },
  },
};
