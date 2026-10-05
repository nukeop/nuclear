import { CSSProperties } from 'react';
import { spring, SpringConfig } from 'remotion';

import { easeOutExpo, progressOver } from '../motion';

export type Entrance = 'drop' | 'wipe';

type EntranceMotion = {
  frame: number;
  fps: number;
  exit: number;
};

type MotionStyle = CSSProperties & { '--video-lift'?: number };

const DROP_SPRING: Partial<SpringConfig> = {
  stiffness: 380,
  damping: 24,
  mass: 1,
};

const FADE_IN_FRAMES = 5;
const WIPE_FRAMES = 12;
const DROP_DISTANCE = 16;
const DROP_EXIT_DISTANCE = 8;
const WIPE_BLEED = 16;

const visibility = ({ frame, exit }: EntranceMotion) =>
  Math.min(progressOver(frame, FADE_IN_FRAMES), 1 - exit);

const drop = (motion: EntranceMotion): MotionStyle => {
  const { frame, fps, exit } = motion;
  const progress = spring({ frame, fps, config: DROP_SPRING });
  const offset = DROP_DISTANCE * (1 - progress) + DROP_EXIT_DISTANCE * exit;

  return {
    opacity: visibility(motion),
    transform: `translateY(${offset}px)`,
    '--video-lift': Math.min(progress, 1) * (1 - exit),
  };
};

const wipe = ({ frame, exit }: EntranceMotion): MotionStyle => {
  const reveal = Math.min(
    progressOver(frame, WIPE_FRAMES, easeOutExpo),
    1 - exit,
  );
  const hidden = 1 - reveal;
  const bleed = `${-WIPE_BLEED}px`;
  const right = `calc((100% + ${WIPE_BLEED}px) * ${hidden} - ${WIPE_BLEED}px)`;

  return { clipPath: `inset(${bleed} ${right} ${bleed} ${bleed})` };
};

export const entranceStyles: Record<
  Entrance,
  (motion: EntranceMotion) => MotionStyle
> = { drop, wipe };
