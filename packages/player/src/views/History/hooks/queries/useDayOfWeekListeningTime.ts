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

      const averageFor = (weekday: number) =>
        meanBy(byWeekday[weekday] ?? [{ value: 0 }], 'value');

      return [
        averageFor(1),
        averageFor(2),
        averageFor(3),
        averageFor(4),
        averageFor(5),
        averageFor(6),
        averageFor(7),
      ];
    },
  });
