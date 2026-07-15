import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { HistoryRowLabels } from '@nuclearplayer/ui';
import { HistoryDayGroup, HistoryRow } from '@nuclearplayer/ui';

import type { HistoryEntry } from '../../../services/tauri/bindings';
import { formatTimeOfDay } from '../../../utils/time';
import { useDayMarker } from '../hooks/useDayMarker';
import { groupEntriesByDay } from '../utils/groupEntriesByDay';
import { HistoryEmptyState } from './HistoryEmptyState';

type HistoryBodyProps = {
  isPending: boolean;
  entries: HistoryEntry[];
};

export const HistoryBody: FC<HistoryBodyProps> = ({ isPending, entries }) => {
  const { t } = useTranslation('history');
  const markerFor = useDayMarker();
  const rowLabels: HistoryRowLabels = {
    favorite: t('row.favorite'),
    unfavorite: t('row.unfavorite'),
    addToQueue: t('row.addToQueue'),
  };

  if (isPending) {
    return <div className="flex-1" data-testid="history-loading" />;
  }

  if (entries.length === 0) {
    return <HistoryEmptyState />;
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6 pb-6">
      <div className="flex flex-1 flex-col gap-6">
        {groupEntriesByDay(entries).map((group) => (
          <HistoryDayGroup
            key={group.day.toISODate()}
            marker={markerFor(group.day)}
          >
            {group.entries.map((entry) => (
              <HistoryRow
                key={entry.playId}
                title={entry.title}
                artist={entry.artists.join(', ')}
                time={formatTimeOfDay(entry.startedAt)}
                artworkUrl={entry.artworkUrl}
                labels={rowLabels}
              />
            ))}
          </HistoryDayGroup>
        ))}
      </div>
      <footer className="flex items-center justify-between" />
    </div>
  );
};
