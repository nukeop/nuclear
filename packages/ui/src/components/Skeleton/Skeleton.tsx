import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';

type SkeletonProps = ComponentProps<'div'> & {
  'data-testid'?: string;
};

export const Skeleton: FC<SkeletonProps> = ({
  className,
  'data-testid': testId = 'skeleton',
  ...props
}) => (
  <div
    data-testid={testId}
    className={cn(
      'bg-muted border-border animate-pulse rounded-md border-(length:--border-width)',
      className,
    )}
    {...props}
  />
);
