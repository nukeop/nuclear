import type { Track } from '@nuclearplayer/model';

import { createEventBus } from './eventBus';

const testTrack: Track = {
  title: 'Idioteque',
  artists: [{ name: 'Radiohead', roles: [] }],
  source: { provider: 'test', id: 'track-1' },
};

describe('PluginEventBus', () => {
  it('calls listener when an event is emitted', async () => {
    const bus = createEventBus();
    const listener = vi.fn(async () => {});

    bus.on('trackFinished', listener);
    bus.emit('trackFinished', testTrack);

    await vi.waitFor(() => {
      expect(listener).toHaveBeenCalledWith(testTrack);
    });
  });

  it('does not call listener after unsubscribe', async () => {
    const bus = createEventBus();
    const listener = vi.fn(async () => {});

    const unsubscribe = bus.on('trackFinished', listener);
    unsubscribe();
    bus.emit('trackFinished', testTrack);

    await Promise.resolve();
    expect(listener).not.toHaveBeenCalled();
  });

  it('supports multiple listeners for the same event', async () => {
    const bus = createEventBus();
    const listenerA = vi.fn(async () => {});
    const listenerB = vi.fn(async () => {});

    bus.on('trackFinished', listenerA);
    bus.on('trackFinished', listenerB);
    bus.emit('trackFinished', testTrack);

    await vi.waitFor(() => {
      expect(listenerA).toHaveBeenCalledWith(testTrack);
      expect(listenerB).toHaveBeenCalledWith(testTrack);
    });
  });

  it('isolates listeners between separate bus instances', async () => {
    const busA = createEventBus();
    const busB = createEventBus();
    const listener = vi.fn(async () => {});

    busA.on('trackFinished', listener);
    busB.emit('trackFinished', testTrack);

    await Promise.resolve();
    expect(listener).not.toHaveBeenCalled();
  });
});
