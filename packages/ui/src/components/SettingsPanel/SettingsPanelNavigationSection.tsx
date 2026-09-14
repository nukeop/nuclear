import { FC } from 'react';

import { SettingsNavigationSection } from './SettingsPanel';
import { SettingsPanelNavigationItem } from './SettingsPanelNavigationItem';

type SettingsPanelNavigationSectionProps = {
  section: SettingsNavigationSection;
};

export const SettingsPanelNavigationSection: FC<
  SettingsPanelNavigationSectionProps
> = ({ section }) => (
  <div
    data-testid={`settings-navigation-section-${section.id}`}
    className="flex flex-col gap-1"
  >
    <div className="font-heading text-foreground px-2 pt-3 pb-1 text-sm font-extrabold tracking-tight uppercase">
      {section.label}
    </div>
    {section.items.map((item) => (
      <SettingsPanelNavigationItem
        key={item.id}
        id={item.id}
        label={item.label}
        icon={item.icon}
        isActive={section.activeItemId === item.id}
        onClick={() => section.onSelect(item.id)}
      />
    ))}
  </div>
);
