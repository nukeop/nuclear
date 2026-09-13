import { FC, ReactNode } from 'react';

import { DialogRoot } from '../Dialog/DialogRoot';
import { SettingsPanelContent } from './SettingsPanelContent';
import { SettingsPanelNav } from './SettingsPanelNav';

export type SettingsTab = {
  id: string;
  label: string;
  icon: ReactNode;
  content: () => ReactNode;
};

type SettingsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  tabs: SettingsTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  navFooter?: ReactNode;
};

export const SettingsPanel: FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  tabs,
  activeTab,
  onTabChange,
  navFooter,
}) => {
  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <DialogRoot
      isOpen={isOpen}
      onClose={onClose}
      className="narrow:inset-0 narrow:rounded-none narrow:border-0 fixed inset-8 flex w-auto max-w-none p-0"
    >
      <SettingsPanelNav
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        footer={navFooter}
      />
      <SettingsPanelContent>
        {activeTabContent && activeTabContent()}
      </SettingsPanelContent>
    </DialogRoot>
  );
};
