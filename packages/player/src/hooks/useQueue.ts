import { useMemo } from 'react';

import { useQueueStore } from '../stores/queue/queueStore';

// You can't replace this with lodash pick because it causes infinite re-renders
export const useQueue = () => {
  const { items, currentIndex } = useQueueStore();

  return useMemo(() => ({ items, currentIndex }), [items, currentIndex]);
};
