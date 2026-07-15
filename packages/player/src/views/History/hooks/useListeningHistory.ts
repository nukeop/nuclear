import { useQuery } from '@tanstack/react-query';

import type { HistoryEntry, PlaysPage } from '../../../services/tauri/bindings';
import { commands } from '../../../services/tauri/bindings';

const fetchListeningHistory = async (
  page: PlaysPage,
): Promise<HistoryEntry[]> => {
  const result = await commands.historyFetch(page);
  if (result.status === 'error') {
    throw new Error(result.error);
  }
  return result.data;
};

export const useListeningHistory = (page: PlaysPage) =>
  useQuery({
    queryKey: ['history', page.limit, page.offset],
    queryFn: () => fetchListeningHistory(page),
  });
