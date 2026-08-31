import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { WallpaperLayer } from '../Wallpaper';

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
      'surface-background text-foreground flex h-dvh flex-col overflow-hidden',
      className,
    )}
  >
    <WallpaperLayer />
    {children}
  </div>
);
