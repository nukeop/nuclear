export type DayOfWeekChartLabels = {
  weekdays: string[];
};

export type DayOfWeekChartProps = {
  values: number[];
  labels: DayOfWeekChartLabels;
  formatValue: (value: number) => string;
  className?: string;
};
