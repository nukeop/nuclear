import { initialStoreState, mockElectronStore } from '../../test/mockElectronStore';

const mockStore = {...initialStoreState()};

const LastFmApi = {
  searchTracks: jest.fn().mockResolvedValue([])
};

const mockTopTags = {
  toptags: {
    tag: [
      { name: 'rock', count: 1000, reach: 100 },
      { name: 'pop', count: 800, reach: 80 }
    ]
  }
};

module.exports = {
  isArtistObject: jest.requireActual('@nuclear/core/src/types').isArtistObject,
  store: mockElectronStore(mockStore),
  createApi: () => ({
    app: {},
    store: {},
    React: jest.fn(),
    ReactDOM: jest.fn()
  }),
  setOption: jest.fn(),
  getOption: () => '',
  rest: {
    LastFmApi: jest.fn(() =>  ({
      getTagInfo: jest.fn(),
      getTagTracks: jest.fn(),
      getTagAlbums: jest.fn(),
      getTagArtists: jest.fn(),
      getTopTags: jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockTopTags)
      }),
      getTopTracks: jest.fn().mockResolvedValue([]),
      searchTracks: LastFmApi.searchTracks
    })),
    Youtube: {
      urlSearch: jest.fn().mockResolvedValue([]),
      liveStreamSearch: jest.fn().mockResolvedValue([])
    },
    NuclearPlaylistsService: jest.requireActual('@nuclear/core/src/rest/Nuclear/Playlists').NuclearPlaylistsService,
    NuclearStreamMappingsService: jest.requireActual('@nuclear/core/src/rest/Nuclear/StreamMappings').NuclearStreamMappingsService,
    Deezer: {
      ...jest.requireActual('@nuclear/core/src/rest/Deezer'),
      getEditorialCharts: jest.fn().mockResolvedValue({
        playlists: {
          data: []
        }
      }),
      getPlaylistTracks: jest.fn().mockResolvedValue({
        data: []
      })
    }
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
  PlaylistHelper: jest.requireActual('@nuclear/core/src/helpers').PlaylistHelper,
  IpcEvents: jest.requireActual('@nuclear/core').IpcEvents
};
