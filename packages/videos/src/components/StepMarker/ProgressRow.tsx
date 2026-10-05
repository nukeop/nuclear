import { FC } from 'react';

type ProgressRowProps = {
  stepCount: number;
  stepIndex: number;
  changeProgress: number;
};

const barFill = (
  barIndex: number,
  stepIndex: number,
  changeProgress: number,
) => {
  if (barIndex < stepIndex) {
    return 1;
  }
  if (barIndex === stepIndex) {
    return changeProgress;
  }
  return 0;
};

type ProgressBarProps = {
  fill: number;
};

const ProgressBar: FC<ProgressBarProps> = ({ fill }) => (
  <div className="bg-video-ink/15 relative h-1.5 flex-1 overflow-hidden rounded-full">
    <div
      className="bg-video-ink absolute inset-0 origin-left"
      style={{ transform: `scaleX(${fill})` }}
    />
  </div>
);

export const ProgressRow: FC<ProgressRowProps> = ({
  stepCount,
  stepIndex,
  changeProgress,
}) => (
  <div className="flex gap-1">
    {Array.from({ length: stepCount }, (_, barIndex) => (
      <ProgressBar
        key={barIndex}
        fill={barFill(barIndex, stepIndex, changeProgress)}
      />
    ))}
  </div>
);
