import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@nuclearplayer/i18n';
import type { StreamVerificationStatus } from '@nuclearplayer/model';

import { Logger } from '../services/logger';
import type { VerifiedStream } from '../services/streamVerification';
import { streamVerification } from '../services/streamVerification';
import { useCoreSetting } from './useCoreSetting';
import { useCurrentQueueItem } from './useCurrentQueueItem';

export const useStreamVerification = () => {
  const { t } = useTranslation('queue');
  const [isEnabled] = useCoreSetting<boolean>('playback.streamVerification');
  const [isServiceEnabled] = useCoreSetting<boolean>(
    'playback.streamVerificationService',
  );
  const currentItem = useCurrentQueueItem();
  const headCandidate = currentItem?.track.streamCandidates?.[0];
  const hasCandidates = Boolean(headCandidate);
  const [verifiedStream, setVerifiedStream] = useState<VerifiedStream>();
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (!currentItem || !hasCandidates || !isEnabled) {
      return;
    }

    let isCurrent = true;
    streamVerification.getVerifiedStream(currentItem.track).then((next) => {
      if (isCurrent) {
        setVerifiedStream(next);
        setIsLoading(false);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [currentItem?.id, hasCandidates, isEnabled, isServiceEnabled]);

  const getStatus = (): StreamVerificationStatus => {
    if (isLoading) {
      return 'loading';
    }
    if (!headCandidate || verifiedStream?.streamId !== headCandidate.id) {
      return 'unverified';
    }
    return verifiedStream.status;
  };

  const submit = async (action: 'verify' | 'unverify') => {
    if (!currentItem || !headCandidate) {
      return;
    }

    setIsBusy(true);
    try {
      const result = await streamVerification[action](
        currentItem.track,
        headCandidate.id,
      );
      if (result === 'failed') {
        toast.warning(t('streamVerification.notShared'));
      }
      setVerifiedStream(
        await streamVerification.getVerifiedStream(currentItem.track),
      );
    } catch (error) {
      Logger.streaming.error(
        `Failed to ${action} the stream: ${String(error)}`,
      );
      toast.error(t('streamVerification.failed'));
    } finally {
      setIsBusy(false);
    }
  };

  return {
    isVisible: Boolean(isEnabled && currentItem),
    status: getStatus(),
    isBusy,
    isDisabled: !headCandidate?.stream,
    onVerify: () => submit('verify'),
    onUnverify: () => submit('unverify'),
  };
};
