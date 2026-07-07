import { useNavigate } from '@tanstack/react-router';
import { RefObject, useEffect, useState } from 'react';

import { useRecentSearches } from './useRecentSearches';

export const useSearchPopover = (
  inputRef: RefObject<HTMLInputElement>,
  isOpen: boolean,
) => {
  const { recentSearches, clearRecentSearches } = useRecentSearches();
  const navigate = useNavigate();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const clearIndex = recentSearches.length;

  const navigateToSearch = (query: string) =>
    navigate({ to: '/search', search: { q: query } });

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input || !isOpen || recentSearches.length === 0) {
      return;
    }

    const rowCount = recentSearches.length + 1;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedIndex((previous) => (previous + 1) % rowCount);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedIndex((previous) =>
          previous <= 0 ? rowCount - 1 : previous - 1,
        );
        return;
      }

      if (event.key === 'Enter' && highlightedIndex >= 0) {
        event.preventDefault();
        if (highlightedIndex === recentSearches.length) {
          clearRecentSearches();
          return;
        }
        navigateToSearch(recentSearches[highlightedIndex]);
        input.blur();
      }
    };

    input.addEventListener('keydown', handleKeyDown);
    return () => input.removeEventListener('keydown', handleKeyDown);
  }, [
    inputRef,
    isOpen,
    recentSearches,
    highlightedIndex,
    navigate,
    clearRecentSearches,
  ]);

  return {
    recentSearches,
    clearRecentSearches,
    navigateToSearch,
    highlightedIndex,
    setHighlightedIndex,
    clearIndex,
  };
};
