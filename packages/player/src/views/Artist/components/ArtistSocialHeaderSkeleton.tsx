import { FC } from 'react';

import { Skeleton, StatChip } from '@nuclearplayer/ui';

type ArtistSocialHeaderSkeletonProps = Record<string, never>;

export const ArtistSocialHeaderSkeleton: FC<
  ArtistSocialHeaderSkeletonProps
> = () => (
  <div
    className="border-border surface-card shadow-shadow relative m-4 rounded-md border-(length:--border-width) p-6"
    data-testid="artist-social-header"
  >
    <div data-testid="artist-social-header-skeleton">
      <div className="flex items-center gap-5">
        <Skeleton className="h-24 w-24 shrink-0 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <StatChip.Skeleton />
        <StatChip.Skeleton />
        <StatChip.Skeleton />
        <StatChip.Skeleton />
      </div>
    </div>
  </div>
);
