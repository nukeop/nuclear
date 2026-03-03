import { act, waitFor } from '@testing-library/react';

import { AudioSource } from '@nuclearplayer/hifi';

import { SoundWrapper } from './Sound.test-wrapper';

const trackSource: AudioSource = { url: '/track.mp3', protocol: 'http' };
const srcA: AudioSource = { url: '/a.mp3', protocol: 'http' };
const srcB: AudioSource = { url: '/b.mp3', protocol: 'http' };

describe('Sound component', () => {
  it('mounts app and renders Sound only after src is set', async () => {
    await SoundWrapper.mount();
    expect(document.querySelectorAll('audio').length).toBe(0);

    SoundWrapper.setSrc(trackSource);
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
