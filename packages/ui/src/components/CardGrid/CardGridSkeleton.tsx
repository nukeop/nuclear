import range from 'lodash-es/range';
import { FC } from 'react';

import { Card } from '../Card';
import { CardGridBase } from './CardGridBase';

type CardGridSkeletonProps = {
  count?: number;
  className?: string;
  'data-testid'?: string;
};

export const CardGridSkeleton: FC<CardGridSkeletonProps> = ({
  count = 8,
  className,
  'data-testid': dataTestId = 'card-grid-skeleton',
}) => (
  <CardGridBase className={className} data-testid={dataTestId}>
    {range(count).map((index) => (
      <Card.Skeleton key={index} />
    ))}
  </CardGridBase>
);
