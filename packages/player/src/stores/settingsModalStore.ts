import { create } from 'zustand';

type SettingsModalState = {
  isOpen: boolean;
  activeItemId: string | null;
  open: (itemId?: string) => void;
  close: () => void;
  selectItem: (itemId: string) => void;
};

export const useSettingsModalStore = create<SettingsModalState>((set) => ({
  isOpen: false,
  activeItemId: null,
  open: (itemId) =>
    set((state) => ({
      isOpen: true,
      activeItemId: itemId ?? state.activeItemId,
    })),
  close: () => set({ isOpen: false }),
  selectItem: (itemId) => set({ activeItemId: itemId }),
}));
