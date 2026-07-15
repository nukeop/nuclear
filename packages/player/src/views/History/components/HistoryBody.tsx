import { FC } from 'react';

import type { HistoryEntry } from '../../../services/tauri/bindings';
import { HistoryEmptyState } from './HistoryEmptyState';

type HistoryBodyProps = {
  isPending: boolean;
  entries: HistoryEntry[];
};

export const HistoryBody: FC<HistoryBodyProps> = ({ isPending, entries }) => {
  if (isPending) {
    return <div className="flex-1" data-testid="history-loading" />;
  }

  if (entries.length === 0) {
    return <HistoryEmptyState />;
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6 pb-6">
      <div className="flex flex-1 flex-col gap-6">
        {entries.map((entry) => (
          <div key={entry.playId}>
            {entry.title} - {entry.artists.join(', ')}
          </div>
        ))}
      </div>
      <footer className="flex items-center justify-between" />
    </div>
  );
};
