import { FC } from 'react';

import { cn } from '../../utils';
import { Badge } from '../Badge';
import { Card } from '../Card';
import { Skeleton } from '../Skeleton';

type CardsRowSkeletonTitleProps = {
  title?: string;
};

const CardsRowSkeletonTitle: FC<CardsRowSkeletonTitleProps> = ({ title }) => {
  if (title) {
    return <h2 className="text-foreground text-lg font-bold">{title}</h2>;
  }

  return (
    <Skeleton data-testid="cards-row-skeleton-title" className="h-5 w-32" />
  );
};

type CardsRowSkeletonProps = {
  title?: string;
  badge?: string;
  count?: number;
  className?: string;
  'data-testid'?: string;
};

export const CardsRowSkeleton: FC<CardsRowSkeletonProps> = ({
  title,
  badge,
  count = 5,
  className,
  'data-testid': testId = 'cards-row-skeleton',
}) => (
  <div data-testid={testId} className={cn('flex flex-col gap-3', className)}>
    <div className="flex min-h-10 items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <CardsRowSkeletonTitle title={title} />
        {badge && (
          <Badge data-testid="cards-row-badge" variant="pill" color="purple">
            {badge}
          </Badge>
        )}
      </div>
    </div>

    <div className="flex gap-2 overflow-hidden pb-2">
      {Array.from({ length: count }, (_, index) => (
        <Card.Skeleton key={index} className="shrink-0" />
      ))}
    </div>
  </div>
);
