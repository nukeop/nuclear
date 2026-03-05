import { create } from 'zustand';

export type SettingsTab =
  | 'general'
  | 'shortcuts'
  | 'plugins'
  | 'themes'
  | 'logs'
  | 'whats-new';

type SettingsModalState = {
  isOpen: boolean;
  activeTab: SettingsTab;
  open: (tab?: SettingsTab) => void;
  close: () => void;
  setActiveTab: (tab: SettingsTab) => void;
};

export const useSettingsModalStore = create<SettingsModalState>((set) => ({
  isOpen: false,
  activeTab: 'general',
  open: (tab) =>
    set((state) => ({
      isOpen: true,
      ...(tab ? { activeTab: tab } : { activeTab: state.activeTab }),
    })),
  close: () => set({ isOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
