import { ComponentProps, FC } from 'react';

export type PaginationLabels = {
  navigation: string;
  previous: string;
  next: string;
  page: (pageNumber: number) => string;
};

export type PaginationProps = ComponentProps<'nav'> & {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  labels?: Partial<PaginationLabels>;
};

export const Pagination: FC<PaginationProps> = () => null;
