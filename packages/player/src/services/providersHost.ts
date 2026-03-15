import type {
  ProviderDescriptor,
  ProviderKind,
  ProvidersHost,
} from '@nuclearplayer/plugin-sdk';

export const createProvidersHost = (): ProvidersHost => {
  const byKind = new Map<ProviderKind, Map<string, ProviderDescriptor>>();
  const byId = new Map<string, ProviderDescriptor>();
  const active = new Map<ProviderKind, string>();
  const subscribers = new Set<() => void>();

  const notify = () => {
    for (const listener of subscribers) {
      listener();
    }
  };

  return {
    register<T extends ProviderDescriptor>(provider: T): string {
      const kindMap = byKind.get(provider.kind) ?? new Map();
      kindMap.set(provider.id, provider);
      byKind.set(provider.kind, kindMap);
      byId.set(provider.id, provider);
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

    get<T extends ProviderDescriptor>(providerId: string, kind: ProviderKind) {
      const provider = byId.get(providerId);
      if (!provider || provider.kind !== kind) {
        return undefined;
      }
      return provider as T | undefined;
    },

    clear() {
      byKind.clear();
      byId.clear();
      active.clear();
      notify();
    },

    getActive(kind: ProviderKind) {
      return active.get(kind);
    },

    setActive(kind: ProviderKind, providerId: string) {
      active.set(kind, providerId);
      notify();
    },

    clearActive(kind: ProviderKind) {
      active.delete(kind);
      notify();
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
