import type { Queue, Track } from '@nuclearplayer/model';
import type { AttributedLyrics } from '@nuclearplayer/plugin-sdk';

import type {
  PlaybackState,
  SettingsState,
} from '../../remoteControl/remoteStore';
import {
  LineSyncedLyricsBuilder,
  PlainLyricsBuilder,
} from '../builders/LyricsBuilders';
import { createQueueItem, createTrack } from './queue';

export const REMOTE_QUEUE: Queue = {
  currentIndex: 0,
  items: [
    { ...createQueueItem('First Test Track'), status: 'success' },
    createQueueItem('Second Test Track'),
  ],
};

export const REMOTE_EMPTY_QUEUE: Queue = {
  currentIndex: 0,
  items: [],
};

export const REMOTE_SEARCH_TRACKS: Track[] = [
  createTrack('First Search Result'),
  createTrack('Second Search Result'),
];

export const REMOTE_PLAYBACK: PlaybackState = {
  status: 'playing',
  seek: 45,
  duration: 240,
};

export const REMOTE_SETTINGS: SettingsState = {
  shuffle: false,
  repeat: 'off',
  discovery: false,
  language: 'en_US',
  dark: false,
  themeId: 'nuclear:default',
  lyricsTextSize: 1,
};

const TEST_PROVIDER = {
  providerId: 'test-lyrics',
  providerName: 'Test Lyrics',
};

export const REMOTE_SYNCED_LYRICS: AttributedLyrics[] = [
  {
    ...TEST_PROVIDER,
    lyrics: new LineSyncedLyricsBuilder()
      .withLine(40000, 50000, 'Neon rain on the overpass')
      .withLine(50000, 60000, 'Counting static in the glass')
      .withLine(60000, 70000, 'Every signal fades too fast')
      .build(),
  },
];

export const REMOTE_PLAIN_LYRICS: AttributedLyrics[] = [
  {
    ...TEST_PROVIDER,
    lyrics: new PlainLyricsBuilder()
      .withLine('Paper boats in a parking lot')
      .withLine('Sinking slow in the summer heat')
      .build(),
  },
];

export const REMOTE_INSTRUMENTAL_LYRICS: AttributedLyrics[] = [
  {
    ...TEST_PROVIDER,
    lyrics: { type: 'instrumental', metadata: {} },
  },
];

export const REMOTE_LYRICS_FOR_NEXT_TRACK: AttributedLyrics[] = [
  {
    ...TEST_PROVIDER,
    lyrics: new LineSyncedLyricsBuilder()
      .withLine(0, 30000, 'Wake me when the tape runs out')
      .withLine(30000, 60000, 'Hum the chorus, skip the doubt')
      .build(),
  },
];

export const REMOTE_LYRICS_FROM_TWO_SOURCES: AttributedLyrics[] = [
  ...REMOTE_SYNCED_LYRICS,
  {
    ...REMOTE_PLAIN_LYRICS[0],
    providerId: 'other-lyrics',
    providerName: 'Other Lyrics',
  },
];
