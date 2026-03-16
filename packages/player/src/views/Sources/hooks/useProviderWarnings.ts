import { useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type {
  MetadataProvider,
  ProviderDescriptor,
} from '@nuclearplayer/plugin-sdk';

export type ProviderWarning = {
  providerName: string;
  message: string;
};

export const useProviderWarnings = (
  metadataProviders: MetadataProvider[],
  streamingProviders: ProviderDescriptor<'streaming'>[],
): ProviderWarning[] => {
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
