import { FC } from 'react';

import { cn } from '../../../utils';
import { Skeleton } from '../../Skeleton';

type SkeletonTextHeaderProps = {
  className?: string;
};

export const SkeletonTextHeader: FC<SkeletonTextHeaderProps> = ({
  className,
}) => (
  <th role="columnheader" className={cn('px-2 text-left', className)}>
    <div className="flex h-6 items-center">
      <Skeleton className="h-3.5 w-16" />
    </div>
  </th>
);
