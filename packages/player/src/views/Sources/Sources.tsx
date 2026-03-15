import {
  GaugeIcon,
  HeadphonesIcon,
  ListMusicIcon,
  SearchIcon,
} from 'lucide-react';
import { FC, ReactNode, useState } from 'react';
import { Trans } from 'react-i18next';

import { useTranslation } from '@nuclearplayer/i18n';
import type { MetadataProvider } from '@nuclearplayer/plugin-sdk';
import { Badge, ScrollableArea, ViewShell } from '@nuclearplayer/ui';

import { useProviders } from '../../hooks/useProviders';
import { ProviderInfoSection } from './components/ProviderInfoSection';
import { ProviderKindSection } from './components/ProviderKindSection';

type MissingProviderWarning = {
  providerName: string;
  message: string;
};

const ICON_SIZE = 14;
const PILL_ICON_SIZE = 10;

const MetadataPill: FC<{ children?: ReactNode }> = ({ children }) => (
  <Badge variant="pill" color="yellow" className="mx-1 gap-1 align-middle">
    <SearchIcon size={PILL_ICON_SIZE} />
    {children}
  </Badge>
);

const StreamingPill: FC<{ children?: ReactNode }> = ({ children }) => (
  <Badge variant="pill" color="cyan" className="mx-1 gap-1 align-middle">
    <HeadphonesIcon size={PILL_ICON_SIZE} />
    {children}
  </Badge>
);

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
          metadata: <MetadataPill />,
          streaming: <StreamingPill />,
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
    <ViewShell data-testid="sources-view" title={t('title')}>
      <div className="flex h-full w-full items-start justify-center">
        <ScrollableArea className="max-w-120 flex-1 gap-4 overflow-hidden">
          <ProviderKindSection
            kind="metadata"
            icon={<SearchIcon size={ICON_SIZE} />}
            onValueChange={setActiveMetadataId}
            warnings={warnings}
          />
          <ProviderKindSection
            kind="streaming"
            icon={<HeadphonesIcon size={ICON_SIZE} />}
            value={lockedStreamingId}
            disabled={!!lockedStreamingId}
            lockedReason={lockedReason}
          />
          <ProviderInfoSection
            kind="dashboard"
            icon={<GaugeIcon size={ICON_SIZE} />}
            pillIcon={<GaugeIcon size={PILL_ICON_SIZE} />}
            color="purple"
          />
          <ProviderInfoSection
            kind="playlists"
            icon={<ListMusicIcon size={ICON_SIZE} />}
            pillIcon={<ListMusicIcon size={PILL_ICON_SIZE} />}
            color="green"
          />
        </ScrollableArea>
      </div>
    </ViewShell>
  );
};
