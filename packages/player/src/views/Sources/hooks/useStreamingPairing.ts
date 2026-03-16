import { useMemo } from 'react';

import type {
  MetadataProvider,
  ProviderDescriptor,
} from '@nuclearplayer/plugin-sdk';

type StreamingPairing = {
  lockedStreamingId: string | undefined;
  metadataName: string | undefined;
  streamingName: string | undefined;
};

export const useStreamingPairing = (
  activeMetadata: MetadataProvider | undefined,
  streamingProviders: ProviderDescriptor<'streaming'>[],
): StreamingPairing => {
  return useMemo(() => {
    const lockedStreamingId = activeMetadata?.streamingProviderId;
    const lockedStreamingProvider = lockedStreamingId
      ? streamingProviders.find((provider) => provider.id === lockedStreamingId)
      : undefined;

    return {
      lockedStreamingId,
      metadataName: activeMetadata?.name,
      streamingName: lockedStreamingProvider?.name,
    };
  }, [activeMetadata, streamingProviders]);
};
