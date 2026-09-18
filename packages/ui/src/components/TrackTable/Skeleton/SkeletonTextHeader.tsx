import { FC } from 'react';

import { Skeleton } from '../../Skeleton';

export const SkeletonTextHeader: FC = () => (
  <th role="columnheader" className="px-2 text-left">
    <div className="flex h-6 items-center">
      <Skeleton className="h-3.5 w-16" />
    </div>
  </th>
);
