import { FC, ReactNode } from 'react';

import { SettingsNavigationSection } from './SettingsPanel';
import { SettingsPanelNavigationSection } from './SettingsPanelNavigationSection';

type SettingsPanelNavigationProps = {
  sections: SettingsNavigationSection[];
  footer?: ReactNode;
};

export const SettingsPanelNavigation: FC<SettingsPanelNavigationProps> = ({
  sections,
  footer,
}) => (
  <nav className="border-border flex w-56 shrink-0 flex-col gap-4 border-r-(length:--border-width) p-4">
    {sections.map((section) => (
      <SettingsPanelNavigationSection key={section.id} section={section} />
    ))}
    {footer && <div className="mt-auto">{footer}</div>}
  </nav>
);
