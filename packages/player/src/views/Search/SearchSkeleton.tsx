import { FC } from 'react';

import { Card, CardGrid } from '@nuclearplayer/ui';

export const SearchSkeleton: FC = () => (
  <CardGrid data-testid="search-skeleton">
    {Array.from({ length: 8 }, (_, index) => (
      <Card.Skeleton key={index} />
    ))}
  </CardGrid>
);
