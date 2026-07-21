import { FC, MouseEvent } from 'react';

import { wedgePath } from './geometry';

type HourHitAreasProps = {
  onHourEnter: (hour: number, element: SVGPathElement) => void;
};

export const HourHitAreas: FC<HourHitAreasProps> = ({ onHourEnter }) => (
  <g>
    {Array.from({ length: 24 }, (_, hour) => (
      <path
        key={hour}
        data-testid="listening-clock-hit"
        fill="transparent"
        d={wedgePath({ hour, radius: 102 }) ?? undefined}
        onMouseEnter={(event: MouseEvent<SVGPathElement>) =>
          onHourEnter(hour, event.currentTarget)
        }
      />
    ))}
  </g>
);
