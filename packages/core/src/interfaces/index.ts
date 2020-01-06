import { App } from 'electron';
import { ReactType, ReactDOM } from 'react';
import { Store } from 'redux';

export enum PlaybackStatus {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
  STOPPED = 'STOPPED',
}

export interface PluginApi {
  React: ReactType;
  ReactDOM: ReactDOM;
  app: App;
  store: Store;
}

export interface NuclearPlugin {
  name: string;
  description: string;
  image?: string;
  author: string;
  onLoad: (api: PluginApi) => void;
}

export interface NuclearStatus {
  playbackStatus: PlaybackStatus;
  volume: number;
  shuffleQueue: boolean;
  loopAfterQueueEnd: boolean;
}

export interface NuclearMeta {
  uuid: string;
  thumbnail: string;
  streams: Array<{ duration: number }>;
  name: string;
  artist: string;
}

export interface NuclearStream {
  uuid: string;
  title?: string;
  duration?: number;
  source: 'Local' | string;
  stream: string;
  thumbnail?: string;
}

export interface NuclearBrutMeta {
  uuid: string;
  duration?: number;
  path: string;
  name?: string;
  pos: number;
  album?: string;
  artist: { name: string };
  genre?: string[];
  year?: string | number;
  loading: boolean;
  local?: boolean;
  image: Array<{ '#text': string } | undefined>;
  streams?: NuclearStream[];
}

export interface NuclearPlaylist {
  name: string;
  tracks: NuclearMeta[];
}
