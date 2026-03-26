import { FC } from 'react';

import { Slider } from '@nuclearplayer/ui';

type Props = {
  label: string;
  description?: string;
  value: number | undefined;
  setValue: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  startLabel?: string;
  endLabel?: string;
};

export const SliderField: FC<Props> = ({
  label,
  description,
  value,
  setValue,
  min,
  max,
  step,
  unit,
  startLabel,
  endLabel,
}) => (
  <div className="px-2">
    <Slider
      label={label}
      description={description}
      showFooter
      unit={unit}
      min={min}
      max={max}
      step={step}
      startLabel={startLabel}
      endLabel={endLabel}
      value={Number(value ?? 0)}
      onValueChange={setValue}
    />
  </div>
);
