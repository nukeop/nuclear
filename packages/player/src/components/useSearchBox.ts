import { useRouter } from '@tanstack/react-router';
import { KeyboardEvent, RefObject, useRef } from 'react';

import { useSearchQuery } from './useSearchQuery';

export const useSearchBox = () => {
  const { query, setQuery } = useSearchQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const submit = () => {
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      router.navigate({ to: '/search', search: { q: trimmed } });
    }
  };

  const clear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
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
    handleKeyDown,
    clear,
  };
};
