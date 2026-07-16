import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type {
  HistoryEntry,
  Page,
  PageRequest,
} from '../../../services/tauri/bindings';
import { commands } from '../../../services/tauri/bindings';

const fetchListeningHistory = async (
  page: PageRequest,
): Promise<Page<HistoryEntry>> => {
  const result = await commands.historyFetch(page);
  if (result.status === 'error') {
    throw new Error(result.error);
  }
  return result.data;
};

export const useListeningHistory = (page: PageRequest) =>
  useQuery({
    queryKey: ['history', page.limit, page.offset],
    queryFn: () => fetchListeningHistory(page),
    placeholderData: keepPreviousData,
  });
