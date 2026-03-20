import { Package } from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, EmptyState } from '@nuclearplayer/ui';

type InstalledPluginsEmptyStateProps = {
  onGoToStore: () => void;
};

export const InstalledPluginsEmptyState: FC<
  InstalledPluginsEmptyStateProps
> = ({ onGoToStore }) => {
  const { t } = useTranslation('plugins');

  return (
    <EmptyState
      data-testid="installed-plugins-empty-state"
      className="flex-1"
      icon={<Package size={48} />}
      title={t('installed.empty-state')}
      description={t('installed.empty-state-description')}
      action={
        <Button
          data-testid="installed-plugins-empty-state-action"
          onClick={onGoToStore}
        >
          {t('installed.empty-state-action')}
        </Button>
      }
    />
  );
};
