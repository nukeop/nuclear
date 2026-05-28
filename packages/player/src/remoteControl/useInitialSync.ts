import { useCallback, useEffect, useRef } from 'react';

import type { Queue } from '@nuclearplayer/model';
import type { ConnectionStatus } from '@nuclearplayer/ui';

import type { PlaybackState, SettingsState } from './remoteStore';
import { useRemoteStore } from './remoteStore';

const fetchJSON = async <T>(path: string): Promise<T> => {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const useInitialSync = (connectionStatus: ConnectionStatus) => {
  const refetchAll = useCallback(async () => {
    const { setQueue, setPlayback, setSettings, setSynced } =
      useRemoteStore.getState();

    try {
      const [queue, playback, settings] = await Promise.all([
        fetchJSON<Queue>('/api/queue'),
        fetchJSON<PlaybackState>('/api/playback'),
        fetchJSON<SettingsState>('/api/settings'),
      ]);

      setQueue(queue);
      setPlayback(playback);
      setSettings(settings);
      setSynced(true);
    } catch (error) {
      console.error('Initial sync failed:', error);
    }
  }, []);

  const prevStatus = useRef(connectionStatus);

  useEffect(() => {
    if (
      prevStatus.current !== 'connected' &&
      connectionStatus === 'connected'
    ) {
      refetchAll();
    }
    prevStatus.current = connectionStatus;
  }, [connectionStatus, refetchAll]);
};
