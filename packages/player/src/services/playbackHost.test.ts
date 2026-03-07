import { useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';
import { playbackHost } from './playbackHost';

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
    useSettingsStore.setState({ values: {} });
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

  it('getVolume returns 1 when no volume is set', async () => {
    const volume = await playbackHost.getVolume();
    expect(volume).toBe(1);
  });

  it('setVolume updates the volume setting', async () => {
    await playbackHost.setVolume(0.3);
    expect(useSettingsStore.getState().getValue('core.playback.volume')).toBe(
      0.3,
    );
  });

  it('isMuted returns false when not set', async () => {
    const muted = await playbackHost.isMuted();
    expect(muted).toBe(false);
  });

  it('setMuted updates the muted setting', async () => {
    await playbackHost.setMuted(true);
    expect(useSettingsStore.getState().getValue('core.playback.muted')).toBe(
      true,
    );
  });

  it('isShuffleEnabled returns false when not set', async () => {
    const enabled = await playbackHost.isShuffleEnabled();
    expect(enabled).toBe(false);
  });

  it('setShuffleEnabled updates the shuffle setting', async () => {
    await playbackHost.setShuffleEnabled(true);
    expect(useSettingsStore.getState().getValue('core.playback.shuffle')).toBe(
      true,
    );
  });

  it('getRepeatMode returns off when not set', async () => {
    const mode = await playbackHost.getRepeatMode();
    expect(mode).toBe('off');
  });

  it('setRepeatMode updates the repeat mode', async () => {
    await playbackHost.setRepeatMode('one');
    expect(useSettingsStore.getState().getValue('core.playback.repeat')).toBe(
      'one',
    );
  });
});
