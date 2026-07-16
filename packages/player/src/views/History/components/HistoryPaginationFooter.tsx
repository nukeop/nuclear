import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { PaginationLabels } from '@nuclearplayer/ui';
import { Pagination, Select } from '@nuclearplayer/ui';

type HistoryPaginationFooterProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  sizes: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export const HistoryPaginationFooter: FC<HistoryPaginationFooterProps> = ({
  currentPage,
  totalPages,
  pageSize,
  sizes,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslation('pagination');

  const labels: PaginationLabels = {
    navigation: t('navigation'),
    previous: t('previous'),
    next: t('next'),
    page: (pageNumber) => t('page', { pageNumber }),
  };

  return (
    <footer
      data-testid="history-pagination"
      className="flex w-full flex-col gap-2 pb-6"
    >
      <div className="flex justify-end pr-1">
        <div data-testid="history-page-size" className="w-24">
          <Select
            options={sizes.map((size) => ({
              id: String(size),
              label: String(size),
            }))}
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          labels={labels}
        />
      </div>
    </footer>
  );
};
