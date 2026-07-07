import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps, FC, ReactNode } from 'react';

import { cn } from '../../utils';

const popoverItemVariants = cva(
  'flex w-full cursor-pointer items-center gap-3 border-t border-transparent px-3 py-2 text-left text-sm outline-none not-last:border-b first:border-t-0 last:border-b-0',
  {
    variants: {
      intent: {
        default: '',
        danger: 'text-accent-red',
      },
      align: {
        left: '',
        center: 'justify-center text-center',
      },
      highlight: {
        hover: 'hover:bg-background-secondary hover:border-border',
        controlled: '',
      },
    },
    defaultVariants: {
      intent: 'default',
      align: 'left',
      highlight: 'hover',
    },
  },
);

type PopoverItemProps = Omit<ComponentProps<'button'>, 'children'> &
  VariantProps<typeof popoverItemVariants> & {
    icon?: ReactNode;
    children: ReactNode;
  };

export const PopoverItem: FC<PopoverItemProps> = ({
  className,
  intent,
  align,
  highlight,
  icon,
  children,
  ...props
}) => (
  <button
    className={cn(popoverItemVariants({ intent, align, highlight, className }))}
    {...props}
  >
    <span className="w-4 shrink-0">{icon}</span>
    <span>{children}</span>
  </button>
);
