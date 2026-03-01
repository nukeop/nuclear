import { useState } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { cn, ViewShell } from '@nuclearplayer/ui';

import changelog from '../../../changelog.json';
import type { ChangelogEntry } from '../../types/changelog';

const entries = changelog as ChangelogEntry[];

const INITIAL_COUNT = 3;

const NODE_SIZE = 'size-4';

const TimelineNode = () => (
  <div
    className={cn(
      NODE_SIZE,
      'bg-foreground border-foreground shrink-0 rounded-full border-2',
    )}
  >
    <div className="bg-background-secondary border-background-secondary size-full rounded-full border-2">
      <div className="bg-foreground size-full rounded-full" />
    </div>
  </div>
);

export const WhatsNew = () => {
  const { t } = useTranslation('changelog');
  const [showAll, setShowAll] = useState(false);

  const visibleEntries = showAll ? entries : entries.slice(0, INITIAL_COUNT);
  const hiddenCount = entries.length - INITIAL_COUNT;

  return (
    <ViewShell title={t('title')}>
      <div className="flex w-full flex-col pr-4 pl-2">
        {visibleEntries.map((entry, index) => (
          <div key={index} data-testid="changelog-entry" className="flex gap-4">
            <div className="flex w-4 flex-col items-center">
              <div
                className={cn(
                  'w-0.5 flex-1',
                  index > 0 ? 'bg-border' : 'bg-transparent',
                )}
              />
              <TimelineNode />
              <div
                className={cn(
                  'w-0.5 flex-1',
                  index < visibleEntries.length - 1
                    ? 'bg-border'
                    : 'bg-transparent',
                )}
              />
            </div>
            <div className="border-border bg-background-secondary shadow-shadow my-4 flex-1 rounded-md border-2 p-4">
              <span data-testid="changelog-description">
                {entry.description}
              </span>
            </div>
          </div>
        ))}
        {!showAll && hiddenCount > 0 && (
          <button
            className="text-muted-foreground hover:text-foreground cursor-pointer py-4 text-sm transition-colors"
            onClick={() => setShowAll(true)}
          >
            {t('seeMore', { count: hiddenCount })}
          </button>
        )}
      </div>
    </ViewShell>
  );
};
