import type { QueueItem } from '@nuclearplayer/model';

import { useQueueStore } from '../stores/queue/queueStore';

export const useCurrentQueueItem = (): QueueItem | undefined => {
  return useQueueStore((state) => state.getCurrentItem());
};
