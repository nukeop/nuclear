import { useQuery } from '@tanstack/react-query';

import { commands } from '../../../../services/tauri/bindings';
import { unwrapResult } from '../../../../services/tauri/results';

export const useFirstPlayAt = () =>
  useQuery({
    queryKey: ['history', 'firstPlayAt'],
    queryFn: async () => unwrapResult(await commands.historyFirstPlayAt()),
  });
