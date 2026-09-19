import range from 'lodash-es/range';
import { FC } from 'react';

import { Skeleton } from '@nuclearplayer/ui';

type ArtistSimilarArtistsSkeletonProps = Record<string, never>;

export const ArtistSimilarArtistsSkeleton: FC<
  ArtistSimilarArtistsSkeletonProps
> = () => (
  <div data-testid="similar-artists-skeleton" className="flex flex-col">
    <Skeleton className="mb-2 h-7 w-32" />
    <ul className="divide-border surface-card border-border divide-y-(length:--border-width) border border-(length:--border-width)">
      {range(5).map((rowIndex) => (
        <li key={rowIndex} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-none" />
          <Skeleton className="h-4 w-32" />
        </li>
      ))}
    </ul>
  </div>
);
