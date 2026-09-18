import { FC } from 'react';

import { cn } from '../../utils';
import { Box } from '../Box';
import { Skeleton } from '../Skeleton';

type CardSkeletonProps = {
  className?: string;
};

export const CardSkeleton: FC<CardSkeletonProps> = ({ className }) => (
  <div
    data-testid="card-skeleton"
    className={cn(
      'surface-card border-border shadow-shadow flex w-42 flex-col items-stretch gap-2 rounded-md border-(length:--border-width) p-2',
      className,
    )}
  >
    <Box
      variant="primary"
      shadow="none"
      className="surface-card aspect-square w-full overflow-hidden p-0"
    >
      <Skeleton className="h-full w-full rounded-none border-0" />
    </Box>

    <div className="flex min-w-0 flex-col">
      <div className="flex h-5 items-center">
        <Skeleton className="h-3.5 w-3/4" />
      </div>
      <div className="flex h-4 items-center">
        <Skeleton className="h-2.5 w-1/2" />
      </div>
    </div>
  </div>
);
