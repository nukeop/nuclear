import { FC } from 'react';

import { cn } from '../../../utils';
import { Skeleton } from '../../Skeleton';

type SkeletonTextCellProps = {
  rowIndex: number;
};

export const SkeletonTextCell: FC<SkeletonTextCellProps> = ({ rowIndex }) => {
  const widths = ['w-3/4', 'w-1/2', 'w-2/3', 'w-5/6'];

  return (
    <td className="px-2">
      <Skeleton className={cn('h-3.5', widths[rowIndex % widths.length])} />
    </td>
  );
};
