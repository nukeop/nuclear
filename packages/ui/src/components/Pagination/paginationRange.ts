import range from 'lodash-es/range';

export type PageItem =
  | { kind: 'page'; page: number }
  | { kind: 'ellipsis'; side: 'start' | 'end' };

export const pageItemKey = (item: PageItem): string => {
  if (item.kind === 'page') {
    return String(item.page);
  }
  return `${item.side}-ellipsis`;
};

const pages = (from: number, to: number): PageItem[] =>
  range(from, to + 1).map((page) => ({ kind: 'page', page }));

const edgePageCount = (siblingCount: number): number => 2 * siblingCount + 3;

const tailEllipsisRow = (
  totalPages: number,
  siblingCount: number,
): PageItem[] => [
  ...pages(1, edgePageCount(siblingCount)),
  { kind: 'ellipsis', side: 'end' },
  { kind: 'page', page: totalPages },
];

const headEllipsisRow = (
  totalPages: number,
  siblingCount: number,
): PageItem[] => [
  { kind: 'page', page: 1 },
  { kind: 'ellipsis', side: 'start' },
  ...pages(totalPages - edgePageCount(siblingCount) + 1, totalPages),
];

export const paginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PageItem[] => {
  const rowLengthWithEllipsis = edgePageCount(siblingCount) + 2;
  if (totalPages <= rowLengthWithEllipsis) {
    return pages(1, totalPages);
  }

  const windowStart = currentPage - siblingCount;
  const windowEnd = currentPage + siblingCount;

  const gapAfterFirstPage = windowStart > 2;
  const gapBeforeLastPage = windowEnd < totalPages - 1;

  if (gapAfterFirstPage && gapBeforeLastPage) {
    return [
      { kind: 'page', page: 1 },
      { kind: 'ellipsis', side: 'start' },
      ...pages(windowStart, windowEnd),
      { kind: 'ellipsis', side: 'end' },
      { kind: 'page', page: totalPages },
    ];
  }

  if (gapBeforeLastPage) {
    return tailEllipsisRow(totalPages, siblingCount);
  }

  if (gapAfterFirstPage) {
    return headEllipsisRow(totalPages, siblingCount);
  }

  return pages(1, totalPages);
};
