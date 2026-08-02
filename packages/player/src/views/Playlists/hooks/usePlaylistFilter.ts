import { useMemo, useState } from 'react';

import type { PlaylistIndexEntry } from '@nuclearplayer/model';

export const usePlaylistFilter = (index: PlaylistIndexEntry[]) => {
  const [filter, setFilter] = useState('');
  const query = filter.trim().toLowerCase();

  const filteredIndex = useMemo(() => {
    if (query.length === 0) {
      return index;
    }
    return index.filter((entry) => entry.name.toLowerCase().includes(query));
  }, [index, query]);

  return {
    filter,
    setFilter,
    filteredIndex,
    hasFilter: query.length > 0,
  };
};
