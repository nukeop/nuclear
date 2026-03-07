import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useQueueStore } from '../stores/queueStore';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { createMockTrack } from '../test/utils/mockTrack';
import { queueHost } from './queueHost';

describe('queueHost', () => {
  beforeEach(() => {
    const date = new Date(2025, 1, 1);
    vi.setSystemTime(date);
    resetInMemoryTauriStore();
    useQueueStore.setState({
      items: [],
      currentIndex: 0,
      isReady: false,
      isLoading: false,
    });
  });

  it('should get the current queue state', async () => {
    useQueueStore.setState({
      items: [
        {
          id: '1',
          track: createMockTrack('Track 1'),
          status: 'idle',
          addedAtIso: new Date().toISOString(),
        },
      ],
      currentIndex: 0,
    });

    const queue = await queueHost.getQueue();
    expect(queue.items).toHaveLength(1);
    expect(queue.items[0].track.title).toBe('Track 1');
    expect(queue.currentIndex).toBe(0);
  });

  it('should add tracks to queue', async () => {
    await queueHost.addToQueue([createMockTrack('Track 1')]);
    const queue = await queueHost.getQueue();
    expect(queue.items).toHaveLength(1);
    expect(queue.items[0].track.title).toBe('Track 1');
  });

  it('should clear queue', async () => {
    await queueHost.addToQueue([createMockTrack('Track 1')]);
    await queueHost.clearQueue();
    const queue = await queueHost.getQueue();
    expect(queue.items).toHaveLength(0);
  });

  it('should navigate to next track', async () => {
    await queueHost.addToQueue([
      createMockTrack('Track 1'),
      createMockTrack('Track 2'),
    ]);
    await queueHost.goToNext();
    const queue = await queueHost.getQueue();
    expect(queue.currentIndex).toBe(1);
  });

  it('should navigate to previous track', async () => {
    await queueHost.addToQueue([
      createMockTrack('Track 1'),
      createMockTrack('Track 2'),
    ]);
    await queueHost.goToIndex(1);
    await queueHost.goToPrevious();
    const queue = await queueHost.getQueue();
    expect(queue.currentIndex).toBe(0);
  });

  it('should subscribe to queue changes', async () => {
    const listener = vi.fn();
    const unsubscribe = queueHost.subscribe(listener);

    await queueHost.addToQueue([createMockTrack('Track 1')]);

    expect(listener).toHaveBeenCalled();
    const lastCall = listener.mock.calls[listener.mock.calls.length - 1][0];
    expect(lastCall.items).toHaveLength(1);
    expect(lastCall.items[0].track.title).toBe('Track 1');

    unsubscribe();
  });

  it('should subscribe to current item changes', async () => {
    const listener = vi.fn();
    const unsubscribe = queueHost.subscribeToCurrentItem(listener);

    await queueHost.addToQueue([
      createMockTrack('Track 1'),
      createMockTrack('Track 2'),
    ]);

    await queueHost.goToNext();

    expect(listener).toHaveBeenCalled();
    const lastCall = listener.mock.calls[listener.mock.calls.length - 1][0];
    expect(lastCall?.track.title).toBe('Track 2');

    unsubscribe();
  });
});
