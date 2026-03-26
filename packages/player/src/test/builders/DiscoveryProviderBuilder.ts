import type { DiscoveryProvider } from '@nuclearplayer/plugin-sdk';

export class DiscoveryProviderBuilder {
  private provider: DiscoveryProvider;

  constructor() {
    this.provider = {
      id: 'test-discovery',
      kind: 'discovery',
      name: 'Test Discovery',
      getRecommendations: async () => [],
    };
  }

  withId(id: DiscoveryProvider['id']): this {
    this.provider.id = id;
    return this;
  }

  withName(name: DiscoveryProvider['name']): this {
    this.provider.name = name;
    return this;
  }

  withGetRecommendations(
    getRecommendations: DiscoveryProvider['getRecommendations'],
  ): this {
    this.provider.getRecommendations = getRecommendations;
    return this;
  }

  build(): DiscoveryProvider {
    return this.provider;
  }
}
