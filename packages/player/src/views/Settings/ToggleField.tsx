import { FC } from 'react';

import { Toggle } from '@nuclearplayer/ui';

type Props = {
  label: string;
  description?: string;
  value: boolean | undefined;
  setValue: (v: boolean) => void;
};

export const ToggleField: FC<Props> = ({
  label,
  description,
  value,
  setValue,
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-3">
      <Toggle aria-label={label} checked={Boolean(value)} onChange={setValue} />
      <span className="text-foreground text-sm font-semibold">{label}</span>
    </div>
    {description && (
      <p className="text-foreground/60 text-sm select-none">{description}</p>
    )}
  </div>
);
