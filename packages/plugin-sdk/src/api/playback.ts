import type {
  PlaybackHost,
  PlaybackListener,
  PlaybackState,
} from '../types/playback';

export class PlaybackAPI {
  #host?: PlaybackHost;

  constructor(host?: PlaybackHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: PlaybackHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Playback host not available');
    }
    return fn(host);
  }

  getState(): Promise<PlaybackState> {
    return this.#withHost((host) => host.getState());
  }

  play(): Promise<void> {
    return this.#withHost((host) => host.play());
  }

  pause(): Promise<void> {
    return this.#withHost((host) => host.pause());
  }

  stop(): Promise<void> {
    return this.#withHost((host) => host.stop());
  }

  toggle(): Promise<void> {
    return this.#withHost((host) => host.toggle());
  }

  seekTo(seconds: number): Promise<void> {
    return this.#withHost((host) => host.seekTo(seconds));
  }

  subscribe(listener: PlaybackListener): () => void {
    return this.#withHost((host) => host.subscribe(listener));
  }
}
