import { FC } from 'react';

import { cn } from '../../utils';
import { Box } from '../Box';
import { Skeleton } from '../Skeleton';

type ThemeStoreItemSkeletonProps = {
  className?: string;
};

export const ThemeStoreItemSkeleton: FC<ThemeStoreItemSkeletonProps> = ({
  className,
}) => (
  <div data-testid="theme-store-item-skeleton" className="flex flex-row gap-2">
    <Box
      variant="tertiary"
      className={cn('relative h-auto overflow-hidden p-2', className)}
    >
      <Skeleton className="absolute inset-0 rounded-none border-0" />
      <Box
        variant="tertiary"
        shadow="none"
        className="relative flex-1 flex-row items-center justify-between gap-4"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex h-6 items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <div className="flex h-5 items-center">
            <Skeleton className="h-3 w-full" />
          </div>
          <div className="flex h-5 items-center">
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex h-4 items-center">
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-28 shrink-0" />
      </Box>
    </Box>
  </div>
);
