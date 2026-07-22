export type CalendarHeatmapDay = {
  date: string;
  value: number;
};

export type CalendarHeatmapLabels = {
  months: string[];
  weekdays: string[];
  legendLess: string;
  legendMore: string;
};

export type CalendarHeatmapProps = {
  days: CalendarHeatmapDay[];
  labels: CalendarHeatmapLabels;
  formatValue: (value: number) => string;
  formatDate: (date: string) => string;
  className?: string;
};
