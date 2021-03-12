
type StoreStateBuilder = ReturnType<typeof buildStoreState>;
export const buildStoreState = () => {
  let state = {
    search: {},
    plugin: {}
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
            streamProviders: {},
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
            metaProviders: 'Test Metadata Provider'
          }
        }
      };
      return this as StoreStateBuilder;
    },
    build() {
      return state;
    }
  };
};
