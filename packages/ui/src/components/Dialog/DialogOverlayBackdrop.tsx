import { DialogBackdrop } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FC } from 'react';

export const DialogOverlayBackdrop: FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
  >
    <DialogBackdrop className="fixed inset-0 bg-black/40" />
  </motion.div>
);
