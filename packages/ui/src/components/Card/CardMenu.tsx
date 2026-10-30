import { EllipsisVerticalIcon } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { Button } from '../Button';
import { Popover } from '../Popover';

type CardMenuProps = {
  children: ReactNode;
  label?: string;
};

export const CardMenu: FC<CardMenuProps> = ({ children, label }) => (
  <Popover
    className="relative"
    panelClassName="surface-background px-0 py-0"
    anchor="bottom end"
    trigger={
      <Button
        data-testid="card-menu-button"
        variant="text"
        size="icon-sm"
        aria-label={label}
        className="surface-background hover:surface-muted rounded-none bg-clip-padding"
      >
        <EllipsisVerticalIcon size={16} />
      </Button>
    }
  >
    <Popover.Menu>{children}</Popover.Menu>
  </Popover>
);
