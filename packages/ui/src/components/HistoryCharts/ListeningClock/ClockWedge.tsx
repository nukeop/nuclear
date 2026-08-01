import { motion } from 'motion/react';
import { FC } from 'react';

import { cn } from '../../../utils';

type ClockWedgeProps = {
  hour: number;
  path: string;
  active: boolean;
  barClassName?: string;
};

export const ClockWedge: FC<ClockWedgeProps> = ({
  hour,
  path,
  active,
  barClassName,
}) => (
  <motion.path
    data-testid="listening-clock-bar"
    data-hour={hour}
    data-active={active}
    className={cn(
      'fill-accent-cyan stroke-border stroke-(length:--border-width) transition-[fill] duration-150',
      barClassName,
      { 'fill-primary': active },
    )}
    d={path}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: hour * 0.018 }}
  />
);
