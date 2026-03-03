import type {
  AlbumRef,
  ArtistRef,
  PlaylistRef,
  Track,
} from '@nuclearplayer/model';

const TEST_PROVIDER_ID = 'test-dashboard-provider';

const testSource = (id: string) => ({ provider: TEST_PROVIDER_ID, id });

export const TOP_TRACKS_RADIOHEAD: Track[] = [
  {
    title: 'Everything In Its Right Place',
    artists: [{ name: 'Radiohead', roles: [] }],
    artwork: {
      items: [
        {
          url: 'https://img/kid-a.jpg',
          purpose: 'thumbnail' as const,
          width: 64,
        },
      ],
    },
    source: testSource('track-1'),
  },
  {
    title: 'Idioteque',
    artists: [{ name: 'Radiohead', roles: [] }],
    artwork: {
      items: [
        {
          url: 'https://img/kid-a.jpg',
          purpose: 'thumbnail' as const,
          width: 64,
        },
      ],
    },
    source: testSource('track-2'),
  },
];

export const TOP_ARTISTS_DASHBOARD: ArtistRef[] = [
  {
    name: 'Radiohead',
    artwork: {
      items: [
        {
          url: 'https://img/radiohead.jpg',
          purpose: 'avatar' as const,
          width: 300,
        },
      ],
    },
    source: testSource('artist-1'),
  },
  {
    name: 'Björk',
    artwork: {
      items: [
        {
          url: 'https://img/bjork.jpg',
          purpose: 'avatar' as const,
          width: 300,
        },
      ],
    },
    source: testSource('artist-2'),
  },
];

export const TOP_ALBUMS_DASHBOARD: AlbumRef[] = [
  {
    title: 'Kid A',
    artists: [{ name: 'Radiohead', source: testSource('artist-1') }],
    artwork: {
      items: [
        {
          url: 'https://img/kid-a.jpg',
          purpose: 'cover' as const,
          width: 300,
        },
      ],
    },
    source: testSource('album-1'),
  },
];

export const EDITORIAL_PLAYLISTS_DASHBOARD: PlaylistRef[] = [
  {
    id: 'playlist-1',
    name: 'Art Rock Essentials',
    artwork: {
      items: [
        {
          url: 'https://img/art-rock.jpg',
          purpose: 'cover' as const,
          width: 300,
        },
      ],
    },
    source: testSource('playlist-1'),
  },
];

export const EDITORIAL_PLAYLISTS_WITH_URL: PlaylistRef[] = [
  {
    id: 'playlist-1',
    name: 'Art Rock Essentials',
    artwork: {
      items: [
        {
          url: 'https://img/art-rock.jpg',
          purpose: 'cover' as const,
          width: 300,
        },
      ],
    },
    source: {
      ...testSource('playlist-1'),
      url: 'https://music.example.com/playlist/12345',
    },
  },
];

export const NEW_RELEASES_DASHBOARD: AlbumRef[] = [
  {
    title: 'In Rainbows',
    artists: [{ name: 'Radiohead', source: testSource('artist-1') }],
    artwork: {
      items: [
        {
          url: 'https://img/in-rainbows.jpg',
          purpose: 'cover' as const,
          width: 300,
        },
      ],
    },
    source: testSource('album-2'),
  },
];
