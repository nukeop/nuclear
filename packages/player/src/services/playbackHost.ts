import type {
  PlaybackHost,
  PlaybackListener,
  PlaybackState,
} from '@nuclearplayer/plugin-sdk';

import { useSoundStore } from '../stores/soundStore';

const toPlaybackState = (): PlaybackState => {
  const { status, seek, duration } = useSoundStore.getState();
  return { status, seek, duration };
};

export const createPlaybackHost = (): PlaybackHost => ({
  getState: async () => toPlaybackState(),

  play: async () => useSoundStore.getState().play(),

  pause: async () => useSoundStore.getState().pause(),

  stop: async () => useSoundStore.getState().stop(),

  toggle: async () => useSoundStore.getState().toggle(),

  seekTo: async (seconds) => useSoundStore.getState().seekTo(seconds),

  subscribe: (listener: PlaybackListener) =>
    useSoundStore.subscribe((state) =>
      listener({
        status: state.status,
        seek: state.seek,
        duration: state.duration,
      }),
    ),
});

export const playbackHost = createPlaybackHost();
