import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { PlayerWorkspaceLeftSidebar } from './PlayerWorkspaceLeftSidebar';
import { PlayerWorkspaceRightSidebar } from './PlayerWorkspaceRightSidebar';

type PlayerWorkspaceProps = {
  children: ReactNode;
  className?: string;
};

type MainProps = {
  children?: ReactNode;
  className?: string;
};

const PlayerWorkspaceMain: FC<MainProps> = ({ children, className = '' }) => {
  return (
    <main
      data-testid="player-workspace-main"
      className={cn('surface-muted overflow-auto', className)}
    >
      {children}
    </main>
  );
};

type PlayerWorkspaceComponent = FC<PlayerWorkspaceProps> & {
  LeftSidebar: typeof PlayerWorkspaceLeftSidebar;
  RightSidebar: typeof PlayerWorkspaceRightSidebar;
  Main: typeof PlayerWorkspaceMain;
};

const PlayerWorkspaceImpl: FC<PlayerWorkspaceProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'surface-muted relative grid h-full min-h-0 grid-cols-[auto_1fr_auto]',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const PlayerWorkspace = PlayerWorkspaceImpl as PlayerWorkspaceComponent;
PlayerWorkspace.LeftSidebar = PlayerWorkspaceLeftSidebar;
PlayerWorkspace.RightSidebar = PlayerWorkspaceRightSidebar;
PlayerWorkspace.Main = PlayerWorkspaceMain;
