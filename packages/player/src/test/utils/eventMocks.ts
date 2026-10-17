import type * as TauriEvent from '@tauri-apps/api/event';
import type { Event } from '@tauri-apps/api/event';

type StoredListener = (event: Event<never>) => void;

const listeners = new Map<string, StoredListener>();

export const listen: typeof TauriEvent.listen = async (name, listener) => {
  listeners.set(name, listener);
  return () => {
    if (listeners.get(name) === listener) {
      listeners.delete(name);
    }
  };
};

export const emit: typeof TauriEvent.emit = async (name, payload) => {
  listeners.get(name)?.({ event: name, id: 0, payload } as Event<never>);
};
