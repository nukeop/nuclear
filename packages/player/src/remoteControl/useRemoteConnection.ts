import { useEffect } from 'react';

import { useRemoteStore } from './remoteStore';
import { useEventSource } from './useEventSource';
import { useInitialSync } from './useInitialSync';
import { useSSESync } from './useSSESync';

export const useRemoteConnection = () => {
  const [source, connectionStatus] = useEventSource('/api/events');
  const setConnectionStatus = useRemoteStore(
    (state) => state.setConnectionStatus,
  );

  useEffect(() => {
    setConnectionStatus(connectionStatus);
  }, [connectionStatus, setConnectionStatus]);

  useInitialSync(connectionStatus);
  useSSESync(source);
};
