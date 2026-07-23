import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

import { commands } from '../../../services/tauri/bindings';
import { unwrapResult } from '../../../services/tauri/results';

export const useDailyListeningTime = () => {
  const range = useMemo(() => {
    const to = DateTime.now();
    return { from: to.minus({ months: 12 }).toMillis(), to: to.toMillis() };
  }, []);

  return useQuery({
    queryKey: ['history', 'stats', 'daily', range.from, range.to],
    queryFn: async () =>
      unwrapResult(await commands.historyDailyListeningTime(range)),
  });
};
