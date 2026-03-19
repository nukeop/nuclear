import { FC } from 'react';

import { cn } from '../../utils';
import {
  PlayerWorkspaceSidebar,
  PlayerWorkspaceSidebarPropsBase,
} from './PlayerWorkspaceSidebar';

export const PlayerWorkspaceLeftSidebar: FC<
  PlayerWorkspaceSidebarPropsBase
> = ({ children, ...props }) => {
  return (
    <PlayerWorkspaceSidebar
      side="left"
      className={cn(props.className, 'p-2')}
      {...props}
    >
      {children}
    </PlayerWorkspaceSidebar>
  );
};
