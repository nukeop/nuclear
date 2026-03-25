import {
  Popover as HeadlessPopover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
  PopoverPanelProps,
} from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { PopoverItem } from './PopoverItem';
import { PopoverMenu } from './PopoverMenu';

export type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  anchor?: PopoverPanelProps['anchor'];
  backdrop?: boolean;
};

type PopoverComponent = FC<PopoverProps> & {
  Item: typeof PopoverItem;
  Menu: typeof PopoverMenu;
};

const PopoverImpl: FC<PopoverProps> = ({
  trigger,
  children,
  className,
  panelClassName,
  anchor,
  backdrop,
}) => {
  return (
    <HeadlessPopover className={cn('absolute', className)}>
      {({ open }) => (
        <>
          <PopoverButton as="div" className="cursor-pointer">
            {trigger}
          </PopoverButton>
          <AnimatePresence>
            {open && (
              <>
                {backdrop && (
                  <PopoverBackdrop
                    transition
                    className="fixed inset-0 bg-black/20 transition duration-150 ease-out data-closed:opacity-0"
                  />
                )}
                <PopoverPanel
                  static
                  as={motion.div}
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 8, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  className={cn(
                    'text-foreground bg-primary border-border rounded-md border-(length:--border-width) px-4 py-2 leading-5 select-none',
                    panelClassName,
                    {
                      ['translate-y-0']: anchor === 'bottom',
                      ['-translate-y-4']: anchor === 'top',
                      ['translate-x-2 -translate-y-2']: anchor === 'right',
                      ['-translate-x-2 -translate-y-2']: anchor === 'left',
                    },
                  )}
                  anchor={anchor}
                >
                  {children}
                </PopoverPanel>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </HeadlessPopover>
  );
};

export const Popover = PopoverImpl as PopoverComponent;
Popover.Item = PopoverItem;
Popover.Menu = PopoverMenu;
