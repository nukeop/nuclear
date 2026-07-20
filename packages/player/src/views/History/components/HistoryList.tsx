import { FC } from 'react';

import { usePagination } from '../../../hooks/usePagination';
import { useListeningHistory } from '../hooks/useListeningHistory';
import { HistoryBody } from './HistoryBody';
import { HistoryPaginationFooter } from './HistoryPaginationFooter';

const PAGE_SIZES = [10, 25, 50];

export const HistoryList: FC = () => {
  const pagination = usePagination({ sizes: PAGE_SIZES });
  const { data, isPending } = useListeningHistory(pagination.request);
  const total = data?.total ?? 0;

  return (
    <>
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
    </>
  );
};
