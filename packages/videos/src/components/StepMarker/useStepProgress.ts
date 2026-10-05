import { useCurrentFrame } from 'remotion';

import { activeIndex, easeOutExpo, progressOver } from '../motion';

export type Step = {
  label: string;
  startFrame: number;
};

const CHANGE_FRAMES = 10;

export const useStepProgress = (steps: Step[]) => {
  const frame = useCurrentFrame();
  const stepIndex = activeIndex(steps, frame);

  return {
    stepIndex,
    changeProgress: progressOver(
      frame - steps[stepIndex].startFrame,
      CHANGE_FRAMES,
      easeOutExpo,
    ),
  };
};
