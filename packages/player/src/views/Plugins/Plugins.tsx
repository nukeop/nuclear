import findIndex from 'lodash-es/findIndex';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Tabs, TabsItem, ViewShell } from '@nuclearplayer/ui';

import type { PluginsTab } from '../../stores/settingsModalStore';
import { InstalledPlugins } from './InstalledPlugins';
import { PluginStore } from './PluginStore';
import { usePluginsTabs } from './usePluginsTabs';

type PluginsTabItem = TabsItem & { id: PluginsTab };

export const Plugins: FC = () => {
  const { t } = useTranslation('plugins');
  const { selectedTab, selectTab, goToStore } = usePluginsTabs();

  const items: PluginsTabItem[] = [
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
  ];

  return (
    <ViewShell title={t('title')}>
      <Tabs
        selectedIndex={findIndex(items, { id: selectedTab })}
        onChange={(index) => selectTab(items[index].id)}
        className="flex flex-1 flex-col overflow-hidden"
        panelsClassName="flex-1 overflow-hidden"
        panelClassName="flex flex-1 overflow-hidden"
        items={items}
      />
    </ViewShell>
  );
};
