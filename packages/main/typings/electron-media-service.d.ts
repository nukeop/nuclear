declare module 'electron-media-service' {
  export type MediaState = 'playing' | 'paused' | 'stopped';

  export interface MediaMetadata {
    title: string;
    artist: string;
    album: string;
    albumArt: string;
    state: MediaState;
    id: number;
    currentTime: number;
    duration: number;

  }

  class MediaService {
    startService();
    on(event: string, handler: (param?: any) => void);
    setMetaData(meta: MediaMetadata);
  }

  export default MediaService;
}