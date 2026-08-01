import { arc } from 'd3-shape';
import { DateTime } from 'luxon';
import { FC } from 'react';

import { hourToRadians } from './geometry';

const labelPoint = arc<number>()
  .innerRadius(115)
  .outerRadius(115)
  .startAngle(hourToRadians)
  .endAngle(hourToRadians);

export const HourLabels: FC = () => (
  <>
    {[0, 6, 12, 18].map((hour) => {
      const [x, y] = labelPoint.centroid(hour);
      return (
        <text
          key={hour}
          className="fill-foreground-secondary font-bold"
          x={x}
          y={y}
          fontSize={16}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {DateTime.fromObject({ hour }).toFormat('HH')}
        </text>
      );
    })}
  </>
);
