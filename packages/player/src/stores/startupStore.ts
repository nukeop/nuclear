import { create } from 'zustand';

type StartupState = {
  isStartingUp: boolean;
  startupFinishedAt?: string;
  totalStartupTimeMs?: number;
  pluginDurations: Record<string, number>;
  startStartup: () => void;
  finishStartup: (totalMs: number) => void;
  setPluginDuration: (id: string, ms: number) => void;
};

export const useStartupStore = create<StartupState>((set) => ({
  isStartingUp: true,
  startupFinishedAt: undefined,
  totalStartupTimeMs: undefined,
  pluginDurations: {},
  startStartup: () => set({ isStartingUp: true }),
  finishStartup: (totalMs) =>
    set({
      isStartingUp: false,
      totalStartupTimeMs: totalMs,
      startupFinishedAt: new Date().toISOString(),
    }),
  setPluginDuration: (id, ms) =>
    set((state) => ({
      pluginDurations: { ...state.pluginDurations, [id]: ms },
    })),
}));
