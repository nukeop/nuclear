import { useState } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Tabs, ViewShell } from '@nuclearplayer/ui';

import { MyThemes } from './MyThemes';
import { ThemeStore } from './ThemeStore';

export const Themes = () => {
  const { t } = useTranslation('themes');
  const [selectedTab, setSelectedTab] = useState(0);

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
            id: 'my-themes',
            label: t('tabs.myThemes'),
            content: <MyThemes />,
          },
          {
            id: 'store',
            label: t('tabs.store'),
            content: <ThemeStore />,
          },
        ]}
      />
    </ViewShell>
  );
};
