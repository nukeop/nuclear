import { useQuery } from '@tanstack/react-query';
import groupBy from 'lodash-es/groupBy';
import range from 'lodash-es/range';
import sumBy from 'lodash-es/sumBy';
import { DateTime } from 'luxon';

import type { TimeRange } from '../../../services/tauri/bindings';
import { commands } from '../../../services/tauri/bindings';
import { unwrapResult } from '../../../services/tauri/results';

export const useDayOfWeekListeningTime = (timeRange: TimeRange) =>
  useQuery({
    queryKey: ['history', 'stats', 'dayOfWeek', timeRange.from, timeRange.to],
    queryFn: async () => {
      const days = unwrapResult(
        await commands.historyDailyListeningTime(timeRange),
      );

      const daysInCompleteWeeks = days.filter((day) => {
        const date = DateTime.fromISO(day.date);
        return (
          date.startOf('week').toMillis() >= timeRange.from &&
          date.endOf('week').toMillis() <= timeRange.to
        );
      });

      const byWeekday = groupBy(
        daysInCompleteWeeks,
        (day) => DateTime.fromISO(day.date).weekday,
      );

      return range(1, 8).map((weekday) =>
        sumBy(byWeekday[weekday] ?? [], 'value'),
      );
    },
  });
