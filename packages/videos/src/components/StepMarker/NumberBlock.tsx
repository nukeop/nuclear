import { FC } from 'react';

import { Roll } from './Roll';

type NumberBlockProps = {
  stepCount: number;
  stepIndex: number;
  changeProgress: number;
};

const formatStepNumber = (stepIndex: number) =>
  String(stepIndex + 1).padStart(2, '0');

export const NumberBlock: FC<NumberBlockProps> = ({
  stepCount,
  stepIndex,
  changeProgress,
}) => (
  <div className="bg-video-accent border-video-ink font-heading flex items-center border-r-(length:--video-border-width) px-4 text-2xl font-extrabold">
    <Roll
      items={Array.from({ length: stepCount }, (_, index) =>
        formatStepNumber(index),
      )}
      index={stepIndex}
      progress={changeProgress}
    />
  </div>
);
