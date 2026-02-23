import { Link } from '@tanstack/react-router';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { Tooltip } from '../Tooltip/Tooltip';
import { useSidebarCompact } from './SidebarCompactContext';

type SidebarNavigationItemProps = {
  icon: ReactNode;
  label: string;
  isSelected?: boolean;
  to?: string;
  onClick?: () => void;
};

const MaybeNavLink: FC<{
  to?: string;
  isSelected?: boolean;
  children: (isSelected: boolean) => ReactNode;
}> = ({ to, isSelected = false, children }) => {
  if (to) {
    return <Link to={to}>{({ isActive }) => children(isActive)}</Link>;
  }
  return <>{children(isSelected)}</>;
};

export const SidebarNavigationItem: FC<SidebarNavigationItemProps> = ({
  icon,
  label,
  isSelected,
  to,
  onClick,
}) => {
  const isCompact = useSidebarCompact();

  return (
    <MaybeNavLink to={to} isSelected={isSelected}>
      {(active) => (
        <Tooltip content={label} side="right" disabled={!isCompact}>
          <div
            role={onClick ? 'button' : undefined}
            onClick={onClick}
            data-testid="sidebar-navigation-item"
            className={cn(
              'flex w-full flex-row items-center gap-2 rounded-r-md border-y-2 border-transparent px-2 py-1',
              'group-data-[compact]/sidebar:justify-center group-data-[compact]/sidebar:rounded-md group-data-[compact]/sidebar:border-2 group-data-[compact]/sidebar:px-0 group-data-[compact]/sidebar:py-2',
              onClick && 'cursor-pointer',
              active &&
                'bg-primary border-border border-t-2 border-r-2 border-b-2 font-bold',
            )}
          >
            <span className="shrink-0">{icon}</span>
            <span className="group-data-[compact]/sidebar:hidden">{label}</span>
          </div>
        </Tooltip>
      )}
    </MaybeNavLink>
  );
};
