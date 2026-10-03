import { ComponentProps, FC } from 'react';

import { cn } from '../../../utils';
import { Select } from '../../Select';
import { LyricsTypeBadge } from '../LyricsTypeBadge';
import type { LyricsSource, LyricsTypeLabels } from './types';

type LyricsSourcePickerProps = Omit<ComponentProps<'div'>, 'children'> & {
  sources: LyricsSource[];
  value: string;
  onValueChange: (sourceId: string) => void;
  typeLabels: LyricsTypeLabels;
};

export const LyricsSourcePicker: FC<LyricsSourcePickerProps> = ({
  sources,
  value,
  onValueChange,
  typeLabels,
  className,
  ...props
}) => {
  const options = sources.map((source) => ({
    id: source.id,
    label: source.name,
    icon: (
      <LyricsTypeBadge
        type={source.type}
        variant="icon"
        label={typeLabels[source.type]}
      />
    ),
  }));

  return (
    <div className={cn('w-56', className)} {...props}>
      <Select
        options={options}
        value={value}
        onValueChange={onValueChange}
        variant="muted"
        size="sm"
      />
    </div>
  );
};
