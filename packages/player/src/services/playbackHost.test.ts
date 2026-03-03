import type { Track } from '@nuclearplayer/model';

import { useSoundStore } from '../stores/soundStore';
import { notifyTrackFinished, playbackHost } from './playbackHost';

describe('playbackHost', () => {
  beforeEach(() => {
    useSoundStore.setState({
      src: null,
      status: 'stopped',
      seek: 0,
      duration: 0,
      crossfadeMs: 0,
      preload: 'auto',
      crossOrigin: '',
    });
  });

  it('gets initial playback state', async () => {
    const state = await playbackHost.getState();

    expect(state).toMatchInlineSnapshot(`
      {
        "duration": 0,
        "seek": 0,
        "status": "stopped",
      }
    `);
  });

  it('play sets status to playing', async () => {
    await playbackHost.play();

    const state = await playbackHost.getState();
    expect(state.status).toBe('playing');
  });

  it('pause sets status to paused', async () => {
    await playbackHost.play();

    await playbackHost.pause();

    const state = await playbackHost.getState();
    expect(state.status).toBe('paused');
  });

  it('stop resets status and seek', async () => {
    await playbackHost.play();
    await playbackHost.seekTo(30);

    await playbackHost.stop();

    const state = await playbackHost.getState();
    expect(state.status).toBe('stopped');
    expect(state.seek).toBe(0);
  });

  it('toggle switches between playing and paused', async () => {
    await playbackHost.toggle();
    const afterFirst = await playbackHost.getState();
    expect(afterFirst.status).toBe('playing');

    await playbackHost.toggle();
    const afterSecond = await playbackHost.getState();
    expect(afterSecond.status).toBe('paused');
  });

  it('seekTo updates seek position', async () => {
    await playbackHost.seekTo(42.5);

    const state = await playbackHost.getState();
    expect(state.seek).toBe(42.5);
  });

  it('subscribe fires on state changes', async () => {
    const listener = vi.fn();
    playbackHost.subscribe(listener);

    await playbackHost.play();

    expect(listener).toHaveBeenCalled();
    const lastCallArg = listener.mock.calls[listener.mock.calls.length - 1][0];
    expect(lastCallArg).toMatchInlineSnapshot(`
      {
        "duration": 0,
        "seek": 0,
        "status": "playing",
      }
    `);
  });

  it('unsubscribe stops notifications', async () => {
    const listener = vi.fn();
    const unsubscribe = playbackHost.subscribe(listener);

    unsubscribe();
    await playbackHost.play();

    expect(listener).not.toHaveBeenCalled();
  });

  describe('onTrackFinished', () => {
    const testTrack: Track = {
      title: 'Idioteque',
      artists: [{ name: 'Radiohead', roles: [] }],
      source: { provider: 'test', id: 'track-1' },
    };

    it('calls listener when a track finishes', () => {
      const listener = vi.fn();
      playbackHost.onTrackFinished(listener);

      notifyTrackFinished(testTrack);

      expect(listener).toHaveBeenCalledWith(testTrack);
    });

    it('does not call listener after unsubscribe', () => {
      const listener = vi.fn();
      const unsubscribe = playbackHost.onTrackFinished(listener);

      unsubscribe();
      notifyTrackFinished(testTrack);

      expect(listener).not.toHaveBeenCalled();
    });

    it('supports multiple listeners', () => {
      const listenerA = vi.fn();
      const listenerB = vi.fn();
      playbackHost.onTrackFinished(listenerA);
      playbackHost.onTrackFinished(listenerB);

      notifyTrackFinished(testTrack);

      expect(listenerA).toHaveBeenCalledWith(testTrack);
      expect(listenerB).toHaveBeenCalledWith(testTrack);
    });
  });
});
