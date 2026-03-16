import { useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type {
  MetadataProvider,
  ProviderDescriptor,
} from '@nuclearplayer/plugin-sdk';

export const useProviderWarnings = (
  metadataProviders: MetadataProvider[],
  streamingProviders: ProviderDescriptor<'streaming'>[],
): {
  providerName: string;
  message: string;
}[] => {
  const { t } = useTranslation('sources');

  return useMemo(
    () =>
      metadataProviders
        .filter(
          (provider) =>
            provider.streamingProviderId &&
            !streamingProviders.some(
              (sp) => sp.id === provider.streamingProviderId,
            ),
        )
        .map((provider) => ({
          providerName: provider.name,
          message: t('missingStreamingProvider', {
            providerId: provider.streamingProviderId,
          }),
        })),
    [metadataProviders, streamingProviders, t],
  );
};
