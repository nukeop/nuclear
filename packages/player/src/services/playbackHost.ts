import type {
  PlaybackHost,
  PlaybackListener,
  PlaybackState,
} from '@nuclearplayer/plugin-sdk';

import { useSoundStore } from '../stores/soundStore';
import { playbackManager } from './playback';
import { playbackSettings } from './playbackSettings';

const toPlaybackState = (): PlaybackState => {
  const { status, seek, duration } = useSoundStore.getState();
  return { status, seek, duration };
};

export const createPlaybackHost = (): PlaybackHost => ({
  getState: async () => toPlaybackState(),

  play: async () => playbackManager.play(),

  pause: async () => playbackManager.pause(),

  stop: async () => useSoundStore.getState().stop(),

  toggle: async () => playbackManager.toggle(),

  seekTo: async (seconds) => useSoundStore.getState().seekTo(seconds),

  subscribe: (listener: PlaybackListener) =>
    useSoundStore.subscribe((state) =>
      listener({
        status: state.status,
        seek: state.seek,
        duration: state.duration,
      }),
    ),

  getVolume: async () => playbackSettings.volume,
  setVolume: async (volume) => playbackSettings.setVolume(volume),
  isMuted: async () => playbackSettings.muted,
  setMuted: async (muted) => playbackSettings.setMuted(muted),
  isShuffleEnabled: async () => playbackSettings.shuffleEnabled,
  setShuffleEnabled: async (enabled) =>
    playbackSettings.setShuffleEnabled(enabled),
  getRepeatMode: async () => playbackSettings.repeatMode,
  setRepeatMode: async (mode) => playbackSettings.setRepeatMode(mode),
});

export const playbackHost = createPlaybackHost();
