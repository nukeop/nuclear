import { WifiOff } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';

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
  <div
    className={cn(
      'flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center',
      className,
    )}
    data-testid="jam-error"
  >
    <WifiOff size={48} className="text-accent-red" />
    <h1 className="text-foreground text-3xl">{labels.title}</h1>
    <h2 className="text-foreground-secondary text-xl">{labels.subtitle}</h2>
  </div>
);
