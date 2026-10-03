import type { Track } from '@nuclearplayer/model';

import type { AttributedLyrics, LyricsHost } from '../types/lyrics';

export class LyricsAPI {
  #host?: LyricsHost;

  constructor(host?: LyricsHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: LyricsHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Lyrics host not available');
    }
    return fn(host);
  }

  getLyricsForTrack(
    track: Track,
    providerId?: string,
  ): Promise<AttributedLyrics[]> {
    return this.#withHost((host) => host.getLyricsForTrack(track, providerId));
  }
}
