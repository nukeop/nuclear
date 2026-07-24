import { ChartColumn } from 'lucide-react';
import { DateTime, Info } from 'luxon';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import {
  CalendarHeatmap,
  EmptyState,
  ListeningClock,
  ScrollableArea,
  Select,
} from '@nuclearplayer/ui';

import { useCoreSetting } from '../../../hooks/useCoreSetting';
import { useDailyListeningTime } from '../hooks/useDailyListeningTime';
import { useHistoryStats } from '../hooks/useHistoryStats';
import { formatListeningDuration } from '../utils/format';
import type { RangePresetId } from '../utils/rangePresets';
import { RANGE_PRESET_IDS } from '../utils/rangePresets';

const sundayFirstWeekdays = (weekdays: string[]) => [
  weekdays[6],
  ...weekdays.slice(0, 6),
];

export const HistoryStats: FC = () => {
  const { t, i18n } = useTranslation('history');
  const { presetId, setPresetId, hourlyValues, hasListening } =
    useHistoryStats();
  const { data: dailyDays } = useDailyListeningTime();
  const [isDark] = useCoreSetting<boolean>('theme.dark');
  const colorScheme = isDark ? 'dark' : 'light';
  const locale = i18n.language.replace('_', '-');

  const rangeLabels: Record<RangePresetId, string> = {
    last7Days: t('stats.range.last7Days'),
    last30Days: t('stats.range.last30Days'),
    last90Days: t('stats.range.last90Days'),
    last12Months: t('stats.range.last12Months'),
    allTime: t('stats.range.allTime'),
  };

  return (
    <ScrollableArea
      data-testid="history-stats"
      viewportClassName="flex flex-col gap-6 p-4"
    >
      <div className="flex justify-end">
        <div data-testid="history-stats-range" className="w-44">
          <Select
            options={RANGE_PRESET_IDS.map((id) => ({
              id,
              label: rangeLabels[id],
            }))}
            value={presetId}
            onValueChange={(value) => setPresetId(value as RangePresetId)}
          />
        </div>
      </div>
      {hourlyValues &&
        (hasListening ? (
          <ListeningClock
            values={hourlyValues}
            labels={{
              busiestHour: t('stats.busiestHour'),
              busiestHourValue: t('stats.listeningTime'),
            }}
            formatValue={formatListeningDuration}
          />
        ) : (
          <EmptyState
            data-testid="history-stats-empty"
            icon={<ChartColumn size={48} />}
            title={t('stats.empty')}
            className="flex-1"
          />
        ))}
      {dailyDays && (
        <div className="border-border min-w-fit border-t-(length:--border-width) px-2">
          <CalendarHeatmap
            className="mx-auto"
            days={dailyDays}
            labels={{
              months: Info.months('short', { locale }),
              weekdays: sundayFirstWeekdays(Info.weekdays('short', { locale })),
              legendLess: t('stats.legendLess'),
              legendMore: t('stats.legendMore'),
            }}
            colorScheme={colorScheme}
            formatValue={formatListeningDuration}
            formatDate={(date) =>
              DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL)
            }
          />
        </div>
      )}
    </ScrollableArea>
  );
};
