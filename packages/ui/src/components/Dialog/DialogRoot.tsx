import { DialogPanel, Dialog as HeadlessDialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, PropsWithChildren } from 'react';

import { cn } from '../../utils';
import { DialogContext } from './context';
import { DialogOverlayBackdrop } from './DialogOverlayBackdrop';
import { DialogXClose } from './DialogXClose';

type DialogRootProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  initialFocus?: React.RefObject<HTMLElement | null>;
  className?: string;
  showCloseButton?: boolean;
}>;

export const DialogRoot: FC<DialogRootProps> = ({
  isOpen,
  onClose,
  initialFocus,
  className,
  showCloseButton = true,
  children,
}) => {
  return (
    <DialogContext.Provider value={{ onClose }}>
      <AnimatePresence>
        {isOpen && (
          <HeadlessDialog
            static
            open={isOpen}
            onClose={onClose}
            initialFocus={initialFocus}
            className="relative z-50"
          >
            <DialogOverlayBackdrop />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 22,
                  mass: 0.9,
                }}
              >
                <DialogPanel
                  className={cn(
                    'border-border bg-background shadow-shadow relative w-full max-w-md rounded-md border-2 p-6',
                    className,
                  )}
                >
                  {showCloseButton && <DialogXClose />}
                  {children}
                </DialogPanel>
              </motion.div>
            </div>
          </HeadlessDialog>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};
