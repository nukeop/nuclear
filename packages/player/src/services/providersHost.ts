import type {
  ProviderDescriptor,
  ProviderKind,
  ProvidersHost,
} from '@nuclearplayer/plugin-sdk';

import {
  initializeProvidersStore,
  useProvidersStore,
} from '../stores/providersStore';
import { setupStreamingPairingSync } from './streamingPairingSync';

const createProvidersHost = (): ProvidersHost => {
  const byKind = new Map<ProviderKind, Map<string, ProviderDescriptor>>();
  const byId = new Map<string, ProviderDescriptor>();
  const subscribers = new Set<() => void>();

  const notify = () => {
    for (const listener of subscribers) {
      listener();
    }
  };

  useProvidersStore.subscribe(() => notify());

  return {
    register<T extends ProviderDescriptor>(provider: T): string {
      const kindMap = byKind.get(provider.kind) ?? new Map();
      kindMap.set(provider.id, provider);
      byKind.set(provider.kind, kindMap);
      byId.set(provider.id, provider);

      const activeForKind = useProvidersStore
        .getState()
        .getActive(provider.kind);

      // Set the first registered provider as active
      if (!activeForKind) {
        useProvidersStore.getState().setActive(provider.kind, provider.id);
      }

      notify();
      return provider.id;
    },

    unregister(providerId: string): boolean {
      const current = byId.get(providerId);
      if (!current) {
        return false;
      }
      byId.delete(providerId);
      const kindMap = byKind.get(current.kind);
      if (kindMap) {
        kindMap.delete(providerId);
        if (kindMap.size === 0) {
          byKind.delete(current.kind);
        }
      }
      notify();
      return true;
    },

    list<K extends ProviderKind = ProviderKind>(kind?: K) {
      if (kind) {
        const map = byKind.get(kind as ProviderKind);
        return (map ? Array.from(map.values()) : []) as ProviderDescriptor<K>[];
      }
      const all: ProviderDescriptor[] = [];
      for (const map of byKind.values()) {
        for (const value of map.values()) {
          all.push(value);
        }
      }
      return all as ProviderDescriptor<K>[];
    },

    get<T extends ProviderDescriptor>(
      providerId: string | undefined,
      kind: ProviderKind,
    ) {
      if (!providerId) {
        return undefined;
      }
      const provider = byId.get(providerId);
      if (!provider || provider.kind !== kind) {
        return undefined;
      }
      return provider as T;
    },

    clear() {
      byKind.clear();
      byId.clear();
      useProvidersStore.getState().clearAllActive();
      notify();
    },

    getActive(kind: ProviderKind) {
      return useProvidersStore.getState().getActive(kind);
    },

    setActive(kind: ProviderKind, providerId: string) {
      useProvidersStore.getState().setActive(kind, providerId);
    },

    subscribe(listener: () => void) {
      subscribers.add(listener);
      return () => {
        subscribers.delete(listener);
      };
    },
  };
};

export const providersHost: ProvidersHost = createProvidersHost();

setupStreamingPairingSync(providersHost);

void initializeProvidersStore();
