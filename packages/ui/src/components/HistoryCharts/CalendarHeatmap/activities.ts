import type { CalendarHeatmapDay } from './types';

export const toActivities = (days: CalendarHeatmapDay[]) => {
  const busiestValue = Math.max(...days.map((day) => day.value));
  return days.map((day) => ({
    date: day.date,
    count: day.value,
    level: day.value === 0 ? 0 : Math.ceil((day.value / busiestValue) * 4),
  }));
};
