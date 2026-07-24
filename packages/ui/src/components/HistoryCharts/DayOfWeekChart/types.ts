import type { ComponentProps } from 'react';

export type DayOfWeekChartLabels = {
  weekdays: string[];
};

export type DayOfWeekChartProps = Omit<ComponentProps<'div'>, 'children'> & {
  values: number[];
  labels: DayOfWeekChartLabels;
  formatValue: (value: number) => string;
};
