import { create } from 'zustand';

export type PluginsTab = 'installed' | 'store';

type SettingsModalState = {
  isOpen: boolean;
  activeItemId: string | null;
  pluginsTab: PluginsTab;
  open: (itemId?: string) => void;
  openPluginStore: () => void;
  close: () => void;
  selectItem: (itemId: string) => void;
  selectPluginsTab: (tab: PluginsTab) => void;
};

export const useSettingsModalStore = create<SettingsModalState>((set) => ({
  isOpen: false,
  activeItemId: null,
  pluginsTab: 'installed',
  open: (itemId) =>
    set((state) => ({
      isOpen: true,
      activeItemId: itemId ?? state.activeItemId,
    })),
  openPluginStore: () =>
    set({ isOpen: true, activeItemId: 'app-plugins', pluginsTab: 'store' }),
  close: () => set({ isOpen: false }),
  selectItem: (itemId) => set({ activeItemId: itemId }),
  selectPluginsTab: (pluginsTab) => set({ pluginsTab }),
}));
