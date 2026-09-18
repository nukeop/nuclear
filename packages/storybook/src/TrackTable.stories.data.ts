import { Track } from '@nuclearplayer/model';
import { TrackTableLabels } from '@nuclearplayer/ui';

export const labels: TrackTableLabels = {
  headers: {
    artist: 'Artist',
    title: 'Title',
    album: 'Album',
    duration: 'Duration',
  },
  favorite: 'Add to favorites',
  unfavorite: 'Remove from favorites',
  playAll: 'Play all',
  addAllToQueue: 'Add all to queue',
  addToQueue: 'Add to queue',
  trackOptions: 'Track options',
  remove: 'Remove from list',
  filterPlaceholder: 'Filter tracks',
};

export const tracks: Track[] = [
  {
    trackNumber: 1,
    artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
    title: 'Why Does it Hurt When I Pee?',
    artists: [{ name: 'Frank Zappa', roles: [] }],
    album: {
      title: "Joe's Garage",
      artists: [
        { name: 'Frank Zappa', source: { provider: 'local', id: '1' } },
      ],
      source: { provider: 'local', id: '1' },
    },
    source: { provider: 'local', id: '1' },
    durationMs: 78 * 1000,
  },
  {
    trackNumber: 2,
    artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
    title: 'The Return of the Son of Monster Magnet',
    artists: [{ name: 'Frank Zappa', roles: [] }],
    album: {
      title: 'Freak Out!',
      artists: [
        { name: 'Frank Zappa', source: { provider: 'local', id: '1' } },
      ],
      source: { provider: 'local', id: '2' },
    },
    source: { provider: 'local', id: '2' },
    durationMs: 45 * 1000,
  },
  {
    trackNumber: 3,
    artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
    title: 'Waka/Jawaka',
    artists: [{ name: 'Frank Zappa', roles: [] }],
    album: {
      title: 'Waka/Jawaka',
      artists: [
        { name: 'Frank Zappa', source: { provider: 'local', id: '1' } },
      ],
      source: { provider: 'local', id: '3' },
    },
    source: { provider: 'local', id: '3' },
    durationMs: 217 * 1000,
  },
];
