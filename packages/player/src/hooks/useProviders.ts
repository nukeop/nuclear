import { useMemo } from 'react';

import type {
  ProviderDescriptor,
  ProviderKind,
} from '@nuclearplayer/plugin-sdk';

import { providersHost } from '../services/providersHost';
import { useStartupStore } from '../stores/startupStore';

export const useProviders = <K extends ProviderKind>(
  kind: K,
): ProviderDescriptor<K>[] => {
  const isStartingUp = useStartupStore((state) => state.isStartingUp);

  return useMemo(() => providersHost.list(kind), [kind, isStartingUp]);
};
