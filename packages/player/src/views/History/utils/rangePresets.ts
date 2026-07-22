export const RANGE_PRESET_IDS = [
  'last7Days',
  'last30Days',
  'last90Days',
  'last12Months',
  'allTime',
] as const;

export type RangePresetId = (typeof RANGE_PRESET_IDS)[number];

const DAY_MS = 60 * 60 * 24 * 1000;

export const RANGE_LOOKBACK_MS: Record<RangePresetId, number | null> = {
  last7Days: 7 * DAY_MS,
  last30Days: 30 * DAY_MS,
  last90Days: 90 * DAY_MS,
  last12Months: 365 * DAY_MS,
  allTime: null,
};
