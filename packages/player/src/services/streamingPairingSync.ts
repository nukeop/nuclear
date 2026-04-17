import type {
  MetadataProvider,
  ProvidersHost,
} from '@nuclearplayer/plugin-sdk';

import { useProvidersStore } from '../stores/providersStore';

const tryPairStreaming = (host: ProvidersHost): void => {
  const currentMetadataId = useProvidersStore.getState().active.metadata;
  if (!currentMetadataId) {
    return;
  }

  const metadataProvider = host.get<MetadataProvider>(
    currentMetadataId,
    'metadata',
  );
  if (!metadataProvider?.streamingProviderId) {
    return;
  }

  const currentStreamingId = useProvidersStore.getState().active.streaming;
  if (currentStreamingId === metadataProvider.streamingProviderId) {
    return;
  }

  const streamingProvider = host.get(
    metadataProvider.streamingProviderId,
    'streaming',
  );
  if (streamingProvider) {
    host.setActive('streaming', metadataProvider.streamingProviderId);
  }
};

export const setupStreamingPairingSync = (host: ProvidersHost): void => {
  let previousMetadataId: string | undefined;

  useProvidersStore.subscribe((state) => {
    const currentMetadataId = state.active.metadata;

    if (currentMetadataId !== previousMetadataId) {
      previousMetadataId = currentMetadataId;
      tryPairStreaming(host);
    }
  });
};
