import { FC, ReactNode } from 'react';
import { interpolate } from 'remotion';

import { useEntranceProgress, useExitOpacity } from './useEntrance';

export type EnterFrom = 'bottom' | 'right' | 'scale';

const slide = (progress: number, distance: number) =>
  interpolate(progress, [0, 1], [distance, 0]);

const transforms: Record<EnterFrom, (progress: number) => string> = {
  bottom: (progress) => `translateY(${slide(progress, 2.5)}rem)`,
  right: (progress) => `translateX(${slide(progress, 4)}rem)`,
  scale: (progress) => `scale(${progress})`,
};

type EnterProps = {
  from?: EnterFrom;
  className?: string;
  children: ReactNode;
};

export const Enter: FC<EnterProps> = ({
  from = 'bottom',
  className,
  children,
}) => {
  const progress = useEntranceProgress();
  const exitOpacity = useExitOpacity();

  return (
    <div
      className={className}
      style={{
        opacity: Math.min(progress, exitOpacity),
        transform: transforms[from](progress),
      }}
    >
      {children}
    </div>
  );
};
