import { create } from 'zustand';

type HistoryState = {
  currentPlayId: string | null;
  beginPlay: () => string;
  clearPlay: () => void;
};

export const useHistoryStore = create<HistoryState>()((set) => ({
  currentPlayId: null,
  beginPlay: () => {
    const playId = crypto.randomUUID();
    set({ currentPlayId: playId });
    return playId;
  },
  clearPlay: () => set({ currentPlayId: null }),
}));
