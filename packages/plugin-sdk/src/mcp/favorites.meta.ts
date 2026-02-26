import type { DomainMeta } from './meta';

export const FavoritesAPIMeta: DomainMeta = {
  description: 'Manage favorite tracks, albums, and artists.',
  methods: {
    getTracks: {
      name: 'getTracks',
      description: 'Get all favorite tracks.',
      params: [],
      returns: 'FavoriteEntry<Track>[]',
    },
    getAlbums: {
      name: 'getAlbums',
      description: 'Get all favorite albums.',
      params: [],
      returns: 'FavoriteEntry<AlbumRef>[]',
    },
    getArtists: {
      name: 'getArtists',
      description: 'Get all favorite artists.',
      params: [],
      returns: 'FavoriteEntry<ArtistRef>[]',
    },
    addTrack: {
      name: 'addTrack',
      description: 'Add a track to favorites.',
      params: [{ name: 'track', type: 'Track' }],
      returns: 'void',
    },
    removeTrack: {
      name: 'removeTrack',
      description: 'Remove a track from favorites by its provider reference.',
      params: [{ name: 'source', type: 'ProviderRef' }],
      returns: 'void',
    },
    isTrackFavorite: {
      name: 'isTrackFavorite',
      description: 'Check if a track is in favorites.',
      params: [{ name: 'source', type: 'ProviderRef' }],
      returns: 'boolean',
    },
    addAlbum: {
      name: 'addAlbum',
      description: 'Add an album to favorites.',
      params: [{ name: 'ref', type: 'AlbumRef' }],
      returns: 'void',
    },
    removeAlbum: {
      name: 'removeAlbum',
      description: 'Remove an album from favorites by its provider reference.',
      params: [{ name: 'source', type: 'ProviderRef' }],
      returns: 'void',
    },
    isAlbumFavorite: {
      name: 'isAlbumFavorite',
      description: 'Check if an album is in favorites.',
      params: [{ name: 'source', type: 'ProviderRef' }],
      returns: 'boolean',
    },
    addArtist: {
      name: 'addArtist',
      description: 'Add an artist to favorites.',
      params: [{ name: 'ref', type: 'ArtistRef' }],
      returns: 'void',
    },
    removeArtist: {
      name: 'removeArtist',
      description: 'Remove an artist from favorites by its provider reference.',
      params: [{ name: 'source', type: 'ProviderRef' }],
      returns: 'void',
    },
    isArtistFavorite: {
      name: 'isArtistFavorite',
      description: 'Check if an artist is in favorites.',
      params: [{ name: 'source', type: 'ProviderRef' }],
      returns: 'boolean',
    },
  },
};
