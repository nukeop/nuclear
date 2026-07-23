import { FC } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';

import { cn } from '../../../utils';
import { toActivities } from './activities';
import type { CalendarHeatmapProps } from './types';

const LIGHT_COLORS = [
  'var(--background-secondary)',
  'color-mix(in oklab, var(--accent-green) 25%, var(--background-secondary))',
  'color-mix(in oklab, var(--accent-green) 55%, var(--background-secondary))',
  'var(--accent-green)',
  'color-mix(in oklab, var(--accent-green) 70%, black)',
];

const DARK_COLORS = [
  'var(--background-secondary)',
  'color-mix(in oklab, var(--accent-green) 25%, var(--background-secondary))',
  'color-mix(in oklab, var(--accent-green) 55%, var(--background-secondary))',
  'color-mix(in oklab, var(--accent-green) 80%, var(--background-secondary))',
  'var(--accent-green)',
];

export const CalendarHeatmap: FC<CalendarHeatmapProps> = ({
  days,
  labels,
  colorScheme,
  className,
}) => (
  <div
    data-testid="calendar-heatmap"
    className={cn('w-fit text-xs', className)}
    style={{ color: 'var(--foreground-secondary)' }}
  >
    <ActivityCalendar
      data={toActivities(days)}
      colorScheme={colorScheme}
      theme={{ light: LIGHT_COLORS, dark: DARK_COLORS }}
      blockSize={10}
      blockMargin={3}
      blockRadius={4}
      showTotalCount={false}
      showWeekdayLabels
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
