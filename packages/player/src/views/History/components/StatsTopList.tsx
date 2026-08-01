import { FC } from 'react';

import { Box, TopList } from '@nuclearplayer/ui';
import type { TopListEntry } from '@nuclearplayer/ui';

import { formatListeningDuration } from '../utils/format';

type StatsTopListProps = {
  testId: string;
  title: string;
  entries: TopListEntry[];
};

export const StatsTopList: FC<StatsTopListProps> = ({
  testId,
  title,
  entries,
}) => {
  if (!entries.length) {
    return null;
  }

  return (
    <Box variant="tertiary" className="min-w-0 flex-col">
      <TopList
        data-testid={testId}
        title={title}
        entries={entries}
        formatValue={formatListeningDuration}
      />
    </Box>
  );
};
