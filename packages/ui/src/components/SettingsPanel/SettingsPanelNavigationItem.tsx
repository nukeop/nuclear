import { FC, ReactNode } from 'react';

import { Button } from '../Button';

type SettingsPanelNavigationItemProps = {
  id: string;
  label: string;
  icon?: ReactNode;
  isActive: boolean;
  onClick: () => void;
};

export const SettingsPanelNavigationItem: FC<
  SettingsPanelNavigationItemProps
> = ({ id, label, icon, isActive, onClick }) => (
  <Button
    data-testid={`settings-navigation-item-${id}`}
    onClick={onClick}
    variant={isActive ? 'default' : 'text'}
    size="default"
    className="justify-start gap-2"
  >
    {icon && <span>{icon}</span>}
    {label}
  </Button>
);
