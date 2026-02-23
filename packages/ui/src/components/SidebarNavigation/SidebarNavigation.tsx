import { FC, ReactNode } from 'react';

import { SidebarCompactProvider } from './SidebarCompactContext';

type SidebarNavigationProps = {
  children: ReactNode;
  isCompact?: boolean;
};

export const SidebarNavigation: FC<SidebarNavigationProps> = ({
  children,
  isCompact = false,
}) => {
  return (
    <SidebarCompactProvider isCompact={isCompact}>
      <div
        data-testid="sidebar-navigation"
        data-compact={isCompact || undefined}
        className="group/sidebar flex flex-1 flex-col items-start justify-start"
      >
        {children}
      </div>
    </SidebarCompactProvider>
  );
};
