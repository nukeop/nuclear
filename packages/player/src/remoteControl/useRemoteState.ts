import { useCallback, useEffect, useRef, useState } from 'react';

import type { Queue, RepeatMode } from '@nuclearplayer/model';
import { pickArtwork } from '@nuclearplayer/model';
import type { ConnectionStatus } from '@nuclearplayer/ui';

import {
  EventSourceEvent,
  EventSourceStatus,
  useEventSource,
  useEventSourceListener,
} from './useEventSource';

type PlaybackState = {
  status: 'playing' | 'paused' | 'stopped';
  seek: number;
  duration: number;
};

export type SettingsState = {
  shuffle: boolean;
  repeat: RepeatMode;
  discovery: boolean;
};

const mapConnectionStatus = (
  sseStatus: EventSourceStatus,
): ConnectionStatus => {
  switch (sseStatus) {
    case 'open':
      return 'connected';
    case 'error':
      return 'reconnecting';
    default:
      return 'disconnected';
  }
};

type CurrentTrack = {
  title: string;
  artist?: string;
  coverUrl?: string;
};

type RemoteState = {
  connectionStatus: ConnectionStatus;
  currentTrack?: CurrentTrack;
  isLoading: boolean;
  isPlaying: boolean;
  progress: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  settings: SettingsState;
  queue: { items: Queue['items']; currentItemId?: string };
  hasQueue: boolean;
};

const deriveCurrentTrack = (
  queue: Queue | null,
): { track: CurrentTrack; isLoading: boolean } | undefined => {
  if (!queue || queue.items.length === 0) {
    return undefined;
  }

  const item = queue.items[queue.currentIndex];
  if (!item) {
    return undefined;
  }

  return {
    track: {
      title: item.track.title,
      artist: item.track.artists[0]?.name,
      coverUrl: pickArtwork(item.track.artwork, 'cover', 208)?.url,
    },
    isLoading: item.status === 'loading',
  };
};

const derivePlayback = (playback: PlaybackState | null) => {
  const elapsed = playback?.seek ?? 0;
  const duration = playback?.duration ?? 0;

  return {
    isPlaying: playback?.status === 'playing',
    progress: duration > 0 ? (elapsed / duration) * 100 : 0,
    elapsedSeconds: elapsed,
    remainingSeconds: duration - elapsed,
  };
};

export const useRemoteState = (): RemoteState => {
  const [queue, setQueue] = useState<Queue | null>(null);
  const [playback, setPlayback] = useState<PlaybackState | null>(null);
  const [settings, setSettings] = useState<SettingsState>({
    shuffle: false,
    repeat: 'off',
    discovery: false,
  });

  const fetchEndpoint = useCallback(
    async <T>(path: string, setter: (data: T) => void) => {
      try {
        const response = await fetch(path);
        if (response.ok) {
          setter(await response.json());
        }
      } catch {
        // Connection will recover via SSE
      }
    },
    [],
  );

  const refetchAll = useCallback(() => {
    fetchEndpoint('/api/queue', setQueue);
    fetchEndpoint('/api/playback', setPlayback);
  }, [fetchEndpoint]);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  const [source, sseStatus] = useEventSource('/api/events');
  const prevSseStatus = useRef(sseStatus);

  useEffect(() => {
    if (prevSseStatus.current !== 'open' && sseStatus === 'open') {
      refetchAll();
    }
    prevSseStatus.current = sseStatus;
  }, [sseStatus, refetchAll]);

  useEventSourceListener(source, ['queue'], (event: EventSourceEvent) => {
    setQueue(JSON.parse(event.data));
  });

  useEventSourceListener(source, ['playback'], (event: EventSourceEvent) => {
    setPlayback(JSON.parse(event.data));
  });

  useEventSourceListener(source, ['settings'], (event: EventSourceEvent) => {
    setSettings(JSON.parse(event.data));
  });

  const current = deriveCurrentTrack(queue);
  const playbackState = derivePlayback(playback);

  return {
    connectionStatus: mapConnectionStatus(sseStatus),
    currentTrack: current?.track,
    isLoading: current?.isLoading ?? false,
    ...playbackState,
    settings,
    queue: {
      items: queue?.items ?? [],
      currentItemId: queue?.items[queue.currentIndex]?.id,
    },
    hasQueue: queue !== null && queue.items.length > 0,
  };
};
