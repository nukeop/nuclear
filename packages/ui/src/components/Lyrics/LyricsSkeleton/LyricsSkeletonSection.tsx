import { FC } from 'react';

import { cn } from '../../../utils';
import { Skeleton } from '../../Skeleton';

type LyricsSkeletonSectionProps = {
  lineWidths: string[];
};

export const LyricsSkeletonSection: FC<LyricsSkeletonSectionProps> = ({
  lineWidths,
}) => (
  <div className="flex flex-col gap-3">
    <Skeleton className="h-3 w-20" />
    {lineWidths.map((width, index) => (
      <Skeleton key={index} className={cn('h-8', width)} />
    ))}
  </div>
);
