import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

export type NuclearJamProps = {
  children: ReactNode;
  className?: string;
};

export const NuclearJamRoot: FC<NuclearJamProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      'bg-background text-foreground flex h-dvh flex-col overflow-hidden',
      className,
    )}
  >
    {children}
  </div>
);
