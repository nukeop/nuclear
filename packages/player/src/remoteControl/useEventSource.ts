import { useEffect, useRef, useState } from 'react';

import type { ConnectionStatus } from '@nuclearplayer/ui';

export type EventSourceEvent = Event & { data: string };

const RECONNECT_DELAY_MS = 3000;
const MAX_RETRIES = 3;

export const useEventSource = (url: string) => {
  const source = useRef<EventSource | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');

  useEffect(() => {
    if (!url) {
      setStatus('failed');
      return;
    }

    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let cancelled = false;
    let retries = 0;

    const connect = () => {
      const eventSource = new EventSource(url);
      source.current = eventSource;

      eventSource.addEventListener('open', () => {
        retries = 0;
        setStatus('connected');
      });

      eventSource.addEventListener('error', () => {
        if (eventSource.readyState === EventSource.CLOSED && !cancelled) {
          eventSource.close();
          source.current = null;
          retries++;

          if (retries > MAX_RETRIES) {
            setStatus('failed');
            return;
          }

          setStatus('reconnecting');
          reconnectTimeout = setTimeout(connect, RECONNECT_DELAY_MS);
        } else if (eventSource.readyState === EventSource.CONNECTING) {
          setStatus('reconnecting');
        }
      });
    };

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimeout);
      source.current?.close();
      source.current = null;
    };
  }, [url]);

  return [source.current, status] as const;
};

export const useEventSourceListener = (
  source: EventSource | null,
  types: string[],
  listener: (event: EventSourceEvent) => void,
  dependencies: unknown[] = [],
) => {
  useEffect(() => {
    if (!source) {
      return;
    }

    types.forEach((type) =>
      source.addEventListener(type, listener as EventListener),
    );

    return () => {
      types.forEach((type) =>
        source.removeEventListener(type, listener as EventListener),
      );
    };
  }, [source, ...dependencies]);
};
