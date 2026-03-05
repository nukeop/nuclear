import { useState } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { ViewShell } from '@nuclearplayer/ui';

import changelog from '../../../changelog.json';
import type { ChangelogEntry } from '../../types/changelog';
import { TimelineEntry } from './TimelineEntry';

const entries = changelog as ChangelogEntry[];

const INITIAL_COUNT = 3;

export const WhatsNew = () => {
  const { t } = useTranslation('changelog');
  const [showAll, setShowAll] = useState(false);

  const visibleEntries = showAll ? entries : entries.slice(0, INITIAL_COUNT);
  const hiddenCount = entries.length - INITIAL_COUNT;

  return (
    <ViewShell title={t('title')}>
      <div className="flex w-full flex-col pr-4 pl-2">
        {visibleEntries.map((entry, index) => (
          <TimelineEntry
            key={index}
            entry={entry}
            isFirst={index === 0}
            isLast={index === visibleEntries.length - 1}
          />
        ))}
        {!showAll && hiddenCount > 0 && (
          <button
            className="hover:text-foreground cursor-pointer py-4 text-sm transition-colors"
            onClick={() => setShowAll(true)}
          >
            {t('seeMore', { count: hiddenCount })}
          </button>
        )}
      </div>
    </ViewShell>
  );
};
