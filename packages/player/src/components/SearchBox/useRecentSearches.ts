import { create } from 'zustand';

const MAX_RECENT_SEARCHES = 5;

type RecentSearchesState = {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
};

export const useRecentSearches = create<RecentSearchesState>((set) => ({
  recentSearches: [],
  addRecentSearch: (query) =>
    set((state) => ({
      recentSearches: [
        query,
        ...state.recentSearches.filter((item) => item !== query),
      ].slice(0, MAX_RECENT_SEARCHES),
    })),
  clearRecentSearches: () => set({ recentSearches: [] }),
}));
