import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import type { Track } from '@nuclearplayer/model';

import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useRemoteActions } from './useRemoteActions';

type RemoteSearch = {
  query: string;
  setQuery: (query: string) => void;
  tracks: Track[];
  isError: boolean;
  isSuccess: boolean;
};

export const useRemoteSearch = (): RemoteSearch => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const { onSearchTracks } = useRemoteActions();

  const { data, isError, isSuccess } = useQuery({
    queryKey: ['remote-search', debouncedQuery],
    queryFn: () => onSearchTracks(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    retry: false,
  });

  return {
    query,
    setQuery,
    tracks: data?.tracks ?? [],
    isError,
    isSuccess,
  };
};
