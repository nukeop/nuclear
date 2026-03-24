import { HeaderContext } from '@tanstack/react-table';
import { LucideProps, SortAsc, SortDesc } from 'lucide-react';
import { FC, useCallback } from 'react';

import { Artwork, Track } from '@nuclearplayer/model';

import { cn } from '../../../utils';

type HeaderValue = string | number | Artwork;

export function IconHeader<T extends Track>({
  Icon,
  context,
}: {
  Icon: FC<LucideProps>;
  context: HeaderContext<T, HeaderValue>;
}) {
  const { getCanSort, getIsSorted, toggleSorting } = context.column;

  const isSorted = getIsSorted();
  const canSort = getCanSort();

  const onClick = useCallback(() => {
    if (canSort) {
      toggleSorting();
    }
  }, []);

  return (
    <th
      role="columnheader"
      className={cn('w-10 text-center', {
        'cursor-pointer': canSort,
      })}
      onClick={onClick}
    >
      <span className="flex w-full items-center justify-center">
        <Icon className="h-4 w-4" />
        {isSorted === 'desc' && <SortDesc className="ml-1 h-4 w-4" />}
        {isSorted === 'asc' && <SortAsc className="ml-1 h-4 w-4" />}
      </span>
    </th>
  );
}
