import { FC } from 'react';

import { Skeleton } from '../../Skeleton';

export const SkeletonIconCell: FC = () => (
  <td className="w-10 text-center">
    <Skeleton className="mx-auto size-4" />
  </td>
);
