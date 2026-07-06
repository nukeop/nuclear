import { useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const useSearchQuery = () => {
  const [query, setQuery] = useState('');
  const urlQuery = useSearch({
    strict: false,
    select: (search) => search.q,
  });

  useEffect(() => {
    if (urlQuery !== undefined) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  return { query, setQuery };
};
