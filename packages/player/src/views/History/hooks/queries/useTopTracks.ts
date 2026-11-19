import { useQuery } from '@tanstack/react-query';

import type { TimeRange } from '../../../../services/tauri/bindings';
import { commands } from '../../../../services/tauri/bindings';
import { rethrowAsError } from '../../../../services/tauri/results';

export const useTopTracks = (range: TimeRange, limit: number) =>
  useQuery({
    queryKey: ['history', 'stats', 'topTracks', range.from, range.to, limit],
    queryFn: () =>
      commands.historyTopTracks(range, limit).catch(rethrowAsError),
  });
