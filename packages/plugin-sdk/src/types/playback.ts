import type { Track } from '@nuclearplayer/model';

export type PlaybackStatus = 'playing' | 'paused' | 'stopped';

export type PlaybackState = {
  status: PlaybackStatus;
  seek: number;
  duration: number;
};

export type PlaybackListener = (state: PlaybackState) => void;

export type TrackFinishedListener = (track: Track) => void;

export type PlaybackHost = {
  getState: () => Promise<PlaybackState>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  toggle: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  subscribe: (listener: PlaybackListener) => () => void;
  onTrackFinished: (listener: TrackFinishedListener) => () => void;
};
