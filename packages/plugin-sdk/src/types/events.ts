import type { Track } from '@nuclearplayer/model';

export type PluginEventMap = {
  trackFinished: Track;
  trackStarted: Track;
  playbackPaused: { positionMs: number };
  playbackResumed: { positionMs: number };
  playbackSeeked: { fromMs: number; toMs: number };
  playbackStopped: { positionMs: number };
  playbackSkipped: { positionMs: number };
};

export type PluginEventListener<E extends keyof PluginEventMap> = (
  payload: PluginEventMap[E],
) => Promise<void>;

export type EventsHost = {
  on<E extends keyof PluginEventMap>(
    event: E,
    listener: PluginEventListener<E>,
  ): () => void;

  emit<E extends keyof PluginEventMap>(
    event: E,
    payload: PluginEventMap[E],
  ): void;
};
