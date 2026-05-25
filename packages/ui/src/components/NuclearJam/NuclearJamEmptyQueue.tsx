import { Music } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';

export type NuclearJamEmptyQueueLabels = {
  title?: string;
  subtitle?: string;
};

type NuclearJamEmptyQueueProps = {
  labels: NuclearJamEmptyQueueLabels;
  className?: string;
};

export const NuclearJamEmptyQueue: FC<NuclearJamEmptyQueueProps> = ({
  labels,
  className,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center gap-3 p-6 text-center',
      className,
    )}
    data-testid="jam-queue-empty"
  >
    <Music size={48} className="text-foreground-secondary opacity-50" />
    {labels.title && (
      <div className="text-foreground text-base font-bold">{labels.title}</div>
    )}
    {labels.subtitle && (
      <div className="text-foreground-secondary text-sm">{labels.subtitle}</div>
    )}
  </div>
);
