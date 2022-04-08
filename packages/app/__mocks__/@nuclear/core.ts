const initialStoreState = () => ({
  equalizer: {
    selected: 'Default'
  },
  downloads: [],
  favorites: {
    albums: [],
    tracks: []
  },
  playlists: []
});

let mockStore = {...initialStoreState()};

const LastFmApi = {
  searchTracks: jest.fn().mockResolvedValue([])
};

module.exports = {
  isArtistObject: jest.requireActual('@nuclear/core/src/types').isArtistObject,
  store: {
    init: (store: typeof mockStore) => mockStore = store,
    get: (key: string) => mockStore[key] || {},
    set: (key: string, value: any) => {
      mockStore[key] = value;
    },
    clear: () => mockStore = initialStoreState()
  },
  createApi: () => ({
    app: {},
    store: {},
    React: jest.fn(),
    ReactDOM: jest.fn()
  }),
  setOption: jest.fn(),
  getOption: () => '',
  rest: {
    LastFmApi: class {
      constructor() {}

      getTagInfo() {}
      getTagTracks() {}
      getTagAlbums() {}
      getTagArtists() {}
      getTopTags = jest.fn().mockResolvedValue([])
      getTopTracks = jest.fn().mockResolvedValue([])
      searchTracks = LastFmApi.searchTracks
    },
    Youtube: {
      urlSearch: jest.fn().mockResolvedValue([]),
      liveStreamSearch: jest.fn().mockResolvedValue([])
    },
    NuclearPlaylistsService: jest.requireActual('@nuclear/core/src/rest/Nuclear/Playlists').NuclearPlaylistsService
  },
  settingsConfig: jest.requireActual('@nuclear/core/src/settings').settingsConfig,
  SettingType: {
    BOOLEAN: 'boolean',
    LIST: 'list',
    NODE: 'node',
    NUMBER: 'number',
    STRING: 'string',
    DIRECTORY: 'directory'
  },
  PlaylistHelper: jest.requireActual('@nuclear/core/src/helpers').PlaylistHelper
};
