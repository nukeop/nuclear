import { useQuery } from '@tanstack/react-query';
import groupBy from 'lodash-es/groupBy';
import meanBy from 'lodash-es/meanBy';
import { DateTime } from 'luxon';

import type { DayOfWeekValues } from '@nuclearplayer/ui';

import type { TimeRange } from '../../../../services/tauri/bindings';
import { commands } from '../../../../services/tauri/bindings';
import { unwrapResult } from '../../../../services/tauri/results';

export const useDayOfWeekListeningTime = (timeRange: TimeRange) =>
  useQuery<DayOfWeekValues>({
    queryKey: ['history', 'stats', 'dayOfWeek', timeRange.from, timeRange.to],
    queryFn: async () => {
      const days = unwrapResult(
        await commands.historyDailyListeningTime(timeRange),
      );

      const byWeekday = groupBy(
        days,
        (day) => DateTime.fromISO(day.date).weekday,
      );

      return [
        meanBy(byWeekday[1], 'value'),
        meanBy(byWeekday[2], 'value'),
        meanBy(byWeekday[3], 'value'),
        meanBy(byWeekday[4], 'value'),
        meanBy(byWeekday[5], 'value'),
        meanBy(byWeekday[6], 'value'),
        meanBy(byWeekday[7], 'value'),
      ];
    },
  });
