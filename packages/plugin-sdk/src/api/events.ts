import type {
  EventsHost,
  PluginEventListener,
  PluginEventMap,
} from '../types/events';

export class EventsAPI {
  #host?: EventsHost;

  constructor(host?: EventsHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: EventsHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Events host not available');
    }
    return fn(host);
  }

  on<E extends keyof PluginEventMap>(
    event: E,
    listener: PluginEventListener<E>,
  ): () => void {
    return this.#withHost((host) => host.on(event, listener));
  }
}
