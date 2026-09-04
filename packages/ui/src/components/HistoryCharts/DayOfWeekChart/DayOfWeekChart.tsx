import { FC } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { DayOfWeekTooltip } from './DayOfWeekTooltip';
import type { DayOfWeekChartProps } from './types';

const barTopRadius: [number, number, number, number] = [4, 4, 0, 0];

export const DayOfWeekChart: FC<DayOfWeekChartProps> = ({
  values,
  labels,
  formatValue,
  className,
  ...props
}) => {
  const data = labels.weekdays.map((weekday, index) => ({
    weekday,
    value: values[index] ?? 0,
  }));

  return (
    <ResponsiveContainer
      data-testid="day-of-week-chart"
      width="100%"
      height="100%"
      className={className}
      {...props}
    >
      <BarChart data={data}>
        <XAxis
          dataKey="weekday"
          tickLine={false}
          axisLine={false}
          tick={{ className: 'fill-muted-foreground text-xs' }}
        />
        <Tooltip
          cursor={false}
          content={<DayOfWeekTooltip formatValue={formatValue} />}
        />
        <Bar
          dataKey="value"
          radius={barTopRadius}
          fill="var(--color-primary)"
          stroke="var(--color-border)"
          className="stroke-(length:--border-width)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
