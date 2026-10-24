import { FC, ReactNode } from 'react';

import { CardMenu } from './CardMenu';
import { CardPlayButton } from './CardPlayButton';

export type CardLabels = {
  play?: string;
  menu?: string;
};

type CardActionsProps = {
  onPlay?: () => void;
  menuItems?: ReactNode;
  labels?: CardLabels;
};

export const CardActions: FC<CardActionsProps> = ({
  onPlay,
  menuItems,
  labels,
}) => (
  <div className="group-hover:translate-x-shadow-x group-hover:translate-y-shadow-y pointer-events-none absolute inset-0 border-(length:--border-width) border-transparent p-2 transition-all">
    <div className="relative aspect-square">
      <div className="border-border divide-border pointer-events-auto absolute right-0 bottom-0 flex divide-x-(--border-width) overflow-hidden rounded-tl-md rounded-br-md border-(length:--border-width)">
        {menuItems && <CardMenu label={labels?.menu}>{menuItems}</CardMenu>}
        {onPlay && <CardPlayButton onClick={onPlay} label={labels?.play} />}
      </div>
    </div>
  </div>
);
