import { useCallback, useEffect, useRef } from 'react';

import { useRemoteStore } from './remoteStore';
import type { EventSourceStatus } from './useEventSource';

const fetchEndpoint = async <T>(
  path: string,
  setter: (data: T) => void,
): Promise<void> => {
  try {
    const response = await fetch(path);
    if (response.ok) {
      setter(await response.json());
    }
  } catch {
    // Connection will recover via SSE
  }
};

export const useInitialSync = (connectionStatus: EventSourceStatus) => {
  const refetchAll = useCallback(() => {
    const { setQueue, setPlayback } = useRemoteStore.getState();
    fetchEndpoint('/api/queue', setQueue);
    fetchEndpoint('/api/playback', setPlayback);
  }, []);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  const prevStatus = useRef(connectionStatus);

  useEffect(() => {
    if (prevStatus.current !== 'open' && connectionStatus === 'open') {
      refetchAll();
    }
    prevStatus.current = connectionStatus;
  }, [connectionStatus, refetchAll]);
};
