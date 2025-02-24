import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { logger } from '@nuclear/core';

import { getTrackArtist, StreamVerification } from '@nuclear/ui';
import { StreamVerificationProps } from '@nuclear/ui/lib/components/StreamVerification';
import { rest } from '@nuclear/core';

import { queue as queueSelector } from '../../selectors/queue';
import { QueueItem } from '../../reducers/queue';
import { head } from 'lodash';
import { pluginsSelectors } from '../../selectors/plugins';
import { settingsSelector } from '../../selectors/settings';
import { setStringOption } from '../../actions/settings';
import { isSuccessCacheEntry } from '@nuclear/core/src/rest/Nuclear/StreamMappings';

const WEAK_VERIFICATION_THRESHOLD = 3;

export const StreamVerificationContainer: React.FC = () => {
  const { t } = useTranslation('queue');
  const dispatch = useDispatch();
  const queue = useSelector(queueSelector);
  const settings = useSelector(settingsSelector);
  const selectedStreamProvider = useSelector(pluginsSelectors.selected)?.streamProviders;
  const currentTrack: QueueItem = queue.queueItems[queue.currentTrack];
  const [isLoading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<StreamVerificationProps['status']>('unknown');
  const StreamMappingsService = rest.NuclearStreamMappingsService.get(process.env.NUCLEAR_VERIFICATION_SERVICE_URL);

  useEffect(() => {
    setVerificationStatus('unknown');
    if (currentTrack) {
      StreamMappingsService.getTopStream(
        getTrackArtist(currentTrack),
        currentTrack.name,
        selectedStreamProvider,
        settings?.userId
      ).then(topStream => {
        if (isSuccessCacheEntry(topStream) && topStream.value.stream_id === head(currentTrack.streams)?.id) {
          if (topStream.value.score === undefined) {
            logger.error(`Failed to verify stream: ${currentTrack.name} by ${getTrackArtist(currentTrack)}`);
            setVerificationStatus('unverified');
          } else if (topStream.value.self_verified) {
            setVerificationStatus('verified_by_user');
          } else if (topStream.value.score < WEAK_VERIFICATION_THRESHOLD) {
            setVerificationStatus('weakly_verified');
          } else {
            setVerificationStatus('verified');
          }
        } else {
          setVerificationStatus('unverified');
        }
      })
        .catch((e) => {
          setVerificationStatus('unverified');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentTrack?.streams?.[0], settings?.userId, selectedStreamProvider]);

  useEffect(() => {
    if (settings.isReady && !settings?.userId) {
      dispatch(setStringOption('userId', v4()));
    }
  }, [settings.isLoading, settings.isReady]);

  const onVerify = () => {
    if (currentTrack && verificationStatus !== 'verified_by_user') {
      setLoading(true);
      StreamMappingsService.postStreamMapping({
        artist: getTrackArtist(currentTrack),
        title: currentTrack.name,
        source: selectedStreamProvider,
        stream_id: head(currentTrack.streams).id,
        author_id: settings?.userId
      }).then(() => {
        setVerificationStatus('verified_by_user');
      }).catch((e) => {
        logger.error(`Failed to verify stream: ${currentTrack.name} by ${getTrackArtist(currentTrack)}`);
        logger.error(e);
        setVerificationStatus('unknown');
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const onUnverify = () => {
    if (currentTrack && verificationStatus === 'verified_by_user') {
      setLoading(true);
      StreamMappingsService.deleteStreamMapping({
        artist: getTrackArtist(currentTrack),
        title: currentTrack.name,
        source: selectedStreamProvider,
        stream_id: head(currentTrack.streams).id,
        author_id: settings?.userId
      }).then(() => {
        setVerificationStatus('unverified');
      }).catch(() => {
        logger.error(`Failed to unverify stream: ${currentTrack.name} by ${getTrackArtist(currentTrack)}`);
        setVerificationStatus('verified_by_user');
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  if (settings.compactQueueBar || !currentTrack) {
    return null;
  }

  return settings?.isReady &&
    <StreamVerification
      status={verificationStatus}
      isLoading={isLoading}
      isDisabled={!currentTrack?.streams?.[0]?.stream}
      onVerify={onVerify}
      onUnverify={onUnverify}
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
      textUnverify={t('stream-verification.unverify')}
    />;
};
