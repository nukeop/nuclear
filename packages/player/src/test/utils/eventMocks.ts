import type { EventCallback } from '@tauri-apps/api/event';

const listeners = new Map<string, EventCallback<unknown>>();

export const listen = async (
  name: string,
  listener: EventCallback<unknown>,
) => {
  listeners.set(name, listener);
  return () => {
    if (listeners.get(name) === listener) {
      listeners.delete(name);
    }
  };
};

export const emit = (name: string, payload?: unknown) => {
  listeners.get(name)?.({ event: name, id: 0, payload });
};
