import { LayoutDashboard } from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, EmptyState } from '@nuclearplayer/ui';

import { useSettingsModalStore } from '../../../stores/settingsModalStore';

export const DashboardEmptyState: FC = () => {
  const { t } = useTranslation('dashboard');

  return (
    <EmptyState
      data-testid="dashboard-empty-state"
      icon={<LayoutDashboard size={48} />}
      title={t('empty-state')}
      description={t('empty-state-description')}
      className="flex-1"
      action={
        <Button
          data-testid="dashboard-empty-state-action"
          onClick={() => useSettingsModalStore.getState().open('plugins')}
        >
          {t('empty-state-action')}
        </Button>
      }
    />
  );
};
