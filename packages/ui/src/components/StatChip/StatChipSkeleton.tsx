import { FC } from 'react';

import { cn } from '../../utils';
import { Skeleton } from '../Skeleton';

type StatChipSkeletonProps = {
  className?: string;
};

export const StatChipSkeleton: FC<StatChipSkeletonProps> = ({ className }) => (
  <div
    data-testid="stat-chip-skeleton"
    className={cn(
      'border-border bg-background shadow-shadow flex items-center gap-2 rounded-md border-(length:--border-width) px-2 py-1',
      className,
    )}
  >
    <div className="flex h-7 items-center">
      <Skeleton className="h-4 w-10" />
    </div>
    <div className="flex h-4 items-center">
      <Skeleton className="h-2.5 w-16" />
    </div>
  </div>
);
