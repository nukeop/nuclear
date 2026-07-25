import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';

import type { RangePresetId } from '../utils/rangePresets';
import { RANGE_LOOKBACK } from '../utils/rangePresets';
import { useDayOfWeekListeningTime } from './useDayOfWeekListeningTime';
import { useHourlyListeningTime } from './useHourlyListeningTime';

export const useHistoryStats = () => {
  const [presetId, setPresetId] = useState<RangePresetId>('last30Days');
  const range = useMemo(() => {
    const to = DateTime.now();
    const lookback = RANGE_LOOKBACK[presetId];

    if (lookback === null) {
      return { from: 0, to: to.toMillis() };
    }

    const from = to.startOf('day').minus(lookback).plus({ days: 1 });
    return { from: from.toMillis(), to: to.toMillis() };
  }, [presetId]);
  const { data: hourlyValues } = useHourlyListeningTime(range);
  const { data: dayOfWeekValues } = useDayOfWeekListeningTime(range);
  const hasListening = Boolean(hourlyValues?.some((value) => value > 0));

  return {
    presetId,
    setPresetId,
    range,
    hourlyValues,
    dayOfWeekValues,
    hasListening,
  };
};
