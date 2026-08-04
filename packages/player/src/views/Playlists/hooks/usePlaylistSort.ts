import { useMemo, useState } from 'react';

import type { PlaylistIndexEntry } from '@nuclearplayer/model';

export type PlaylistSortBy =
  | 'name'
  | 'dateAdded'
  | 'dateModified'
  | 'trackCount'
  | 'duration';

export type SortDirection = 'asc' | 'desc';

const comparePlaylists = (
  left: PlaylistIndexEntry,
  right: PlaylistIndexEntry,
  sortBy: PlaylistSortBy,
): number => {
  switch (sortBy) {
    case 'name':
      return left.name.localeCompare(right.name);
    case 'dateAdded':
      return left.createdAtIso.localeCompare(right.createdAtIso);
    case 'dateModified':
      return left.lastModifiedIso.localeCompare(right.lastModifiedIso);
    case 'trackCount':
      return left.itemCount - right.itemCount;
    case 'duration':
      return left.totalDurationMs - right.totalDurationMs;
  }
};

export const usePlaylistSort = (playlists: PlaylistIndexEntry[]) => {
  const [sortBy, setSortBy] = useState<PlaylistSortBy>('dateAdded');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const toggleSortDirection = () => {
    setSortDirection((current) => {
      if (current === 'asc') {
        return 'desc';
      }
      return 'asc';
    });
  };

  const sortedPlaylists = useMemo(() => {
    const ascending = [...playlists].sort((left, right) =>
      comparePlaylists(left, right, sortBy),
    );

    if (sortDirection === 'desc') {
      return ascending.reverse();
    }

    return ascending;
  }, [playlists, sortBy, sortDirection]);

  return {
    sortBy,
    setSortBy,
    sortDirection,
    toggleSortDirection,
    sortedPlaylists,
  };
};
