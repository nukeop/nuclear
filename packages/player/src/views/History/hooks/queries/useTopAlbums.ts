import { useQuery } from '@tanstack/react-query';

import type { TimeRange } from '../../../../services/tauri/bindings';
import { commands } from '../../../../services/tauri/bindings';
import { unwrapResult } from '../../../../services/tauri/results';

export const useTopAlbums = (range: TimeRange, limit: number) =>
  useQuery({
    queryKey: ['history', 'stats', 'topAlbums', range.from, range.to, limit],
    queryFn: async () =>
      unwrapResult(await commands.historyTopAlbums(range, limit)),
  });
