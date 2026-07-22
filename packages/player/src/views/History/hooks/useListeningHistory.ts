import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { PageRequest } from '../../../services/tauri/bindings';
import { commands } from '../../../services/tauri/bindings';
import { unwrapResult } from '../../../services/tauri/results';

export const useListeningHistory = (page: PageRequest) =>
  useQuery({
    queryKey: ['history', page.limit, page.offset],
    queryFn: async () => unwrapResult(await commands.historyFetch(page)),
    placeholderData: keepPreviousData,
  });
