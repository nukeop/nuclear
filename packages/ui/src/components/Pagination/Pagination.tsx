import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';
import { Button } from '../Button';
import { PaginationItem } from './PaginationItem';
import { pageItemKey, paginationRange } from './paginationRange';
import { PaginationProps } from './types';

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  labels,
  className,
  ...props
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const items = paginationRange(currentPage, totalPages, siblingCount);

  return (
    <nav
      aria-label={labels.navigation}
      data-testid="pagination"
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      <Button
        variant="secondary"
        size="icon-sm"
        aria-label={labels.previous}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      {items.map((item) => (
        <PaginationItem
          key={pageItemKey(item)}
          item={item}
          currentPage={currentPage}
          onPageChange={onPageChange}
          pageLabel={labels.page}
        />
      ))}
      <Button
        variant="secondary"
        size="icon-sm"
        aria-label={labels.next}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </nav>
  );
};
