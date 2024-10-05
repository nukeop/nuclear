/* eslint-disable @typescript-eslint/no-explicit-any */
export enum PlaybackStatus {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
  STOPPED = 'STOPPED',
}

export interface NuclearStatus {
  playbackStatus: PlaybackStatus;
  volume: number;
  shuffleQueue: boolean;
  loopAfterQueueEnd: boolean;
}

export interface NuclearMeta {
  uuid: string;
  artists: string[];
  streams?: Array<{ duration: number }>;
  name?: string;
  position?: number;
  duration?: number;
  thumbnail?: string;
  path?: string;
  album?: string;
  folder?: any;
  lastScanned?: number;
  local?: boolean;
  imageData?: Buffer;
}

export interface NuclearPlaylist {
  name: string;
  tracks: NuclearMeta[];
}

export type PartialExcept<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

export type TrackType = {
  local?: boolean;
  album?: string;
  artists?: string[];
  duration?: number | string;
  position?: number;
  playcount?: number | string;
  title?: string;
  name?: string;
  thumbnail?: string;
};
