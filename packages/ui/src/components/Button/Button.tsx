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
          'text-foreground bg-primary border-border shadow-shadow hover:translate-x-shadow-x hover:translate-y-shadow-y border-2 hover:shadow-none',
        secondary:
          'border-border shadow-shadow hover:translate-x-shadow-x hover:translate-y-shadow-y bg-background-secondary text-foreground border-2 hover:shadow-none',
        noShadow: 'text-foreground bg-primary border-border border-2',
        text: 'text-foreground bg-transparent',
        ghost: 'border border-current bg-transparent hover:bg-black/10',
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
        danger: 'bg-accent-red',
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
