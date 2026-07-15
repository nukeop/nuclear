import { FC } from 'react';

import { cn } from '../../utils';
import type { HistoryDayGroupProps } from './types';

export const HistoryDayGroup: FC<HistoryDayGroupProps> = ({
  marker,
  children,
  classes,
  className,
  ...props
}) => (
  <section
    data-testid="history-day-group"
    className={cn(
      'flex w-full flex-col items-start justify-start',
      classes?.root,
      className,
    )}
    {...props}
  >
    <h2
      data-testid="history-day-marker"
      className={cn(
        'mb-3 flex w-full flex-0 flex-row text-left text-2xl font-bold',
        classes?.marker,
      )}
    >
      {marker}
    </h2>
    <div
      className={cn(
        'border-border w-full border-(length:--border-width)',
        classes?.rows,
      )}
    >
      {children}
    </div>
  </section>
);
