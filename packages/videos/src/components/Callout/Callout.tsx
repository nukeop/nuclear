import { FC } from 'react';

import { Badge, cn } from '@nuclearplayer/ui';

import { Enter } from '../Enter';

type CalloutProps = {
  text: string;
  x: number;
  y: number;
  className?: string;
};

const toPercent = (fraction: number) => `${fraction * 100}%`;

export const Callout: FC<CalloutProps> = ({ text, x, y, className }) => (
  <div
    className="absolute -translate-1/2"
    style={{ left: toPercent(x), top: toPercent(y) }}
  >
    <Enter from="scale">
      <Badge
        variant="pill"
        color="green"
        className={cn(
          'shadow-shadow -rotate-2 px-4 py-2 text-xl font-bold',
          className,
        )}
      >
        {text}
      </Badge>
    </Enter>
  </div>
);
