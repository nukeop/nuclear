import { FC } from 'react';

import { wedgePath } from './geometry';

export const HourSlots: FC = () => (
  <g>
    {Array.from({ length: 24 }, (_, hour) => (
      <path
        key={hour}
        data-testid="listening-clock-slot"
        className="fill-background-secondary/50"
        d={wedgePath({ hour, radius: 102 }) ?? undefined}
      />
    ))}
  </g>
);
