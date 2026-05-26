import { create } from 'zustand';

import type { Queue, RepeatMode } from '@nuclearplayer/model';
import { DEFAULT_THEME_ID } from '@nuclearplayer/themes';

import type { EventSourceStatus } from './useEventSource';

export type PlaybackState = {
  status: 'playing' | 'paused' | 'stopped';
  seek: number;
  duration: number;
};

export type SettingsState = {
  shuffle: boolean;
  repeat: RepeatMode;
  discovery: boolean;
  language: string;
  dark: boolean;
  themeId: string;
};

type RemoteStore = {
  queue: Queue | null;
  playback: PlaybackState | null;
  settings: SettingsState;
  connectionStatus: EventSourceStatus;

  setQueue: (queue: Queue) => void;
  setPlayback: (playback: PlaybackState) => void;
  setSettings: (settings: SettingsState) => void;
  setConnectionStatus: (status: EventSourceStatus) => void;
};

export const useRemoteStore = create<RemoteStore>((set) => ({
  queue: null,
  playback: null,
  settings: {
    shuffle: false,
    repeat: 'off',
    discovery: false,
    language: 'en_US',
    dark: false,
    themeId: DEFAULT_THEME_ID,
  },
  connectionStatus: 'init',

  setQueue: (queue) => set({ queue }),
  setPlayback: (playback) => set({ playback }),
  setSettings: (settings) => set({ settings }),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
}));
