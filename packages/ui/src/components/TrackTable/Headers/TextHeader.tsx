import type { HeaderContext } from '@tanstack/react-table';
import type { LegacyFeatures } from '@tanstack/react-table/legacy';
import { SortAsc, SortDesc } from 'lucide-react';
import { PropsWithChildren, useCallback } from 'react';

import { Track } from '@nuclearplayer/model';
import { cn } from '@nuclearplayer/ui';

export function TextHeader<T extends Track>({
  children,
  context,
}: PropsWithChildren<{
  context: HeaderContext<LegacyFeatures, T>;
}>) {
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
      className={cn('px-2 text-left', { 'cursor-pointer': canSort })}
      onClick={onClick}
    >
      <span className="flex items-center">
        {children}
        {isSorted === 'desc' && <SortDesc className="ml-1 h-4 w-4" />}
        {isSorted === 'asc' && <SortAsc className="ml-1 h-4 w-4" />}
      </span>
    </th>
  );
}
