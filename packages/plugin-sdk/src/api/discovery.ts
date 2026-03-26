import type { Track } from '@nuclearplayer/model';

import type { DiscoveryHost, DiscoveryOptions } from '../types/discovery';

export class DiscoveryAPI {
  #host?: DiscoveryHost;

  constructor(host?: DiscoveryHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: DiscoveryHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Discovery host not available');
    }
    return fn(host);
  }

  getRecommendations(
    context: Track[],
    options: DiscoveryOptions,
    providerId?: string,
  ): Promise<Track[]> {
    return this.#withHost((host) =>
      host.getRecommendations(context, options, providerId),
    );
  }
}
