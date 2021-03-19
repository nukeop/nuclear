
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

let mockStore = initialStoreState();

module.exports = {
  store: {
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
  getOption: () => '',
  rest: {
    LastFmApi: class {
      constructor() {

      }
    }
  },
  settingsConfig: [],
  SettingType: {
    BOOLEAN: 'boolean',
    LIST: 'list',
    NODE: 'node',
    NUMBER: 'number',
    STRING: 'string',
    DIRECTORY: 'directory'
  }
};
