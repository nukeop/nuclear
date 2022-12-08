import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { getTrackArtist, StreamVerification } from '@nuclear/ui';
import { StreamVerificationProps } from '@nuclear/ui/lib/components/StreamVerification';
import { rest } from '@nuclear/core';

import { queue as queueSelector } from '../../selectors/queue';
import { QueueItem } from '../../reducers/queue';
import { head, isString } from 'lodash';
import { pluginsSelectors } from '../../selectors/plugins';
import { settingsSelector } from '../../selectors/settings';

const StreamMappingsService = new rest.NuclearStreamMappingsService(
  process.env.NUCLEAR_SERVICES_URL,
  process.env.NUCLEAR_SERVICES_ANON_KEY
);

const WEAK_VERIFICATION_THRESHOLD = 3;

export const StreamVerificationContainer: React.FC = () => {
  const { t } = useTranslation('queue');
  const queue = useSelector(queueSelector);
  const settings = useSelector(settingsSelector);
  const selectedStreamProvider = useSelector(pluginsSelectors.selected)?.streamProviders;
  const currentTrack: QueueItem = queue.queueItems[queue.currentSong];
  const [isLoading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<StreamVerificationProps['status']>('unknown');

  useEffect(() => {
    if (currentTrack) {
      StreamMappingsService.getStreamMappingsByArtistAndTitle(
        getTrackArtist(currentTrack),
        currentTrack.name,
        selectedStreamProvider
      ).then(res => {
        const verifications = res.data?.[0]?.count;
        if (verifications === undefined) {
          setVerificationStatus('unverified');
        } else if (verifications < WEAK_VERIFICATION_THRESHOLD) {
          setVerificationStatus('weakly_verified');
        } else {
          setVerificationStatus('verified');
        }
      });
    }
  }, [currentTrack]);

  const onVerify = () => {
    if (currentTrack) {
      setLoading(true);
      StreamMappingsService.postStreamMapping({
        artist: getTrackArtist(currentTrack),
        title: currentTrack.name,
        source: selectedStreamProvider,
        stream_id: head(currentTrack.streams).source,
        author_id: settings?.userId
      }).then(() => {
        setVerificationStatus('verified_by_user');
      }).catch(() => {
        setVerificationStatus('unknown');
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  if (settings.compactQueueBar || !currentTrack) {
    return null;
  }

  return <StreamVerification 
    status={verificationStatus}
    isLoading={isLoading}
    onVerify={onVerify}
    onUnverify={() => {}}
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
