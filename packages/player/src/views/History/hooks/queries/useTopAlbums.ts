import { useQuery } from '@tanstack/react-query';

import type { TimeRange } from '../../../../services/tauri/bindings';
import { commands } from '../../../../services/tauri/bindings';
import { rethrowAsError } from '../../../../services/tauri/results';

export const useTopAlbums = (range: TimeRange, limit: number) =>
  useQuery({
    queryKey: ['history', 'stats', 'topAlbums', range.from, range.to, limit],
    queryFn: () =>
      commands.historyTopAlbums(range, limit).catch(rethrowAsError),
  });
