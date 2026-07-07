import { KeyboardEvent, useEffect, useState } from 'react';

import { useRecentSearches } from './useRecentSearches';

type SearchPopoverParams = {
  isOpen: boolean;
  onSelect: (query: string) => void;
};

const NO_HIGHLIGHT = -1;

export const useSearchPopover = ({ isOpen, onSelect }: SearchPopoverParams) => {
  const { recentSearches, clearRecentSearches } = useRecentSearches();
  const [highlightedIndex, setHighlightedIndex] = useState(NO_HIGHLIGHT);

  const clearIndex = recentSearches.length;
  const rowCount = recentSearches.length + 1;

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(NO_HIGHLIGHT);
    }
  }, [isOpen]);

  const clearHistory = () => {
    clearRecentSearches();
    setHighlightedIndex(NO_HIGHLIGHT);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): boolean => {
    if (!isOpen || recentSearches.length === 0) {
      return false;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((previous) => (previous + 1) % rowCount);
      return true;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((previous) =>
        previous <= 0 ? rowCount - 1 : previous - 1,
      );
      return true;
    }

    if (event.key === 'Enter' && highlightedIndex !== NO_HIGHLIGHT) {
      if (highlightedIndex === clearIndex) {
        clearHistory();
        return true;
      }

      onSelect(recentSearches[highlightedIndex]);
      return true;
    }

    return false;
  };

  return {
    recentSearches,
    highlightedIndex,
    highlightIndex: setHighlightedIndex,
    select: onSelect,
    clearHistory,
    handleKeyDown,
  };
};
