import { useMemo, useState } from 'react';

import type {
  PlaylistIndexEntry,
  PlaylistIndexNode,
} from '@nuclearplayer/model';

export const usePlaylistFilter = (
  entries: PlaylistIndexNode[],
  searchablePlaylists: PlaylistIndexEntry[],
) => {
  const [filter, setFilter] = useState('');
  const query = filter.trim().toLowerCase();

  const filteredEntries = useMemo((): PlaylistIndexNode[] => {
    if (query.length === 0) {
      return entries;
    }
    return searchablePlaylists.filter((playlist) =>
      playlist.name.toLowerCase().includes(query),
    );
  }, [entries, searchablePlaylists, query]);

  return {
    filter,
    setFilter,
    filteredEntries,
    hasFilter: query.length > 0,
  };
};
