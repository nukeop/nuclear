import type { FilterFn } from '@tanstack/react-table';
import type { LegacyFeatures } from '@tanstack/react-table/legacy';
import { useMemo, useState } from 'react';

import type { Track } from '@nuclearplayer/model';

export type UseGlobalFilterResult<T extends Track> = {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  globalFilterFn: FilterFn<LegacyFeatures, T>;
  hasFilter: boolean;
};

export function useGlobalFilter<T extends Track>(): UseGlobalFilterResult<T> {
  const [globalFilter, setGlobalFilter] = useState('');

  const globalFilterFn: FilterFn<LegacyFeatures, T> = useMemo(() => {
    return (row, _columnId, filterValue) => {
      const query = String(filterValue ?? '')
        .toLowerCase()
        .trim();

      if (query.length === 0) {
        return true;
      }

      const track = row.original;
      const artist = track.artists?.[0]?.name ?? '';
      const title = track.title ?? '';
      const album = track.album?.title ?? '';

      return (
        artist.toLowerCase().includes(query) ||
        title.toLowerCase().includes(query) ||
        album.toLowerCase().includes(query)
      );
    };
  }, []);

  const hasFilter = (globalFilter ?? '').trim().length > 0;

  return { globalFilter, setGlobalFilter, globalFilterFn, hasFilter } as const;
}
