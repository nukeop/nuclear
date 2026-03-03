import type {
  EventsHost,
  PluginEventListener,
  PluginEventMap,
} from '@nuclearplayer/plugin-sdk';

type Listener = (payload: PluginEventMap[keyof PluginEventMap]) => void;

export const createEventBus = (): EventsHost => {
  const listeners = new Map<keyof PluginEventMap, Set<Listener>>();

  const getOrCreateSet = (event: keyof PluginEventMap): Set<Listener> => {
    let set = listeners.get(event);
    if (!set) {
      set = new Set();
      listeners.set(event, set);
    }
    return set;
  };

  return {
    on<E extends keyof PluginEventMap>(
      event: E,
      listener: PluginEventListener<E>,
    ) {
      const set = getOrCreateSet(event);
      set.add(listener);

      return () => {
        set.delete(listener);
      };
    },

    emit<E extends keyof PluginEventMap>(event: E, payload: PluginEventMap[E]) {
      listeners.get(event)?.forEach((listener) => listener(payload));
    },
  };
};

export const eventBus = createEventBus();
