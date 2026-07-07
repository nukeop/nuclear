import { useNavigate } from '@tanstack/react-router';
import { KeyboardEvent, RefObject, useRef, useState } from 'react';

import { useRecentSearches } from './useRecentSearches';
import { useSearchPopover } from './useSearchPopover';
import { useSearchQuery } from './useSearchQuery';

export const useSearchBox = () => {
  const { query, setQuery } = useSearchQuery();
  const addRecentSearch = useRecentSearches((state) => state.addRecentSearch);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);

  const goToSearch = (searchQuery: string) => {
    navigate({ to: '/search', search: { q: searchQuery } });
    inputRef.current?.blur();
  };

  const popover = useSearchPopover({ isOpen: isFocused, onSelect: goToSearch });

  const submit = () => {
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      addRecentSearch(trimmed);
      goToSearch(trimmed);
    }
  };

  const clear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (popover.handleKeyDown(event)) {
      return;
    }

    if (event.key === 'Enter') {
      submit();
      return;
    }

    if (event.key === 'Escape') {
      if (query.length > 0) {
        setQuery('');
        return;
      }

      inputRef.current?.blur();
    }
  };

  return {
    query,
    setQuery,
    inputRef: inputRef as RefObject<HTMLInputElement>,
    isFocused,
    setIsFocused,
    handleKeyDown,
    clear,
    popover,
  };
};
