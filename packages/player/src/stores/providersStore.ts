import { LazyStore } from '@tauri-apps/plugin-store';
import { create } from 'zustand';

import type { ProviderKind } from '@nuclearplayer/plugin-sdk';

const STORE_FILE = 'active-providers.json';
const STORE_KEY = 'active';
const store = new LazyStore(STORE_FILE);

type ProvidersStoreState = {
  active: Record<string, string>;
  loadFromDisk: () => Promise<void>;
  getActive: (kind: ProviderKind) => string | undefined;
  setActive: (kind: ProviderKind, providerId: string) => void;
  clearActive: (kind: ProviderKind) => void;
  clearAllActive: () => void;
};

const saveToDisk = async (): Promise<void> => {
  const { active } = useProvidersStore.getState();
  await store.set(STORE_KEY, active);
  await store.save();
};

export const useProvidersStore = create<ProvidersStoreState>((set, get) => ({
  active: {},

  loadFromDisk: async () => {
    const record = await store.get<Record<string, string>>(STORE_KEY);
    set({
      active: record ?? {},
    });
  },

  getActive: (kind: ProviderKind): string | undefined => {
    return get().active[kind];
  },

  setActive: (kind: ProviderKind, providerId: string) => {
    set((state) => ({
      active: { ...state.active, [kind]: providerId },
    }));
    void saveToDisk();
  },

  clearActive: (kind: ProviderKind) => {
    set((state) => {
      const rest = Object.fromEntries(
        Object.entries(state.active).filter(([key]) => key !== kind),
      );
      return { active: rest };
    });
    void saveToDisk();
  },

  clearAllActive: () => {
    set({ active: {} });
    void saveToDisk();
  },
}));

export const initializeProvidersStore = async (): Promise<void> => {
  await useProvidersStore.getState().loadFromDisk();
};
