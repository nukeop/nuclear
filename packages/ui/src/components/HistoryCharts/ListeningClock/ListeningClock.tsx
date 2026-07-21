import times from 'lodash-es/times';
import { DateTime } from 'luxon';
import { ComponentProps, FC, ReactNode, useState } from 'react';

import { cn } from '../../../utils';
import { ClockChart } from './ClockChart';
import { ClockStats } from './ClockStats';
import { ClockTooltip } from './ClockTooltip';
import type { ListeningClockClasses, ListeningClockLabels } from './types';

type ListeningClockProps = Omit<ComponentProps<'div'>, 'children'> & {
  values: number[];
  labels: ListeningClockLabels;
  formatValue: (value: number) => string;
  classes?: ListeningClockClasses;
  emptyState?: ReactNode;
};

type HoveredHour = {
  hour: number;
  element: SVGPathElement;
};

const formatHour = (hour: number) =>
  DateTime.fromObject({ hour }).toFormat('HH:mm');

export const ListeningClock: FC<ListeningClockProps> = ({
  values,
  labels,
  formatValue,
  classes,
  emptyState,
  className,
  ...props
}) => {
  const [hovered, setHovered] = useState<HoveredHour | null>(null);

  const hours = times(24, (hour) => values[hour] ?? 0);
  const isEmpty = hours.every((value) => value === 0);
  const busiestValue = Math.max(...hours);
  const busiestHour = hours.indexOf(busiestValue);

  return (
    <div
      data-testid="listening-clock"
      className={cn('flex items-center gap-8', className)}
      {...props}
    >
      {isEmpty ? (
        emptyState
      ) : (
        <>
          <div className="shrink-0" onMouseLeave={() => setHovered(null)}>
            <ClockChart
              hours={hours}
              barClassName={classes?.bar}
              activeHour={hovered?.hour ?? null}
              onHourEnter={(hour, element) => setHovered({ hour, element })}
            />
            {hovered && (
              <ClockTooltip
                anchor={hovered.element}
                value={formatValue(hours[hovered.hour])}
                label={`${formatHour(hovered.hour)} – ${formatHour((hovered.hour + 1) % 24)}`}
              />
            )}
          </div>
          <ClockStats
            labels={labels}
            busiestHour={formatHour(busiestHour)}
            busiestHourValue={formatValue(busiestValue)}
          />
        </>
      )}
    </div>
  );
};
