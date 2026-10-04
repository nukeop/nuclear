import clamp from 'lodash-es/clamp';
import times from 'lodash-es/times';
import { ComponentProps, CSSProperties, FC } from 'react';

import { cn } from '../../../utils';
import { getTimingState } from '../utils';

type InstrumentalBreakProps = ComponentProps<'div'> & {
  startMs: number;
  endMs: number;
  positionMs: number;
};

const dotFill = (progress: number, index: number) =>
  ({
    '--dot-fill': clamp(progress * 3 - index, 0, 1),
  }) as CSSProperties;

export const InstrumentalBreak: FC<InstrumentalBreakProps> = ({
  startMs,
  endMs,
  positionMs,
  className,
  ...props
}) => {
  const { isActive, progress } = getTimingState({ startMs, endMs }, positionMs);

  return (
    <div
      data-testid="lyrics-break"
      data-active={isActive}
      className={cn('flex gap-3 py-4', className)}
      {...props}
    >
      {times(3, (index) => (
        <span
          key={index}
          className="bg-primary/30 before:bg-primary relative size-4 rounded-full before:absolute before:inset-0 before:scale-(--dot-fill) before:rounded-full"
          style={dotFill(progress, index)}
        />
      ))}
    </div>
  );
};
