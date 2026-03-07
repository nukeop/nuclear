import type {
  PlaybackHost,
  PlaybackListener,
  PlaybackState,
  RepeatMode,
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

  getVolume(): Promise<number> {
    return this.#withHost((host) => host.getVolume());
  }

  setVolume(volume: number): Promise<void> {
    return this.#withHost((host) => host.setVolume(volume));
  }

  isMuted(): Promise<boolean> {
    return this.#withHost((host) => host.isMuted());
  }

  setMuted(muted: boolean): Promise<void> {
    return this.#withHost((host) => host.setMuted(muted));
  }

  isShuffleEnabled(): Promise<boolean> {
    return this.#withHost((host) => host.isShuffleEnabled());
  }

  setShuffleEnabled(enabled: boolean): Promise<void> {
    return this.#withHost((host) => host.setShuffleEnabled(enabled));
  }

  getRepeatMode(): Promise<RepeatMode> {
    return this.#withHost((host) => host.getRepeatMode());
  }

  setRepeatMode(mode: RepeatMode): Promise<void> {
    return this.#withHost((host) => host.setRepeatMode(mode));
  }
}
