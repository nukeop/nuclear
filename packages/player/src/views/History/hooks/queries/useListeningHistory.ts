import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { PageRequest } from '../../../../services/tauri/bindings';
import { commands } from '../../../../services/tauri/bindings';
import { rethrowAsError } from '../../../../services/tauri/results';

export const useListeningHistory = (page: PageRequest) =>
  useQuery({
    queryKey: ['history', 'entries', page.limit, page.offset],
    queryFn: () => commands.historyFetch(page).catch(rethrowAsError),
    placeholderData: keepPreviousData,
  });
