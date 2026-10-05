import { FC } from 'react';
import { Sequence } from 'remotion';

import { Enter } from '../Enter';
import { NumberBlock } from './NumberBlock';
import { ProgressRow } from './ProgressRow';
import { Roll } from './Roll';
import { Step, useStepProgress } from './useStepProgress';

type StepMarkerProps = {
  steps: Step[];
  endFrame: number;
};

type StepMarkerPlateProps = {
  steps: Step[];
};

const StepMarkerPlate: FC<StepMarkerPlateProps> = ({ steps }) => {
  const { stepIndex, changeProgress } = useStepProgress(steps);

  return (
    <Enter entrance="drop" className="top-video-safe right-video-safe absolute">
      <div className="bg-video-paper text-video-ink border-video-ink shadow-video-plate flex overflow-hidden rounded-md border-(length:--video-border-width)">
        <NumberBlock
          stepCount={steps.length}
          stepIndex={stepIndex}
          changeProgress={changeProgress}
        />
        <div className="flex flex-col gap-2 px-4 py-2">
          <Roll
            items={steps.map((step) => step.label)}
            index={stepIndex}
            progress={changeProgress}
            className="text-lg font-bold tracking-wider whitespace-nowrap uppercase"
          />
          <ProgressRow
            stepCount={steps.length}
            stepIndex={stepIndex}
            changeProgress={changeProgress}
          />
        </div>
      </div>
    </Enter>
  );
};

export const StepMarker: FC<StepMarkerProps> = ({ steps, endFrame }) => {
  const firstFrame = steps[0].startFrame;
  const relativeSteps = steps.map((step) => ({
    ...step,
    startFrame: step.startFrame - firstFrame,
  }));

  return (
    <Sequence
      from={firstFrame}
      durationInFrames={endFrame - firstFrame}
      name="StepMarker"
    >
      <StepMarkerPlate steps={relativeSteps} />
    </Sequence>
  );
};
