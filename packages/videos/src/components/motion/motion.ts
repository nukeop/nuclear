import { Easing, interpolate } from 'remotion';

export const EXIT_FRAMES = 10;

export const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInCubic = Easing.in(Easing.cubic);

export const progressOver = (
  frame: number,
  durationInFrames: number,
  easing: (input: number) => number = Easing.linear,
) =>
  interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
