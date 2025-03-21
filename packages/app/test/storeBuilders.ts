import Sound from 'react-hifi';
import { UserAccountState } from '@nuclear/core/src/rest/Nuclear/Identity.types';
import { DownloadStatus } from '@nuclear/ui/lib/types';

import { RootState } from '../app/reducers';
import { startingStateMeta } from '../app/reducers/helpers';
import { PlaylistsStore } from '../app/reducers/playlists';
import { AnyProps } from './testUtils';
import { LyricsProvider, MetaProvider } from '@nuclear/core';
import { TrackStream } from '../app/reducers/queue';
import { LocalLibraryState } from '../app/actions/local';
import { DeezerEditorialCharts } from '@nuclear/core/src/rest/Deezer';
import { Loadable } from '../app/reducers/types';
import { ArtistDetailsState } from '../app/reducers/search';
import { SearchResultsSource } from '@nuclear/core/src/plugins/plugins.types';

type StoreStateBuilder = ReturnType<typeof buildStoreState>;
export const buildStoreState = () => {
  let state: Partial<RootState> = {
    connectivity: true,
    search: {
      artistSearchResults: [],
      albumSearchResults: [],
      podcastSearchResults: [],
      trackSearchResults: [],
      playlistSearchResults: [],
      liveStreamSearchResults: [],
      albumDetails: {},
      artistDetails: {},
      searchHistory: [],
      unifiedSearchStarted: false,
      playlistSearchStarted: false,
      liveStreamSearchStarted: false,
      isFocused: false
    },
    plugin: {
      plugins: {
        streamProviders: [],
        metaProviders: [],
        lyricsProviders: []
      },
      selected: {},
      userPlugins: {}
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
      volume: 50,
      muted: false,
      playbackRate: 1
    },
    dashboard: {
      topTracks: [],
      topTags: [],
      editorialCharts: { ...startingStateMeta },
      editorialPlaylists: {}
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
      currentTrack: 0
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
    withAlbumDetails(data?: any) {
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
    withArtistDetails(data?: {[key: string]: ArtistDetailsState }) {
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
                  title: 'Test album 1',
                  artist: 'test artist',
                  genres: ['genre 1', 'genre 2'],
                  images: ['image 1'],
                  thumb: 'image 1',
                  coverImage: 'image 1',
                  tracklist: [
                    {
                      uuid: 'track-1',
                      artist: 'test artist 1',                      
                      title: 'test track 1',
                      duration: 10
                    }
                  ],
                  year: '2020',
                  source: SearchResultsSource.Discogs
                },
                {
                  id: 'test-album-2',
                  title: 'Test album 2',
                  artist: 'test artist 2',
                  genres: ['genre 2', 'genre 3'],
                  images: ['image 2'],
                  thumb: 'image 2',
                  coverImage: 'image 2',
                  tracklist: [
                    {
                      uuid: 'track-2',
                      artist: 'test artist 2',
                      title: 'test track 2',
                      duration: 40
                    }
                  ],
                  year: '2019',
                  source: SearchResultsSource.Discogs
                },
                {
                  id: 'test-album-3',
                  title: 'First test album',
                  artist: 'test artist',
                  genres: ['genre 4', 'genre 5'],
                  images: ['image 3'],
                  thumb: 'image 3',
                  coverImage: 'image 3',
                  tracklist: [
                    {
                      uuid: 'track-3',
                      artist: 'test artist',
                      title: 'test track 3',
                      duration: 40
                    }
                  ],
                  year: '2010',
                  source: SearchResultsSource.Discogs
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
                    name: 'test artist'
                  },
                  listeners: 771858,
                  playcount: 6900237,
                  thumb: '',
                  title: 'test artist top track 1'
                },
                {
                  artist: {
                    name: 'test artist'
                  },
                  listeners: 123,
                  playcount: 6969,
                  thumb: '',
                  title: 'test artist top track 2'
                },
                {
                  artist: {
                    name: 'test artist'
                  },
                  listeners: 9,
                  playcount: 1,
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
    withPlugins(data?: { streamProviders?: any[], metaProviders?: any[] }) {
      state = {
        ...state,
        plugin: {
          userPlugins: {},
          plugins: {
            streamProviders: data?.streamProviders ?? [
              {
                name: 'Test Stream Provider',
                sourceName: 'Test Stream Provider',
                search: jest.fn(() => ([{
                  id: 'test-stream-id',
                  author: {
                    name: 'test author'
                  }
                }])),
                getStreamForId: jest.fn(() => ({
                  stream: 'test-stream-url',
                  author: {
                    name: 'test author'
                  }
                }))
              },
              {
                name: 'Different Stream Provider',
                sourceName: 'Different Stream Provider',
                search: jest.fn(() => ([{
                  id: 'test-stream-id-1',
                  source: 'Different Stream Provider',
                  author: {
                    name: 'test author'
                  }
                }])),
                getStreamForId: jest.fn((id: string) => ({
                  id: 'test-stream-id-1',
                  stream: 'different-test-stream-url',
                  source: 'Different Stream Provider'
                }) as TrackStream)
              }
            ],
            metaProviders: data?.metaProviders ?? [
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
                fetchArtistDetailsByName: jest.fn(artistName => {
                  switch (artistName) {
                  case 'artist-similar-1':
                    return { id: 'artist-similar-id' };

                  default:
                    return { id: 'test-artist-id' };
                  }
                }),
                fetchArtistAlbums: jest.fn()
              } as any as MetaProvider,
              {
                name: 'Another Meta Provider',
                description: 'Another metadata provider for testing.',
                image: null,
                isDefault: true,
                sourceName: 'Another Metadata Provider',
                searchName: 'Another Metadata Provider',
                fetchArtistDetailsByName: jest.fn().mockResolvedValue({
                  id: 'test-artist-id'
                })
              } as unknown as MetaProvider
            ],
            lyricsProviders: [
              {
                name: 'Test Lyrics Provider',
                description: 'Lyrics provider for testing.',
                sourceName: 'Test Lyrics Provider'
              } as unknown as LyricsProvider,
              {
                name: 'Different Lyrics Provider',
                description: 'A different lyrics provider for testing.',
                sourceName: 'Different Lyrics Provider'
              } as unknown as LyricsProvider
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
                    stream: {
                      id: 'test-stream-id',
                      source: 'Test source',
                      title: 'stream title 1',
                      duration: 100
                    }
                  },
                  {
                    uuid: 'test-track-2',
                    artist: 'test artist 2',
                    name: 'test track 22',
                    thumbnail: 'test thumbnail 2',
                    stream: {
                      id: 'test-stream-id-3',
                      source: 'Test source',
                      title: 'stream title 3',
                      duration: 20
                    }
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
                    stream:
                    {
                      id: 'test-stream-id',
                      source: 'Test source',
                      title: 'stream title 1',
                      duration: 100
                    }
                  },
                  {
                    uuid: 'test-track-22',
                    artist: 'test artist 2',
                    name: 'test track 22',
                    thumbnail: 'test thumbnail 2',
                    stream: {
                      id: 'test-stream-id-3',
                      source: 'Test source',
                      title: 'stream title 3',
                      duration: 20
                    }
                  }
                ]
              }
            ]
          }
        }
      };
      return this as StoreStateBuilder;
    },
    withFavorites(favorites: RootState['favorites'] = {}) {
      state = {
        ...state,
        favorites: {
          tracks: [
            {
              position: 2,
              artist: 'test artist 1',
              name: 'test track 1',
              thumbnail: 'https://test-track-thumb-url',
              uuid: 'uuid1'
            },
            {
              position: 1,
              artist: 'test artist 2',
              name: 'test track 2',
              thumbnail: 'https://test-track-thumb-url',
              stream: undefined,
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
          ],
          ...favorites
        }
      };
      return this as StoreStateBuilder;
    },
    withDashboard() {
      state = {
        ...state,
        dashboard: {
          topTracks: [
            {
              id: 1,
              position: 1,
              title: 'top track 1',
              artist: 'top track artist 1',
              thumbnail: 'top track thumbnail 1',
              duration: 100,
              album: {
                title: 'top track album 1',
                cover_small: 'top track cover small 1',
                cover_medium: 'top track album cover 1',
                cover_big: 'top track cover big 1',
                cover_xl: 'top track cover xl 1'
              }
            },
            {
              id: 2,
              position: 2,
              title: 'top track 2',
              artist: 'top track artist 2',
              thumbnail: 'top track thumbnail 2',
              duration: 78,
              album: {
                title: 'top track album 2',
                cover_small: 'top track cover small 2',
                cover_medium: 'top track album cover 2',
                cover_big: 'top track cover big 2',
                cover_xl: 'top track cover xl 2'
              }
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
          ],
          editorialCharts: {
            isLoading: false,
            isReady: true,
            data: {
              artists: {
                data: [{
                  id: 1,
                  name: 'artist 1',
                  picture_medium: 'artist 1 picture medium'
                }, {
                  id: 2,
                  name: 'artist 2',
                  picture_medium: 'artist 2 picture medium'
                }],
                total: 2
              },
              albums: {
                data: [{
                  id: 1,
                  title: 'album 1',
                  artist: {
                    name: 'artist 1'
                  },
                  cover_medium: 'album 1 cover medium'
                }, {
                  id: 2,
                  title: 'album 2',
                  artist: {
                    name: 'artist 2'
                  },
                  cover_medium: 'album 2 cover medium'
                }],
                total: 2
              },
              playlists: {
                data: [{
                  id: 1,
                  title: 'playlist 1',
                  picture_medium: 'playlist 1 picture medium'
                }, {
                  id: 2,
                  title: 'playlist 2',
                  picture_medium: 'playlist 2 picture medium'
                }],
                total: 2
              }
            }
          } as Loadable<DeezerEditorialCharts>,
          editorialPlaylists: {
            1: {
              isLoading: false,
              isReady: true,
              data: {
                id: 1,
                tracklist: [{
                  uuid: '1',
                  name: 'track 1',
                  artist: 'artist 1',
                  stream: undefined
                }, {
                  uuid: '2',
                  name: 'track 2',
                  artist: 'artist 2',
                  stream: undefined
                }]
              }
            }
          }
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
              artist: 'test artist 1',
              name: 'finished track'
            }
          },
          {
            status: DownloadStatus.ERROR,
            completion: 0.1,
            track: {
              uuid: '2',
              artist: 'test artist 2',
              name: 'track with errorx'
            }
          },
          {
            status: DownloadStatus.PAUSED,
            completion: 0.3,
            track: {
              uuid: '3',
              artist: 'test artist 3',
              name: 'paused track'
            }
          },
          {
            status: DownloadStatus.STARTED,
            completion: 0.5,
            track: {
              uuid: '4',
              artist: 'test artist 4',
              name: 'started track'
            }
          },
          {
            status: DownloadStatus.WAITING,
            completion: 0,
            track: {
              uuid: '5',
              artist: 'test artist 5',
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
              streams: [{
                source: 'Test Stream Provider',
                id: 'CuklIb9d3fI',
                stream: 'https://test-track-stream-url',
                duration: 300,
                title: 'test track 1',
                thumbnail: 'https://test-track-thumb-url',
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
              }, {
                id: 'test-stream-provider-id',
                source: 'Test Stream Provider',
                title: 'test track 1 - different stream'
              }],
              uuid: 'uuid1',
              queueId: '1',
              loading: false,
              error: false
            },
            {
              artist: 'test artist 2',
              name: 'test track 2',
              thumbnail: 'https://test-track-thumb-url',
              streams: [{
                source: 'Different Stream Provider',
                id: '_CuklIb9d3fI',
                stream: 'https://test-track-stream-url',
                duration: 300,
                title: 'test track 2',
                thumbnail: 'https://test-track-thumb-url',
                skipSegments: []
              }],
              uuid: 'uuid2',
              queueId: '2',
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
                skipSegments: []
              }],
              uuid: 'uuid3',
              queueId: '3',
              loading: false,
              error: false
            }
          ],
          currentTrack: 0
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
            thumbnail: 'https://test-thumb-url',
            cleanName: () => { },
            addSearchResultData: () => { }
          }
        ],
        liveStreamSearchResults: {
          id: 'test',
          info: [
            {
              streams: [{
                source: 'Test LiveStream Provider',
                id: '_CuklIb9d3fI'
              }],
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
    withLocal(tracks?: LocalLibraryState['tracks']) {
      state = {
        ...state,
        local: {
          pending: false,
          error: false,
          folders: ['/home/nuclear/Music'],
          page: 0,
          sortBy: 'artist',
          direction: 'ascending',
          filter: '',
          listType: 'simple-list',
          tracks: tracks ?? [{
            uuid: 'local-track-1',
            artist: 'local artist 1',
            name: 'local track 1',
            album: 'local album 1',
            thumbnail: 'local track thumbnail 1',
            duration: 300,
            path: '/home/nuclear/Music/local artist 1/local album 1/local track 1.mp3',
            folder: {
              path: '/home/nuclear/Music/local artist 1/local album 1'
            },
            local: true

          }, {
            uuid: 'local-track-2',
            artist: 'local artist 1',
            name: 'local track 2',
            album: 'local album 1',
            thumbnail: 'local track thumbnail 2',
            duration: 200,
            path: '/home/nuclear/Music/local artist 1/local album 1/local track 2.mp3',
            folder: {
              path: '/home/nuclear/Music/local artist 1/local album 1'
            },
            local: true
          }, {
            uuid: 'local-track-3',
            artist: 'local artist 2',
            name: 'local track 3',
            album: 'local album 2',
            thumbnail: 'local track thumbnail 3',
            duration: 100,
            path: '/home/nuclear/Music/local artist 2/local album 2/local track 3.mp3',
            folder: {
              path: '/home/nuclear/Music/local artist 2/local album 2'
            },
            local: true
          }],
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
    withPlayer(playerState: Partial<RootState['player']>) {
      state.player = {
        ...state.player,
        ...playerState
      };
      return this as StoreStateBuilder;
    },
    build() {
      return state;
    }
  };
};

export const buildElectronStoreState = (overrides?: AnyProps) => {
  return {
    equalizer: {
      selected: 'Default'
    },
    downloads: [],
    favorites: {
      albums: [],
      tracks: [],
      artists: []
    },
    playlists: [],
    ...overrides
  };
};
