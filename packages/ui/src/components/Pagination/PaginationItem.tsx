import { cva } from 'class-variance-authority';
import { FC } from 'react';

import { cn } from '../../utils';
import { PageItem } from './paginationRange';

const pageVariants = cva(
  'inline-flex size-8 cursor-pointer items-center justify-center rounded-md border-(length:--border-width) text-sm font-medium transition-colors',
  {
    variants: {
      selected: {
        true: 'bg-primary text-foreground border-border',
        false:
          'text-foreground hover:bg-foreground/10 border-transparent bg-transparent',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

type PaginationItemProps = {
  item: PageItem;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageLabel: (pageNumber: number) => string;
};

export const PaginationItem: FC<PaginationItemProps> = ({
  item,
  currentPage,
  onPageChange,
  pageLabel,
}) => {
  if (item.kind === 'ellipsis') {
    return (
      <span
        aria-hidden="true"
        className="text-foreground-secondary inline-flex size-8 items-center justify-center select-none"
      >
        …
      </span>
    );
  }

  const isCurrent = item.page === currentPage;
  return (
    <button
      type="button"
      aria-label={pageLabel(item.page)}
      aria-current={isCurrent ? 'page' : undefined}
      className={cn(pageVariants({ selected: isCurrent }))}
      onClick={() => onPageChange(item.page)}
    >
      {item.page}
    </button>
  );
};
