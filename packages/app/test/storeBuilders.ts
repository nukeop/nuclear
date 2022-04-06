import Sound from 'react-hifi';
import { UserAccountState } from '@nuclear/core/src/rest/Nuclear/Identity.types';

import { RootState } from '../app/reducers';
import { startingStateMeta } from '../app/reducers/helpers';
import { PlaylistsStore } from '../app/reducers/playlists';
import { DownloadStatus } from '../app/actions/downloads';

type StoreStateBuilder = ReturnType<typeof buildStoreState>;
export const buildStoreState = () => {
  let state: Partial<RootState> = {
    connectivity: true,
    search: {
      albumDetails: {},
      artistDetails: {},
      liveStreamSearchResults: {},
      artistSearchResults: []
    },
    plugin: {
      plugins: [],
      selected: [],
      userPlugins: []
    },
    playlists: {
      localPlaylists: { ...startingStateMeta },
      remotePlaylists: { ...startingStateMeta }
    },
    player: {
      playbackStatus: Sound.status.PAUSED,
      playbackStreamLoading: false,
      playbackProgress: 0,
      seek: 0,
      volume: 0.5,
      muted: false
    },
    dashboard: {
      bestNewAlbums: [],
      bestNewTracks: [],
      topTracks: [],
      topTags: []
    },
    downloads: [],
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
    queue: {
      queueItems: [],
      currentSong: 0
    },
    nuclear: {
      identity: {
        token: null,
        signedInUser: null
      }
    },
    settings: {}
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
                  artists: [
                    {
                      name: 'test artist 1'
                    }
                  ],
                  genres: ['genre 1', 'genre 2'],
                  images: ['image 1'],
                  thumb: 'image 1',
                  coverImage: 'image 1',
                  tracklist: [
                    {
                      uuid: 'track-1',
                      artist: {
                        name: 'test artist 1'
                      },
                      title: 'test track 1',
                      duration: 10
                    }
                  ],
                  year: 2019
                },
                {
                  id: 'test-album-2',
                  title: ' Test album 2',
                  artists: [
                    {
                      name: 'test artist 2'
                    }
                  ],
                  genres: ['genre 2', 'genre 3'],
                  images: ['image 2'],
                  thumb: 'image 2',
                  coverImage: 'image 2',
                  tracklist: [
                    {
                      uuid: 'track-2',
                      artist: {
                        name: 'test artist 2'
                      },
                      title: 'test track 2',
                      duration: 40
                    }
                  ],
                  year: 2021
                }
              ],
              releasesLoading: false,
              similar: [
                {
                  name: 'artist-similar-1',
                  thumbnail: 'artist-similar-1 thumb'
                },
                {
                  name: 'artist-similar-2',
                  thumbnail: 'artist-similar-2 thumb'
                }
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
    withPlugins(data?: { streamProviders: any[] }) {
      state = {
        ...state,
        plugin: {
          userPlugins: {},
          plugins: {
            streamProviders: data?.streamProviders || [
              {
                name: 'Test Stream Provider',
                sourceName: 'Test Stream Provider',
                search: jest.fn(() => ({
                  data: 'test-stream-data'
                })),
                getStreamForId: jest.fn((id: string) => ({
                  data: id
                }))
              },
              {
                name: 'Different Stream Provider',
                sourceName: 'Different Stream Provider',
                search: jest.fn(() => ({
                  data: 'different-test-stream-data'
                })),
                getStreamForId: jest.fn((id: string) => ({
                  data: id
                }))
              }
            ],
            metaProviders: [
              {
                name: 'Test Meta Provider',
                description: 'Metadata provider for testing.',
                image: null,
                isDefault: true,
                sourceName: 'Test Metadata Provider',
                searchName: 'Test Metadata Provider',
                searchForArtists: jest.fn().mockResolvedValue([]),
                searchForReleases: jest.fn().mockResolvedValue([]),
                searchForPodcast: jest.fn().mockResolvedValue([]),
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
                searchName: 'Another Metadata Provider',
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
    withConnectivity(connectivity = true) {
      state = {
        ...state,
        connectivity
      };
      return this as StoreStateBuilder;
    },
    withPlaylists(
      data?: PlaylistsStore['localPlaylists']['data'],
      isLoading?: boolean
    ) {
      state = {
        ...state,
        playlists: {
          remotePlaylists: { ...startingStateMeta },
          localPlaylists: {
            isLoading: isLoading || false,
            hasError: false,
            isReady: !isLoading,
            data: data ?? [
              {
                id: 'test-playlist-id',
                name: 'test playlist',
                lastModified: 1000198000000,
                tracks: [
                  {
                    uuid: 'test-track-1',
                    artist: 'test artist 1',
                    name: 'test track',
                    thumbnail: 'test thumbnail',
                    streams: [
                      {
                        id: 'test-stream-id',
                        source: 'Test source',
                        title: 'stream title 1',
                        duration: 100
                      },
                      {
                        id: 'test-stream-id-2',
                        source: 'Another test source',
                        title: 'another stream title 2',
                        duration: 200
                      }
                    ]
                  },
                  {
                    uuid: 'test-track-2',
                    artist: 'test artist 2',
                    name: 'test track 22',
                    thumbnail: 'test thumbnail 2',
                    streams: [
                      {
                        id: 'test-stream-id-3',
                        source: 'Test source',
                        title: 'stream title 3',
                        duration: 20
                      }
                    ]
                  }
                ]
              },
              {
                id: 'test-playlist-id-2',
                name: 'test playlist 2',
                tracks: [
                  {
                    uuid: 'test-track-1',
                    artist: 'test artist 1',
                    name: 'test track',
                    thumbnail: 'test thumbnail',
                    streams: [
                      {
                        id: 'test-stream-id',
                        source: 'Test source',
                        title: 'stream title 1',
                        duration: 100
                      },
                      {
                        id: 'test-stream-id-2',
                        source: 'Another test source',
                        title: 'another stream title 2',
                        duration: 200
                      }
                    ]
                  },
                  {
                    uuid: 'test-track-22',
                    artist: 'test artist 2',
                    name: 'test track 22',
                    thumbnail: 'test thumbnail 2',
                    streams: [
                      {
                        id: 'test-stream-id-3',
                        source: 'Test source',
                        title: 'stream title 3',
                        duration: 20
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      };
      return this as StoreStateBuilder;
    },
    withFavorites() {
      state = {
        ...state,
        favorites: {
          tracks: [
            {
              artist: 'test artist 1',
              name: 'test track 1',
              thumbnail: 'https://test-track-thumb-url',
              streams: [
                {
                  source: 'Test Stream Provider',
                  id: 'CuklIb9d3fI',
                  duration: 300,
                  title: 'test track 1',
                  thumbnail: 'https://test-track-thumb-url',
                  format: 'webm',
                  skipSegments: [
                    {
                      category: 'intro',
                      startTime: 0,
                      endTime: 5
                    },
                    {
                      category: 'music_offtopic',
                      startTime: 5,
                      endTime: 22
                    },
                    {
                      category: 'music_offtopic',
                      startTime: 239,
                      endTime: 299
                    }
                  ],
                  originalUrl: 'https://test-track-original-url'
                }
              ],
              uuid: 'uuid1'
            },
            {
              artist: 'test artist 2',
              name: 'test track 2',
              thumbnail: 'https://test-track-thumb-url',
              streams: [],
              uuid: 'uuid2'
            }
          ],
          artists: [],
          albums: [
            {
              id: 'test-album-1',
              title: ' Test album 1',
              artists: [
                {
                  name: 'test artist 1'
                }
              ],
              genres: ['genre 1', 'genre 2'],
              images: ['image 1'],
              thumb: 'image 1',
              coverImage: 'image 1',
              tracklist: [
                {
                  uuid: 'track-1',
                  artist: {
                    name: 'test artist 1'
                  },
                  title: 'test track 1',
                  duration: 10
                },
                {
                  uuid: 'track-2',
                  artist: {
                    name: 'test artist 2'
                  },
                  title: 'test track 2',
                  duration: 45
                }
              ]
            }
          ]
        }
      };
      return this as StoreStateBuilder;
    },
    withDashboard() {
      state = {
        ...state,
        dashboard: {
          bestNewAlbums: [
            {
              thumbnail: 'test thumbnail 1',
              artist: 'test artist 1',
              title: 'test title 1',
              reviewUrl: 'test review url 1',
              score: '5.0',
              abstract: 'test abstract 1',
              review: 'test review 1',
              genres: ['Rock']
            },
            {
              thumbnail: 'test thumbnail 2',
              artist: 'test artist 2',
              title: 'test title 2',
              reviewUrl: 'test review url 2',
              score: '8.0',
              abstract: 'test abstract 2',
              review: 'test review 2',
              genres: ['Pop']
            }
          ],
          bestNewTracks: [
            {
              thumbnail: 'test track thumbnail 1',
              artist: 'test track artist 1',
              title: 'test track title 1',
              reviewUrl: 'test track review url 1',
              review: 'track review 1'
            },
            {
              thumbnail: 'test track thumbnail 2',
              artist: 'test track artist 2',
              title: 'test track title 2',
              reviewUrl: 'test track review url 2',
              review: 'track review 2'
            }
          ],
          topTracks: [
            {
              name: 'top track 1',
              artist: {
                name: 'top track artist 1'
              },
              playcount: '1000000',
              thumbnail: 'top track thumbnail 1'
            },
            {
              name: 'top track 2',
              artist: {
                name: 'top track artist 2'
              },
              playcount: '7899543',
              thumbnail: 'top track thumbnail 2'
            }
          ],
          topTags: [
            {
              name: 'rock',
              count: 123456,
              reach: 1234
            },
            {
              name: 'pop',
              count: 2345,
              reach: 899
            }
          ]
        }
      };
      return this as StoreStateBuilder;
    },
    withDownloads() {
      state = {
        ...state,
        downloads: [
          {
            status: DownloadStatus.FINISHED,
            completion: 1,
            track: {
              uuid: '1',
              artist: {
                name: 'test artist 1'
              },
              name: 'finished track'
            }
          },
          {
            status: DownloadStatus.ERROR,
            completion: 0.1,
            track: {
              uuid: '2',
              artist: {
                name: 'test artist 2'
              },
              name: 'track with errorx'
            }
          },
          {
            status: DownloadStatus.PAUSED,
            completion: 0.3,
            track: {
              uuid: '3',
              artist: {
                name: 'test artist 3'
              },
              name: 'paused track'
            }
          },
          {
            status: DownloadStatus.STARTED,
            completion: 0.5,
            track: {
              uuid: '4',
              artist: {
                name: 'test artist 4'
              },
              name: 'started track'
            }
          },
          {
            status: DownloadStatus.WAITING,
            completion: 0,
            track: {
              uuid: '5',
              artist: {
                name: 'test artist 5'
              },
              name: 'waiting track'
            }
          }
        ]
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
    withTracksInPlayQueue() {
      state = {
        ...state,
        queue: {
          queueItems: [
            {
              artist: 'test artist 1',
              name: 'test track 1',
              thumbnail: 'https://test-track-thumb-url',
              streams: [
                {
                  source: 'Test Stream Provider',
                  id: 'CuklIb9d3fI',
                  stream: 'https://test-track-stream-url',
                  duration: 300,
                  title: 'test track 1',
                  thumbnail: 'https://test-track-thumb-url',
                  format: 'webm',
                  skipSegments: [
                    {
                      category: 'intro',
                      startTime: 0,
                      endTime: 5
                    },
                    {
                      category: 'music_offtopic',
                      startTime: 5,
                      endTime: 22
                    },
                    {
                      category: 'music_offtopic',
                      startTime: 239,
                      endTime: 299
                    }
                  ],
                  originalUrl: 'https://test-track-original-url'
                }
              ],
              uuid: 'uuid1',
              loading: false,
              error: false
            },
            {
              artist: 'test artist 2',
              name: 'test track 2',
              thumbnail: 'https://test-track-thumb-url',
              streams: [
                {
                  source: 'Different Stream Provider',
                  id: '_CuklIb9d3fI',
                  stream: 'https://test-track-stream-url',
                  duration: 300,
                  title: 'test track 2',
                  thumbnail: 'https://test-track-thumb-url',
                  format: 'webm',
                  skipSegments: []
                }
              ],
              uuid: 'uuid2',
              loading: false,
              error: false
            },
            {
              artist: 'test artist 3',
              name: 'test track 3',
              thumbnail: undefined,
              streams: [{
                source: 'Test Stream Provider',
                id: 'CuklIb9d3fI',
                stream: 'https://test-track-stream-url',
                duration: 300,
                title: 'test track 3',
                thumbnail: 'https://test-track-thumb-url',
                format: 'webm',
                skipSegments: []
              }],
              uuid: 'uuid3',
              loading: false,
              error: false
            }
          ],
          currentSong: 0
        }
      };

      return this as StoreStateBuilder;
    },
    withSearchResults() {
      state.search = {
        ...state.search,
        artistSearchResults: [
          {
            uuid: 'test-uuid',
            name: 'Test Artist',
            coverImage: 'https://test-cover-url',
            thumbnail: 'https://test-thumb-url'
          }
        ],
        liveStreamSearchResults: {
          id: 'test',
          info: [
            {
              streams: [
                {
                  source: 'Test LiveStream Provider',
                  id: '_CuklIb9d3fI'
                }
              ],
              name: 'Test LiveStream',
              thumbnail: 'https://test-thumb-url',
              artist: {
                name: 'Test artist'
              }
            }
          ]
        }
      };
      return this as StoreStateBuilder;
    },
    withLoggedInUser() {
      state.nuclear.identity = {
        ...state.nuclear.identity,
        token: 'auth-token',
        signedInUser: {
          id: '1',
          username: 'nukeop',
          displayName: 'nukeop',
          accountState: UserAccountState.UNCONFIRMED
        }
      };
      return this as StoreStateBuilder;
    },
    withLocal() {
      state = {
        ...state,
        local: {
          pending: false,
          error: false,
          folders: [],
          page: 0,
          sortBy: 'artist',
          direction: 'ascending',
          filter: '',
          listType: 'simple-list',
          tracks: [],
          scanProgress: null,
          scanTotal: null,
          expandedFolders: []
        }
      };
      return this as StoreStateBuilder;
    },
    withSettings(settings: { [key: string]: string | number | boolean }) {
      state.settings = {
        ...state.settings,
        ...settings
      };
      return this as StoreStateBuilder;
    },
    build() {
      return state;
    }
  };
};

export const buildElectronStoreState = () => {
  return {
    equalizer: {
      selected: 'Default'
    },
    downloads: [],
    favorites: {
      albums: [],
      tracks: []
    },
    playlists: []
  };
};
