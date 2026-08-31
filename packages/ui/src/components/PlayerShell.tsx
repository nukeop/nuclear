import { ComponentProps, FC } from 'react';

import { cn } from '../utils';
import { WallpaperLayer } from './Wallpaper';

type PlayerShellProps = ComponentProps<'div'>;

export const PlayerShell: FC<PlayerShellProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'grid h-screen w-screen grid-rows-[auto_1fr_auto] overflow-hidden',
        className,
      )}
      {...props}
    >
      <WallpaperLayer />
      {children}
    </div>
  );
};
