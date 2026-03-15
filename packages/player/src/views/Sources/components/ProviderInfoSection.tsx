import { ComponentProps, FC, ReactNode } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { ProviderKind } from '@nuclearplayer/plugin-sdk';
import { Badge } from '@nuclearplayer/ui';

import { useProviders } from '../../../hooks/useProviders';

type ProviderInfoSectionProps = {
  kind: ProviderKind;
  icon: ReactNode;
  pillIcon: ReactNode;
  color: ComponentProps<typeof Badge>['color'];
};

export const ProviderInfoSection: FC<ProviderInfoSectionProps> = ({
  kind,
  icon,
  pillIcon,
  color,
}) => {
  const { t } = useTranslation('sources');
  const providers = useProviders(kind);

  return (
    <div data-testid={`sources-section-${kind}`} className="mb-6 px-2">
      <h3 className="text-foreground mb-1 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {t(kind)}
      </h3>
      <p className="text-foreground-secondary mb-3 text-sm">
        {t(`${kind}Description`)}
      </p>
      {providers.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {providers.map((provider) => (
            <Badge
              key={provider.id}
              variant="pill"
              color={color}
              data-testid="provider-list-item"
              className="gap-1"
            >
              {pillIcon}
              {provider.name}
            </Badge>
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
