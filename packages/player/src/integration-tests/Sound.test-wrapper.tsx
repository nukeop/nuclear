import {
  act,
  render,
  RenderResult,
  screen,
  waitFor,
  within,
} from '@testing-library/react';

import { AudioSource } from '@nuclearplayer/hifi';

import App from '../App';
import { useQueueStore } from '../stores/queueStore';
import { useSoundStore } from '../stores/soundStore';
import { createQueueItem } from '../test/fixtures/queue';

const defaultSrc: AudioSource = { url: '/track.mp3', protocol: 'http' };

export const SoundWrapper = {
  async mount(): Promise<RenderResult> {
    return render(<App />);
  },

  async seedAndPlay(startIndex = 0) {
    useQueueStore.setState({
      items: [
        createQueueItem('Track 1'),
        createQueueItem('Track 2'),
        createQueueItem('Track 3'),
      ],
      currentIndex: startIndex,
      isReady: true,
      isLoading: false,
    });
    useSoundStore.getState().setSrc(defaultSrc);
    useSoundStore.getState().play();
    await waitFor(() => {
      expect(this.getAudios().length).toBeGreaterThan(0);
    });
  },

  get nowPlayingTitle() {
    return screen.queryByTestId('now-playing-title')?.textContent;
  },

  get nowPlayingArtist() {
    return screen.queryByTestId('player-now-playing-artist')?.textContent;
  },

  get currentQueueItem() {
    const items = screen.queryAllByTestId('queue-item');
    return items.find(
      (item) => item.getAttribute('data-is-current') === 'true',
    );
  },

  get currentQueueItemTitle() {
    const current = this.currentQueueItem;
    if (!current) {
      return undefined;
    }
    return within(current).queryByTestId('queue-item-title')?.textContent;
  },

  setSrc(src: AudioSource) {
    useSoundStore.getState().setSrc(src);
  },
  play() {
    useSoundStore.getState().play();
  },
  pause() {
    useSoundStore.getState().pause();
  },
  stop() {
    useSoundStore.getState().stop();
  },
  seekTo(seconds: number) {
    useSoundStore.getState().seekTo(seconds);
  },
  setCrossfadeMs(ms: number) {
    useSoundStore.getState().setCrossfadeMs(ms);
  },
  getAudios(): NodeListOf<HTMLAudioElement> {
    return document.querySelectorAll('audio');
  },
  getActiveAudio(): HTMLAudioElement | null {
    return document.querySelector('audio[data-is-active="true"]');
  },
  fireCanPlay() {
    const audio = document.querySelector('audio');
    if (audio) {
      act(() => {
        audio.dispatchEvent(new Event('canplay', { bubbles: false }));
      });
    }
  },
  fireEnded() {
    const audio = document.querySelector('audio');
    if (audio) {
      act(() => {
        audio.dispatchEvent(new Event('ended', { bubbles: false }));
      });
    }
  },
};
