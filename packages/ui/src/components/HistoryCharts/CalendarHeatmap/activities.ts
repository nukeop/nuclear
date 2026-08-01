import type { CalendarHeatmapDay } from './types';

const MAX_LEVEL = 4;

export const toActivities = (days: CalendarHeatmapDay[]) => {
  const peak = Math.max(...days.map((day) => day.value));
  return days.map((day) => ({
    date: day.date,
    count: day.value,
    level: day.value === 0 ? 0 : Math.ceil((day.value / peak) * MAX_LEVEL),
  }));
};
