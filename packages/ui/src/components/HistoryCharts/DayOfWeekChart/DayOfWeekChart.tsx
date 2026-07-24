import { FC } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts';

import { cn } from '../../../utils';
import type { DayOfWeekChartProps } from './types';

export const DayOfWeekChart: FC<DayOfWeekChartProps> = ({
  values,
  labels,
  className,
}) => {
  const data = labels.weekdays.map((weekday, index) => ({
    weekday,
    value: values[index] ?? 0,
  }));

  return (
    <div className={cn('h-full w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="weekday"
            tickLine={false}
            axisLine={false}
            tick={{ className: 'fill-foreground-secondary text-xs' }}
          />
          <Bar dataKey="value" className="fill-primary" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
