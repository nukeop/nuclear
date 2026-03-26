import {
  BoomBoxIcon,
  GaugeIcon,
  HeadphonesIcon,
  ListMusicIcon,
  SearchIcon,
} from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { MetadataProvider } from '@nuclearplayer/plugin-sdk';
import { ScrollableArea, ViewShell } from '@nuclearplayer/ui';

import { useProviders } from '../../hooks/useProviders';
import { providersHost } from '../../services/providersHost';
import { useProvidersStore } from '../../stores/providersStore';
import { LockedReasonMessage } from './components/LockedReasonMessage';
import { ProviderInfoSection } from './components/ProviderInfoSection';
import { ProviderKindSection } from './components/ProviderKindSection';
import { useProviderWarnings } from './hooks/useProviderWarnings';
import { useStreamingPairing } from './hooks/useStreamingPairing';

export const Sources: FC = () => {
  const { t } = useTranslation('sources');
  const metadataProviders = useProviders('metadata') as MetadataProvider[];
  const streamingProviders = useProviders('streaming');
  const activeMetadataId = useProvidersStore((state) => state.active.metadata);
  const activeStreamingId = useProvidersStore(
    (state) => state.active.streaming,
  );
  const activeDiscoveryId = useProvidersStore(
    (state) => state.active.discovery,
  );

  const activeMetadata = metadataProviders.find(
    (provider) => provider.id === activeMetadataId,
  );

  const { lockedStreamingId, metadataName, streamingName } =
    useStreamingPairing(activeMetadata, streamingProviders);

  const warnings = useProviderWarnings(metadataProviders, streamingProviders);

  return (
    <ViewShell data-testid="sources-view" title={t('title')}>
      <div className="flex h-full w-full items-start justify-center">
        <ScrollableArea className="max-w-120 flex-1 gap-4 overflow-hidden">
          <ProviderKindSection
            kind="metadata"
            Icon={SearchIcon}
            value={activeMetadataId}
            onValueChange={(providerId) =>
              providersHost.setActive('metadata', providerId)
            }
            warnings={warnings}
          />
          <ProviderKindSection
            kind="streaming"
            Icon={HeadphonesIcon}
            value={lockedStreamingId ?? activeStreamingId}
            disabled={!!lockedStreamingId}
            lockedReason={
              metadataName && streamingName ? (
                <LockedReasonMessage
                  metadataName={metadataName}
                  streamingName={streamingName}
                />
              ) : undefined
            }
            onValueChange={(providerId) =>
              providersHost.setActive('streaming', providerId)
            }
          />
          <ProviderKindSection
            kind="discovery"
            Icon={BoomBoxIcon}
            value={activeDiscoveryId}
            onValueChange={(providerId) =>
              providersHost.setActive('discovery', providerId)
            }
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
