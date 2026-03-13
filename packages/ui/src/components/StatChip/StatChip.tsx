import { ComponentProps, FC, ReactNode } from 'react';

import { cn } from '../../utils';

type StatChipProps = ComponentProps<'div'> & {
  value: ReactNode;
  label: string;
  icon?: ReactNode;
};

export const StatChip: FC<StatChipProps> = ({
  value,
  label,
  icon,
  className,
  ...props
}) => (
  <div
    className={cn(
      'border-border bg-background shadow-shadow flex items-center gap-2 rounded-md border-(length:--border-width) px-2 py-1',
      className,
    )}
    {...props}
  >
    {icon && <span className="shrink-0">{icon}</span>}
    <span className="font-heading text-lg font-extrabold">{value}</span>
    <span className="text-foreground-secondary text-xs font-bold tracking-wide uppercase">
      {label}
    </span>
  </div>
);
