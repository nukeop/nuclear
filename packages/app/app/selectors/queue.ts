import { RootState } from '../reducers';
import { QueueStore } from '../reducers/queue';

export const queue = (s: RootState) => s.queue as QueueStore;
