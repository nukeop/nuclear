import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { ListeningClock, Select } from '@nuclearplayer/ui';

import { useHistoryStats } from '../hooks/useHistoryStats';
import { formatListeningDuration } from '../utils/format';
import type { RangePresetId } from '../utils/rangePresets';
import { RANGE_PRESET_IDS } from '../utils/rangePresets';

export const HistoryStats: FC = () => {
  const { t } = useTranslation('history');
  const { presetId, setPresetId, hourlyValues } = useHistoryStats();

  const rangeLabels: Record<RangePresetId, string> = {
    last7Days: t('stats.range.last7Days'),
    last30Days: t('stats.range.last30Days'),
    last90Days: t('stats.range.last90Days'),
    last12Months: t('stats.range.last12Months'),
    allTime: t('stats.range.allTime'),
  };

  return (
    <div
      data-testid="history-stats"
      className="flex flex-1 flex-col gap-6 overflow-y-auto p-4"
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
      {hourlyValues && (
        <ListeningClock
          values={hourlyValues}
          labels={{
            busiestHour: t('stats.busiestHour'),
            busiestHourValue: t('stats.listeningTime'),
          }}
          formatValue={formatListeningDuration}
          emptyState={
            <div
              data-testid="history-stats-empty"
              className="text-foreground-secondary"
            >
              {t('stats.empty')}
            </div>
          }
        />
      )}
    </div>
  );
};
