import { FC } from 'react';

import { Skeleton } from '../Skeleton';

export const StreamVerificationSkeleton: FC = () => (
  <span
    data-testid="stream-verification-loader"
    className="flex items-center gap-2"
  >
    <Skeleton className="size-2.5 rounded-full" />
    <Skeleton className="h-3 w-20" />
  </span>
);
