import { act, render, RenderResult } from '@testing-library/react';

import { AudioSource } from '@nuclearplayer/hifi';

import App from '../App';
import { useSoundStore } from '../stores/soundStore';

export const SoundWrapper = {
  async mount(): Promise<RenderResult> {
    return render(<App />);
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
};
