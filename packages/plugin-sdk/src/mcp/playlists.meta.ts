import type { DomainMeta } from './meta';

export const PlaylistsAPIMeta: DomainMeta = {
  description: 'Create, edit, import, and manage playlists.',
  methods: {
    getIndex: {
      name: 'getIndex',
      description: 'Get the list of all playlists with summary info.',
      params: [],
      returns: 'PlaylistIndexEntry[]',
    },
    getPlaylist: {
      name: 'getPlaylist',
      description: 'Get a playlist by ID with all its items.',
      params: [{ name: 'id', type: 'string' }],
      returns: 'Playlist | null',
    },
    createPlaylist: {
      name: 'createPlaylist',
      description: 'Create a new empty playlist. Returns the playlist ID.',
      params: [{ name: 'name', type: 'string' }],
      returns: 'string',
    },
    deletePlaylist: {
      name: 'deletePlaylist',
      description: 'Delete a playlist by ID.',
      params: [{ name: 'id', type: 'string' }],
      returns: 'void',
    },
    addTracks: {
      name: 'addTracks',
      description:
        'Add tracks to a playlist. Returns the created playlist items.',
      params: [
        { name: 'playlistId', type: 'string' },
        { name: 'tracks', type: 'Track[]' },
      ],
      returns: 'PlaylistItem[]',
    },
    removeTracks: {
      name: 'removeTracks',
      description: 'Remove items from a playlist by their item IDs.',
      params: [
        { name: 'playlistId', type: 'string' },
        { name: 'itemIds', type: 'string[]' },
      ],
      returns: 'void',
    },
    reorderTracks: {
      name: 'reorderTracks',
      description:
        'Move a track within a playlist from one position to another.',
      params: [
        { name: 'playlistId', type: 'string' },
        { name: 'from', type: 'number' },
        { name: 'to', type: 'number' },
      ],
      returns: 'void',
    },
    importPlaylist: {
      name: 'importPlaylist',
      description:
        'Import a full playlist object. Returns the new playlist ID.',
      params: [{ name: 'playlist', type: 'Playlist' }],
      returns: 'string',
    },
    saveQueueAsPlaylist: {
      name: 'saveQueueAsPlaylist',
      description:
        'Save the current queue as a new playlist. Returns the playlist ID.',
      params: [{ name: 'name', type: 'string' }],
      returns: 'string',
    },
  },
};
