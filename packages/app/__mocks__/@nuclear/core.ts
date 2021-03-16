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
  ...jest.requireActual('@nuclear/core'),
  store: {
    get: (key: string) => mockStore[key] || {},
    set: (key: string, value: any) => {
      mockStore[key] = value;
    },
    clear: () => mockStore = initialStoreState()
  }
};
