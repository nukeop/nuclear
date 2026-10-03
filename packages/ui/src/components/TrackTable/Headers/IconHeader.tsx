import type { HeaderContext } from '@tanstack/react-table';
import type { LegacyFeatures } from '@tanstack/react-table/legacy';
import { LucideProps, SortAsc, SortDesc } from 'lucide-react';
import { FC, useCallback } from 'react';

import { Track } from '@nuclearplayer/model';

import { cn } from '../../../utils';

export function IconHeader<T extends Track>({
  Icon,
  context,
}: {
  Icon: FC<LucideProps>;
  context: HeaderContext<LegacyFeatures, T>;
}) {
  const isSorted = context.column.getIsSorted();
  const canSort = context.column.getCanSort();

  const onClick = useCallback(() => {
    if (canSort) {
      context.column.toggleSorting();
    }
  }, [canSort, context.column]);

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
