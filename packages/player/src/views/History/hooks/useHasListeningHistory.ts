import { useQuery } from '@tanstack/react-query';

import { commands } from '../../../services/tauri/bindings';
import { unwrapResult } from '../../../services/tauri/results';

export const useHasListeningHistory = () =>
  useQuery({
    queryKey: ['history', 'hasAny'],
    queryFn: async () => {
      const { total } = unwrapResult(
        await commands.historyFetch({ limit: 1, offset: 0 }),
      );
      return total > 0;
    },
  });
