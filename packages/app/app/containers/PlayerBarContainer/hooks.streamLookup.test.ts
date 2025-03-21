import { shouldSearchForStreams } from './hooks';
import { QueueStore, QueueItem } from '../../reducers/queue';
import { streamLookupRetriesLimit } from '../../actions/queue';

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

  it('returns false when an item with error has reached retries limit', () => {
    const queue = createQueueStore([
      { error: { message: 'error', details: 'details' }, streamLookupRetries: streamLookupRetriesLimit, artist: 'A', name: 'a' }
    ]);
    expect(shouldSearchForStreams(queue)).toBe(false);
  });

  it('returns true when at least one item has no stream and has not reached retries limit', () => {
    const queue = createQueueStore([
      { streams: [{ id: '1', source: '1', stream: 'http://test' }], artist: 'A', name: 'a' },
      { error: { message: 'error', details: 'details' }, streamLookupRetries: streamLookupRetriesLimit - 1, artist: 'B', name: 'b' }
    ]);
    expect(shouldSearchForStreams(queue)).toBe(true);
  });

  it('returns true when at least one item has no stream and no error/retries info', () => {
    const queue = createQueueStore([
      { streams: [], artist: 'A', name: 'a' }
    ]);
    expect(shouldSearchForStreams(queue)).toBe(true);
  });
});
