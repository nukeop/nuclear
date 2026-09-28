import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

import {
  Box,
  DayOfWeekChart,
  ListeningClock,
  type DayOfWeekValues,
} from '@nuclearplayer/ui';

const MINUTES_PER_HOUR = [
  150, 70, 25, 10, 0, 0, 15, 60, 110, 95, 80, 85, 120, 105, 90, 100, 130, 190,
  280, 400, 520, 480, 380, 250,
];

const MINUTES_PER_WEEKDAY: DayOfWeekValues = [95, 80, 105, 90, 140, 170, 215];

const CLOCK_LABELS = {
  busiestHour: 'Busiest hour',
  busiestHourValue: 'Listening time',
};

const WEEKDAY_LABELS = {
  weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

const formatMinutes = (minutes: number) =>
  `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

const formatHour = (hour: number) => `${hour}:00`;

type StatsCardProps = {
  title: string;
  className?: string;
  children: ReactNode;
};

const StatsCard: FC<StatsCardProps> = ({ title, className, children }) => (
  <Box variant="tertiary" className={clsx('h-auto flex-col gap-3', className)}>
    <h3 className="font-heading text-xl">{title}</h3>
    {children}
  </Box>
);

export const ListeningStatsWidget: FC = () => (
  <div className="@container w-full">
    <div className="flex flex-col items-stretch gap-4 @3xl:flex-row">
      <StatsCard title="Time of day" className="w-auto">
        <ListeningClock
          className="flex-wrap justify-center gap-y-4"
          values={MINUTES_PER_HOUR}
          labels={CLOCK_LABELS}
          formatValue={formatMinutes}
          formatHour={formatHour}
        />
      </StatsCard>
      <StatsCard title="Day of week" className="min-w-0 flex-1">
        <div className="h-48 min-h-0 @3xl:h-auto @3xl:flex-1">
          <DayOfWeekChart
            values={MINUTES_PER_WEEKDAY}
            labels={WEEKDAY_LABELS}
            formatValue={formatMinutes}
          />
        </div>
      </StatsCard>
    </div>
  </div>
);
