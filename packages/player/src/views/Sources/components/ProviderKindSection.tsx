import { FC, ReactNode } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { ProviderKind } from '@nuclearplayer/plugin-sdk';
import { Select } from '@nuclearplayer/ui';

import { useProviders } from '../../../hooks/useProviders';

type ProviderWarning = {
  providerName: string;
  message: string;
};

type ProviderKindSectionProps = {
  kind: ProviderKind;
  value?: string;
  disabled?: boolean;
  lockedReason?: ReactNode;
  onValueChange?: (providerId: string) => void;
  warnings?: ProviderWarning[];
};

export const ProviderKindSection: FC<ProviderKindSectionProps> = ({
  kind,
  value,
  disabled,
  lockedReason,
  onValueChange,
  warnings,
}) => {
  const { t } = useTranslation('sources');
  const providers = useProviders(kind);
  const options = providers.map((provider) => ({
    id: provider.id,
    label: provider.name,
  }));

  return (
    <div data-testid={`sources-section-${kind}`} className="mb-4 px-2">
      <Select
        label={t(kind)}
        description={t(`${kind}Description`)}
        options={options}
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
      />
      {lockedReason && (
        <p className="mt-4 leading-loose" data-testid="locked-reason">
          {lockedReason}
        </p>
      )}
      {warnings?.map((warning) => (
        <p
          key={warning.providerName}
          data-testid={`provider-warning-${warning.providerName}`}
        >
          {warning.message}
        </p>
      ))}
    </div>
  );
};
