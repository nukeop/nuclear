import { LazyStore } from '@tauri-apps/plugin-store';
import { create } from 'zustand';

import { Logger } from '../services/logger';
import { COMMANDS } from '../shortcuts/commands';
import { resolveErrorMessage } from '../utils/logging';

const SHORTCUTS_FILE = 'shortcuts.json';
const store = new LazyStore(SHORTCUTS_FILE);

type ShortcutsStore = {
  overrides: Record<string, string>;
  isRecording: boolean;
  loadFromDisk: () => Promise<void>;
  setShortcut: (commandId: string, shortcut: string) => void;
  resetShortcut: (commandId: string) => void;
  resetAll: () => void;
  setRecording: (recording: boolean) => void;
};

const saveToDisk = async (): Promise<void> => {
  try {
    const state = useShortcutsStore.getState();
    await store.set('shortcuts.overrides', state.overrides);
    await store.save();
  } catch (error) {
    Logger.settings.error(
      `Failed to save shortcuts: ${resolveErrorMessage(error)}`,
    );
  }
};

const withPersistence = <T extends unknown[]>(
  fn: (...args: T) => void,
): ((...args: T) => void) => {
  return (...args: T) => {
    fn(...args);
    void saveToDisk();
  };
};

export const useShortcutsStore = create<ShortcutsStore>((set) => ({
  overrides: {},
  isRecording: false,

  loadFromDisk: async () => {
    const overrides =
      (await store.get<Record<string, string>>('shortcuts.overrides')) ?? {};
    set({ overrides });
  },

  setShortcut: withPersistence((commandId: string, shortcut: string) => {
    set((state) => ({
      overrides: { ...state.overrides, [commandId]: shortcut },
    }));
  }),

  resetShortcut: withPersistence((commandId: string) => {
    set((state) => {
      const overrides = { ...state.overrides };
      delete overrides[commandId];
      return { overrides };
    });
  }),

  resetAll: withPersistence(() => {
    set({ overrides: {} });
  }),

  setRecording: (recording: boolean) => set({ isRecording: recording }),
}));

export const getEffectiveShortcut = (commandId: string): string => {
  const { overrides } = useShortcutsStore.getState();
  return overrides[commandId] ?? COMMANDS[commandId]?.defaultShortcut ?? '';
};

export const getEffectiveShortcuts = (): Record<string, string> =>
  Object.fromEntries(
    Object.keys(COMMANDS).map((id) => [id, getEffectiveShortcut(id)]),
  );

export const initializeShortcutsStore = async (): Promise<void> => {
  await useShortcutsStore.getState().loadFromDisk();
};
