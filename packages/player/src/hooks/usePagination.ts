import { useState } from 'react';

import type { PageRequest } from '../services/tauri/bindings';

type UsePaginationOptions = {
  sizes: number[];
};

export const usePagination = ({ sizes }: UsePaginationOptions) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(sizes[0]);

  const changePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const request: PageRequest = {
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  };

  return {
    currentPage,
    pageSize,
    sizes,
    request,
    setPage: setCurrentPage,
    setPageSize: changePageSize,
    totalPagesFor: (total: number) => Math.ceil(total / pageSize),
    showControlsFor: (total: number) => total > Math.min(...sizes),
  };
};
