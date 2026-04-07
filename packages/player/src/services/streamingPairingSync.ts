import type {
  MetadataProvider,
  ProvidersHost,
} from '@nuclearplayer/plugin-sdk';

import { useProvidersStore } from '../stores/providersStore';

export const setupStreamingPairingSync = (host: ProvidersHost): void => {
  let previousMetadataId: string | undefined;

  useProvidersStore.subscribe((state) => {
    const currentMetadataId = state.active.metadata;

    if (currentMetadataId !== previousMetadataId) {
      previousMetadataId = currentMetadataId;
      if (currentMetadataId) {
        const metadataProvider = host.get<MetadataProvider>(
          currentMetadataId,
          'metadata',
        );
        if (metadataProvider?.streamingProviderId) {
          host.setActive('streaming', metadataProvider.streamingProviderId);
        }
      }
    }
  });
};
