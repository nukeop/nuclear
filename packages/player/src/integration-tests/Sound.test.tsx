import { act, waitFor } from '@testing-library/react';

import { AudioSource } from '@nuclearplayer/hifi';

import { useQueueStore } from '../stores/queueStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';
import { createQueueItem } from '../test/fixtures/queue';
import { SoundWrapper } from './Sound.test-wrapper';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue(9100),
}));

const srcA: AudioSource = { url: '/a.mp3', protocol: 'http' };
const srcB: AudioSource = { url: '/b.mp3', protocol: 'http' };

describe('Sound component', () => {
  it('mounts app and renders Sound only after src is set', async () => {
    await SoundWrapper.mount();
    expect(document.querySelectorAll('audio').length).toBe(0);

    SoundWrapper.setSrc(srcA);
    await waitFor(() =>
      expect(document.querySelectorAll('audio').length).toBe(1),
    );
  });

  it('plays, seeks, and pauses via store actions', async () => {
    await SoundWrapper.mount();
    SoundWrapper.setSrc(srcA);
    SoundWrapper.play();

    const playMock = window.HTMLMediaElement.prototype
      .play as unknown as ReturnType<typeof vi.fn>;
    const pauseMock = window.HTMLMediaElement.prototype
      .pause as unknown as ReturnType<typeof vi.fn>;

    await waitFor(() => {
      expect(SoundWrapper.getAudios().length).toBeGreaterThan(0);
    });
    SoundWrapper.fireCanPlay();

    await waitFor(() => expect(playMock).toHaveBeenCalled());
    playMock.mockClear();
    pauseMock.mockClear();

    SoundWrapper.pause();
    await waitFor(() => expect(pauseMock).toHaveBeenCalled());

    SoundWrapper.play();
    await waitFor(() => expect(playMock).toHaveBeenCalled());

    SoundWrapper.seekTo(37);
    await waitFor(() => {
      const audio = SoundWrapper.getAudios()[0];
      expect(audio).toBeDefined();
      expect(audio?.currentTime).toBe(37);
    });
  });

  it('crossfades on src change when crossfadeMs > 0', async () => {
    await SoundWrapper.mount();
    SoundWrapper.setCrossfadeMs(40);
    SoundWrapper.setSrc(srcA);
    SoundWrapper.play();

    vi.useFakeTimers();
    SoundWrapper.setSrc(srcB);
    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });
    vi.useRealTimers();

    const audios = SoundWrapper.getAudios();
    const sources = [...audios].flatMap((a) =>
      [...a.querySelectorAll('source')].map((s) => s.getAttribute('src')),
    );
    expect(sources.every((s) => s === '/b.mp3')).toBe(true);
  });
});

describe('Repeat mode behavior when a track ends', () => {
  const threeTrackQueue = [
    createQueueItem('Track 1'),
    createQueueItem('Track 2'),
    createQueueItem('Track 3'),
  ];

  const seedAndPlay = async (
    items: ReturnType<typeof createQueueItem>[],
    startIndex = 0,
  ) => {
    useQueueStore.setState({
      items,
      currentIndex: startIndex,
      isReady: true,
      isLoading: false,
    });
    SoundWrapper.setSrc(srcA);
    SoundWrapper.play();
    await waitFor(() => {
      expect(SoundWrapper.getAudios().length).toBeGreaterThan(0);
    });
  };

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

  it('advances to next track when repeat is off', async () => {
    await SoundWrapper.mount();
    await seedAndPlay(threeTrackQueue);
    expect(SoundWrapper.nowPlayingTitle).toBe('Track 1');

    SoundWrapper.fireEnded();

    await waitFor(() => {
      expect(SoundWrapper.nowPlayingTitle).toBe('Track 2');
      expect(SoundWrapper.currentQueueItemTitle).toBe('Track 2');
    });
  });

  it('replays the same track when repeat is one', async () => {
    await SoundWrapper.mount();
    useSettingsStore.setState({
      values: { 'core.playback.repeat': 'one' },
    });
    await seedAndPlay(threeTrackQueue);

    SoundWrapper.fireEnded();

    await waitFor(() => {
      expect(SoundWrapper.nowPlayingTitle).toBe('Track 1');
      expect(SoundWrapper.currentQueueItemTitle).toBe('Track 1');
    });
  });

  it('wraps to first track when repeat is all and last track ends', async () => {
    await SoundWrapper.mount();
    useSettingsStore.setState({
      values: { 'core.playback.repeat': 'all' },
    });
    await seedAndPlay(threeTrackQueue, 2);
    expect(SoundWrapper.nowPlayingTitle).toBe('Track 3');

    SoundWrapper.fireEnded();

    await waitFor(() => {
      expect(SoundWrapper.nowPlayingTitle).toBe('Track 1');
      expect(SoundWrapper.currentQueueItemTitle).toBe('Track 1');
    });
  });

  it('stays on last track when repeat is off and last track ends', async () => {
    await SoundWrapper.mount();
    await seedAndPlay(threeTrackQueue, 2);
    expect(SoundWrapper.nowPlayingTitle).toBe('Track 3');

    SoundWrapper.fireEnded();

    await waitFor(() => {
      expect(SoundWrapper.nowPlayingTitle).toBe('Track 3');
      expect(SoundWrapper.currentQueueItemTitle).toBe('Track 3');
    });
  });
});
