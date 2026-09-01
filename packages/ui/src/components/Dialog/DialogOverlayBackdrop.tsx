import { motion } from 'motion/react';
import { FC } from 'react';

export const DialogOverlayBackdrop: FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
    data-testid="dialog-backdrop"
    className="bg-overlay fixed inset-0"
  />
);
