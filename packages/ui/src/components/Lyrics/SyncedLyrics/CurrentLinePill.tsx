import { ArrowDown, ArrowUp } from 'lucide-react';
import { FC } from 'react';

import { Button } from '../../Button';
import { ActiveLineDirection } from './useActiveLineDirection';

type CurrentLinePillProps = {
  direction: ActiveLineDirection;
  label: string;
  onClick: () => void;
};

export const CurrentLinePill: FC<CurrentLinePillProps> = ({
  direction,
  label,
  onClick,
}) => (
  <div className="pointer-events-none sticky bottom-4 flex shrink-0 justify-center font-sans tracking-normal font-stretch-normal">
    <Button
      size="sm"
      onClick={onClick}
      data-direction={direction}
      className="pointer-events-auto gap-2 text-sm font-bold"
    >
      {direction === 'up' && <ArrowUp className="size-4" />}
      {direction === 'down' && <ArrowDown className="size-4" />}
      {label}
    </Button>
  </div>
);
