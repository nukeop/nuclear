import { DateTime, Info, Interval } from 'luxon';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import {
  Box,
  CalendarHeatmap,
  DayOfWeekChart,
  ListeningClock,
  ScrollableArea,
  Select,
} from '@nuclearplayer/ui';

import { useCoreSetting } from '../../../hooks/useCoreSetting';
import { useDailyListeningTime } from '../hooks/queries/useDailyListeningTime';
import { useFirstPlayAt } from '../hooks/queries/useFirstPlayAt';
import { useHistoryStats } from '../hooks/useHistoryStats';
import { formatListeningDuration } from '../utils/format';
import type { RangePresetId } from '../utils/rangePresets';
import { RANGE_PRESET_IDS } from '../utils/rangePresets';
import { HistoryStatsEmptyState } from './HistoryStatsEmptyState';
import { HistoryTopLists } from './HistoryTopLists';

type HistoryStatsBodyProps = {
  firstPlayAt: number;
};

const HistoryStatsBody: FC<HistoryStatsBodyProps> = ({ firstPlayAt }) => {
  const { t, i18n } = useTranslation('history');
  const {
    presetId,
    setPresetId,
    range,
    hourlyValues,
    dayOfWeekValues,
    hasListening,
  } = useHistoryStats(firstPlayAt);
  const { data: dailyDays } = useDailyListeningTime();
  const [isDark] = useCoreSetting<boolean>('theme.dark');
  const colorScheme = isDark ? 'dark' : 'light';
  const locale = i18n.language.replace('_', '-');

  const rangeDates = Interval.fromDateTimes(
    DateTime.fromMillis(range.from),
    DateTime.fromMillis(range.to),
  ).toLocaleString(DateTime.DATE_MED, { locale });

  const rangeLabels: Record<RangePresetId, string> = {
    last7Days: t('stats.range.last7Days'),
    last30Days: t('stats.range.last30Days'),
    last90Days: t('stats.range.last90Days'),
    last12Months: t('stats.range.last12Months'),
    allTime: t('stats.range.allTime'),
  };

  return (
    <>
      <div className="flex items-center justify-end gap-3">
        <span
          data-testid="history-stats-range-dates"
          className="text-foreground-secondary text-sm"
        >
          {rangeDates}
        </span>
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
      <HistoryTopLists range={range} />
      {hourlyValues &&
        (hasListening ? (
          <div className="flex flex-col items-stretch gap-4 @3xl:flex-row">
            <Box variant="tertiary" className="w-auto flex-col gap-3">
              <h3 className="font-heading text-xl">{t('stats.hourOfDay')}</h3>
              <ListeningClock
                values={hourlyValues}
                labels={{
                  busiestHour: t('stats.busiestHour'),
                  busiestHourValue: t('stats.listeningTime'),
                }}
                formatValue={formatListeningDuration}
              />
            </Box>
            {dayOfWeekValues && (
              <Box variant="tertiary" className="min-w-0 flex-1 flex-col gap-3">
                <h3 className="font-heading text-xl">{t('stats.dayOfWeek')}</h3>
                <div className="min-h-0 flex-1">
                  <DayOfWeekChart
                    values={dayOfWeekValues}
                    labels={{ weekdays: Info.weekdays('short', { locale }) }}
                    formatValue={formatListeningDuration}
                  />
                </div>
              </Box>
            )}
          </div>
        ) : (
          <HistoryStatsEmptyState />
        ))}
      {dailyDays && (
        <Box variant="tertiary" className="min-w-fit flex-col gap-3">
          <h3 className="font-heading text-xl">{t('stats.calendar')}</h3>
          <CalendarHeatmap
            className="mx-auto"
            days={dailyDays}
            labels={{
              months: Info.months('short', { locale }),
              weekdays: Info.weekdays('short', { locale }),
              legendLess: t('stats.legendLess'),
              legendMore: t('stats.legendMore'),
            }}
            colorScheme={colorScheme}
            formatValue={formatListeningDuration}
            formatDate={(date) =>
              DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL)
            }
          />
        </Box>
      )}
    </>
  );
};

export const HistoryStats: FC = () => {
  const { data: firstPlayAt, isPending } = useFirstPlayAt();

  return (
    <ScrollableArea
      data-testid="history-stats"
      viewportClassName="@container flex flex-col gap-4 p-4"
    >
      {!isPending &&
        (firstPlayAt ? (
          <HistoryStatsBody firstPlayAt={firstPlayAt.at} />
        ) : (
          <HistoryStatsEmptyState />
        ))}
    </ScrollableArea>
  );
};
