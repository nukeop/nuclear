import { Button as HeadlessButton } from '@headlessui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '../../utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center rounded-md whitespace-nowrap transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'surface-primary border-border shadow-shadow hover:translate-x-shadow-x hover:translate-y-shadow-y border-(length:--border-width) hover:shadow-none',
        secondary:
          'surface-background border-border shadow-shadow hover:translate-x-shadow-x hover:translate-y-shadow-y border-(length:--border-width) hover:shadow-none',
        tertiary:
          'surface-muted border-border shadow-shadow hover:translate-x-shadow-x hover:translate-y-shadow-y border-(length:--border-width) hover:shadow-none',
        noShadow:
          'surface-primary border-border border-(length:--border-width)',
        text: '',
        ghost: 'hover:bg-foreground/10 border border-current',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        xs: 'h-8 px-2 text-sm',
        lg: 'h-11 px-8',
        icon: 'size-10 justify-center',
        'icon-sm': 'size-8 justify-center',
        flexible: 'h-auto',
      },
      intent: {
        danger: 'surface-accent-red',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { variant, size, intent, className, children, type, ...rest },
  ref,
) {
  return (
    <HeadlessButton
      as="button"
      ref={ref}
      className={cn(buttonVariants({ variant, size, intent, className }))}
      type={type ?? 'button'}
      {...rest}
    >
      {children}
    </HeadlessButton>
  );
});
