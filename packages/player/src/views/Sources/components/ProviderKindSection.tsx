import { FC } from 'react';

import type { ProviderKind } from '@nuclearplayer/plugin-sdk';
import { Select } from '@nuclearplayer/ui';

import { useProviders } from '../../../hooks/useProviders';

export const ProviderKindSection: FC<{ kind: ProviderKind }> = ({ kind }) => {
  const providers = useProviders(kind);
  const options = providers.map((provider) => ({
    id: provider.id,
    label: provider.name,
  }));

  return (
    <div data-testid={`sources-section-${kind}`}>
      <Select label="Provider" options={options} />
    </div>
  );
};
