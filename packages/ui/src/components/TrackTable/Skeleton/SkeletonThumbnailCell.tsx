import { FC } from 'react';

import { Skeleton } from '../../Skeleton';

export const SkeletonThumbnailCell: FC = () => (
  <td className="w-10 text-center">
    <Skeleton className="mx-auto size-8" />
  </td>
);
