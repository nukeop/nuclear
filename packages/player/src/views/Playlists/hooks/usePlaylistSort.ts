import { useMemo, useState } from 'react';

import type {
  PlaylistFolder,
  PlaylistIndexEntry,
  PlaylistIndexNode,
} from '@nuclearplayer/model';

export type PlaylistSortBy =
  'custom' | 'name' | 'dateAdded' | 'dateModified' | 'trackCount' | 'duration';

export type SortDirection = 'asc' | 'desc';

const comparePlaylists = (
  left: PlaylistIndexEntry,
  right: PlaylistIndexEntry,
  sortBy: Exclude<PlaylistSortBy, 'custom'>,
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

const sortInDirection = <Entry extends PlaylistIndexNode>(
  entries: Entry[],
  compare: (left: Entry, right: Entry) => number,
  sortDirection: SortDirection,
): Entry[] => {
  const ascending = [...entries].sort(compare);

  if (sortDirection === 'desc') {
    return ascending.reverse();
  }

  return ascending;
};

const compareNames = (left: PlaylistFolder, right: PlaylistFolder) =>
  left.name.localeCompare(right.name);

export const usePlaylistSort = (entries: PlaylistIndexNode[]) => {
  const [sortBy, setSortBy] = useState<PlaylistSortBy>('custom');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const selectSortBy = (nextSortBy: PlaylistSortBy) => {
    setSortBy(nextSortBy);
    if (nextSortBy === 'custom') {
      setSortDirection('asc');
    }
  };

  const toggleSortDirection = () => {
    setSortDirection((current) => {
      if (current === 'asc') {
        return 'desc';
      }
      return 'asc';
    });
  };

  const sortedEntries = useMemo((): PlaylistIndexNode[] => {
    if (sortBy === 'custom') {
      return entries;
    }

    const folders = entries.filter((entry) => entry.kind === 'folder');
    const playlists = entries.filter((entry) => entry.kind === 'playlist');

    return [
      ...sortInDirection(folders, compareNames, sortDirection),
      ...sortInDirection(
        playlists,
        (left, right) => comparePlaylists(left, right, sortBy),
        sortDirection,
      ),
    ];
  }, [entries, sortBy, sortDirection]);

  return {
    sortBy,
    setSortBy: selectSortBy,
    sortDirection,
    toggleSortDirection,
    sortedEntries,
  };
};
