import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

type TrackContextMenuActionProps = {
  icon?: ReactNode;
  children: ReactNode;
  onClick: () => void;
  'data-testid'?: string;
};

export const TrackContextMenuAction: FC<TrackContextMenuActionProps> = ({
  icon,
  children,
  onClick,
  'data-testid': testId,
}) => {
  return (
    <DropdownMenu.Item
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 border-t border-transparent px-3 py-2 text-left text-sm outline-none not-last:border-b',
        'data-[highlighted]:bg-muted data-[highlighted]:border-border nth-[2]:border-t-transparent',
      )}
      onClick={onClick}
      data-testid={testId}
    >
      <span className="shrink-0">{icon}</span>
      <span>{children}</span>
    </DropdownMenu.Item>
  );
};
