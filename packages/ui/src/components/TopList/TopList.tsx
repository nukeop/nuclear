import { FC } from 'react';

import { cn } from '../../utils';
import type { TopListProps } from './types';

export const TopList: FC<TopListProps> = ({ title, className }) => (
  <div className={cn('flex flex-col gap-3', className)}>
    <h3>{title}</h3>
    <div></div>
  </div>
);
