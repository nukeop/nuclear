import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@nuclearplayer/i18n';
import type { StreamVerificationStatus, Track } from '@nuclearplayer/model';

import type { StreamCacheEntry } from '../apis/streamVerificationApi';
import {
  isSuccessCacheEntry,
  streamVerificationApi,
} from '../apis/streamVerificationApi';
import { useCoreSetting } from './useCoreSetting';
import { useCurrentQueueItem } from './useCurrentQueueItem';

const WEAK_VERIFICATION_THRESHOLD = 3;

const getStatus = (
  topStream: StreamCacheEntry,
  headCandidateId: string,
): StreamVerificationStatus => {
  if (
    !isSuccessCacheEntry(topStream) ||
    topStream.value.streamId !== headCandidateId
  ) {
    return 'unverified';
  }
  if (topStream.value.selfVerified) {
    return 'verifiedByUser';
  }
  if (topStream.value.score < WEAK_VERIFICATION_THRESHOLD) {
    return 'weaklyVerified';
  }
  return 'verified';
};

export const useStreamVerification = () => {
  const { t } = useTranslation('queue');
  const [isEnabled] = useCoreSetting<boolean>('playback.streamVerification');
  const currentItem = useCurrentQueueItem();
  const headCandidate = currentItem?.track.streamCandidates?.[0];
  const [status, setStatus] = useState<StreamVerificationStatus>('loading');
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    setStatus('loading');
    if (!currentItem || !headCandidate || !isEnabled) {
      return;
    }

    let isCurrent = true;
    streamVerificationApi
      .getTopStream(currentItem.track)
      .then((entry) => getStatus(entry, headCandidate.id))
      .catch(() => 'unverified' as const)
      .then((nextStatus) => {
        if (isCurrent) {
          setStatus(nextStatus);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [currentItem?.id, headCandidate?.id, isEnabled]);

  const submit = (
    write: (track: Track) => Promise<void>,
    statusAfter: StreamVerificationStatus,
  ) => {
    if (!currentItem) {
      return;
    }

    setIsBusy(true);
    write(currentItem.track)
      .then(() => setStatus(statusAfter))
      .catch(() => toast.error(t('streamVerification.failed')))
      .finally(() => setIsBusy(false));
  };

  return {
    isVisible: Boolean(isEnabled && currentItem),
    status,
    isBusy,
    isDisabled: !headCandidate?.stream,
    onVerify: () =>
      submit(
        (track) => streamVerificationApi.postStreamMapping(track),
        'verifiedByUser',
      ),
    onUnverify: () =>
      submit(
        (track) => streamVerificationApi.deleteStreamMapping(track),
        'unverified',
      ),
  };
};
