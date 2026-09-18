import { FC } from 'react';

import { CardsRow } from '@nuclearplayer/ui';

export const DashboardStartupSkeleton: FC = () => (
  <div data-testid="dashboard-skeleton" className="flex flex-col gap-8">
    {Array.from({ length: 3 }, (_, index) => (
      <CardsRow.Skeleton key={index} />
    ))}
  </div>
);
