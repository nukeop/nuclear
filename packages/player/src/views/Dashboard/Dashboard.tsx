import isEmpty from 'lodash-es/isEmpty';
import { FC, useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { DashboardProvider } from '@nuclearplayer/plugin-sdk';
import { ViewShell } from '@nuclearplayer/ui';

import { useProviders } from '../../hooks/useProviders';
import { useStartupStore } from '../../stores/startupStore';
import { DashboardEmptyState } from './components/DashboardEmptyState';
import { DashboardStartupSkeleton } from './components/DashboardStartupSkeleton';
import { DASHBOARD_WIDGETS, DashboardWidgetEntry } from './dashboardWidgets';

const DashboardContent: FC<{
  isStartingUp: boolean;
  activeWidgets: DashboardWidgetEntry[];
}> = ({ isStartingUp, activeWidgets }) => {
  if (isStartingUp) {
    return <DashboardStartupSkeleton />;
  }

  if (isEmpty(activeWidgets)) {
    return <DashboardEmptyState />;
  }

  return activeWidgets.map(({ capability, component: Widget }) => (
    <Widget key={capability} />
  ));
};

export const Dashboard: FC = () => {
  const { t } = useTranslation('dashboard');
  const isStartingUp = useStartupStore((state) => state.isStartingUp);
  const providers = useProviders('dashboard') as DashboardProvider[];

  const activeWidgets = useMemo(() => {
    const capabilities = new Set(
      providers.flatMap((provider) => provider.capabilities),
    );

    return DASHBOARD_WIDGETS.filter((widget) =>
      capabilities.has(widget.capability),
    );
  }, [providers]);

  return (
    <ViewShell data-testid="dashboard-view" title={t('title')}>
      <DashboardContent
        isStartingUp={isStartingUp}
        activeWidgets={activeWidgets}
      />
    </ViewShell>
  );
};
