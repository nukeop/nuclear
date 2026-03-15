import { LucideIcon } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { ProviderKind } from '@nuclearplayer/plugin-sdk';
import { Select } from '@nuclearplayer/ui';

import { useProviders } from '../../../hooks/useProviders';

type ProviderKindSectionProps = {
  kind: ProviderKind;
  Icon: LucideIcon;
  value?: string;
  disabled?: boolean;
  lockedReason?: ReactNode;
  onValueChange?: (providerId: string) => void;
  warnings?: { providerName: string; message: string }[];
};

export const ProviderKindSection: FC<ProviderKindSectionProps> = ({
  kind,
  Icon,
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
    <div data-testid={`sources-section-${kind}`} className="mb-6 px-2">
      <h3 className="text-foreground mb-1 flex items-center gap-2 text-sm font-semibold">
        <Icon size={14} />
        {t(kind)}
      </h3>
      <p className="text-foreground-secondary mb-2 text-sm">
        {t(`${kind}Description`)}
      </p>
      <Select
        options={options}
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
      />
      {lockedReason && (
        <p
          className="text-foreground-secondary mt-4 text-sm leading-relaxed"
          data-testid="locked-reason"
        >
          {lockedReason}
        </p>
      )}
      {warnings?.map((warning) => (
        <p
          key={warning.providerName}
          className="text-foreground-secondary mt-2 text-sm"
          data-testid={`provider-warning-${warning.providerName}`}
        >
          {warning.message}
        </p>
      ))}
    </div>
  );
};
