import { ComponentProps, FC } from 'react';

import { cn } from '../utils';

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
      <div
        data-testid="wallpaper-layer"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[image:var(--wallpaper)] bg-cover bg-center"
      />
      {children}
    </div>
  );
};
