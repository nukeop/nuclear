import {
  GaugeIcon,
  HeadphonesIcon,
  ListMusicIcon,
  SearchIcon,
} from 'lucide-react';
import { FC, useState } from 'react';
import { Trans } from 'react-i18next';

import { useTranslation } from '@nuclearplayer/i18n';
import type { MetadataProvider } from '@nuclearplayer/plugin-sdk';
import { ScrollableArea, ViewShell } from '@nuclearplayer/ui';

import { useProviders } from '../../hooks/useProviders';
import { ProviderInfoSection } from './components/ProviderInfoSection';
import { ProviderKindSection } from './components/ProviderKindSection';
import { ProviderPill } from './components/ProviderPill';

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
          metadata: (
            <ProviderPill
              Icon={SearchIcon}
              color="yellow"
              className="mx-1 align-middle"
            />
          ),
          streaming: (
            <ProviderPill
              Icon={HeadphonesIcon}
              color="cyan"
              className="mx-1 align-middle"
            />
          ),
        }}
      />
    ) : undefined;

  const warnings = metadataProviders
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
    <ViewShell data-testid="sources-view" title={t('title')}>
      <div className="flex h-full w-full items-start justify-center">
        <ScrollableArea className="max-w-120 flex-1 gap-4 overflow-hidden">
          <ProviderKindSection
            kind="metadata"
            Icon={SearchIcon}
            onValueChange={setActiveMetadataId}
            warnings={warnings}
          />
          <ProviderKindSection
            kind="streaming"
            Icon={HeadphonesIcon}
            value={lockedStreamingId}
            disabled={!!lockedStreamingId}
            lockedReason={lockedReason}
          />
          <ProviderInfoSection
            kind="dashboard"
            Icon={GaugeIcon}
            color="purple"
          />
          <ProviderInfoSection
            kind="playlists"
            Icon={ListMusicIcon}
            color="green"
          />
        </ScrollableArea>
      </div>
    </ViewShell>
  );
};
