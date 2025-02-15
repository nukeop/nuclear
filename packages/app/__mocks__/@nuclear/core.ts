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

const mockLogger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn().mockImplementation((...args) => {
    console.error(...args);
  }),
  time: jest.fn(),
  timeEnd: jest.fn(),
  streamLog: jest.fn(),
  streamWarn: jest.fn(),
  streamError: jest.fn().mockImplementation((stream) => {
    stream.on('data', (data) => {
      console.error(data.trim());
    });
  }),
  create: jest.fn().mockImplementation(() => mockLogger),
  getDefaults: jest.fn().mockReturnValue({
    ignore: null,
    shouldHookConsole: false,
    logLevel: 'info'
  }),
  hookConsole: jest.fn().mockReturnValue(() => {})
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
  logger: mockLogger,
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
