export const SIDEBAR_CONFIG = {
  COLLAPSED_WIDTH: 54,
  MIN_WIDTH: 150,
  MAX_WIDTH: 400,
  RESIZE_HANDLE_WIDTH: 1,
  TOGGLE_BUTTON_SIZE: 4,
  TOGGLE_BUTTON_OFFSET: 2,
} as const;

export const SIDEBAR_ANIMATIONS = {
  width: {
    spring: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
    instant: { duration: 0 },
  },
  content: {
    spring: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
      mass: 0.5,
    },
    slideDistance: 20,
  },
  button: {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    spring: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 17,
    },
    rotation: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 20,
    },
  },
} as const;
