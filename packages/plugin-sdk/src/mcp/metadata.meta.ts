import type { DomainMeta } from './meta';

export const MetadataAPIMeta: DomainMeta = {
  description: 'Search for music and fetch artist, album, and track metadata.',
  methods: {
    search: {
      name: 'search',
      description: 'Search for artists, albums, tracks, and playlists.',
      params: [
        { name: 'params', type: 'SearchParams' },
        { name: 'providerId', type: 'string?' },
      ],
      returns: 'SearchResults',
    },
    fetchArtistBio: {
      name: 'fetchArtistBio',
      description: "Fetch an artist's biography and tags.",
      params: [
        { name: 'artistId', type: 'string' },
        { name: 'providerId', type: 'string?' },
      ],
      returns: 'ArtistBio',
    },
    fetchArtistSocialStats: {
      name: 'fetchArtistSocialStats',
      description:
        "Fetch an artist's social media stats (followers, track count, etc.).",
      params: [
        { name: 'artistId', type: 'string' },
        { name: 'providerId', type: 'string?' },
      ],
      returns: 'ArtistSocialStats',
    },
    fetchArtistAlbums: {
      name: 'fetchArtistAlbums',
      description: "Fetch an artist's album discography.",
      params: [
        { name: 'artistId', type: 'string' },
        { name: 'providerId', type: 'string?' },
      ],
      returns: 'AlbumRef[]',
    },
    fetchArtistTopTracks: {
      name: 'fetchArtistTopTracks',
      description: "Fetch an artist's most popular tracks.",
      params: [
        { name: 'artistId', type: 'string' },
        { name: 'providerId', type: 'string?' },
      ],
      returns: 'TrackRef[]',
    },
    fetchArtistPlaylists: {
      name: 'fetchArtistPlaylists',
      description: 'Fetch playlists associated with an artist.',
      params: [
        { name: 'artistId', type: 'string' },
        { name: 'providerId', type: 'string?' },
      ],
      returns: 'PlaylistRef[]',
    },
    fetchArtistRelatedArtists: {
      name: 'fetchArtistRelatedArtists',
      description: 'Fetch artists similar to the given artist.',
      params: [
        { name: 'artistId', type: 'string' },
        { name: 'providerId', type: 'string?' },
      ],
      returns: 'ArtistRef[]',
    },
    fetchAlbumDetails: {
      name: 'fetchAlbumDetails',
      description: 'Fetch full album details including track listing.',
      params: [
        { name: 'albumId', type: 'string' },
        { name: 'providerId', type: 'string?' },
      ],
      returns: 'Album',
    },
  },
};
