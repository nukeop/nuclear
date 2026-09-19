import { FC } from 'react';

import { cn } from '../../utils';
import { Box } from '../Box';
import { Skeleton } from '../Skeleton';

type PluginStoreItemSkeletonProps = {
  className?: string;
};

export const PluginStoreItemSkeleton: FC<PluginStoreItemSkeletonProps> = ({
  className,
}) => (
  <Box
    data-testid="plugin-store-item-skeleton"
    variant="tertiary"
    className={cn('flex-row items-center justify-between gap-4', className)}
  >
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="flex h-5 items-center gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-10 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex h-5 items-center">
        <Skeleton className="h-3 w-full" />
      </div>
      <div className="flex h-5 items-center">
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>

    <Skeleton className="h-10 w-28 shrink-0" />
  </Box>
);
