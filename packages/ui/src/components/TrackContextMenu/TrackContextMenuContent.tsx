import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FC, ReactNode } from 'react';

type TrackContextMenuContentProps = {
  children: ReactNode;
};

export const TrackContextMenuContent: FC<TrackContextMenuContentProps> = ({
  children,
}) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align="end"
        sideOffset={4}
        className="bg-background border-border data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 w-56 origin-top-right overflow-hidden rounded-sm border-(length:--border-width) shadow-lg outline-none"
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
};
