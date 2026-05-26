import type { RepeatMode } from '@nuclearplayer/model';

type UseRemoteActionsParams = {
  shuffleActive: boolean;
  repeatMode: RepeatMode;
  duration: number;
};

type RemoteActions = {
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (percent: number) => void;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
};

const nextRepeatMode = { off: 'all', all: 'one', one: 'off' } as const;

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

export const useRemoteActions = ({
  shuffleActive,
  repeatMode,
  duration,
}: UseRemoteActionsParams): RemoteActions => ({
  onPlayPause: () => postAction('/api/playback/toggle'),
  onNext: () => postAction('/api/playback/next'),
  onPrevious: () => postAction('/api/playback/previous'),
  onSeek: (percent: number) =>
    postAction('/api/playback/seek', { seconds: (percent / 100) * duration }),
  onShuffleToggle: () =>
    postAction('/api/playback/shuffle', { enabled: !shuffleActive }),
  onRepeatToggle: () =>
    postAction('/api/playback/repeat', { mode: nextRepeatMode[repeatMode] }),
});
