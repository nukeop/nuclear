import { useState } from 'react';

const MAX_RECENT_SEARCHES = 5;

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const addRecentSearch = (query: string) => {
    setRecentSearches((previous) =>
      [query, ...previous].slice(0, MAX_RECENT_SEARCHES),
    );
  };

  return {
    recentSearches,
    addRecentSearch,
  };
};
