import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Tabs, ViewShell } from '@nuclearplayer/ui';

import { InstalledPlugins } from './InstalledPlugins';
import { PluginStore } from './PluginStore';
import { usePluginsTabs } from './usePluginsTabs';

export const Plugins: FC = () => {
  const { t } = useTranslation('plugins');
  const { selectedTab, setSelectedTab, goToStore } = usePluginsTabs();

  return (
    <ViewShell title={t('title')}>
      <Tabs
        selectedIndex={selectedTab}
        onChange={setSelectedTab}
        className="flex flex-1 flex-col overflow-hidden"
        panelsClassName="flex-1 overflow-hidden"
        panelClassName="flex flex-1 overflow-hidden"
        items={[
          {
            id: 'installed',
            label: t('tabs.installed'),
            content: <InstalledPlugins onGoToStore={goToStore} />,
          },
          {
            id: 'store',
            label: t('tabs.store'),
            content: <PluginStore />,
          },
        ]}
      />
    </ViewShell>
  );
};
