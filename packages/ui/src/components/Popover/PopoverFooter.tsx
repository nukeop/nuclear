import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';

type PopoverFooterProps = ComponentProps<'div'>;

export const PopoverFooter: FC<PopoverFooterProps> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'border-border bg-background-secondary/40 flex flex-col border-t',
      className,
    )}
    {...props}
  />
);
