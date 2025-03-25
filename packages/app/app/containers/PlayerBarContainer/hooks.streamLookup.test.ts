import { shouldSearchForStreams } from './hooks';
import { QueueStore, QueueItem } from '../../reducers/queue';

describe('shouldSearchForStreams', () => {
  const createQueueStore = (items: QueueItem[]): QueueStore => ({
    queueItems: items,
    currentTrack: 0
  });

  it('returns false when all items are local', () => {
    const queue = createQueueStore([
      { local: true, artist: 'A', name: 'a' },
      { local: true, artist: 'B', name: 'b' }
    ]);
    expect(shouldSearchForStreams(queue)).toBe(false);
  });

  it('returns false when all items have a valid stream', () => {
    const queue = createQueueStore([
      { streams: [{ id: '1', source: '1', stream: 'http://test' }], artist: 'A', name: 'a' },
      { streams: [{ id: '2', source: '1', stream: 'http://test2' }], artist: 'B', name: 'b' }
    ]);
    expect(shouldSearchForStreams(queue)).toBe(false);
  });

  it('returns true when at least one item has no stream and no error info', () => {
    const queue = createQueueStore([
      { streams: [], artist: 'A', name: 'a' }
    ]);
    expect(shouldSearchForStreams(queue)).toBe(true);
  });
});
