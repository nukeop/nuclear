
type StoreStateBuilder = ReturnType<typeof buildStoreState>;
export const buildStoreState = () => {
  let state = {
    search: { 
      albumDetails: {},
      artistDetails: {} 
    },
    plugin: {},
    playlists: {},
    dashboard: {},
    favorites: {
      tracks: [],
      artists: [],
      albums: []
    },
    githubContrib: {
      contributors: [],
      loading: false,
      error: false
    },
    connectivity: false
  };

  return {
    withAlbumDetails(data?: object) {
      state.search = {
        ...state.search,
        albumDetails: data || {
          ['test-album-id']: {
            id: 'test-album-id',
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
    withArtistDetails(data?: object) {
      state = {
        ...state,
        search: {
          ...state.search,
          artistDetails: data || {
            ['test-artist-id']: {
              name: 'test artist',
              loading: false,
              coverImage: 'test cover',
              description: 'test description',
              id: 'test-artist-id',
              images: ['first image', 'second image'],
              onTour: false,
              releases: [
                {
                  id: 'test-album-1',
                  title: ' Test album 1',
                  artists: [{
                    name: 'test artist 1'
                  }],
                  genres: ['genre 1', 'genre 2'],
                  images: ['image 1'],
                  thumb: 'image 1',
                  coverImage: 'image 1',
                  tracklist: [{
                    uuid: 'track-1',
                    artist: {
                      name: 'test artist 1'
                    },
                    title: 'test track 1',
                    duration: 10
                  }],
                  year: 2019
                },
                {
                  id: 'test-album-2',
                  title: ' Test album 2',
                  artists: [{
                    name: 'test artist 2'
                  }],
                  genres: ['genre 2', 'genre 3'],
                  images: ['image 2'],
                  thumb: 'image 2',
                  coverImage: 'image 2',
                  tracklist: [{
                    uuid: 'track-2',
                    artist: {
                      name: 'test artist 2'
                    },
                    title: 'test track 2',
                    duration: 40
                  }],
                  year: 2021
                }
              ],
              releasesLoading: false,
              similar: [
                { name: 'artist-similar-1', thumbnail: 'artist-similar-1 thumb' },
                { name: 'artist-similar-2', thumbnail: 'artist-similar-2 thumb' }
              ],
              tags: ['tag1', 'tag2', 'tag3'],
              thumb: 'test thumb',
              topTracks: [
                {
                  artist: {
                    mbid: 'test mbid',
                    name: 'test artist',
                    url: 'test artist url'
                  },
                  listeners: '771858',
                  name: 'test artist top track 1',
                  playcount: '6900237',
                  thumb: '',
                  title: 'test artist top track 1'
                },
                {
                  artist: {
                    mbid: 'test mbid',
                    name: 'test artist',
                    url: 'test artist url'
                  },
                  listeners: '123',
                  name: 'test artist top track 2',
                  playcount: '6969',
                  thumb: '',
                  title: 'test artist top track 2'
                },
                {
                  artist: {
                    mbid: 'test mbid',
                    name: 'test artist',
                    url: 'test artist url'
                  },
                  listeners: '9',
                  name: 'test artist top track 3',
                  playcount: '1',
                  thumb: '',
                  title: 'test artist top track 3'
                }
              ]
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
              },
              {
                name: 'Different Stream Provider',
                sourceName: 'Different Stream Provider',
                search: () => ({
                  data: 'different-test-stream-data'
                })
              }
            ],
            metaProviders: [
              {
                name: 'Test Meta Provider',
                description: 'Metadata provider for testing.',
                image: null,
                isDefault: true,
                sourceName: 'Test Metadata Provider',
                searchName: 'Test',
                fetchArtistDetailsByName: (artistName) => {
                  switch (artistName) {
                  case 'artist-similar-1':
                    return { id: 'artist-similar-id' };

                  default:
                    return { id: 'test-artist-id' };
                  }
                }
              },
              {
                name: 'Another Meta Provider',
                description: 'Another metadata provider for testing.',
                image: null,
                isDefault: true,
                sourceName: 'Another Metadata Provider',
                searchName: 'Test',
                fetchArtistDetailsByName: () => ({
                  id: 'test-artist-id'
                })
              }
            ],
            lyricsProviders: [
              {
                name: 'Test Lyrics Provider',
                description: 'Lyrics provider for testing.',
                sourceName: 'Test Lyrics Provider'
              },
              {
                name: 'Different Lyrics Provider',
                description: 'A different lyrics provider for testing.',
                sourceName: 'Different Lyrics Provider'
              }
            ]
          },
          selected: {
            streamProviders: 'Test Stream Provider',
            metaProviders: 'Test Metadata Provider',
            lyricsProviders: 'Test Lyrics Provider'
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
    withPlaylists(data?: object) {
      state = {
        ...state,
        playlists: {
          playlists: data || [
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
            },
            {
              id: 'test-playlist-id-2',
              name: 'test playlist 2',
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
    withFavorites() {
      state = {
        ...state,
        favorites: {
          tracks: [],
          artists: [],
          albums: [{
            id: 'test-album-1',
            title: ' Test album 1',
            artists: [{
              name: 'test artist 1'
            }],
            genres: ['genre 1', 'genre 2'],
            images: ['image 1'],
            thumb: 'image 1',
            coverImage: 'image 1',
            tracklist: [{
              uuid: 'track-1',
              artist: {
                name: 'test artist 1'
              },
              title: 'test track 1',
              duration: 10
            }, {
              uuid: 'track-2',
              artist: {
                name: 'test artist 2'
              },
              title: 'test track 2',
              duration: 45
            }]
          }]
        }
      };
      return this as StoreStateBuilder;
    },
    withDashboard() {
      state = {
        ...state,
        dashboard: {
          bestNewAlbums: [{
            thumbnail: 'test thumbnail 1',
            artist: 'test artist 1',
            title: 'test title 1',
            reviewUrl: 'test review url 1',
            score: '5.0',
            abstract: 'test abstract 1',
            review: 'test review 1',
            genres: ['Rock']
          }, {
            thumbnail: 'test thumbnail 2',
            artist: 'test artist 2',
            title: 'test title 2',
            reviewUrl: 'test review url 2',
            score: '8.0',
            abstract: 'test abstract 2',
            review: 'test review 2',
            genres: ['Pop']
          }],
          bestNewTracks: [{
            thumbnail: 'test track thumbnail 1',
            artist: 'test track artist 1',
            title: 'test track title 1',
            reviewUrl: 'test track review url 1',
            review: 'track review 1'
          }, {
            thumbnail: 'test track thumbnail 2',
            artist: 'test track artist 2',
            title: 'test track title 2',
            reviewUrl: 'test track review url 2',
            review: 'track review 2'
          }],
          topTracks: [{
            name: 'top track 1',
            artist: {
              name: 'top track artist 1'
            },
            playcount: '1000000',
            thumbnail: 'top track thumbnail 1'
          }, {
            name: 'top track 2',
            artist: {
              name: 'top track artist 2'
            },
            playcount: '7899543',
            thumbnail: 'top track thumbnail 2'
          }],
          topTags: [{
            name: 'rock',
            count: 123456,
            reach: 1234
          }, {
            name: 'pop',
            count: 2345,
            reach: 899
          }]
        }
      };
      return this as StoreStateBuilder;
    },
    withGithubContrib() {
      state = {
        ...state,
        githubContrib: {
          contributors: [],
          loading: false,
          error: false
        }
      };

      return this as StoreStateBuilder;
    },
    build() {
      return state;
    }
  };
};
