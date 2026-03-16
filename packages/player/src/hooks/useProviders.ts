import { useEffect, useState } from 'react';

import type {
  ProviderDescriptor,
  ProviderKind,
} from '@nuclearplayer/plugin-sdk';

import { providersHost } from '../services/providersHost';

export const useProviders = <K extends ProviderKind>(
  kind: K,
): ProviderDescriptor<K>[] => {
  const [providers, setProviders] = useState(() => providersHost.list(kind));

  useEffect(() => {
    setProviders(providersHost.list(kind));
    return providersHost.subscribe(() =>
      setProviders(providersHost.list(kind)),
    );
  }, [kind]);

  return providers;
};
