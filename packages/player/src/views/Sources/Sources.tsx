import { FC, useState } from 'react';
import { Trans } from 'react-i18next';

import { useTranslation } from '@nuclearplayer/i18n';
import type { MetadataProvider } from '@nuclearplayer/plugin-sdk';
import { Badge, ScrollableArea, ViewShell } from '@nuclearplayer/ui';

import { useProviders } from '../../hooks/useProviders';
import { ProviderKindSection } from './components/ProviderKindSection';

type MissingProviderWarning = {
  providerName: string;
  message: string;
};

export const Sources: FC = () => {
  const { t } = useTranslation('sources');
  const metadataProviders = useProviders('metadata') as MetadataProvider[];
  const streamingProviders = useProviders('streaming');
  const [activeMetadataId, setActiveMetadataId] = useState<string>();

  const activeMetadata = metadataProviders.find(
    (provider) => provider.id === activeMetadataId,
  );
  const lockedStreamingId = activeMetadata?.streamingProviderId;
  const lockedStreamingProvider = lockedStreamingId
    ? streamingProviders.find((provider) => provider.id === lockedStreamingId)
    : undefined;

  const lockedReason =
    activeMetadata && lockedStreamingProvider ? (
      <Trans
        i18nKey="sources:lockedReason"
        values={{
          metadataName: activeMetadata.name,
          streamingName: lockedStreamingProvider.name,
        }}
        components={{
          metadata: <Badge variant="pill" color="yellow" />,
          streaming: <Badge variant="pill" color="cyan" />,
        }}
      />
    ) : undefined;

  const warnings: MissingProviderWarning[] = metadataProviders
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
    }));

  return (
    <ViewShell data-testid="sources-view" title="Sources">
      <div className="flex h-full w-full items-start justify-center">
        <ScrollableArea className="max-w-100 flex-1 gap-4 overflow-hidden">
          <ProviderKindSection
            kind="metadata"
            onValueChange={setActiveMetadataId}
            warnings={warnings}
          />
          <ProviderKindSection
            kind="streaming"
            value={lockedStreamingId}
            disabled={!!lockedStreamingId}
            lockedReason={lockedReason}
          />
        </ScrollableArea>
      </div>
    </ViewShell>
  );
};
