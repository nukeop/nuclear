import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';

type WallpaperLayerProps = ComponentProps<'div'>;

export const Wallpaper: FC<WallpaperLayerProps> = ({ className, ...props }) => (
  <div
    data-testid="wallpaper-layer"
    aria-hidden="true"
    className={cn(
      'pointer-events-none fixed inset-0 -z-10 bg-(image:--wallpaper) bg-cover bg-center',
      className,
    )}
    {...props}
  />
);
