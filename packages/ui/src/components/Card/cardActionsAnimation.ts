import { Transition, Variants } from 'motion/react';

const spring: Transition = {
  type: 'spring',
  bounce: 0.2,
  visualDuration: 0.25,
};

export const shapeVariants: Variants = {
  idle: {
    width: 'auto',
    height: 'auto',
    borderTopLeftRadius: 'var(--radius-md)',
    transition: {
      height: spring,
      borderTopLeftRadius: spring,
      width: { ...spring, delay: 0.2 },
    },
  },
  loading: {
    width: '100%',
    height: '0.375rem',
    borderTopLeftRadius: 0,
    transition: {
      width: spring,
      height: { ...spring, delay: 0.2 },
      borderTopLeftRadius: { ...spring, delay: 0.2 },
    },
  },
};

export const buttonVariants: Variants = {
  idle: { opacity: 1, transition: { delay: 0.2, duration: 0.2 } },
  loading: { opacity: 0, transition: { duration: 0.2 } },
};

export const loadingBarFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.2, duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
