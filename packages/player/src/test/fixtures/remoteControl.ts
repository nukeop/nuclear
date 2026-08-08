import type { Queue, Track } from '@nuclearplayer/model';

import type {
  PlaybackState,
  SettingsState,
} from '../../remoteControl/remoteStore';
import { createQueueItem, createTrack } from './queue';

export const REMOTE_QUEUE: Queue = {
  currentIndex: 0,
  items: [
    { ...createQueueItem('Everything In Its Right Place'), status: 'success' },
    createQueueItem('Kid A'),
  ],
};

export const REMOTE_EMPTY_QUEUE: Queue = {
  currentIndex: 0,
  items: [],
};

export const REMOTE_SEARCH_TRACKS: Track[] = [
  createTrack('Idioteque'),
  createTrack('Morning Bell'),
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
};
