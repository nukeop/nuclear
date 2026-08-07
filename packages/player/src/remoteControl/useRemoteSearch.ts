import { debounce } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { useRemoteActions } from './useRemoteActions';

type RemoteSearch = {
  query: string;
  setQuery: (query: string) => void;
};

const useSearchAction = () => {
  const actions = useRemoteActions();
  const search = debounce((query: string) => {
    actions.onSearchTracks(query);
  }, 300);

  return useMemo(() => search, []);
};

export const useRemoteSearch = (): RemoteSearch => {
  const [query, setQuery] = useState('');

  const search = useSearchAction();
  useEffect(() => search(query), [query]);
  useEffect(() => search.cancel, [search]);

  return {
    query,
    setQuery,
  };
};
