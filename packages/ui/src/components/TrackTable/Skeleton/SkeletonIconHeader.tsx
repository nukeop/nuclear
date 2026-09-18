import { FC } from 'react';

import { Skeleton } from '../../Skeleton';

export const SkeletonIconHeader: FC = () => (
  <th role="columnheader" className="w-10 text-center">
    <div className="flex h-6 items-center justify-center">
      <Skeleton className="size-4" />
    </div>
  </th>
);
