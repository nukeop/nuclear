import { create } from 'zustand';

import { AudioSource, SoundStatus } from '@nuclearplayer/hifi';

import { eventBus } from '../services/eventBus';
import { Logger } from '../services/logger';
import { secondsToMs } from '../utils/time';

type SoundState = {
  src: AudioSource | null;
  status: SoundStatus;
  seek: number;
  duration: number;
  crossfadeMs: number;
  preload: 'none' | 'metadata' | 'auto';
  crossOrigin: '' | 'anonymous' | 'use-credentials';
};

type SoundActions = {
  setSrc: (src: AudioSource | null) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  toggle: () => void;
  seekTo: (seconds: number) => void;
  updatePlayback: (position: number, duration: number) => void;
  setCrossfadeMs: (ms: number) => void;
  setPreload: (mode: 'none' | 'metadata' | 'auto') => void;
  setCrossOrigin: (v: '' | 'anonymous' | 'use-credentials') => void;
};

export const useSoundStore = create<SoundState & SoundActions>((set, get) => ({
  src: null,
  status: 'stopped',
  seek: 0,
  duration: 0,
  crossfadeMs: 0,
  preload: 'auto',
  crossOrigin: '',
  setSrc: (src) => {
    set({ src, seek: 0, duration: 0 });
    Logger.playback.debug(`Set source: ${src?.url ?? 'null'}`);
  },
  play: () => {
    set({ status: 'playing' });
    Logger.playback.debug('Play');
  },
  pause: () => {
    set({ status: 'paused' });
    Logger.playback.debug('Pause');
  },
  stop: () => {
    set({ status: 'stopped', seek: 0 });
    Logger.playback.debug('Stop');
  },
  toggle: () => {
    const { status } = get();
    if (status === 'playing') {
      get().pause();
    } else {
      get().play();
    }
  },
  seekTo: (seconds) => {
    eventBus.emit('playbackSeeked', {
      fromMs: secondsToMs(get().seek),
      toMs: secondsToMs(seconds),
    });
    set({ seek: seconds });
  },
  updatePlayback: (position, duration) => set({ seek: position, duration }),
  setCrossfadeMs: (ms) => set({ crossfadeMs: ms }),
  setPreload: (mode) => set({ preload: mode }),
  setCrossOrigin: (v) => set({ crossOrigin: v }),
}));
