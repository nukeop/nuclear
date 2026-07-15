import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { HistoryRow } from '@nuclearplayer/ui';

import type { HistoryEntry } from '../../../services/tauri/bindings';
import { formatTimeOfDay } from '../../../utils/time';
import { HistoryEmptyState } from './HistoryEmptyState';

type HistoryBodyProps = {
  isPending: boolean;
  entries: HistoryEntry[];
};

export const HistoryBody: FC<HistoryBodyProps> = ({ isPending, entries }) => {
  const { t } = useTranslation('history');

  if (isPending) {
    return <div className="flex-1" data-testid="history-loading" />;
  }

  if (entries.length === 0) {
    return <HistoryEmptyState />;
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6 pb-6">
      <div className="flex flex-1 flex-col">
        {entries.map((entry) => (
          <HistoryRow
            key={entry.playId}
            title={entry.title}
            artist={entry.artists.join(', ')}
            time={formatTimeOfDay(entry.startedAt)}
            artworkUrl={entry.artworkUrl}
            labels={{
              favorite: t('row.favorite'),
              unfavorite: t('row.unfavorite'),
              addToQueue: t('row.addToQueue'),
            }}
          />
        ))}
      </div>
      <footer className="flex items-center justify-between" />
    </div>
  );
};
