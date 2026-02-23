import { FC, ReactNode } from 'react';

import { Button } from '../Button';

type SettingsPanelNavItemProps = {
  id: string;
  label: string;
  icon: ReactNode;
  isActive: boolean;
  onClick: () => void;
};

export const SettingsPanelNavItem: FC<SettingsPanelNavItemProps> = ({
  id,
  label,
  icon,
  isActive,
  onClick,
}) => (
  <Button
    data-testid={`settings-tab-${id}`}
    onClick={onClick}
    variant={isActive ? 'default' : 'text'}
    size="default"
    className="justify-start gap-2"
  >
    {icon}
    {label}
  </Button>
);
