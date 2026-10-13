import { useRemoteStore } from './remoteStore';

export const useRemoteCurrentItem = () =>
  useRemoteStore((state) => state.queue?.items[state.queue.currentIndex]);
