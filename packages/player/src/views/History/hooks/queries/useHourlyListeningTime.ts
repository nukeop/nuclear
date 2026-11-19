import { useQuery } from '@tanstack/react-query';

import type { TimeRange } from '../../../../services/tauri/bindings';
import { commands } from '../../../../services/tauri/bindings';
import { rethrowAsError } from '../../../../services/tauri/results';

export const useHourlyListeningTime = (range: TimeRange) =>
  useQuery({
    queryKey: ['history', 'stats', 'hourly', range.from, range.to],
    queryFn: async () => {
      const hourly = await commands
        .historyHourlyListeningTime(range)
        .catch(rethrowAsError);
      return hourly.values;
    },
  });
