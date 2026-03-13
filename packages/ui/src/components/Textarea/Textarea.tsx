import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps, forwardRef } from 'react';

import { cn } from '../../utils';

const textareaVariants = cva(
  'border-border text-foreground placeholder:text-foreground-secondary w-full resize-y rounded-md border-(length:--border-width) px-3 py-2 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none',
  {
    variants: {
      tone: {
        primary: 'bg-background-input',
        secondary: 'bg-background',
      },
    },
    defaultVariants: {
      tone: 'primary',
    },
  },
);

type TextareaProps = ComponentProps<'textarea'> &
  VariantProps<typeof textareaVariants>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ tone, className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(textareaVariants({ tone, className }))}
        {...props}
      />
    );
  },
);
