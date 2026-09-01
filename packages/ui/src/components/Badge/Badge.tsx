import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps, FC, ReactNode } from 'react';

import { cn } from '../../utils';

const badgeVariants = cva(
  'border-border inline-flex items-center justify-center border-(length:--border-width) whitespace-nowrap',
  {
    variants: {
      variant: {
        dot: 'size-2.5 rounded-full',
        pill: 'rounded-full px-2 py-0.5 text-xs font-semibold',
      },
      color: {
        green: '',
        cyan: '',
        orange: '',
        red: '',
        yellow: '',
        purple: '',
        blue: '',
        secondary: '',
        inverted: '',
      },
      animated: {
        true: 'animate-pulse',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'dot',
        color: 'green',
        className: 'surface-accent-green',
      },
      {
        variant: 'dot',
        color: 'cyan',
        className: 'surface-accent-cyan',
      },
      {
        variant: 'dot',
        color: 'orange',
        className: 'surface-accent-orange',
      },
      {
        variant: 'dot',
        color: 'red',
        className: 'surface-accent-red',
      },
      {
        variant: 'dot',
        color: 'yellow',
        className: 'surface-accent-yellow',
      },
      {
        variant: 'dot',
        color: 'purple',
        className: 'surface-accent-purple',
      },
      {
        variant: 'dot',
        color: 'blue',
        className: 'surface-accent-blue',
      },
      {
        variant: 'pill',
        color: 'secondary',
        className: 'bg-background text-foreground',
      },
      {
        variant: 'pill',
        color: 'inverted',
        className: 'bg-foreground text-muted',
      },
      {
        variant: 'pill',
        color: 'green',
        className: 'surface-accent-green text-accent-green-foreground',
      },
      {
        variant: 'pill',
        color: 'cyan',
        className: 'surface-accent-cyan text-accent-cyan-foreground',
      },
      {
        variant: 'pill',
        color: 'orange',
        className: 'surface-accent-orange text-accent-orange-foreground',
      },
      {
        variant: 'pill',
        color: 'red',
        className: 'surface-accent-red text-accent-red-foreground',
      },
      {
        variant: 'pill',
        color: 'yellow',
        className: 'surface-accent-yellow text-accent-yellow-foreground',
      },
      {
        variant: 'pill',
        color: 'purple',
        className: 'surface-accent-purple text-accent-purple-foreground',
      },
      {
        variant: 'pill',
        color: 'blue',
        className: 'surface-accent-blue text-accent-blue-foreground',
      },
    ],
    defaultVariants: {
      variant: 'dot',
      color: 'green',
      animated: false,
    },
  },
);

type BadgeProps = Omit<ComponentProps<'span'>, 'children'> &
  VariantProps<typeof badgeVariants> & {
    children?: ReactNode;
  };

export const Badge: FC<BadgeProps> = ({
  children,
  className,
  variant,
  color,
  animated,
  ...props
}) => {
  if (variant === 'dot' && children) {
    throw new Error('Badge variant "dot" does not support children');
  }

  return (
    <span
      className={cn(badgeVariants({ variant, color, animated, className }))}
      {...props}
    >
      {children}
    </span>
  );
};
