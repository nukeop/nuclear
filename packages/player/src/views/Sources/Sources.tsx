import { FC } from 'react';

import { ViewShell } from '@nuclearplayer/ui';

import { ProviderKindSection } from './components/ProviderKindSection';

export const Sources: FC = () => {
  return (
    <ViewShell data-testid="sources-view" title="Sources">
      <ProviderKindSection kind="streaming" />
      <ProviderKindSection kind="metadata" />
    </ViewShell>
  );
};
