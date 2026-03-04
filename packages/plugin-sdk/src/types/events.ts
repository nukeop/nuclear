import type { Track } from '@nuclearplayer/model';

export type PluginEventMap = {
  trackFinished: Track;
  trackStarted: Track;
};

export type PluginEventListener<E extends keyof PluginEventMap> = (
  payload: PluginEventMap[E],
) => void | Promise<void>;

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
