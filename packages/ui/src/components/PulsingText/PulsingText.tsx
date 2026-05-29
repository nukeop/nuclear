import { motion } from 'motion/react';
import { ComponentProps, FC } from 'react';

type PulsingTextProps = ComponentProps<'span'> & {
  text: string;
  staggerOffset?: number;
  cyclePause?: number;
};

const LETTER_ANIMATION = {
  y: [0, -3, 0],
  scale: [1, 1.15, 1],
  opacity: [1, 0.85, 1],
};

const LETTER_EASING = [0.22, 1, 0.36, 1] as const;
const DEFAULT_STAGGER_OFFSET = 0.12;
const DEFAULT_CYCLE_PAUSE = 7;
const PULSE_DURATION = 0.45;

export const PulsingText: FC<PulsingTextProps> = ({
  text,
  staggerOffset = DEFAULT_STAGGER_OFFSET,
  cyclePause = DEFAULT_CYCLE_PAUSE,
  className,
  ...props
}) => {
  return (
    <span className={className} {...props}>
      {[...text].map((letter, index) => (
        <motion.span
          key={`${index}-${letter}`}
          className="inline-block"
          style={letter === ' ' ? { width: '0.25em' } : undefined}
          animate={LETTER_ANIMATION}
          transition={{
            duration: PULSE_DURATION,
            delay: index * staggerOffset,
            ease: LETTER_EASING,
            repeat: Infinity,
            repeatDelay: cyclePause,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
};
