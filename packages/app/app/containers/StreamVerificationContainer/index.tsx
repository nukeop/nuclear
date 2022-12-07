import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { StreamVerification } from '@nuclear/ui';
import { rest } from '@nuclear/core';

import { queue as queueSelector } from '../../selectors/queue';
import { QueueItem } from '../../reducers/queue';
import { isString } from 'lodash';
import { pluginsSelectors } from '../../selectors/plugins';

const StreamMappingsService = new rest.NuclearStreamMappingsService(
  process.env.NUCLEAR_SERVICES_URL,
  process.env.NUCLEAR_SERVICES_ANON_KEY
);

export const StreamVerificationContainer: React.FC = () => {
  const { t } = useTranslation('queue');
  const queue = useSelector(queueSelector);
  const selectedStreamProvider = useSelector(pluginsSelectors.selected)?.streamProviders;
  const currentTrack: QueueItem = queue.queueItems[queue.currentSong];

  useEffect(() => {
    if (currentTrack) {
      StreamMappingsService.getStreamMappingsByArtistAndTitle(
        isString(currentTrack.artist) ? currentTrack.artist : currentTrack.artist.name,
        currentTrack.name,
        selectedStreamProvider
      );
    }
  }, [currentTrack]);

  return <StreamVerification 
    status='unknown'
    tooltipStrings={{
      unknown: t('stream-verification.tooltip.unknown'),
      unverified: t('stream-verification.tooltip.unverified'),
      weakly_verified: t('stream-verification.tooltip.weakly-verified'),
      verified: t('stream-verification.tooltip.verified'),
      verified_by_user: t('stream-verification.tooltip.verified-by-user')
    }}
    streamStatusStrings={{
      unknown: t('stream-verification.stream-status.unknown'),
      unverified: t('stream-verification.stream-status.unverified'),
      weakly_verified: t('stream-verification.stream-status.weakly-verified'),
      verified: t('stream-verification.stream-status.verified'),
      verified_by_user: t('stream-verification.stream-status.verified-by-user')
    }}
    textVerify={t('stream-verification.verify')}
  />;
};
