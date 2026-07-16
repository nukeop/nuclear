import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { ViewShell } from '@nuclearplayer/ui';

import { usePagination } from '../../hooks/usePagination';
import { HistoryBody } from './components/HistoryBody';
import { HistoryPaginationFooter } from './components/HistoryPaginationFooter';
import { useListeningHistory } from './hooks/useListeningHistory';

const PAGE_SIZES = [10, 25, 50];

export const History: FC = () => {
  const { t } = useTranslation('history');
  const pagination = usePagination({ sizes: PAGE_SIZES });
  const { data, isPending } = useListeningHistory(pagination.request);
  const total = data?.total ?? 0;

  return (
    <ViewShell data-testid="history-view" title={t('title')}>
      <HistoryBody isPending={isPending} entries={data?.items ?? []} />
      {pagination.showControlsFor(total) && (
        <HistoryPaginationFooter
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPagesFor(total)}
          pageSize={pagination.pageSize}
          sizes={pagination.sizes}
          onPageChange={pagination.setPage}
          onPageSizeChange={pagination.setPageSize}
        />
      )}
    </ViewShell>
  );
};
