import { FC } from 'react';

import { Skeleton } from '@nuclearplayer/ui';

export const ArtistBioHeaderSkeleton: FC = () => (
  <div
    data-testid="artist-header-skeleton"
    className="border-border surface-card shadow-shadow relative m-4 rounded-md border-(length:--border-width) p-6"
  >
    <div className="flex gap-6">
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-5">
          <Skeleton className="h-24 w-24 shrink-0 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
      </div>
      <Skeleton className="h-56 w-72 shrink-0" />
    </div>
  </div>
);
