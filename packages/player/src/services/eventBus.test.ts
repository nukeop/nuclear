import type { Track } from '@nuclearplayer/model';

import { createEventBus } from './eventBus';

const testTrack: Track = {
  title: 'Idioteque',
  artists: [{ name: 'Radiohead', roles: [] }],
  source: { provider: 'test', id: 'track-1' },
};

describe('PluginEventBus', () => {
  it('calls listener when an event is emitted', () => {
    const bus = createEventBus();
    const listener = vi.fn();

    bus.on('trackFinished', listener);
    bus.emit('trackFinished', testTrack);

    expect(listener).toHaveBeenCalledWith(testTrack);
  });

  it('does not call listener after unsubscribe', () => {
    const bus = createEventBus();
    const listener = vi.fn();

    const unsubscribe = bus.on('trackFinished', listener);
    unsubscribe();
    bus.emit('trackFinished', testTrack);

    expect(listener).not.toHaveBeenCalled();
  });

  it('supports multiple listeners for the same event', () => {
    const bus = createEventBus();
    const listenerA = vi.fn();
    const listenerB = vi.fn();

    bus.on('trackFinished', listenerA);
    bus.on('trackFinished', listenerB);
    bus.emit('trackFinished', testTrack);

    expect(listenerA).toHaveBeenCalledWith(testTrack);
    expect(listenerB).toHaveBeenCalledWith(testTrack);
  });

  it('isolates listeners between separate bus instances', () => {
    const busA = createEventBus();
    const busB = createEventBus();
    const listener = vi.fn();

    busA.on('trackFinished', listener);
    busB.emit('trackFinished', testTrack);

    expect(listener).not.toHaveBeenCalled();
  });
});
