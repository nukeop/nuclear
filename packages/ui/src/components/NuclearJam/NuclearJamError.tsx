import { WifiOff } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';
import { EmptyState } from '../EmptyState';

export type NuclearJamErrorLabels = {
  title: string;
  subtitle: string;
};

type NuclearJamErrorProps = {
  labels: NuclearJamErrorLabels;
  className?: string;
};

export const NuclearJamError: FC<NuclearJamErrorProps> = ({
  labels,
  className,
}) => (
  <EmptyState
    icon={<WifiOff size={48} />}
    title={labels.title}
    description={labels.subtitle}
    className={cn('flex-1', className)}
    data-testid="jam-error"
  />
);
