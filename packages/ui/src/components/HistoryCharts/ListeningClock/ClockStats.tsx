import { FC } from 'react';

import type { ListeningClockLabels } from './types';

type ClockStatsProps = {
  labels: ListeningClockLabels;
  busiestHour: string;
  busiestHourValue: string;
};

export const ClockStats: FC<ClockStatsProps> = ({
  labels,
  busiestHour,
  busiestHourValue,
}) => (
  <div data-testid="listening-clock-stats" className="flex flex-col gap-5">
    <div className="flex flex-col gap-1">
      <span className="text-foreground-secondary text-sm font-bold">
        {labels.busiestHour}
      </span>
      <span
        data-testid="listening-clock-busiest-hour"
        className="font-heading text-3xl leading-none font-extrabold"
      >
        {busiestHour}
      </span>
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-foreground-secondary text-sm font-bold">
        {labels.busiestHourValue}
      </span>
      <span
        data-testid="listening-clock-busiest-value"
        className="font-heading text-3xl leading-none font-extrabold"
      >
        {busiestHourValue}
      </span>
    </div>
  </div>
);
