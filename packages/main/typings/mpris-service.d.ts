/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'mpris-service' {
  interface Settings {
    name: string;
    identity: string;
    supportedMimeTypes: string[];
    supportedUriSchemes: string[];
    supportedInterfaces: string[];
  }

  export interface MprisPlaylist {
    Id: string;
    Name: string;
    Icon: string;
  }


  export interface MprisMeta {
    id: string;
    'mpris:trackid'?: string;
    'mpris:artUrl'?: string;
    'mpris:length'?: number;
    'xesam:title'?: string;
    'xesam:artist'?: string[];
    'xesam:album'?: number;
  }


  enum loopStatus {
    PLAYLIST = 'playlist',
    NONE = 'none',
    TRACK = 'track',
  }

  enum playbackStatus {
    PLAYING = 'playing',
    PAUSED = 'paused',
    STOPPED = 'stopped',
  }

  export type LoopStatus = loopStatus;
  export type PlaybackStatus = playbackStatus;

  class MprisService {
    static LOOP_STATUS_PLAYLIST: loopStatus.PLAYLIST;
    static LOOP_STATUS_TRACK: loopStatus.TRACK;
    static LOOP_STATUS_NONE: loopStatus.NONE;

    static PLAYBACK_STATUS_PLAYING: playbackStatus.PLAYING;
    static PLAYBACK_STATUS_PAUSED: playbackStatus.PAUSED;
    static PLAYBACK_STATUS_STOPPED: playbackStatus.STOPPED;

    playlists: MprisPlaylist[];
    shuffle: boolean;
    loopStatus: LoopStatus;
    playbackStatus: PlaybackStatus;
    volume: number;
    canControl: boolean;
    canEditTracks: boolean;
    metadata: MprisMeta;
    constructor(settings: Settings);
    getPlaylistIndex(id: string): number;
    objectPath(path: string): string;
    setActivePlaylist(id: string): void;
    setPlaylists(playlists: any[]): void;
    getTrackIndex(id: string): number;
    on(eventName: string, cb: (...args: any[]) => void): void;
  }
  export default MprisService;
}
