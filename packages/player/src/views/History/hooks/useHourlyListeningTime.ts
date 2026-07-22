import { useQuery } from '@tanstack/react-query';

import type { TimeRange } from '../../../services/tauri/bindings';
import { commands } from '../../../services/tauri/bindings';

const fetchHourlyListeningTime = async (
  range: TimeRange,
): Promise<number[]> => {
  const result = await commands.historyHourlyListeningTime(range);
  if (result.status === 'error') {
    throw new Error(result.error);
  }
  return result.data.values;
};

export const useHourlyListeningTime = (range: TimeRange) =>
  useQuery({
    queryKey: ['history', 'stats', 'hourly', range.from, range.to],
    queryFn: () => fetchHourlyListeningTime(range),
  });
