import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

import type { DailyListeningTime } from '../../../../services/tauri/bindings';
import { commands } from '../../../../services/tauri/bindings';
import { rethrowAsError } from '../../../../services/tauri/results';

const isoDate = (millis: number) =>
  DateTime.fromMillis(millis).toFormat('yyyy-MM-dd');

const padToRange = (
  days: DailyListeningTime[],
  fromDate: string,
  toDate: string,
): DailyListeningTime[] => {
  const padded = [...days];
  if (padded.at(0)?.date !== fromDate) {
    padded.unshift({ date: fromDate, value: 0 });
  }
  if (padded.at(-1)?.date !== toDate) {
    padded.push({ date: toDate, value: 0 });
  }
  return padded;
};

export const useDailyListeningTime = () => {
  const range = useMemo(() => {
    const to = DateTime.now();
    return { from: to.minus({ months: 12 }).toMillis(), to: to.toMillis() };
  }, []);

  return useQuery({
    queryKey: ['history', 'stats', 'daily', range.from, range.to],
    queryFn: async () => {
      const days = await commands
        .historyDailyListeningTime(range)
        .catch(rethrowAsError);
      return padToRange(days, isoDate(range.from), isoDate(range.to));
    },
  });
};
