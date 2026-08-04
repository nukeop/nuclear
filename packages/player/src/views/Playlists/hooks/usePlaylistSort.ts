import { useState } from 'react';

export type PlaylistSortBy =
  | 'name'
  | 'dateAdded'
  | 'dateModified'
  | 'trackCount'
  | 'duration';

export type SortDirection = 'asc' | 'desc';

export const usePlaylistSort = () => {
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

  return { sortBy, setSortBy, sortDirection, toggleSortDirection };
};
