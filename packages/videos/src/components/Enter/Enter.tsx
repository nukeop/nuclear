import { FC, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { useExitProgress } from '../motion';
import { Entrance, entranceStyles } from './entrances';

type EnterProps = {
  entrance?: Entrance;
  delay?: number;
  exit?: boolean;
  className?: string;
  children: ReactNode;
};

const exitAmount = (exit: boolean, exitProgress: number) => {
  if (!exit) {
    return 0;
  }
  return exitProgress;
};

export const Enter: FC<EnterProps> = ({
  entrance = 'drop',
  delay = 0,
  exit = true,
  className,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitProgress = useExitProgress();

  const style = entranceStyles[entrance]({
    frame: Math.max(0, frame - delay),
    fps,
    exit: exitAmount(exit, exitProgress),
  });

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};
