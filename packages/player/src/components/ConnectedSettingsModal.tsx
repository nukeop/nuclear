import {
  BlocksIcon,
  KeyboardIcon,
  PaletteIcon,
  ScrollTextIcon,
  Settings2Icon,
  SparklesIcon,
} from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { SettingsPanel } from '@nuclearplayer/ui';

import {
  useSettingsModalStore,
  type SettingsTab,
} from '../stores/settingsModalStore';
import { KeyboardShortcuts } from '../views/KeyboardShortcuts';
import { Logs } from '../views/Logs/Logs';
import { Plugins } from '../views/Plugins/Plugins';
import { Settings } from '../views/Settings/Settings';
import { Themes } from '../views/Themes/Themes';
import { WhatsNew } from '../views/WhatsNew';
import { VersionString } from './VersionString';

const SETTINGS_TABS = [
  {
    id: 'general',
    icon: <Settings2Icon />,
    content: () => <Settings />,
  },
  {
    id: 'shortcuts',
    icon: <KeyboardIcon />,
    content: () => <KeyboardShortcuts />,
  },
  {
    id: 'plugins',
    icon: <BlocksIcon />,
    content: () => <Plugins />,
  },
  {
    id: 'themes',
    icon: <PaletteIcon />,
    content: () => <Themes />,
  },
  {
    id: 'logs',
    icon: <ScrollTextIcon />,
    content: () => <Logs />,
  },
  {
    id: 'whats-new',
    icon: <SparklesIcon />,
    content: () => <WhatsNew />,
  },
] as const;

export const ConnectedSettingsModal: FC = () => {
  const { t } = useTranslation('preferences');
  const { isOpen, close, activeTab, setActiveTab } = useSettingsModalStore();

  const tabs = SETTINGS_TABS.map((tab) => ({
    ...tab,
    label: t(`${tab.id}.title`),
  }));

  return (
    <SettingsPanel
      isOpen={isOpen}
      onClose={close}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as SettingsTab)}
      navFooter={<VersionString />}
    />
  );
};
