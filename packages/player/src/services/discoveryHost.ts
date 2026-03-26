import type { Track } from '@nuclearplayer/model';
import type {
  DiscoveryHost,
  DiscoveryOptions,
  DiscoveryProvider,
} from '@nuclearplayer/plugin-sdk';

import { providersHost } from './providersHost';

export const createDiscoveryHost = (): DiscoveryHost => ({
  async getRecommendations(
    context: Track[],
    options: DiscoveryOptions,
    providerId?: string,
  ): Promise<Track[]> {
    const resolvedId = providerId ?? providersHost.getActive('discovery');
    const provider = providersHost.get<DiscoveryProvider>(
      resolvedId,
      'discovery',
    );

    return provider!.getRecommendations(context, options);
  },
});

export const discoveryHost: DiscoveryHost = createDiscoveryHost();
