import { FC } from 'react';

import { cn } from '@nuclearplayer/ui';
import { DateTime } from 'luxon';

import type { ChangelogEntry } from '../../types/changelog';
import { TimelineNode } from './TimelineNode';

type TimelineEntryProps = {
  entry: ChangelogEntry;
  isFirst: boolean;
  isLast: boolean;
};

export const TimelineEntry: FC<TimelineEntryProps> = ({
  entry,
  isFirst,
  isLast,
}) => (
  <div data-testid="changelog-entry" className="flex gap-4">
    <div className="flex w-4 flex-col items-center gap-1">
      <div
        className={cn(
          'w-1 flex-1 rounded-full',
          isFirst ? 'bg-transparent' : 'bg-border',
        )}
      />
      <TimelineNode isLatest={isFirst} />
      <div
        className={cn(
          'w-1 flex-1 rounded-full',
          isLast ? 'bg-transparent' : 'bg-border',
        )}
      />
    </div>
    <div className="my-4 flex flex-1 flex-col gap-1">
      <div className="border-border bg-background-secondary shadow-shadow flex-1 rounded-md border-2 p-4">
        <span data-testid="changelog-description">{entry.description}</span>
      </div>
      <span
        data-testid="changelog-date"
        className="text-muted-foreground pl-1 text-xs"
      >
        {DateTime.fromISO(entry.date).toLocaleString(DateTime.DATE_MED)}
      </span>
    </div>
  </div>
);
