import type { RepeatMode } from '@nuclearplayer/model';

import { useRemoteStore } from './remoteStore';

type RemoteActions = {
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (percent: number) => void;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
};

const nextRepeatMode: Record<RepeatMode, RepeatMode> = {
  off: 'all',
  all: 'one',
  one: 'off',
};

const postAction = async (path: string, body?: unknown) => {
  try {
    await fetch(path, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // SSE will push corrected state
  }
};

export const useRemoteActions = (): RemoteActions => {
  const getState = () => useRemoteStore.getState();

  return {
    onPlayPause: () => postAction('/api/playback/toggle'),
    onNext: () => postAction('/api/playback/next'),
    onPrevious: () => postAction('/api/playback/previous'),
    onSeek: (percent: number) => {
      const duration = getState().playback?.duration ?? 0;
      postAction('/api/playback/seek', { seconds: (percent / 100) * duration });
    },
    onShuffleToggle: () => {
      const shuffle = getState().settings.shuffle;
      postAction('/api/playback/shuffle', { enabled: !shuffle });
    },
    onRepeatToggle: () => {
      const repeat = getState().settings.repeat;
      postAction('/api/playback/repeat', { mode: nextRepeatMode[repeat] });
    },
  };
};
