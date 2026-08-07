import { useState } from 'react';

type RemoteSearch = {
  query: string;
  setQuery: (query: string) => void;
};

export const useRemoteSearch = (): RemoteSearch => {
  const [query, setQuery] = useState('');

  return {
    query,
    setQuery,
  };
};
