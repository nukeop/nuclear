import type { EventCallback, UnlistenFn } from '@tauri-apps/api/event';

type Listener = EventCallback<unknown>;

export class TauriEventMocks {
  private listeners = new Map<string, Set<Listener>>();

  moduleFactory() {
    return {
      listen: async (name: string, listener: Listener): Promise<UnlistenFn> => {
        this.listenersOf(name).add(listener);
        return () => this.listenersOf(name).delete(listener);
      },
      emit: async (name: string, payload?: unknown): Promise<void> => {
        this.emit(name, payload);
      },
    };
  }

  emit(name: string, payload: unknown): void {
    this.listenersOf(name).forEach((listener) =>
      listener({ event: name, id: 0, payload }),
    );
  }

  private listenersOf(name: string): Set<Listener> {
    const existing = this.listeners.get(name);
    if (existing) {
      return existing;
    }
    const created = new Set<Listener>();
    this.listeners.set(name, created);
    return created;
  }
}

export const tauriEventMocks = new TauriEventMocks();
