import { motion } from 'framer-motion';
import { PanelLeft, PanelRight } from 'lucide-react';
import { FC, ReactNode, useRef } from 'react';

import { cn } from '../../utils';
import { Button } from '../Button';
import { SIDEBAR_CONFIG } from './constants';
import { useSidebarResize } from './hooks';

export type PlayerWorkspaceSidebarPropsBase = {
  children?: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  persistentFooter?: ReactNode;
  isCollapsed: boolean;
  width: number;
  onWidthChange: (width: number) => void;
  onToggle: () => void;
  className?: string;
};

type PlayerWorkspaceSidebarProps = PlayerWorkspaceSidebarPropsBase & {
  side: 'left' | 'right';
};

export const PlayerWorkspaceSidebar: FC<PlayerWorkspaceSidebarProps> = ({
  children,
  headerActions,
  footer,
  persistentFooter,
  isCollapsed,
  width,
  onWidthChange,
  onToggle,
  side,
  className = '',
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { handleMouseDown, isResizingState } = useSidebarResize(
    width,
    onWidthChange,
    side,
    isCollapsed,
  );

  const currentWidth = isCollapsed ? SIDEBAR_CONFIG.COLLAPSED_WIDTH : width;

  return (
    <motion.div
      ref={sidebarRef}
      className={cn(
        'bg-background-secondary border-border relative flex flex-col overflow-hidden p-2',
        { 'border-r-2': side === 'left', 'border-l-2': side === 'right' },
        className,
      )}
      animate={{ width: currentWidth }}
      transition={
        isResizingState
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }
      }
    >
      <span
        className={cn('mb-4 flex flex-row items-center', {
          'justify-end': side === 'left',
          'justify-start': side === 'right',
        })}
      >
        <Button
          data-testid={`sidebar-toggle-${side}`}
          className={cn('top-2 px-2', {
            'right-1': side === 'left',
            'left-1': side === 'right',
          })}
          size="icon"
          onClick={onToggle}
        >
          {side === 'left' ? <PanelLeft /> : <PanelRight />}
        </Button>
        {!isCollapsed && headerActions && (
          <span className="flex flex-1 items-center justify-end gap-1">
            {headerActions}
          </span>
        )}
      </span>
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
        {!isCollapsed && footer && (
          <div className="mt-auto flex justify-center">{footer}</div>
        )}
      </div>

      {persistentFooter && (
        <div className="mt-auto flex flex-col items-center gap-2 py-2">
          {persistentFooter}
        </div>
      )}

      {!isCollapsed && (
        <div
          className={cn(
            'absolute top-0 bottom-0 w-1 cursor-col-resize transition-colors',
            side === 'left' ? 'right-0' : 'left-0',
          )}
          onMouseDown={handleMouseDown}
        />
      )}
    </motion.div>
  );
};
