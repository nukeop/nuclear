import type {
  RepeatMode,
  SearchParams,
  SearchResults,
  Track,
} from '@nuclearplayer/model';

import { useRemoteStore } from './remoteStore';

const nextRepeatMode: Record<RepeatMode, RepeatMode> = {
  off: 'all',
  all: 'one',
  one: 'off',
};

const toRequestInit = (body?: unknown): RequestInit => {
  if (body === undefined) {
    return { method: 'POST' };
  }
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

const post = async <Result>(path: string, body?: unknown): Promise<Result> => {
  const response = await fetch(path, toRequestInit(body));
  if (!response.ok) {
    throw new Error(`POST ${path} failed with status ${response.status}`);
  }
  return response.json();
};

const postAction = async (path: string, body?: unknown) => {
  try {
    await post(path, body);
  } catch {
    // SSE will push corrected state
  }
};

export const useRemoteActions = () => {
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
    onSearchTracks: (query: string) =>
      post<SearchResults>('/api/search', {
        query,
        types: ['tracks'],
        limit: 10,
      } satisfies SearchParams),
    onAddToQueue: async (track: Track) => {
      const wasEmpty = (getState().queue?.items.length ?? 0) === 0;
      await postAction('/api/queue/add', { tracks: [track] });
      if (wasEmpty) {
        await postAction('/api/playback/play');
      }
    },
    onRemoveFromQueue: (itemId: string) =>
      postAction('/api/queue/remove', { ids: [itemId] }),
  };
};
