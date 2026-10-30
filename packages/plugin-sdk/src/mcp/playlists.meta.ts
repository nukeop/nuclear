import type { DomainMeta } from './meta';

export const PlaylistsAPIMeta: DomainMeta = {
  description: 'Create, edit, import, and manage playlists and folders.',
  methods: {
    getIndex: {
      name: 'getIndex',
      description:
        'Get a flat list of all playlists with summary info, including the playlists inside folders.',
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
        'Save the current queue as a new playlist, optionally inside a folder. Returns the playlist ID.',
      params: [
        { name: 'name', type: 'string' },
        { name: 'folderId', type: 'string?' },
      ],
      returns: 'string',
    },
    getIndexTree: {
      name: 'getIndexTree',
      description:
        'Get the playlists and folders in their display order. Each folder contains its playlists.',
      params: [],
      returns: '(PlaylistIndexEntry | PlaylistFolder)[]',
    },
    createFolder: {
      name: 'createFolder',
      description:
        'Create an empty folder at the end of the top level. Returns the folder ID.',
      params: [{ name: 'name', type: 'string' }],
      returns: 'string',
    },
    renameFolder: {
      name: 'renameFolder',
      description: 'Rename a folder.',
      params: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
      ],
      returns: 'void',
    },
    deleteFolder: {
      name: 'deleteFolder',
      description:
        'Delete a folder. Its playlists will not be deleted. They will move to the position of the folder.',
      params: [{ name: 'id', type: 'string' }],
      returns: 'void',
    },
    movePlaylistToFolder: {
      name: 'movePlaylistToFolder',
      description:
        'Move a playlist to the end of a folder. If there is no folder ID, move it to the end of the top level.',
      params: [
        { name: 'playlistId', type: 'string' },
        { name: 'folderId', type: 'string?' },
      ],
      returns: 'void',
    },
  },
};
