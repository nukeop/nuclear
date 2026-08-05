import { useMemo, useState } from 'react';

import type { PlaylistIndexEntry } from '@nuclearplayer/model';

export const usePlaylistFilter = (playlists: PlaylistIndexEntry[]) => {
  const [filter, setFilter] = useState('');
  const query = filter.trim().toLowerCase();

  const filteredPlaylists = useMemo(() => {
    if (query.length === 0) {
      return playlists;
    }
    return playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(query),
    );
  }, [playlists, query]);

  return {
    filter,
    setFilter,
    filteredPlaylists,
    hasFilter: query.length > 0,
  };
};
