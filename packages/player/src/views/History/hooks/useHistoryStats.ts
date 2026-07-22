import { useMemo, useState } from 'react';

import type { RangePresetId } from '../utils/rangePresets';
import { RANGE_LOOKBACK_MS } from '../utils/rangePresets';
import { useHourlyListeningTime } from './useHourlyListeningTime';

export const useHistoryStats = () => {
  const [presetId, setPresetId] = useState<RangePresetId>('last30Days');
  const range = useMemo(() => {
    const now = Date.now();
    const ms = RANGE_LOOKBACK_MS[presetId];
    return { from: ms === null ? 0 : now - ms, to: now };
  }, [presetId]);
  const { data: hourlyValues } = useHourlyListeningTime(range);

  return { presetId, setPresetId, hourlyValues };
};
