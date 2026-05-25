import { useEffect, useRef, useState } from 'react';

export type EventSourceStatus = 'init' | 'open' | 'closed' | 'error';

export type EventSourceEvent = Event & { data: string };

const RECONNECT_DELAY_MS = 3000;

export const useEventSource = (url: string) => {
  const source = useRef<EventSource | null>(null);
  const [status, setStatus] = useState<EventSourceStatus>('init');

  useEffect(() => {
    if (!url) {
      setStatus('closed');
      return;
    }

    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const connect = () => {
      const eventSource = new EventSource(url);
      source.current = eventSource;

      eventSource.addEventListener('open', () => setStatus('open'));
      eventSource.addEventListener('error', () => {
        setStatus('error');

        if (eventSource.readyState === EventSource.CLOSED && !cancelled) {
          eventSource.close();
          source.current = null;
          reconnectTimeout = setTimeout(connect, RECONNECT_DELAY_MS);
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
