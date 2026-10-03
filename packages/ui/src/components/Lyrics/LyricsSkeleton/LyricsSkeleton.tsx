import { ComponentProps, FC } from 'react';

import { cn } from '../../../utils';
import { LyricsSkeletonSection } from './LyricsSkeletonSection';

type LyricsSkeletonProps = Omit<ComponentProps<'div'>, 'children'> & {
  'data-testid'?: string;
};

export const LyricsSkeleton: FC<LyricsSkeletonProps> = ({
  className,
  'data-testid': testId = 'lyrics-skeleton',
  ...props
}) => (
  <div
    data-testid={testId}
    className={cn('flex flex-col gap-8', className)}
    {...props}
  >
    <LyricsSkeletonSection lineWidths={['w-3/4', 'w-1/2', 'w-2/3', 'w-5/6']} />
    <LyricsSkeletonSection lineWidths={['w-2/3', 'w-4/5', 'w-1/2', 'w-3/5']} />
  </div>
);
