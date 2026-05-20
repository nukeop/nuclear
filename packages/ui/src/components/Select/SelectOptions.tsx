import { ListboxOptions } from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import { FC, PropsWithChildren } from 'react';

import { useSelectContext } from './context';

export const SelectOptions: FC<PropsWithChildren> = ({ children }) => {
  const {
    open,
    ids: { listboxId, labelId },
  } = useSelectContext();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.98 }}
          animate={{ opacity: 1, y: 8, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 22,
            mass: 0.9,
          }}
          className="absolute top-16 left-0 z-50 w-full"
        >
          <ListboxOptions
            as="ul"
            id={listboxId}
            aria-labelledby={labelId}
            className="border-border shadow-shadow bg-primary w-full rounded-md border-(length:--border-width) p-2 outline-none"
          >
            {children}
          </ListboxOptions>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
