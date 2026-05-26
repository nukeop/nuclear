import { useEffect } from 'react';

import { i18n } from '@nuclearplayer/i18n';
import type { Queue } from '@nuclearplayer/model';
import { pickArtwork } from '@nuclearplayer/model';
import type { ConnectionStatus } from '@nuclearplayer/ui';

import type { PlaybackState, SettingsState } from './remoteStore';
import { useRemoteStore } from './remoteStore';
import { EventSourceStatus, useEventSource } from './useEventSource';
import { useInitialSync } from './useInitialSync';
import { useSSESync } from './useSSESync';

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

export const useRemoteState = (): RemoteState => {
  const [source, sseStatus] = useEventSource('/api/events');

  const setConnectionStatus = useRemoteStore(
    (state) => state.setConnectionStatus,
  );
  useEffect(() => {
    setConnectionStatus(sseStatus);
  }, [sseStatus, setConnectionStatus]);

  useInitialSync(sseStatus);
  useSSESync(source);

  const queue = useRemoteStore((state) => state.queue);
  const playback = useRemoteStore((state) => state.playback);
  const settings = useRemoteStore((state) => state.settings);

  useEffect(() => {
    void i18n.changeLanguage(settings.language);
  }, [settings.language]);

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
