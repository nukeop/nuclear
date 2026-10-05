import { ListboxOptions } from '@headlessui/react';
import { cva } from 'class-variance-authority';
import { FC, PropsWithChildren } from 'react';

import { cn } from '../../utils';
import { useSelectContext } from './context';

const selectOptionsVariants = cva(
  'border-border shadow-shadow z-50 min-w-(--button-width) rounded-md border-(length:--border-width) p-2 backdrop-blur-xl transition duration-150 ease-out outline-none data-closed:scale-98 data-closed:opacity-0',
  {
    variants: {
      variant: {
        primary: 'surface-popover',
        muted: 'surface-muted',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type SelectOptionsProps = {
  className?: string;
};

export const SelectOptions: FC<PropsWithChildren<SelectOptionsProps>> = ({
  children,
  className,
}) => {
  const {
    ids: { listboxId, labelId },
    variant,
  } = useSelectContext();

  return (
    <ListboxOptions
      as="ul"
      id={listboxId}
      aria-labelledby={labelId}
      anchor={{ to: 'bottom', gap: 8 }}
      portal
      transition
      className={cn(selectOptionsVariants({ variant, className }))}
    >
      {children}
    </ListboxOptions>
  );
};
