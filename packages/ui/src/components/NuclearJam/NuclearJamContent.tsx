import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

export type NuclearJamContentProps = {
  children: ReactNode;
  className?: string;
};

export const NuclearJamContent: FC<NuclearJamContentProps> = ({
  children,
  className,
}) => (
  <div className={cn('relative flex min-h-0 flex-1 flex-col', className)}>
    {children}
  </div>
);
