import type { ComponentProps } from 'react';

export type DayOfWeekValues = readonly [
  monday: number,
  tuesday: number,
  wednesday: number,
  thursday: number,
  friday: number,
  saturday: number,
  sunday: number,
];

export type DayOfWeekChartLabels = {
  weekdays: string[];
};

export type DayOfWeekChartProps = Omit<ComponentProps<'div'>, 'children'> & {
  values: DayOfWeekValues;
  labels: DayOfWeekChartLabels;
  formatValue: (value: number) => string;
};
