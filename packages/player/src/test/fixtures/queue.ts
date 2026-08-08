import type { QueueItem, Track } from '@nuclearplayer/model';

export const createTrack = (title: string): Track => ({
  title,
  artists: [{ name: 'Test Artist', roles: ['primary'] }],
  source: { provider: 'test', id: title.toLowerCase() },
});

export const createQueueItem = (title: string): QueueItem => ({
  id: `item-${title.toLowerCase().replace(/\s+/g, '-')}`,
  track: createTrack(title),
  status: 'idle',
  addedAtIso: new Date().toISOString(),
});
