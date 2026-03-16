import type {
  ProviderDescriptor,
  ProviderKind,
} from '@nuclearplayer/plugin-sdk';

import { useProvidersStore } from '../stores/providersStore';
import { useProviders } from './useProviders';

export const useActiveProvider = <K extends ProviderKind>(
  kind: K,
): ProviderDescriptor<K> | undefined => {
  const providers = useProviders(kind);
  const activeId = useProvidersStore((state) => state.active[kind]);

  return providers.find((provider) => provider.id === activeId);
};
