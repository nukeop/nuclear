import { useEffect, useRef } from 'react';

import { eventBus } from '../services/eventBus';
import { Logger } from '../services/logger';
import { streamResolution } from '../services/streamResolution';
import { useQueueStore } from '../stores/queueStore';
import { useSoundStore } from '../stores/soundStore';

export const useStreamRecovery = (maxAttemptsPerItem = 2): void => {
  const recoveringItemIdRef = useRef<string | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    return eventBus.on('streamSourceInvalid', async () => {
      const item = useQueueStore.getState().getCurrentItem();
      if (!item) {
        return;
      }

      if (item.id !== recoveringItemIdRef.current) {
        recoveringItemIdRef.current = item.id;
        attemptsRef.current = 0;
      }
      if (attemptsRef.current >= maxAttemptsPerItem) {
        Logger.streaming.warn(
          `Stream for '${item.track.title}' became invalid again after ${attemptsRef.current} recoveries; giving up`,
        );
        useQueueStore.getState().updateItemState(item.id, {
          status: 'error',
          error: 'streaming:errors.streamRecoveryFailed',
        });
        return;
      }
      attemptsRef.current += 1;

      Logger.streaming.warn(
        `Stream for '${item.track.title}' became invalid; resolving a fresh URL (attempt ${attemptsRef.current})`,
      );

      await streamResolution.resolveWithFreshStreams(item, {
        autoPlay: true,
        startPositionSeconds: useSoundStore.getState().seek,
      });
    });
  }, [maxAttemptsPerItem]);
};
