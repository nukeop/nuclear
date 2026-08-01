import { FC } from 'react';

import { ChartTooltip } from '../ChartTooltip';

type DayOfWeekTooltipProps = {
  active?: boolean;
  payload?: { payload: { weekday: string; value: number } }[];
  formatValue: (value: number) => string;
};

export const DayOfWeekTooltip: FC<DayOfWeekTooltipProps> = ({
  active,
  payload,
  formatValue,
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  const { weekday, value } = payload[0].payload;

  return <ChartTooltip value={formatValue(value)} label={weekday} />;
};
