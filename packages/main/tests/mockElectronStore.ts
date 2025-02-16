export const initialStoreState = () => ({
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
  
export type MockStore = ReturnType<typeof initialStoreState>;
  
export const mockElectronStore = (mockStore: MockStore) => ({
  init: (store: typeof mockStore) => mockStore = store,
  get: (key: string) => mockStore[key] || {},
  set: (key: string, value: any) => {
    mockStore[key] = value;
  },
  clear: () => mockStore = initialStoreState()
});
  
