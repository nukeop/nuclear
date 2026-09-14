import {
  BlocksIcon,
  KeyboardIcon,
  PaletteIcon,
  ScrollTextIcon,
  SparklesIcon,
} from 'lucide-react';
import { ReactNode } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { SettingsNavigationSection } from '@nuclearplayer/ui';

import { useSettingsModalStore } from '../stores/settingsModalStore';
import { KeyboardShortcuts } from '../views/KeyboardShortcuts';
import { Logs } from '../views/Logs/Logs';
import { Plugins } from '../views/Plugins/Plugins';
import { Settings } from '../views/Settings/Settings';
import { useSettingsGroups } from '../views/Settings/useSettingsGroups';
import { Themes } from '../views/Themes/Themes';
import { WhatsNew } from '../views/WhatsNew';

const APP_TABS = [
  {
    id: 'shortcuts',
    labelKey: 'shortcuts.title',
    icon: <KeyboardIcon />,
    view: <KeyboardShortcuts />,
  },
  {
    id: 'app-plugins',
    labelKey: 'plugins.title',
    icon: <BlocksIcon />,
    view: <Plugins />,
  },
  {
    id: 'themes',
    labelKey: 'themes.title',
    icon: <PaletteIcon />,
    view: <Themes />,
  },
  {
    id: 'logs',
    labelKey: 'logs.title',
    icon: <ScrollTextIcon />,
    view: <Logs />,
  },
  {
    id: 'whats-new',
    labelKey: 'whats-new.title',
    icon: <SparklesIcon />,
    view: <WhatsNew />,
  },
];

type SettingsNavigation = {
  sections: SettingsNavigationSection[];
  content: ReactNode;
};

export const useSettingsNavigation = (): SettingsNavigation => {
  const { t } = useTranslation('preferences');
  const { activeItemId, selectItem } = useSettingsModalStore();
  const settingsGroups = useSettingsGroups();

  const activeTab = APP_TABS.find((tab) => tab.id === activeItemId);

  return {
    sections: [
      {
        id: 'general',
        label: t('navigation.general'),
        items: settingsGroups.map((group) => ({
          id: group.name,
          label: t(`${group.name}.title`, group.name),
        })),
        activeItemId,
        onSelect: selectItem,
      },
      {
        id: 'app',
        label: t('navigation.app'),
        items: APP_TABS.map((tab) => ({
          id: tab.id,
          label: t(tab.labelKey),
          icon: tab.icon,
        })),
        activeItemId,
        onSelect: selectItem,
      },
    ],
    content: activeTab?.view ?? <Settings />,
  };
};
