import { FC } from 'react';

import { OUTER_RADIUS, wedgePath } from './geometry';

export const HourSlots: FC = () => (
  <g>
    {Array.from({ length: 24 }, (_, hour) => (
      <path
        key={hour}
        data-testid="listening-clock-slot"
        className="fill-background-secondary stroke-foreground-secondary/50 stroke-1"
        d={wedgePath({ hour, radius: OUTER_RADIUS }) ?? undefined}
      />
    ))}
  </g>
);
