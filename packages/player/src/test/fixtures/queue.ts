import type { QueueItem } from '@nuclearplayer/model';

export const createQueueItem = (title: string): QueueItem => ({
  id: `item-${title.toLowerCase().replace(/\s+/g, '-')}`,
  track: {
    title,
    artists: [{ name: 'Test Artist', roles: ['primary'] }],
    source: { provider: 'test', id: title.toLowerCase() },
  },
  status: 'idle',
  addedAtIso: new Date().toISOString(),
});
