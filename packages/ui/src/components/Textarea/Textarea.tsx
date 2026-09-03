import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps, forwardRef } from 'react';

import { cn } from '../../utils';

const textareaVariants = cva(
  'border-border focus-visible:ring-ring focus-visible:ring-offset-muted w-full resize-y rounded-md border-(length:--border-width) px-3 py-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
  {
    variants: {
      tone: {
        primary: 'surface-input placeholder:text-input-foreground/60',
        secondary:
          'surface-background text-foreground placeholder:text-foreground/60',
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
