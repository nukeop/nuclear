import type { DurationLike } from 'luxon';

export const RANGE_PRESET_IDS = [
  'last7Days',
  'last30Days',
  'last90Days',
  'last12Months',
  'allTime',
] as const;

export type RangePresetId = (typeof RANGE_PRESET_IDS)[number];

export const RANGE_LOOKBACK: Record<RangePresetId, DurationLike | null> = {
  last7Days: { days: 7 },
  last30Days: { days: 30 },
  last90Days: { days: 90 },
  last12Months: { months: 12 },
  allTime: null,
};
