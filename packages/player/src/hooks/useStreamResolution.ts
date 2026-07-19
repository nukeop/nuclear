import { useEffect, useRef } from 'react';

import type { QueueItem } from '@nuclearplayer/model';

import { resolveStream } from '../services/streamResolution';
import { useQueueStore } from '../stores/queueStore';

const buildResolutionKey = (item: QueueItem): string => {
  const headCandidate = item.track.streamCandidates?.[0];
  return [item.id, headCandidate?.id, headCandidate?.failed].join(':');
};

export const useStreamResolution = (): void => {
  const resolutionKeyRef = useRef<string | null>(null);
  const isFirstResolutionRef = useRef(true);

  useEffect(() => {
    const onCurrentItemChanged = (currentItem: QueueItem | undefined): void => {
      if (!currentItem) {
        return;
      }

      const resolutionKey = buildResolutionKey(currentItem);
      if (resolutionKey === resolutionKeyRef.current) {
        return;
      }
      resolutionKeyRef.current = resolutionKey;

      if (currentItem.status === 'loading') {
        return;
      }

      const autoPlay = !isFirstResolutionRef.current;
      isFirstResolutionRef.current = false;
      void resolveStream(currentItem, { autoPlay });
    };

    const unsubscribe = useQueueStore.subscribe((state) => {
      onCurrentItemChanged(state.getCurrentItem());
    });

    onCurrentItemChanged(useQueueStore.getState().getCurrentItem());

    return unsubscribe;
  }, []);
};
