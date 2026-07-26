import { CassetteTape } from 'lucide-react';
import { FC } from 'react';

import type { TopListEntry } from './types';

type TopListRowProps = {
  entry: TopListEntry;
  rank: number;
  fillRatio: number;
  formatValue: (value: number) => string;
};

export const TopListRow: FC<TopListRowProps> = ({
  entry,
  rank,
  fillRatio,
  formatValue,
}) => (
  <div className="border-border grid grid-cols-[auto_auto_1fr_1fr] items-center gap-3 border-b-(length:--border-width) py-1.5 last:border-b-0">
    <span className="text-foreground-secondary w-5 text-right text-sm tabular-nums">
      {rank}
    </span>
    <div className="flex h-10 w-10 items-center justify-center overflow-hidden">
      {entry.imageUrl ? (
        <img
          src={entry.imageUrl}
          alt={entry.label}
          className="h-full w-full object-cover"
        />
      ) : (
        <CassetteTape size={20} className="text-foreground opacity-20" />
      )}
    </div>
    <div className="min-w-0">
      <div className="truncate font-medium">{entry.label}</div>
      {entry.sublabel && (
        <div className="text-foreground-secondary truncate text-sm">
          {entry.sublabel}
        </div>
      )}
    </div>
    <div
      className="bg-primary/50 min-w-fit px-2 py-1 whitespace-nowrap tabular-nums"
      style={{ width: `${fillRatio * 100}%` }}
    >
      {formatValue(entry.value)}
    </div>
  </div>
);
