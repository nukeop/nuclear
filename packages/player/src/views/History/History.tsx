import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { ViewShell } from '@nuclearplayer/ui';

import { HistoryBody } from './components/HistoryBody';
import { useListeningHistory } from './hooks/useListeningHistory';

const PAGE_SIZE = 10;

export const History: FC = () => {
  const { t } = useTranslation('history');
  const { data: entries, isPending } = useListeningHistory({
    limit: PAGE_SIZE,
    offset: 0,
  });

  return (
    <ViewShell data-testid="history-view" title={t('title')}>
      <HistoryBody isPending={isPending} entries={entries ?? []} />
    </ViewShell>
  );
};
