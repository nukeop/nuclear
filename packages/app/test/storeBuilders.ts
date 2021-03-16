
type StoreStateBuilder = ReturnType<typeof buildStoreState>;
export const buildStoreState = () => {
  let state = {
    search: {},
    plugin: {},
    playlists: {},
    connectivity: false
  };

  return {
    withAlbumDetails(data?: object) {
      state.search = {
        ...state.search,
        albumDetails: data || {
          ['test-album-id']: {
            loading: false,
            artist: 'test artist',
            title: 'test album',
            thumb: 'test thumbnail',
            coverImage: 'test cover',
            images: ['first image', 'second image'],
            genres: ['genre 1', 'genre 2'],
            year: '2001',
            type: 'master',
            tracklist: [
              {
                uuid: 'track-1-id',
                ids: [],
                artist: 'test artist',
                title: 'test track 1',
                duration: 120
              },
              {
                uuid: 'track-2-id',
                ids: [],
                artist: 'test artist',
                title: 'test track 2',
                duration: 63
              },
              {
                uuid: 'track-3-id',
                ids: [],
                artist: 'test artist',
                title: 'test track 3',
                duration: 7
              }
            ]
          }
        }
      };
      return this as StoreStateBuilder;
    },
    withArtistDetails() {
      state = {
        ...state,
        search: {
          ...state.search,
          artistDetails: {
            'test-artist-id': {
              loading: false
            }
          }
        }
      };
      return this as StoreStateBuilder;
    },
    withPlugins() {
      state = {
        ...state,
        plugin: {
          plugins: {
            streamProviders: [
              {
                name: 'Test Stream Provider',
                sourceName: 'Test Stream Provider',
                search: () => ({
                  data: 'test-stream-data'
                })
              }
            ],
            metaProviders: [
              {
                name: 'Test Meta Provider',
                description: 'Metadata providerfor testing.',
                image: null,
                isDefault: true,
                sourceName: 'Test Metadata Provider',
                searchName: 'Test',
                fetchArtistDetailsByName: () => ({
                  id: 'test-artist-id'
                })
              }
            ]
          },
          selected: {
            streamProviders: 'Test Stream Provider',
            metaProviders: 'Test Metadata Provider'
          }
        }
      };
      return this as StoreStateBuilder;
    },
    withConnectivity() {
      state = {
        ...state,
        connectivity: true
      };
      return this as StoreStateBuilder;
    },
    withPlaylists() {
      state = {
        ...state,
        playlists: {
          playlists: [
            {
              id: 'test-playlist-id',
              name: 'test playlist',
              tracks: [{
                artist: 'test artist 1',
                name: 'test track',
                thumbnail: 'test thumbnail',
                streams: [{
                  source: 'Test source',
                  stream: 'test stream 1',
                  title: 'stream title 1',
                  duration: 100
                }, {
                  source: 'Another test source',
                  stream: 'another test stream 2',
                  title: 'another stream title 2',
                  duration: 200
                }]
              }, {
                artist: 'test artist 2',
                name: 'test track 22',
                thumbnail: 'test thumbnail 2',
                streams: [{
                  source: 'Test source',
                  stream: 'test stream 3',
                  title: 'stream title 3',
                  duration: 20
                }]
              }]
            }
          ]
        }
      };
      return this as StoreStateBuilder;
    },
    build() {
      return state;
    }
  };
};
