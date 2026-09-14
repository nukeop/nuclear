import { FC, ReactNode } from 'react';

import { DialogRoot } from '../Dialog/DialogRoot';
import { SettingsPanelContent } from './SettingsPanelContent';
import { SettingsPanelNavigation } from './SettingsPanelNavigation';

export type SettingsNavigationItem = {
  id: string;
  label: string;
  icon?: ReactNode;
};

export type SettingsNavigationSection = {
  id: string;
  label: string;
  items: SettingsNavigationItem[];
  activeItemId: string | null;
  onSelect: (itemId: string) => void;
};

type SettingsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  sections: SettingsNavigationSection[];
  navigationFooter?: ReactNode;
  children: ReactNode;
};

export const SettingsPanel: FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  sections,
  navigationFooter,
  children,
}) => (
  <DialogRoot
    isOpen={isOpen}
    onClose={onClose}
    className="narrow:inset-0 narrow:rounded-none narrow:border-0 fixed inset-8 flex w-auto max-w-none p-0"
  >
    <SettingsPanelNavigation sections={sections} footer={navigationFooter} />
    <SettingsPanelContent>{children}</SettingsPanelContent>
  </DialogRoot>
);
