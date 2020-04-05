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
  artist: string;
  streams?: Array<{ duration: number }>;
  name?: string;
  position?: number;
  duration?: number;
  thumbnail?: string;
  path?: string;
  album?: string;
  folder?: any;

  imageData?: { format: string; data: Buffer };
}

export interface NuclearPlaylist {
  name: string;
  tracks: NuclearMeta[];
}
