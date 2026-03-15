import { LucideIcon } from 'lucide-react';
import { ComponentProps, FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { ProviderKind } from '@nuclearplayer/plugin-sdk';
import { Badge } from '@nuclearplayer/ui';

import { useProviders } from '../../../hooks/useProviders';
import { ProviderPill } from './ProviderPill';

type ProviderInfoSectionProps = {
  kind: ProviderKind;
  Icon: LucideIcon;
  color: ComponentProps<typeof Badge>['color'];
};

export const ProviderInfoSection: FC<ProviderInfoSectionProps> = ({
  kind,
  Icon,
  color,
}) => {
  const { t } = useTranslation('sources');
  const providers = useProviders(kind);

  return (
    <div data-testid={`sources-section-${kind}`} className="mb-6 px-2">
      <h3 className="text-foreground mb-1 flex items-center gap-2 text-sm font-semibold">
        <Icon size={14} />
        {t(kind)}
      </h3>
      <p className="text-foreground-secondary mb-3 text-sm">
        {t(`${kind}Description`)}
      </p>
      {providers.length ? (
        <div className="flex flex-wrap gap-2">
          {providers.map((provider) => (
            <ProviderPill
              key={provider.id}
              Icon={Icon}
              color={color}
              data-testid="provider-list-item"
            >
              {provider.name}
            </ProviderPill>
          ))}
        </div>
      ) : (
        <p className="text-foreground-secondary text-sm italic">
          {t('noProviders')}
        </p>
      )}
    </div>
  );
};
