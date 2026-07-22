import { useQuery } from '@tanstack/react-query';

import type { TimeRange } from '../../../services/tauri/bindings';
import { commands } from '../../../services/tauri/bindings';
import { unwrapResult } from '../../../services/tauri/results';

export const useHourlyListeningTime = (range: TimeRange) =>
  useQuery({
    queryKey: ['history', 'stats', 'hourly', range.from, range.to],
    queryFn: async () =>
      unwrapResult(await commands.historyHourlyListeningTime(range)).values,
  });
