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
      className="flex h-[80vh] max-h-[900px] w-[80vw] max-w-6xl p-0"
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
