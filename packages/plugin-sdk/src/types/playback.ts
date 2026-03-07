import type { RepeatMode } from '@nuclearplayer/model';

export type { RepeatMode } from '@nuclearplayer/model';

export type PlaybackStatus = 'playing' | 'paused' | 'stopped';

export type PlaybackState = {
  status: PlaybackStatus;
  seek: number;
  duration: number;
};

export type PlaybackListener = (state: PlaybackState) => void;

export type PlaybackHost = {
  getState: () => Promise<PlaybackState>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  toggle: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  subscribe: (listener: PlaybackListener) => () => void;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  isMuted: () => Promise<boolean>;
  setMuted: (muted: boolean) => Promise<void>;
  isShuffleEnabled: () => Promise<boolean>;
  setShuffleEnabled: (enabled: boolean) => Promise<void>;
  getRepeatMode: () => Promise<RepeatMode>;
  setRepeatMode: (mode: RepeatMode) => Promise<void>;
};
