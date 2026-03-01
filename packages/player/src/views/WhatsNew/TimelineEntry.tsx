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
          'w-1 flex-1 rounded-b-full',
          isFirst ? 'bg-transparent' : 'bg-border',
        )}
      />
      <TimelineNode isLatest={isFirst} />
      <div
        className={cn(
          'w-1 flex-1 rounded-t-full',
          isLast ? 'bg-transparent' : 'bg-border',
        )}
      />
    </div>
    <div className="my-4 flex flex-1 flex-col gap-1">
      <div className="border-border bg-background-secondary shadow-shadow flex-1 rounded-md border-2 p-4">
        <span data-testid="changelog-description">{entry.description}</span>
      </div>
      <div className="flex items-center justify-between px-1">
        <span
          data-testid="changelog-date"
          className="text-muted-foreground text-xs"
        >
          {DateTime.fromISO(entry.date).toLocaleString(DateTime.DATE_MED)}
        </span>
        {entry.contributors && entry.contributors.length > 0 && (
          <div className="flex gap-1.5">
            {entry.contributors.map((username) => (
              <span
                key={username}
                data-testid="changelog-contributor"
                className="text-muted-foreground font-mono text-xs"
              >
                @{username}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
