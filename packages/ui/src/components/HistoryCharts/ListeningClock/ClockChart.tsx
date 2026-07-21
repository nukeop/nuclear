import { scaleSqrt } from 'd3-scale';
import { FC } from 'react';

import { ClockWedge } from './ClockWedge';
import { wedgePath } from './geometry';
import { HourHitAreas } from './HourHitAreas';
import { HourLabels } from './HourLabels';
import { HourSlots } from './HourSlots';

type ClockChartProps = {
  hours: number[];
  barClassName?: string;
  activeHour: number | null;
  onHourEnter: (hour: number, element: SVGPathElement) => void;
};

export const ClockChart: FC<ClockChartProps> = ({
  hours,
  barClassName,
  activeHour,
  onHourEnter,
}) => {
  const barRadius = scaleSqrt()
    .domain([0, Math.max(...hours)])
    .range([36, 102]);

  return (
    <svg className="aspect-square w-64" viewBox="0 0 264 264">
      <g transform="translate(132 132)">
        <HourSlots />
        <HourLabels />
        {hours.map((value, hour) => {
          const path = wedgePath({ hour, radius: barRadius(value) });
          if (value === 0 || path === null) {
            return null;
          }
          return (
            <ClockWedge
              key={hour}
              hour={hour}
              path={path}
              active={hour === activeHour}
              barClassName={barClassName}
            />
          );
        })}
        <HourHitAreas onHourEnter={onHourEnter} />
      </g>
    </svg>
  );
};
