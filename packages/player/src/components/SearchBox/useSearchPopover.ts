import { useNavigate } from '@tanstack/react-router';

import { useRecentSearches } from './useRecentSearches';

export const useSearchPopover = () => {
  const { recentSearches, clearRecentSearches } = useRecentSearches();
  const navigate = useNavigate();

  const navigateToSearch = (query: string) =>
    navigate({ to: '/search', search: { q: query } });

  return {
    recentSearches,
    clearRecentSearches,
    navigateToSearch,
  };
};
