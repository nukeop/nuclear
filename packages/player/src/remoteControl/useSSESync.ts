import { useRemoteStore } from './remoteStore';
import { EventSourceEvent, useEventSourceListener } from './useEventSource';

export const useSSESync = (source: EventSource | null) => {
  useEventSourceListener(source, ['queue'], (event: EventSourceEvent) => {
    useRemoteStore.getState().setQueue(JSON.parse(event.data));
  });

  useEventSourceListener(source, ['playback'], (event: EventSourceEvent) => {
    useRemoteStore.getState().setPlayback(JSON.parse(event.data));
  });

  useEventSourceListener(source, ['settings'], (event: EventSourceEvent) => {
    useRemoteStore.getState().setSettings(JSON.parse(event.data));
  });
};
