import { FC } from 'react';

import { Skeleton, StatChip } from '@nuclearplayer/ui';

type AlbumHeaderSkeletonProps = Record<string, never>;

export const AlbumHeaderSkeleton: FC<AlbumHeaderSkeletonProps> = () => (
  <div
    data-testid="album-header-skeleton"
    className="border-border surface-card shadow-shadow relative mx-6 mt-6 flex flex-col gap-6 rounded-md border-(length:--border-width) p-6 md:flex-row"
  >
    <Skeleton className="border-border shadow-shadow h-60 w-60 rounded-md border-(length:--border-width)" />
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
      </div>
      <div className="flex flex-wrap gap-3">
        <StatChip.Skeleton />
        <StatChip.Skeleton />
        <StatChip.Skeleton />
      </div>
    </div>
  </div>
);
