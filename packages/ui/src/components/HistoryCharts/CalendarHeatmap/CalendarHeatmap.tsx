import { FC } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';

import { cn } from '../../../utils';
import { toActivities } from './activities';
import type { CalendarHeatmapProps } from './types';

export const CalendarHeatmap: FC<CalendarHeatmapProps> = ({
  days,
  labels,
  className,
}) => {
  return (
    <div data-testid="calendar-heatmap" className={cn('w-fit', className)}>
      <ActivityCalendar
        data={toActivities(days)}
        labels={{
          months: labels.months,
          weekdays: labels.weekdays,
          legend: {
            less: labels.legendLess,
            more: labels.legendMore,
          },
        }}
      />
    </div>
  );
};
