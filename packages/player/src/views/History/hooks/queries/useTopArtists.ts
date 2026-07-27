import { useQuery } from '@tanstack/react-query';

import type { TimeRange } from '../../../../services/tauri/bindings';
import { commands } from '../../../../services/tauri/bindings';
import { unwrapResult } from '../../../../services/tauri/results';

export const useTopArtists = (range: TimeRange, limit: number) =>
  useQuery({
    queryKey: ['history', 'stats', 'topArtists', range.from, range.to, limit],
    queryFn: async () =>
      unwrapResult(await commands.historyTopArtists(range, limit)),
  });
