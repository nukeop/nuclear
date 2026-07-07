import { ComponentProps, FC, ReactNode } from 'react';

import { cn } from '../../utils';

type PopoverSectionProps = ComponentProps<'div'> & {
  label: ReactNode;
};

export const PopoverSection: FC<PopoverSectionProps> = ({
  label,
  className,
  children,
  ...props
}) => (
  <div className={cn('flex flex-col', className)} {...props}>
    <div className="text-foreground-secondary px-3 pt-2.5 pb-1 text-xs font-bold tracking-wide uppercase">
      {label}
    </div>
    {children}
  </div>
);
