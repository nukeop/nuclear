import { FC, useState } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Tabs, ViewShell } from '@nuclearplayer/ui';

import { HistoryList } from './components/HistoryList';
import { HistoryStats } from './components/HistoryStats';

export const History: FC = () => {
  const { t } = useTranslation('history');
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <ViewShell data-testid="history-view" title={t('title')}>
      <Tabs
        selectedIndex={selectedTab}
        onChange={setSelectedTab}
        className="flex flex-1 flex-col overflow-hidden"
        panelsClassName="flex-1 overflow-hidden"
        panelClassName="flex flex-1 overflow-hidden"
        items={[
          {
            id: 'stats',
            label: t('tabs.stats'),
            content: <HistoryStats />,
          },
          {
            id: 'listening-history',
            label: t('tabs.listeningHistory'),
            content: <HistoryList />,
          },
        ]}
      />
    </ViewShell>
  );
};
