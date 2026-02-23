import { FC, ReactNode } from 'react';

import { SettingsTab } from './SettingsPanel';
import { SettingsPanelNavItem } from './SettingsPanelNavItem';

type SettingsPanelNavProps = {
  tabs: SettingsTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  footer?: ReactNode;
};

export const SettingsPanelNav: FC<SettingsPanelNavProps> = ({
  tabs,
  activeTab,
  onTabChange,
  footer,
}) => (
  <nav className="border-border flex w-56 flex-shrink-0 flex-col border-r-2 p-4">
    <div className="flex flex-col gap-1">
      {tabs.map((tab) => (
        <SettingsPanelNavItem
          key={tab.id}
          id={tab.id}
          label={tab.label}
          icon={tab.icon}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
    {footer && <div className="mt-auto">{footer}</div>}
  </nav>
);
