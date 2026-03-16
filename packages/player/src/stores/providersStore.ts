import { LazyStore } from '@tauri-apps/plugin-store';
import { create } from 'zustand';

import type { ProviderKind } from '@nuclearplayer/plugin-sdk';

const STORE_FILE = 'active-providers.json';
const STORE_KEY = 'active';
const store = new LazyStore(STORE_FILE);

type ProvidersStoreState = {
  active: Record<string, string>;
  loaded: boolean;
  loadFromDisk: () => Promise<void>;
  getActive: (kind: ProviderKind) => string | undefined;
  setActive: (kind: ProviderKind, providerId: string) => void;
  clearAllActive: () => void;
};

const saveToDisk = async (): Promise<void> => {
  const { active } = useProvidersStore.getState();
  await store.set(STORE_KEY, active);
  await store.save();
};

export const useProvidersStore = create<ProvidersStoreState>((set, get) => ({
  active: {},
  loaded: false,

  loadFromDisk: async () => {
    const record = await store.get<Record<string, string>>(STORE_KEY);
    set({
      active: record ?? {},
      loaded: true,
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

  clearAllActive: () => {
    set({ active: {} });
    void saveToDisk();
  },
}));

export const initializeProvidersStore = async (): Promise<void> => {
  await useProvidersStore.getState().loadFromDisk();
};
