import range from 'lodash-es/range';
import { FC } from 'react';

import { ThemeStoreItem } from '@nuclearplayer/ui';

export const ThemeStoreSkeletonList: FC = () => (
  <div className="flex flex-col gap-4" data-testid="theme-store-skeleton">
    {range(6).map((index) => (
      <ThemeStoreItem.Skeleton key={index} />
    ))}
  </div>
);
