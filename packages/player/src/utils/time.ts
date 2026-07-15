import { DateTime } from 'luxon';

export const secondsToMs = (seconds: number): number =>
  Math.round(seconds * 1000);

export const formatTimeOfDay = (epochMs: number): string =>
  DateTime.fromMillis(epochMs).toLocaleString(DateTime.TIME_SIMPLE);
